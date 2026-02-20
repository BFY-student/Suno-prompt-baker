const History = (() => {
  const STORAGE_KEY = 'spb-history';
  const MAX_ENTRIES = 50;

  function load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function save(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function add(type, content) {
    const entries = load();
    entries.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      type, // 'style' or 'lyrics'
      content,
      preview: content.slice(0, 60).replace(/\n/g, ' '),
      timestamp: Date.now()
    });
    // Prune to limit
    if (entries.length > MAX_ENTRIES) {
      entries.length = MAX_ENTRIES;
    }
    save(entries);
    document.dispatchEvent(new CustomEvent('historyChanged'));
    return entries;
  }

  function getAll() {
    return load();
  }

  function remove(id) {
    const entries = load().filter(e => e.id !== id);
    save(entries);
    document.dispatchEvent(new CustomEvent('historyChanged'));
    return entries;
  }

  function clearAll() {
    save([]);
    document.dispatchEvent(new CustomEvent('historyChanged'));
  }

  function formatTime(ts) {
    const d = new Date(ts);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  return { add, getAll, remove, clearAll, formatTime };
})();
