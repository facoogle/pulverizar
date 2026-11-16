# Ventanas de aplicación

App para decidir **cuándo pulverizar** con equipo terrestre, dron o avión. Toma el pronóstico hora por hora y calcula
viento, ráfagas, Delta T y lluvia, con un % de aptitud (verde / amarillo / rojo) para cada hora.

React + Vite + TypeScript. Sin base de datos: el lote y los criterios se guardan en el celular.

## Comandos

```bash
npm install     # una sola vez
npm run dev     # servidor de desarrollo (http://localhost:5173)
npm test        # tests de los cálculos
npm run build   # compila a dist/ (también revisa los tipos)
npm run preview # prueba local de lo compilado
```

## Publicar en Vercel

1. Subir el proyecto a un repositorio de GitHub.
2. En vercel.com: **Add New → Project** e importar el repositorio.
3. Vercel detecta Vite solo (build `npm run build`, salida `dist`). Tocar **Deploy**.

> El plan gratis de Vercel (Hobby) y la API gratuita de Open-Meteo son solo para uso **no comercial**.
> Para vender la app hay que pasar a los planes comerciales de ambos.

## Estructura

```
src/lib/        lógica sin pantalla: cálculos (calc.ts), clima (weather.ts), criterios por equipo (profiles.ts)
src/components/ pantallas: grilla, resumen por día, curva, detalle, ajustes
legacy/         versión anterior en un solo HTML (de respaldo; se puede borrar)
```

Si cambia la fuente del clima, solo se toca `src/lib/weather.ts`.

## Fuentes de datos

- Pronóstico: [Open-Meteo](https://open-meteo.com) (modelo automático "best match": ECMWF, GFS e ICON).
- Nombre del lugar a partir del GPS: [OpenStreetMap](https://www.openstreetmap.org/copyright) (Nominatim).
- Delta T: se calcula en la app con temperatura y humedad (fórmula de Stull, 2011).

Los límites por equipo (`src/lib/profiles.ts`) son **orientativos**: validarlos con un ingeniero agrónomo, el manual del
equipo y la etiqueta del producto.
