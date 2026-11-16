import type { Criteria, Evaluation, Hour, Level } from "./types";

/** Temperatura de bulbo húmedo (fórmula de Stull, 2011). T en °C, RH en %. */
export function wetBulb(T: number, RH: number): number {
  return (
    T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035
  );
}

export const deltaT = (T: number, RH: number): number => T - wetBulb(T, RH);

/** Clasifica una hora: óptima, marginal o no apta, con los motivos. */
export function evaluate(h: Hour, c: Criteria): Evaluation {
  const reasons: [Level, string][] = [];
  let level: Level = 0;
  const bump = (l: Level, msg: string) => {
    if (l > level) level = l;
    reasons.push([l, msg]);
  };

  if (h.rain >= c.rainMm) bump(2, `Lluvia ${h.rain.toFixed(1)} mm`);
  else if (h.pp != null && h.pp >= c.rainProb) bump(2, `Prob. lluvia ${h.pp}%`);

  if (h.wind < c.windMin) bump(1, `Viento muy bajo (${h.wind.toFixed(0)} km/h): riesgo de inversión`);
  else if (h.wind > c.windMaxMarg) bump(2, `Viento ${h.wind.toFixed(0)} km/h: deriva`);
  else if (h.wind > c.windMax) bump(1, `Viento ${h.wind.toFixed(0)} km/h: al límite`);

  if (h.gust > c.gustMaxMarg) bump(2, `Ráfagas ${h.gust.toFixed(0)} km/h`);
  else if (h.gust > c.gustMax) bump(1, `Ráfagas ${h.gust.toFixed(0)} km/h: al límite`);

  if (h.dt > c.dtMaxMarg) bump(2, `Delta T ${h.dt.toFixed(1)}: evaporación alta`);
  else if (h.dt > c.dtMax) bump(1, `Delta T ${h.dt.toFixed(1)}: precaución, gota más gruesa`);
  else if (h.dt < c.dtMin) bump(1, `Delta T ${h.dt.toFixed(1)}: aire muy húmedo, posible inversión`);

  return { level, reasons };
}

/** Puntaje 0–100 de un valor que no debe pasarse de un límite. */
function upper(v: number, ok: number, marg: number): number {
  if (v <= ok) return 100 - 30 * (v / ok) ** 2;
  if (v <= marg) return 70 - 30 * (v - ok) / (marg - ok);
  return Math.max(0, 40 - (40 * (v - marg)) / Math.max(marg - ok, 1) / 2);
}

/**
 * % de aptitud 0–100. 70–100 óptima, 40–70 marginal, 0–40 no apta
 * (coincide con los colores). Manda el peor factor.
 */
export function score(h: Hour, c: Criteria): number {
  const s = [
    upper(h.wind, c.windMax, c.windMaxMarg),
    upper(h.gust, c.gustMax, c.gustMaxMarg),
    upper(Math.max(h.dt, 0), c.dtMax, c.dtMaxMarg),
  ];
  if (h.wind < c.windMin) s.push(40 + (30 * h.wind) / c.windMin);
  if (h.dt < c.dtMin) s.push(40 + (30 * Math.max(h.dt, 0)) / c.dtMin);
  if (h.rain >= c.rainMm) s.push(0);
  else if (h.pp != null) {
    s.push(
      h.pp >= c.rainProb
        ? 39 * (1 - (h.pp - c.rainProb) / Math.max(100 - c.rainProb, 1))
        : 100 - (30 * h.pp) / c.rainProb,
    );
  }
  return Math.round(Math.min(...s));
}

/** Hora actual en la zona horaria del lote, formato "YYYY-MM-DDTHH". */
export function nowKey(utcOffsetSeconds: number): string {
  return new Date(Date.now() + utcOffsetSeconds * 1000).toISOString().slice(0, 13);
}

/** Cuántas horas de cada nivel hay, en %. */
export function levelShare(hours: Hour[], c: Criteria): [number, number, number] {
  const n = [0, 0, 0];
  hours.forEach((h) => n[evaluate(h, c).level]++);
  return n.map((x) => Math.round((100 * x) / Math.max(hours.length, 1))) as [number, number, number];
}
