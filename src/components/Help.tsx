export function Help() {
  return (
    <div className="card help">
      <details>
        <summary>¿Qué es cada cosa?</summary>
        <p><b>Viento:</b> con menos de 3 km/h puede haber inversión térmica y la gota queda flotando; con mucho viento, deriva a otros lotes.</p>
        <p><b>Ráfaga:</b> golpes de viento que superan al promedio; desparraman la aplicación.</p>
        <p><b>Delta T:</b> temperatura del aire menos temperatura de bulbo húmedo (se calcula con temperatura y humedad). Indica cuánto se evapora la gota: 2–8 ideal, 8–10 precaución, más de 10 no aplicar. Menos de 2 = aire muy húmedo, riesgo de gotas finas en suspensión.</p>
        <p><b>Lluvia:</b> si llueve o hay alta probabilidad, el producto se lava.</p>
        <p><b>% de aptitud:</b> puntaje de 0 a 100 según qué tan cerca está cada valor de su límite. Manda el peor factor.</p>
        <p>
          Pronóstico: <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo</a> (modelos GFS, ECMWF y
          otros). Nombre del lugar: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>.
          Es una guía: siempre verificar en el lote con anemómetro.
        </p>
      </details>
    </div>
  );
}
