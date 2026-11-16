import { useCallback, useState } from "react";

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** useState que se guarda en el celular. Si el navegador no deja guardar, sigue funcionando en memoria. */
export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => read(key, fallback));
  const set = useCallback(
    (next: T) => {
      setValue(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* sin almacenamiento disponible */
      }
    },
    [key],
  );
  return [value, set] as const;
}

export function readStored<T>(key: string, fallback: T): T {
  return read(key, fallback);
}

export function writeStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sin almacenamiento disponible */
  }
}
