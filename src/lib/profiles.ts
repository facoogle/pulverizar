import type { Criteria, ProfileId } from "./types";

/** Valores de fábrica, orientativos. Ajustar según manual del equipo, etiqueta del producto y normativa local. */
export const PROFILES: Record<ProfileId, Criteria> = {
  dron:      { windMin: 3, windMax: 10, windMaxMarg: 12, gustMax: 15, gustMaxMarg: 18, dtMin: 2, dtMax: 6, dtMaxMarg: 8,  rainProb: 40, rainMm: 0.2 },
  terrestre: { windMin: 3, windMax: 15, windMaxMarg: 18, gustMax: 20, gustMaxMarg: 25, dtMin: 2, dtMax: 8, dtMaxMarg: 10, rainProb: 40, rainMm: 0.2 },
  avion:    { windMin: 5, windMax: 15, windMaxMarg: 18, gustMax: 20, gustMaxMarg: 25, dtMin: 2, dtMax: 8, dtMaxMarg: 10, rainProb: 40, rainMm: 0.2 },
};

export const PROFILE_NAMES: Record<ProfileId, string> = {
  dron: "Dron",
  terrestre: "Terrestre",
  avion: "Avión",
};

export const CRITERIA_LABELS: Record<keyof Criteria, string> = {
  windMin: "Viento mínimo (km/h)",
  windMax: "Viento máx. óptimo (km/h)",
  windMaxMarg: "Viento máx. marginal (km/h)",
  gustMax: "Ráfaga máx. óptima (km/h)",
  gustMaxMarg: "Ráfaga máx. marginal (km/h)",
  dtMin: "Delta T mínimo",
  dtMax: "Delta T máx. óptimo",
  dtMaxMarg: "Delta T máx. marginal",
  rainProb: "Prob. lluvia no apta (%)",
  rainMm: "Lluvia no apta (mm/h)",
};
