import { evaluate, score } from "../lib/calc";
import { dayLabel } from "../lib/dates";
import type { Criteria, Hour } from "../lib/types";
import { COLORS } from "./NowCard";
import { Stats, WxLine } from "./Stats";

/** Detalle de una hora: porcentaje, datos y motivo del color. */
export function Detail({ h, cfg }: { h: Hour; cfg: Criteria }) {
  const ev = evaluate(h, cfg);
  return (
    <div className="card" id="detail">
      <div className="badge" style={{ background: COLORS[ev.level] }}>
        <div>
          <small>{dayLabel(h.t.slice(0, 10))}</small>
          {h.t.slice(11, 16)} h
          <WxLine h={h} />
        </div>
        <span className="big">{score(h, cfg)}%</span>
      </div>
      <Stats h={h} />
      <ul className="reasons">
        {ev.reasons.length ? (
          ev.reasons.map(([l, m]) => <li key={m} style={{ color: COLORS[l] }}>{m}</li>)
        ) : (
          <li style={{ color: COLORS[0] }}>Todo dentro de rango.</li>
        )}
      </ul>
    </div>
  );
}
