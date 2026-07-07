import { createServerFn } from "@tanstack/react-start";

const STATION: Record<string, string> = {
  Sarajevo: "@10557",
  Zenica: "zenica",
  Tuzla: "tuzla",
  Mostar: "mostar",
  "Banja Luka": "banja-luka",
  Živinice: "tuzla",
  Kakanj: "zenica",
  Lukavac: "tuzla",
  Prijedor: "banja-luka",
  Goražde: "sarajevo",
  Drugo: "@10557",
};

// City coordinates for a reliable temperature source (Open-Meteo, no key).
// Many AQICN stations report stale, missing, or plainly wrong `t` values
// (e.g. -2°C in July), so we fetch temperature independently.
const COORDS: Record<string, [number, number]> = {
  Sarajevo: [43.8563, 18.4131],
  Zenica: [44.2039, 17.9078],
  Tuzla: [44.5386, 18.6739],
  Mostar: [43.3438, 17.8078],
  "Banja Luka": [44.7722, 17.191],
  Živinice: [44.4472, 18.6483],
  Kakanj: [44.1339, 18.1194],
  Lukavac: [44.5417, 18.5222],
  Prijedor: [44.98, 16.7083],
  Goražde: [43.6667, 18.9769],
  Bihać: [44.8167, 15.8708],
  Drugo: [43.8563, 18.4131],
};

export type AqicnResult = {
  ok: boolean;
  pm25: number | null;
  pm10: number | null;
  aqi: number | null;
  temp: number | null;
  updatedIso: string | null;
  updatedString: string | null;
  station: string | null;
};

async function fetchOpenMeteoTemp(city: string): Promise<number | null> {
  const coords = COORDS[city];
  if (!coords) return null;
  try {
    const [lat, lon] = coords;
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`,
    );
    if (!res.ok) return null;
    const j: any = await res.json();
    const t = j?.current?.temperature_2m;
    return typeof t === "number" ? Math.round(t) : null;
  } catch {
    return null;
  }
}

export const fetchAqicn = createServerFn({ method: "GET" })
  .inputValidator((data: { city: string }) => data)
  .handler(async ({ data }): Promise<AqicnResult> => {
    const token = process.env.AQICN_TOKEN;
    const slug = STATION[data.city] ?? "@10557";
    const empty: AqicnResult = {
      ok: false, pm25: null, pm10: null, aqi: null, temp: null,
      updatedIso: null, updatedString: null, station: null,
    };
    if (!token) return empty;
    try {
      const [aqRes, meteoTemp] = await Promise.all([
        fetch(`https://api.waqi.info/feed/${slug}/?token=${token}`),
        fetchOpenMeteoTemp(data.city),
      ]);
      if (!aqRes.ok) return empty;
      const j: any = await aqRes.json();
      if (j?.status !== "ok" || !j?.data) return empty;
      const d = j.data;
      const pm25 = typeof d?.iaqi?.pm25?.v === "number" ? d.iaqi.pm25.v : null;
      const pm10 = typeof d?.iaqi?.pm10?.v === "number" ? d.iaqi.pm10.v : null;
      const stationTemp = typeof d?.iaqi?.t?.v === "number" ? Math.round(d.iaqi.t.v) : null;
      // Prefer Open-Meteo; fall back to station only if plausible (-30..50°C).
      const temp =
        meteoTemp != null
          ? meteoTemp
          : stationTemp != null && stationTemp > -30 && stationTemp < 50
            ? stationTemp
            : null;
      const aqi = typeof d?.aqi === "number" ? d.aqi : null;
      return {
        ok: true,
        pm25, pm10, aqi, temp,
        updatedIso: d?.time?.iso ?? null,
        updatedString: d?.time?.s ?? null,
        station: d?.city?.name ?? null,
      };
    } catch {
      return empty;
    }
  });
