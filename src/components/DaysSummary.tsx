import { levelShare } from "../lib/calc";
import { dayParts, isVisible } from "../lib/dates";
import type { Criteria, Hour } from "../lib/types";
import { wx } from "../lib/weatherCodes";
import { WeatherIcon } from "./icons";
import { COLORS } from "./NowCard";

interface Props {
  days: [string, Hour[]][];
  dailyCode: Record<string, number>;
  cfg: Criteria;
  allHours: boolean;
  selDay: string;
  onSelect: (d: string) => void;
}

export function DaysSummary({ days, dailyCode, cfg, allHours, selDay, onSelect }: Props) {
  return (
    <div className="card">
      <h2>Resumen por día</h2>
      <p className="stat tight">% de horas aptas · tocá un día para ver su curva</p>
      <div className="days">
        {days.map(([d, hs]) => {
          const p = levelShare(hs.filter((h) => isVisible(h, allHours)), cfg);
          const [id, text] = wx(dailyCode[d]);
          const [dn, dd] = dayParts(d);
          return (
            <div key={d} className={`dayrow${d === selDay ? " on" : ""}`} onClick={() => onSelect(d)}>
              <span className="dname">{dn}<small>{dd}</small></span>
              <span className="dico" title={text}><WeatherIcon id={id} /></span>
              <div className="bar">
                {p.map((pc, i) =>
                  pc ? <span key={i} style={{ width: `${pc}%`, background: COLORS[i] }}>{pc >= 18 ? `${pc}%` : ""}</span> : null,
                )}
              </div>
              <span className="pct">{p[0]}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
