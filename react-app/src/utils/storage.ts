

export const ls = {
  setItem<T>(key: string, value: T, timer?: number) {
    window.localStorage.setItem(key, JSON.stringify(value));
    if (timer) {
      window.localStorage.setItem(key + '_keep_alive_', timer + '');
      window.localStorage.setItem(key + '_save_time_', Date.now() + '');
    }
  },
  getItem<T>(key: string) {
    let isLive = true;
    const saveTime = window.localStorage.getItem(key + '_save_time_');
    if (saveTime !== null) {
      const liveTime = window.localStorage.getItem(key + '_keep_alie_');
      if (liveTime !== null && Date.now() - Number(saveTime) > Number(liveTime)) {
        window.localStorage.removeItem(key + '_save_time_');
        isLive = false;
      }
      if (liveTime === null) window.localStorage.removeItem(key + '_keep_alie_');
    }
    if (isLive === false) return null;

    const str = window.localStorage.getItem(key);
    if (str === null) return null;
    try { return JSON.parse(str) as unknown as T; }
    catch { return null };
  },
  removeItem(key: string) {
    window.localStorage.removeItem(key);
    window.localStorage.removeItem(key + '_save_time_');
    window.localStorage.removeItem(key + '_keep_alie_');
  },
  clear() {
    window.localStorage.clear();
  }
}
