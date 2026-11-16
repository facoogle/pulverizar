import type { ProfileId } from "../lib/types";
import type { WeatherIconId } from "../lib/weatherCodes";

const CLOUD = "M6.5 18.5h11a4 4 0 0 0 0-8h-.4A5.5 5.5 0 0 0 6.6 11.6a3.45 3.45 0 0 0-.1 6.9z";
const CLOUD_SMALL = "M9.5 20.5h8a3.5 3.5 0 0 0 0-7h-.3a4.6 4.6 0 0 0-8.6 1.6 2.75 2.75 0 0 0 .9 5.4z";
const CLOUD_RAIN = "M6.5 14h11a3.8 3.8 0 0 0 0-7.6h-.3A5.2 5.2 0 0 0 6.6 7.5a3.25 3.25 0 0 0-.1 6.5z";
const CLOUD_HIGH = "M6.5 13h11a3.8 3.8 0 0 0 0-7.6h-.3A5.2 5.2 0 0 0 6.6 6.5a3.25 3.25 0 0 0-.1 6.5z";

/** Se dibuja una sola vez en la página; los íconos del tiempo lo usan con <use>. */
export function WeatherSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="wi-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></symbol>
        <symbol id="wi-moon" viewBox="0 0 24 24"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" /></symbol>
        <symbol id="wi-cloud" viewBox="0 0 24 24"><path d={CLOUD} /></symbol>
        <symbol id="wi-sun-cloud" viewBox="0 0 24 24"><circle cx="8" cy="8" r="3" /><path d="M8 2v1.3M2 8h1.3M3.8 3.8l.9.9M12.2 3.8l-.9.9M3.8 12.2l.9-.9" /><path d={CLOUD_SMALL} /></symbol>
        <symbol id="wi-moon-cloud" viewBox="0 0 24 24"><path d="M12 7.2A5 5 0 0 1 6.2 2.5 5 5 0 1 0 12 9" /><path d={CLOUD_SMALL} /></symbol>
        <symbol id="wi-fog" viewBox="0 0 24 24"><path d="M6.5 12h11a3.5 3.5 0 0 0 0-7h-.4a5 5 0 0 0-9.6 1A3 3 0 0 0 6.5 12z" /><path d="M4 15.5h16M6 19h12" /></symbol>
        <symbol id="wi-drizzle" viewBox="0 0 24 24"><path d={CLOUD_RAIN} /><path d="M8 17.5v.5M12 19.5v.5M16 17.5v.5" strokeWidth="2.4" /></symbol>
        <symbol id="wi-rain" viewBox="0 0 24 24"><path d={CLOUD_RAIN} /><path d="M8.5 16.5l-1.2 3.5M12.5 16.5l-1.2 3.5M16.5 16.5l-1.2 3.5" /></symbol>
        <symbol id="wi-heavy" viewBox="0 0 24 24"><path d={CLOUD_HIGH} /><path d="M7.5 15.5l-1.8 5M11.5 15.5l-1.8 5M15.5 15.5l-1.8 5M19 15.5l-1.4 4" strokeWidth="2.1" /></symbol>
        <symbol id="wi-storm" viewBox="0 0 24 24"><path d={CLOUD_HIGH} /><path d="M13 14l-3 4h4l-3 4" /></symbol>
        <symbol id="wi-snow" viewBox="0 0 24 24"><path d={CLOUD_HIGH} /><path d="M12 15.5v6M9.4 17l5.2 3M14.6 17l-5.2 3" /></symbol>
      </defs>
    </svg>
  );
}

export function WeatherIcon({ id, className = "wi" }: { id: WeatherIconId; className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`#wi-${id}`} />
    </svg>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Íconos del selector de equipo, dibujados a mano (sin librerías externas). */
export function EquipmentIcon({ id }: { id: ProfileId }) {
  if (id === "terrestre") {
    return (
      <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <circle cx="7" cy="16" r="4" /><circle cx="7" cy="16" r="1" /><circle cx="18" cy="17.5" r="2.5" />
        <path d="M4 12.5V5.5h5.5l2 6.5h7.5a1 1 0 0 1 1 1v2.4" /><path d="M11 16.5h4.5" /><path d="M15.5 12V7.5" />
      </svg>
    );
  }
  if (id === "dron") {
    return (
      <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <rect x="9" y="9.5" width="6" height="5" rx="1.2" />
        <path d="M9 10 6.5 7.5M15 10l2.5-2.5M9 14l-2.5 2.5M15 14l2.5 2.5" />
        <circle cx="5" cy="6" r="2.6" /><circle cx="19" cy="6" r="2.6" /><circle cx="5" cy="18" r="2.6" /><circle cx="19" cy="18" r="2.6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
      <path d="M12 2.5c.9 0 1.4.9 1.4 2V18l2.6 2v1l-4-1-4 1v-1l2.6-2V4.5c0-1.1.5-2 1.4-2z" />
      <path d="M10.6 9.5 3 13.5V15l7.6-1.8M13.4 9.5 21 13.5V15l-7.6-1.8" />
    </svg>
  );
}
