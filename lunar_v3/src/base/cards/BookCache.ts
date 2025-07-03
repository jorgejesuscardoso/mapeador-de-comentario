export function setCache(key: string, value: any, ttlSeconds = 3600) {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const payload = { value, expiresAt };
  localStorage.setItem(key, JSON.stringify(payload));
}

export function getCache(key: string) {
  const item = localStorage.getItem(key);
  if (!item) return null;

  try {
    const { value, expiresAt } = JSON.parse(item);
    // if (Date.now() > expiresAt) {
    //   localStorage.removeItem(key);
    //   return null;
    // }
    return value;
  } catch {
    return null;
  }
}
