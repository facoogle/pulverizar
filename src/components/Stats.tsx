import { POINTS } from "../lib/dates";
import type { Hour } from "../lib/types";
import { wx } from "../lib/weatherCodes";
import { WeatherIcon } from "./icons";

/** Línea con el ícono y la descripción del tiempo de esa hora. */
export function WxLine({ h }: { h: Hour }) {
  const [id, text] = wx(h.code, h.isDay);
  return (
    <div className="wx">
      <WeatherIcon id={id} />
      {text}
    </div>
  );
}

/** Los seis datos de una hora: viento, ráfaga, Delta T, temperatura, humedad y prob. de lluvia. */
export function Stats({ h }: { h: Hour }) {
  const items: [React.ReactNode, string][] = [
    [<>{h.wind.toFixed(0)} <small>{POINTS[Math.round(h.dir / 45) % 8]}</small></>, "viento km/h"],
    [h.gust.toFixed(0), "ráfaga km/h"],
    [h.dt.toFixed(1), "Delta T"],
    [`${h.T.toFixed(0)}°`, "temperatura"],
    [`${h.RH}%`, "humedad"],
    [`${h.pp ?? "–"}%`, "prob. lluvia"],
  ];
  return (
    <div className="stats">
      {items.map(([v, l]) => (
        <div key={l}>
          <b>{v}</b>
          <span>{l}</span>
        </div>
      ))}
    </div>
  );
}
