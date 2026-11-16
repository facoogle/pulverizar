import { useEffect, useRef, useState } from "react";
import { evaluate, score } from "../lib/calc";
import { dayLabel, hourOf, isVisible } from "../lib/dates";
import type { Criteria, Hour } from "../lib/types";
import { COLORS } from "./NowCard";

interface Props {
  day: string;
  hours: Hour[];
  cfg: Criteria;
  allHours: boolean;
  onSelect: (t: string) => void;
}

/** Curva del % de aptitud hora por hora de un día, con bandas verde / amarillo / rojo. */
export function Chart({ day, hours, cfg, allHours, onSelect }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxW, setBoxW] = useState(340);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBoxW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const hrs = hours.filter((h) => isVisible(h, allHours));
  const n = hrs.length;
  const W = Math.max(300, Math.min(760, boxW));
  const H = W < 500 ? 200 : 230;
  const L = 34, R = 8, T = 10, B = 24;
  const x = (i: number) => L + (W - L - R) * (n > 1 ? i / (n - 1) : 0.5);
  const y = (v: number) => T + (H - T - B) * (1 - v / 100);
  const sc = hrs.map((h) => score(h, cfg));
  const step = Math.ceil(n / Math.max(Math.floor((W - L) / 28), 1));
  const band = (a: number, b: number, col: string) => (
    <rect x={L} y={y(b)} width={W - L - R} height={y(a) - y(b)} fill={col} opacity={0.13} />
  );

  return (
    <div className="card">
      <h2>Aptitud por hora · {dayLabel(day)}</h2>
      <p className="stat tight" style={{ marginBottom: 8 }}>0–40% no apta · 40–70% marginal · 70–100% óptima</p>
      <div ref={boxRef} className="chart">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Aptitud por hora">
          {band(0, 40, "var(--bad)")}{band(40, 70, "var(--warn)")}{band(70, 100, "var(--ok)")}
          {[0, 40, 70, 100].map((v) => (
            <text key={v} x={L - 6} y={y(v) + 4} textAnchor="end">{v}%</text>
          ))}
          {hrs.map((h, i) =>
            i % step === 0 ? <text key={h.t} x={x(i)} y={H - 6} textAnchor="middle">{hourOf(h)}</text> : null,
          )}
          <polyline
            fill="none" stroke="var(--text)" strokeWidth={2} strokeLinejoin="round"
            points={sc.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
          />
          {sc.map((v, i) => (
            <circle
              key={hrs[i].t} cx={x(i)} cy={y(v)} r={W < 500 ? 5.5 : 5}
              fill={COLORS[evaluate(hrs[i], cfg).level]} stroke="var(--card)" strokeWidth={1.5}
              style={{ cursor: "pointer" }} onClick={() => onSelect(hrs[i].t)}
            >
              <title>{hourOf(hrs[i])} h · {v}%</title>
            </circle>
          ))}
        </svg>
      </div>
    </div>
  );
}
