import { evaluate, score } from "../lib/calc";
import { PROFILE_NAMES } from "../lib/profiles";
import type { Criteria, Hour, ProfileId } from "../lib/types";
import { Stats, WxLine } from "./Stats";

export const COLORS = ["var(--ok)", "var(--warn)", "var(--bad)"] as const;
const TITLES = ["ÓPTIMO PARA APLICAR", "MARGINAL", "NO APLICAR"];

export function NowCard({ cur, cfg, profile }: { cur: Hour; cfg: Criteria; profile: ProfileId }) {
  const ev = evaluate(cur, cfg);
  return (
    <div className="card">
      <div className="badge" style={{ background: COLORS[ev.level] }}>
        <div>
          <small>AHORA · {PROFILE_NAMES[profile].toUpperCase()}</small>
          {TITLES[ev.level]}
          <WxLine h={cur} />
        </div>
        <span className="big">{score(cur, cfg)}%</span>
      </div>
      <Stats h={cur} />
    </div>
  );
}
