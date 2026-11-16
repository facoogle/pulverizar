import { CRITERIA_LABELS, PROFILE_NAMES } from "../lib/profiles";
import type { Criteria, ProfileId } from "../lib/types";

interface Props {
  profile: ProfileId;
  cfg: Criteria;
  resetN: number;
  onChange: (key: keyof Criteria, value: number) => void;
  onReset: () => void;
}

export function Settings({ profile, cfg, resetN, onChange, onReset }: Props) {
  return (
    <div className="card">
      <details>
        <summary>⚙️ Ajustar criterios <span className="stat">· {PROFILE_NAMES[profile]}</span></summary>
        <div className="cfg">
          {(Object.keys(CRITERIA_LABELS) as (keyof Criteria)[]).map((k) => (
            <label key={`${profile}-${k}-${resetN}`}>
              {CRITERIA_LABELS[k]}
              <input
                type="number"
                inputMode="decimal"
                step={k === "rainMm" ? 0.1 : 1}
                defaultValue={cfg[k]}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!Number.isNaN(v)) onChange(k, v);
                }}
              />
            </label>
          ))}
        </div>
        <p className="help">
          Cada equipo guarda sus propios valores. Los de fábrica son orientativos: ajustalos según el manual del
          equipo, la etiqueta del producto y la normativa local.
        </p>
        <button className="full" onClick={onReset}>Volver a los valores de fábrica</button>
      </details>
    </div>
  );
}
