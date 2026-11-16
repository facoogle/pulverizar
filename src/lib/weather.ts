import { deltaT } from "./calc";
import type { Forecast, Hour, Place } from "./types";

interface OpenMeteoResponse {
  utc_offset_seconds: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    wind_gusts_10m: number[];
    wind_direction_10m: number[];
    precipitation: (number | null)[];
    precipitation_probability?: (number | null)[];
    weather_code?: number[];
    is_day?: number[];
  };
  daily?: { time: string[]; weather_code: number[] };
}

/** Pronóstico hora por hora de Open-Meteo (modelo automático "best match"). */
export async function fetchForecast(place: Pick<Place, "lat" | "lon">, signal?: AbortSignal): Promise<Forecast> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}` +
    `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,precipitation,precipitation_probability,weather_code,is_day` +
    `&daily=weather_code&wind_speed_unit=kmh&timezone=auto&forecast_days=7`;
  const r = await fetch(url, { signal });
  if (!r.ok) throw new Error("HTTP " + r.status);
  const j = (await r.json()) as OpenMeteoResponse;
  const H = j.hourly;

  const hours: Hour[] = H.time.map((t, i) => {
    const T = H.temperature_2m[i];
    const RH = H.relative_humidity_2m[i];
    return {
      t,
      T,
      RH,
      wind: H.wind_speed_10m[i],
      gust: H.wind_gusts_10m[i],
      dir: H.wind_direction_10m[i],
      rain: H.precipitation[i] ?? 0,
      pp: H.precipitation_probability?.[i] ?? null,
      code: H.weather_code?.[i],
      isDay: H.is_day?.[i] ?? 1,
      dt: deltaT(T, RH),
    };
  });

  const dailyCode: Record<string, number> = {};
  j.daily?.time.forEach((d, i) => (dailyCode[d] = j.daily!.weather_code[i]));
  return { hours, utcOffset: j.utc_offset_seconds, dailyCode };
}

interface GeoResult { name: string; admin1?: string; country?: string; latitude: number; longitude: number }

/** Busca localidades por nombre (geocoding de Open-Meteo). */
export async function searchPlaces(q: string): Promise<{ label: string; place: Place }[]> {
  const r = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=es`,
  );
  if (!r.ok) throw new Error("HTTP " + r.status);
  const j = (await r.json()) as { results?: GeoResult[] };
  return (j.results ?? []).map((x) => ({
    label: [x.name, x.admin1, x.country].filter(Boolean).join(", "),
    place: { lat: x.latitude, lon: x.longitude, name: x.name, region: x.admin1 ?? "" },
  }));
}

/** Coordenadas → nombre de la localidad (OpenStreetMap Nominatim). Devuelve null si no se pudo. */
export async function reverseName(lat: number, lon: number): Promise<{ name: string; region: string } | null> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=12&accept-language=es`,
    );
    if (!r.ok) return null;
    const a = ((await r.json()) as { address?: Record<string, string> }).address ?? {};
    const name = a.city || a.town || a.village || a.hamlet || a.municipality || a.suburb || a.county;
    return name ? { name, region: a.state ?? "" } : null;
  } catch {
    return null;
  }
}
