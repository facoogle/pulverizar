// En Windows, si la terminal arranca con la letra de disco en minúscula ("c:\..."), Vitest carga dos copias de
// sí mismo y falla con "Cannot read properties of undefined (reading 'config')". Lo corregimos antes de lanzarlo.
import { spawnSync } from "node:child_process";

const cwd = process.cwd().replace(/^[a-z]:/, (d) => d.toUpperCase());
const r = spawnSync("npx", ["vitest", "run", ...process.argv.slice(2)], { cwd, stdio: "inherit", shell: true });
process.exit(r.status ?? 1);
