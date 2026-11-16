import { describe, expect, it } from "vitest";
import { deltaT, evaluate, levelShare, score, wetBulb } from "./calc";
import { PROFILES } from "./profiles";
import type { Hour } from "./types";

const base: Hour = {
  t: "2026-11-15T10:00", T: 22, RH: 60, wind: 8, gust: 12, dir: 90,
  rain: 0, pp: 0, code: 0, isDay: 1, dt: 3.5,
};
const hour = (o: Partial<Hour>): Hour => ({ ...base, ...o });
const terr = PROFILES.terrestre;
const dron = PROFILES.dron;

describe("Delta T", () => {
  it("20 °C y 50% de humedad da un bulbo húmedo cerca de 13,7 °C", () => {
    expect(wetBulb(20, 50)).toBeCloseTo(13.7, 0);
    expect(deltaT(20, 50)).toBeCloseTo(6.3, 0);
  });
  it("aire saturado: Delta T cercano a 0", () => {
    expect(Math.abs(deltaT(20, 100))).toBeLessThan(0.5);
  });
  it("aire seco y caliente: Delta T alto", () => {
    expect(deltaT(35, 20)).toBeGreaterThan(10);
  });
});

describe("evaluate", () => {
  it("condiciones ideales: óptima", () => {
    expect(evaluate(base, terr).level).toBe(0);
  });
  it("viento poco por debajo del mínimo: marginal", () => {
    expect(evaluate(hour({ wind: 1 }), terr).level).toBe(1);
  });
  it("viento fuerte: no apta", () => {
    expect(evaluate(hour({ wind: 25 }), terr).level).toBe(2);
  });
  it("ráfaga entre límite óptimo y marginal: marginal", () => {
    expect(evaluate(hour({ gust: 22 }), terr).level).toBe(1);
  });
  it("Delta T mayor a 10: no apta", () => {
    expect(evaluate(hour({ dt: 11 }), terr).level).toBe(2);
  });
  it("lluvia: no apta, aunque lo demás esté perfecto", () => {
    expect(evaluate(hour({ rain: 1 }), terr).level).toBe(2);
  });
  it("probabilidad de lluvia alta: no apta", () => {
    expect(evaluate(hour({ pp: 70 }), terr).level).toBe(2);
  });
  it("el dron es más estricto que el terrestre", () => {
    const h = hour({ wind: 13, gust: 16 });
    expect(evaluate(h, terr).level).toBe(0);
    expect(evaluate(h, dron).level).toBe(2);
  });
});

describe("score", () => {
  it("queda entre 0 y 100", () => {
    for (const w of [0, 3, 10, 20, 40]) {
      const s = score(hour({ wind: w, gust: w * 1.5 }), terr);
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
    }
  });
  it("coincide con el color: óptima ≥70, marginal 40–70, no apta <40", () => {
    const cases = [base, hour({ wind: 1 }), hour({ gust: 22 }), hour({ wind: 25 }), hour({ rain: 2 }), hour({ dt: 11 })];
    for (const h of cases) {
      const s = score(h, terr);
      const lvl = evaluate(h, terr).level;
      if (lvl === 0) expect(s).toBeGreaterThanOrEqual(70);
      if (lvl === 1) { expect(s).toBeGreaterThanOrEqual(40); expect(s).toBeLessThan(70); }
      if (lvl === 2) expect(s).toBeLessThan(40);
    }
  });
  it("con más viento nunca sube el puntaje", () => {
    let prev = 101;
    for (let w = 3; w <= 30; w++) {
      const s = score(hour({ wind: w, gust: w }), terr);
      expect(s).toBeLessThanOrEqual(prev);
      prev = s;
    }
  });
  it("lluvia: 0%", () => {
    expect(score(hour({ rain: 3 }), terr)).toBe(0);
  });
});

describe("levelShare", () => {
  it("suma 100 (con redondeo) y cuenta cada nivel", () => {
    const hs = [base, base, hour({ wind: 25 }), hour({ wind: 1 })];
    expect(levelShare(hs, terr)).toEqual([50, 25, 25]);
  });
  it("sin horas no falla", () => {
    expect(levelShare([], terr)).toEqual([0, 0, 0]);
  });
});
