const Versions = (() => {
  const STORAGE_KEY_STYLE = 'spb-style-versions';
  const STORAGE_KEY_LYRICS = 'spb-lyrics-versions';
  const MAX_VERSIONS = 5;

  function saveVersion(type, content, params) {
    const key = type === 'style' ? STORAGE_KEY_STYLE : STORAGE_KEY_LYRICS;
    let versions = getVersions(type);

    const version = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      content,
      params,
      preview: content.substring(0, 100)
    };

    versions.unshift(version);
    if (versions.length > MAX_VERSIONS) {
      versions = versions.slice(0, MAX_VERSIONS);
    }

    try {
      localStorage.setItem(key, JSON.stringify(versions));
    } catch (e) {
      console.error('Failed to save version:', e);
    }

    document.dispatchEvent(new CustomEvent('versionsChanged', { detail: { type } }));
  }

  function getVersions(type) {
    const key = type === 'style' ? STORAGE_KEY_STYLE : STORAGE_KEY_LYRICS;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function clearVersions(type) {
    const key = type === 'style' ? STORAGE_KEY_STYLE : STORAGE_KEY_LYRICS;
    localStorage.removeItem(key);
    document.dispatchEvent(new CustomEvent('versionsChanged', { detail: { type } }));
  }

  function compareVersions(type, idA, idB) {
    const versions = getVersions(type);
    const versionA = versions.find(v => v.id === idA);
    const versionB = versions.find(v => v.id === idB);

    if (!versionA || !versionB) return null;

    return {
      versionA,
      versionB,
      paramDiff: findParamDifferences(versionA.params, versionB.params),
      contentDiff: {
        a: versionA.content,
        b: versionB.content
      }
    };
  }

  function findParamDifferences(paramsA, paramsB) {
    const diff = {
      added: [],
      removed: [],
      changed: []
    };

    if (!paramsA || !paramsB) return diff;

    // Compare arrays (genres, moods, etc.)
    const compareArrays = (key, arrA, arrB) => {
      arrA = arrA || [];
      arrB = arrB || [];

      const added = arrB.filter(item => !arrA.includes(item));
      const removed = arrA.filter(item => !arrB.includes(item));

      if (added.length > 0) {
        diff.added.push({ param: key, values: added });
      }
      if (removed.length > 0) {
        diff.removed.push({ param: key, values: removed });
      }
    };

    // Compare simple values
    const compareValues = (key, valA, valB) => {
      if (valA !== valB) {
        diff.changed.push({ param: key, from: valA, to: valB });
      }
    };

    // Genre, Mood, Vocals, etc.
    if (paramsA.genres || paramsB.genres) {
      compareArrays('genres', paramsA.genres, paramsB.genres);
    }
    if (paramsA.moods || paramsB.moods) {
      compareArrays('moods', paramsA.moods, paramsB.moods);
    }
    if (paramsA.vocals || paramsB.vocals) {
      compareArrays('vocals', paramsA.vocals, paramsB.vocals);
    }
    if (paramsA.production || paramsB.production) {
      compareArrays('production', paramsA.production, paramsB.production);
    }

    // Instruments by register
    if (paramsA.instruments || paramsB.instruments) {
      ['high', 'mid', 'low'].forEach(reg => {
        const instA = paramsA.instruments?.[reg] || [];
        const instB = paramsB.instruments?.[reg] || [];
        compareArrays(`instruments.${reg}`, instA, instB);
      });
    }

    // Simple params
    if (paramsA.tempo !== paramsB.tempo) {
      compareValues('tempo', paramsA.tempo, paramsB.tempo);
    }
    if (paramsA.bpm !== paramsB.bpm) {
      compareValues('bpm', paramsA.bpm, paramsB.bpm);
    }
    if (paramsA.era !== paramsB.era) {
      compareValues('era', paramsA.era, paramsB.era);
    }
    if (paramsA.exclusions !== paramsB.exclusions) {
      compareValues('exclusions', paramsA.exclusions, paramsB.exclusions);
    }

    return diff;
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return {
    saveVersion,
    getVersions,
    clearVersions,
    compareVersions,
    formatTimestamp
  };
})();
