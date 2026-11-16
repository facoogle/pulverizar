import { useCallback, useEffect, useMemo, useState } from "react";
import { Chart } from "./components/Chart";
import { DaysSummary } from "./components/DaysSummary";
import { Detail } from "./components/Detail";
import { Grid } from "./components/Grid";
import { Header } from "./components/Header";
import { Help } from "./components/Help";
import { WeatherSprite } from "./components/icons";
import { LocationCard } from "./components/LocationCard";
import { NowCard } from "./components/NowCard";
import { Settings } from "./components/Settings";
import { nowKey } from "./lib/calc";
import { groupByDay } from "./lib/dates";
import { PROFILES } from "./lib/profiles";
import type { Criteria, Forecast, Place, ProfileId } from "./lib/types";
import { readStored, useLocalStorage, writeStored } from "./lib/useLocalStorage";
import { fetchForecast, reverseName } from "./lib/weather";

const isProfile = (p: unknown): p is ProfileId => typeof p === "string" && p in PROFILES;
const REFRESH_MS = 30 * 60 * 1000;
const DEFAULT_PROFILE: ProfileId = "dron";

export default function App() {
  const [storedProfile, storeProfile] = useLocalStorage<ProfileId>("profile", DEFAULT_PROFILE);
  const profile: ProfileId = isProfile(storedProfile) ? storedProfile : DEFAULT_PROFILE;
  const [overrides, setOverrides] = useState<Partial<Criteria>>(() => readStored(`cfg_${profile}`, {}));
  const [resetN, setResetN] = useState(0);
  const [place, setPlace] = useLocalStorage<Place | null>("loc", null);

  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [status, setStatus] = useState({ text: "", error: false });
  const [selKey, setSelKey] = useState<string | null>(null);
  const [selDay, setSelDay] = useState<string | null>(null);
  const [allHours, setAllHours] = useState(false);
  const [locOpen, setLocOpen] = useState(false);

  const cfg = useMemo<Criteria>(() => ({ ...PROFILES[profile], ...overrides }), [profile, overrides]);

  // Pronóstico: al elegir lote y cada 30 minutos
  const lat = place?.lat, lon = place?.lon;
  useEffect(() => {
    if (lat == null || lon == null) {
      setStatus({ text: "Elegí la ubicación del lote para ver el pronóstico.", error: false });
      return;
    }
    const ctrl = new AbortController();
    const load = async () => {
      setStatus({ text: "Cargando pronóstico…", error: false });
      try {
        const f = await fetchForecast({ lat, lon }, ctrl.signal);
        setForecast(f);
        const d = new Date();
        setStatus({ text: `Actualizado ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")} h`, error: false });
      } catch (e) {
        if (ctrl.signal.aborted) return;
        setStatus({ text: `No se pudo cargar el pronóstico (${(e as Error).message}). Revisá la conexión.`, error: true });
      }
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => { ctrl.abort(); clearInterval(id); };
  }, [lat, lon]);

  // Ubicación por GPS: buscar el nombre de la localidad una sola vez
  useEffect(() => {
    if (!place || !(place.gps || /^Mi ubicación/.test(place.name)) || !/^Mi ubicación/.test(place.name)) return;
    let cancelled = false;
    reverseName(place.lat, place.lon).then((r) => {
      if (r && !cancelled) setPlace({ ...place, gps: true, name: r.name, region: r.region });
    });
    return () => { cancelled = true; };
  }, [place, setPlace]);

  const changeProfile = useCallback((p: ProfileId) => {
    storeProfile(p);
    setOverrides(readStored(`cfg_${p}`, {}));
  }, [storeProfile]);

  const changeCriteria = useCallback((k: keyof Criteria, v: number) => {
    const next = { ...overrides, [k]: v };
    setOverrides(next);
    writeStored(`cfg_${profile}`, next);
  }, [overrides, profile]);

  const resetCriteria = useCallback(() => {
    setOverrides({});
    writeStored(`cfg_${profile}`, {});
    setResetN((n) => n + 1);
  }, [profile]);

  const pickPlace = (p: Place) => { setPlace(p); setLocOpen(false); setSelKey(null); setSelDay(null); };

  const selectHour = (t: string) => {
    setSelKey(t);
    setSelDay(t.slice(0, 10));
    requestAnimationFrame(() => document.getElementById("detail")?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  // Datos derivados
  const nowK = forecast ? nowKey(forecast.utcOffset) : "";
  const days = forecast
    ? [...groupByDay(forecast.hours)].filter(([, hs]) => hs.some((h) => h.t.slice(0, 13) >= nowK))
    : [];
  const dayKey = selDay && days.some(([d]) => d === selDay) ? selDay : days[0]?.[0];
  const cur = forecast?.hours.find((h) => h.t.slice(0, 13) === nowK);
  const selHour = selKey ? forecast?.hours.find((h) => h.t === selKey) : undefined;
  const placeName = place?.name ?? "Elegir lote";

  return (
    <>
      <WeatherSprite />
      <Header profile={profile} onProfile={changeProfile} placeName={placeName} onPlaceClick={() => setLocOpen((o) => !o)} />

      <div className="wrap">
        {(locOpen || !place) && <LocationCard onPick={pickPlace} />}
        {forecast && cur && <NowCard cur={cur} cfg={cfg} profile={profile} />}

        {forecast ? (
          <Grid
            forecast={forecast} cfg={cfg} nowK={nowK} allHours={allHours}
            selKey={selKey} onSelect={selectHour} onAllHours={setAllHours}
            scrollKey={`${lat},${lon}|${allHours}`} status={status}
          />
        ) : (
          <div className="card"><p className={status.error ? "stat err" : "stat"}>{status.text}</p></div>
        )}

        {selHour && <Detail h={selHour} cfg={cfg} />}

        {forecast && dayKey && (
          <>
            <DaysSummary
              days={days} dailyCode={forecast.dailyCode} cfg={cfg}
              allHours={allHours} selDay={dayKey} onSelect={setSelDay}
            />
            <Chart
              day={dayKey} hours={days.find(([d]) => d === dayKey)?.[1] ?? []}
              cfg={cfg} allHours={allHours} onSelect={selectHour}
            />
          </>
        )}

        <Settings profile={profile} cfg={cfg} resetN={resetN} onChange={changeCriteria} onReset={resetCriteria} />
        <Help />
      </div>
    </>
  );
}
