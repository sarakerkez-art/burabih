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
      const res = await fetch(`https://api.waqi.info/feed/${slug}/?token=${token}`);
      if (!res.ok) return empty;
      const j: any = await res.json();
      if (j?.status !== "ok" || !j?.data) return empty;
      const d = j.data;
      const pm25 = typeof d?.iaqi?.pm25?.v === "number" ? d.iaqi.pm25.v : null;
      const pm10 = typeof d?.iaqi?.pm10?.v === "number" ? d.iaqi.pm10.v : null;
      const temp = typeof d?.iaqi?.t?.v === "number" ? Math.round(d.iaqi.t.v) : null;
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
