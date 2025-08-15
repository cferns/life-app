import { useEffect, useState } from 'react';

export function usePinsStorage<T>(storageKey: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { setValue(JSON.parse(saved)); } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (value) {
      try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch {}
    }
  }, [storageKey, value]);

  return [value, setValue] as const;
}

