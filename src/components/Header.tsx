import { PROFILE_NAMES } from "../lib/profiles";
import type { ProfileId } from "../lib/types";
import { EquipmentIcon } from "./icons";

interface Props {
  profile: ProfileId;
  onProfile: (p: ProfileId) => void;
  placeName: string;
  onPlaceClick: () => void;
}

export function Header({ profile, onProfile, placeName, onPlaceClick }: Props) {
  return (
    <header>
      <div className="in">
        <div className="top">
          <h1>Ventanas de aplicación</h1>
          <button className="loc" onClick={onPlaceClick} aria-label="Cambiar ubicación">
            📍 <span>{placeName}</span>
          </button>
        </div>
        <div className="seg" role="tablist" aria-label="Equipo">
          {(Object.keys(PROFILE_NAMES) as ProfileId[]).map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={p === profile}
              className={p === profile ? "on" : ""}
              onClick={() => onProfile(p)}
            >
              <EquipmentIcon id={p} />
              {PROFILE_NAMES[p]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
