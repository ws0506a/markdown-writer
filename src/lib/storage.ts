const PREFIX = 'mdwriter:';

export function readKey<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export type WriteResult = { ok: true } | { ok: false; reason: 'quota' | 'unknown' };

export function writeKey(key: string, value: unknown): WriteResult {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return { ok: true };
  } catch (err) {
    if (
      err instanceof DOMException &&
      (err.name === 'QuotaExceededError' || err.code === 22)
    ) {
      return { ok: false, reason: 'quota' };
    }
    return { ok: false, reason: 'unknown' };
  }
}
