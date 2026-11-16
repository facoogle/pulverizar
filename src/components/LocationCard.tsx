import { useState } from "react";
import type { Place } from "../lib/types";
import { searchPlaces } from "../lib/weather";

interface Props {
  onPick: (p: Place) => void;
}

export function LocationCard({ onPick }: Props) {
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [results, setResults] = useState<{ label: string; place: Place }[]>([]);
  const [locating, setLocating] = useState(false);

  const fail = (m: string) => { setError(true); setMsg(m); };
  const info = (m: string | null) => { setError(false); setMsg(m); };

  function useGps() {
    if (!navigator.geolocation) return fail("Este dispositivo no permite ubicación.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocating(false);
        const { latitude: lat, longitude: lon } = p.coords;
        onPick({
          lat: +lat.toFixed(4),
          lon: +lon.toFixed(4),
          gps: true,
          name: `Mi ubicación (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
        });
      },
      () => {
        setLocating(false);
        fail("No se pudo obtener la ubicación. Buscá la localidad por nombre.");
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }

  async function search() {
    const text = q.trim();
    if (!text) return;
    info("Buscando…");
    setResults([]);
    try {
      const found = await searchPlaces(text);
      setResults(found);
      info(found.length ? null : "No encontré esa localidad.");
    } catch {
      fail("Error al buscar.");
    }
  }

  return (
    <div className="card">
      <h2>Ubicación del lote</h2>
      <button className="primary full" style={{ marginTop: 10 }} onClick={useGps} disabled={locating}>
        {locating ? "Obteniendo ubicación…" : "📍 Usar mi ubicación actual"}
      </button>
      <div className="row" style={{ marginTop: 8 }}>
        <input
          className="grow"
          placeholder="o buscar localidad"
          enterKeyHint="search"
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button onClick={search}>Buscar</button>
      </div>
      <div className="results">
        {msg && <p className={error ? "err" : "stat"}>{msg}</p>}
        {results.map((r) => (
          <button key={r.label} onClick={() => onPick(r.place)}>{r.label}</button>
        ))}
      </div>
    </div>
  );
}
