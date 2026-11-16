import type { Hour } from "./types";

export const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const POINTS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];

/** "YYYY-MM-DD" → ["Sáb", "14/11"] */
export function dayParts(d: string): [string, string] {
  const x = new Date(d + "T12:00:00");
  return [DAYS[x.getDay()], `${x.getDate()}/${x.getMonth() + 1}`];
}
export const dayLabel = (d: string): string => dayParts(d).join(" ");

export const hourOf = (h: Hour): number => Number(h.t.slice(11, 13));

/** Horas de trabajo (6 a 21 h) salvo que se pidan las 24. */
export const isVisible = (h: Hour, all: boolean): boolean => all || (hourOf(h) >= 6 && hourOf(h) <= 21);

export function groupByDay(hours: Hour[]): Map<string, Hour[]> {
  const m = new Map<string, Hour[]>();
  for (const h of hours) {
    const d = h.t.slice(0, 10);
    const list = m.get(d);
    if (list) list.push(h);
    else m.set(d, [h]);
  }
  return m;
}
