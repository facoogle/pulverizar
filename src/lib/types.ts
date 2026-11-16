export type ProfileId = "terrestre" | "dron" | "avion";

/** Límites de aplicación de un equipo. */
export interface Criteria {
  windMin: number;
  windMax: number;
  windMaxMarg: number;
  gustMax: number;
  gustMaxMarg: number;
  dtMin: number;
  dtMax: number;
  dtMaxMarg: number;
  rainProb: number;
  rainMm: number;
}

/** Una hora de pronóstico. Viento y ráfaga en km/h, temperatura en °C. */
export interface Hour {
  /** Hora local del lote, "YYYY-MM-DDTHH:MM" */
  t: string;
  T: number;
  RH: number;
  wind: number;
  gust: number;
  dir: number;
  rain: number;
  /** Probabilidad de lluvia (%), si el modelo la informa */
  pp: number | null;
  code: number | undefined;
  isDay: number;
  /** Delta T = temperatura − bulbo húmedo */
  dt: number;
}

export interface Forecast {
  hours: Hour[];
  utcOffset: number;
  /** Código de tiempo por día "YYYY-MM-DD" */
  dailyCode: Record<string, number>;
}

export interface Place {
  lat: number;
  lon: number;
  name: string;
  region?: string;
  /** Viene del GPS: se le busca el nombre de la localidad una vez */
  gps?: boolean;
}

/** 0 = óptima, 1 = marginal, 2 = no apta */
export type Level = 0 | 1 | 2;

export interface Evaluation {
  level: Level;
  reasons: [Level, string][];
}
