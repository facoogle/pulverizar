import { useLayoutEffect, useRef } from "react";
import { evaluate, score } from "../lib/calc";
import { dayParts, groupByDay, hourOf, isVisible } from "../lib/dates";
import type { Criteria, Forecast } from "../lib/types";
import { wx } from "../lib/weatherCodes";
import { WeatherIcon } from "./icons";

interface Props {
  forecast: Forecast;
  cfg: Criteria;
  nowK: string;
  allHours: boolean;
  selKey: string | null;
  onSelect: (t: string) => void;
  onAllHours: (v: boolean) => void;
  /** Cambia cuando hay que volver a llevar la grilla a la hora actual */
  scrollKey: string;
  status: { text: string; error: boolean };
}

const LEVEL_CLASS = ["ok", "warn", "bad"] as const;

export function Grid({ forecast, cfg, nowK, allHours, selKey, onSelect, onAllHours, scrollKey, status }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const done = useRef("");

  const days = [...groupByDay(forecast.hours)]
    .map(([d, hs]) => [d, hs.filter((h) => isVisible(h, allHours))] as const)
    .filter(([, hs]) => hs.some((h) => h.t.slice(0, 13) >= nowK)); // sin días ya pasados

  const firstNow = days[0]?.[1].find((h) => h.t.slice(0, 13) >= nowK)?.t;

  // Al cargar, desplazar la grilla hasta la hora actual
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !firstNow || done.current === scrollKey) return;
    const td = wrap.querySelector<HTMLElement>(`td[data-t="${firstNow}"]`);
    if (!td) return;
    done.current = scrollKey;
    const dayW = wrap.querySelector("th.day")?.getBoundingClientRect().width ?? 0;
    const left = td.getBoundingClientRect().left - wrap.getBoundingClientRect().left + wrap.scrollLeft;
    wrap.scrollLeft = Math.max(0, left - dayW - 24);
  });

  return (
    <div className="card">
      <div className="row between">
        <h2>% de aptitud por hora</h2>
        <label className="toggle">
          <input type="checkbox" checked={allHours} onChange={(e) => onAllHours(e.target.checked)} /> 24 h
        </label>
      </div>
      <p className="stat tight">Deslizá hacia el costado · tocá una hora para ver el detalle</p>

      <div className="gridwrap" ref={wrapRef}>
        <table>
          <tbody>
            {days[0] && (
              <tr>
                <th className="day" />
                {days[0][1].map((h) => (
                  <th key={h.t} className="hh">{hourOf(h)}h</th>
                ))}
              </tr>
            )}
            {days.map(([d, hs]) => {
              const [dn, dd] = dayParts(d);
              return (
                <tr key={d}>
                  <th className="day">{dn}<small>{dd}</small></th>
                  {hs.map((h) => {
                    const [wid, wtxt] = wx(h.code, h.isDay);
                    const past = h.t.slice(0, 13) < nowK ? " past" : "";
                    const sel = h.t === selKey ? " sel" : "";
                    return (
                      <td
                        key={h.t}
                        data-t={h.t}
                        className={`h ${LEVEL_CLASS[evaluate(h, cfg).level]}${past}${sel}`}
                        title={wtxt}
                        onClick={() => onSelect(h.t)}
                      >
                        <WeatherIcon id={wid} />
                        {score(h, cfg)}<small>%</small>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="legend">
        <span><i style={{ background: "var(--ok)" }} />óptima: viento {cfg.windMin}–{cfg.windMax} · ráfaga ≤{cfg.gustMax} · ΔT {cfg.dtMin}–{cfg.dtMax}</span>
        <span><i style={{ background: "var(--warn)" }} />marginal: al límite en algún parámetro</span>
        <span><i style={{ background: "var(--bad)" }} />no apta: viento &gt;{cfg.windMaxMarg} · ráfaga &gt;{cfg.gustMaxMarg} · ΔT &gt;{cfg.dtMaxMarg} o lluvia</span>
      </div>
      {status.text && <p className={status.error ? "stat err" : "stat"}>{status.text}</p>}
    </div>
  );
}
