// Lightweight client-side data layer for OpenAQ + Open-Meteo.
// Falls back gracefully so UI always renders.

const WHO_PM25 = 15; // WHO 24h guideline (µg/m³)

const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  Sarajevo: { lat: 43.8563, lon: 18.4131 },
  Zenica: { lat: 44.2039, lon: 17.9078 },
  Tuzla: { lat: 44.5380, lon: 18.6739 },
  Mostar: { lat: 43.3438, lon: 17.8078 },
  "Banja Luka": { lat: 44.7722, lon: 17.1910 },
  Živinice: { lat: 44.4500, lon: 18.6500 },
  Kakanj: { lat: 44.1333, lon: 18.1167 },
  Lukavac: { lat: 44.5417, lon: 18.5283 },
  Prijedor: { lat: 44.9800, lon: 16.7100 },
  Goražde: { lat: 43.6667, lon: 18.9833 },
  Drugo: { lat: 43.8563, lon: 18.4131 },
};

export type AirSnapshot = {
  pm25: number | null;
  aqi: number | null;
  temp: number | null;
  updatedMinutesAgo: number | null;
  stale: boolean;
  whoMultiplier: number;
};

const pmToAqi = (pm: number): number => {
  // Simplified US EPA breakpoints
  const bps: [number, number, number, number][] = [
    [0, 12, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 500.4, 301, 500],
  ];
  for (const [cl, ch, il, ih] of bps) {
    if (pm >= cl && pm <= ch) {
      return Math.round(((ih - il) / (ch - cl)) * (pm - cl) + il);
    }
  }
  return 500;
};

export async function fetchAir(city: string): Promise<AirSnapshot> {
  const coord = CITY_COORDS[city] ?? CITY_COORDS.Sarajevo;

  let pm25: number | null = null;
  let updatedMinutesAgo: number | null = null;
  let stale = false;

  try {
    // Open-Meteo air quality (free, no key) — European AQ model
    const aqRes = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coord.lat}&longitude=${coord.lon}&current=pm2_5&timezone=auto`
    );
    if (aqRes.ok) {
      const j = await aqRes.json();
      const v = j?.current?.pm2_5;
      const time = j?.current?.time;
      if (typeof v === "number") {
        pm25 = v;
        if (time) {
          const t = new Date(time).getTime();
          updatedMinutesAgo = Math.max(0, Math.round((Date.now() - t) / 60000));
          stale = updatedMinutesAgo > 360;
        }
      }
    }
  } catch {
    stale = true;
  }

  let temp: number | null = null;
  try {
    const wRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coord.lat}&longitude=${coord.lon}&current=temperature_2m&timezone=auto`
    );
    if (wRes.ok) {
      const j = await wRes.json();
      const t = j?.current?.temperature_2m;
      if (typeof t === "number") temp = Math.round(t);
    }
  } catch {
    // ignore
  }

  if (pm25 == null) {
    pm25 = 42; // fallback typical winter value
    stale = true;
    updatedMinutesAgo = updatedMinutesAgo ?? null;
  }

  const aqi = pm25 != null ? pmToAqi(pm25) : null;
  const whoMultiplier = pm25 != null ? Math.max(1, +(pm25 / WHO_PM25).toFixed(1)) : 1;

  return { pm25, aqi, temp, updatedMinutesAgo, stale, whoMultiplier };
}

export const WHO_LIMIT = WHO_PM25;
