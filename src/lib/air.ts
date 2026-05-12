// Air quality data layer backed by aqicn.org (waqi.info).
// Calls a server function to keep AQICN_TOKEN private. Caches the last known
// value per city in localStorage so we can show it when the API is unreachable.

import { fetchAqicn } from "./air.functions";

const WHO_PM25 = 5; // WHO annual guideline (µg/m³)

export type AirSnapshot = {
  pm25: number | null;
  aqi: number | null;
  temp: number | null;
  updatedMinutesAgo: number | null;
  updatedString: string | null;
  stale: boolean;
  whoMultiplier: number;
  station: string | null;
};

export const SOURCE_LABEL = "aqicn.org · Federalni Hidrometeorološki Zavod";
export const REFRESHING_MESSAGE = "Podaci se osvježavaju...";

const cacheKey = (city: string) => `bura.air.${city}`;

function loadCache(city: string): AirSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(cacheKey(city));
    return raw ? (JSON.parse(raw) as AirSnapshot) : null;
  } catch {
    return null;
  }
}

function saveCache(city: string, snap: AirSnapshot) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(cacheKey(city), JSON.stringify(snap));
  } catch {
    // ignore quota errors
  }
}

function minutesAgo(iso: string | null): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.round((Date.now() - t) / 60000));
}

export async function fetchAir(city: string): Promise<AirSnapshot> {
  const cached = loadCache(city);

  try {
    const res = await fetchAqicn({ data: { city } });
    if (res.ok && res.pm25 != null) {
      const snap: AirSnapshot = {
        pm25: res.pm25,
        aqi: res.aqi,
        temp: res.temp,
        updatedMinutesAgo: minutesAgo(res.updatedIso),
        updatedString: res.updatedString,
        stale: false,
        whoMultiplier: Math.max(1, +(res.pm25 / WHO_PM25).toFixed(1)),
        station: res.station,
      };
      saveCache(city, snap);
      return snap;
    }
  } catch {
    // fall through to cache
  }

  if (cached) {
    return { ...cached, stale: true };
  }

  return {
    pm25: null, aqi: null, temp: null,
    updatedMinutesAgo: null, updatedString: null,
    stale: true, whoMultiplier: 1, station: null,
  };
}

export const WHO_LIMIT = WHO_PM25;
