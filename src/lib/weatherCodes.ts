export type WeatherIconId =
  | "sun" | "moon" | "cloud" | "sun-cloud" | "moon-cloud" | "fog"
  | "drizzle" | "rain" | "heavy" | "storm" | "snow";

/** Código de tiempo WMO (Open-Meteo) → ícono y descripción. */
export function wx(code: number | undefined, isDay = 1): [WeatherIconId, string] {
  const c = Number(code);
  if (c === 0) return [isDay ? "sun" : "moon", "Despejado"];
  if (c === 1) return [isDay ? "sun" : "moon", "Mayormente despejado"];
  if (c === 2) return [isDay ? "sun-cloud" : "moon-cloud", "Parcialmente nublado"];
  if (c === 3) return ["cloud", "Nublado"];
  if (c === 45 || c === 48) return ["fog", "Niebla"];
  if (c >= 51 && c <= 57) return ["drizzle", "Llovizna"];
  if (c === 61 || c === 80) return ["rain", "Lluvia débil"];
  if (c === 63 || c === 66 || c === 81) return ["rain", "Lluvia"];
  if (c === 65 || c === 67 || c === 82) return ["heavy", "Lluvia fuerte"];
  if ((c >= 71 && c <= 77) || c === 85 || c === 86) return ["snow", "Nieve"];
  if (c >= 95) return ["storm", "Tormenta"];
  return ["cloud", "—"];
}
