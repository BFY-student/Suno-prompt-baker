const MelodyBaker = (() => {
  const SUNO_API_BASE    = 'https://api.n1n.ai';
  const SUNO_KEY_STORAGE = 'suno_api_key';
  const SUNO_MODEL       = 'chirp-v5';
  // Seconds between consecutive WAV auto-downloads to avoid browser blocking
  const DOWNLOAD_STAGGER_MS = 8000;

  const AUDIO_KEYS = ['audioUrl','audio_url','streamAudioUrl','stream_audio_url','mp3Url','mp3_url','url'];
  const IMAGE_KEYS = ['imageUrl','image_url','coverUrl','cover_url','thumbnailUrl'];

  const autoDownloadedClipIds = new Set();
  const savedToHistoryTasks   = new Set();

  // ─── Helpers ───────────────────────────────────────────────────────────────
  function esc(s) {
    const d = document.createElement('div');
    d.textContent = String(s || '');
    return d.innerHTML;
  }

  function t(key) { return I18n.t(key); }

  function getApiKey() { return localStorage.getItem(SUNO_KEY_STORAGE) || ''; }

  // ─── Init ──────────────────────────────────────────────────────────────────
  function init() {
    const keyInput = document.getElementById('melody-api-key');
    if (keyInput) {
      keyInput.value = getApiKey();
      keyInput.addEventListener('input', () => {
        localStorage.setItem(SUNO_KEY_STORAGE, keyInput.value.trim());
        updateKeyIndicator(keyInput.value.trim());
      });
      updateKeyIndicator(keyInput.value.trim());
    }

    document.getElementById('btn-melody-refresh')?.addEventListener('click', refreshFromBaker);
    document.getElementById('btn-melody-generate')?.addEventListener('click', generate);
  }

  function updateKeyIndicator(val) {
    const dot = document.getElementById('melody-key-dot');
    if (dot) dot.classList.toggle('ok', val.length > 10);
  }

  // ─── Refresh from other bakers ─────────────────────────────────────────────
  function refreshFromBaker() {
    const styleSection  = document.getElementById('style-result-section');
    const lyricsSection = document.getElementById('lyrics-result-section');
    const styleEl       = document.getElementById('style-result');
    const lyricsEl      = document.getElementById('lyrics-result');
    const titleEl       = document.getElementById('lyrics-title');

    const hasStyle  = !!(styleEl  && styleEl.value.trim()  && styleSection  && !styleSection.classList.contains('hidden'));
    const hasLyrics = !!(lyricsEl && lyricsEl.value.trim() && lyricsSection && !lyricsSection.classList.contains('hidden'));

    const melodyTitle  = document.getElementById('melody-title');
    const melodyStyle  = document.getElementById('melody-style');
    const melodyLyrics = document.getElementById('melody-lyrics');

    if (melodyTitle  && titleEl)  melodyTitle.value  = titleEl.value.trim();
    if (melodyStyle  && styleEl)  melodyStyle.value  = styleEl.value.trim();
    if (melodyLyrics && lyricsEl) melodyLyrics.value = lyricsEl.value.trim();

    updateReadiness(hasStyle, hasLyrics);
  }

  function updateReadiness(hasStyle, hasLyrics) {
    const warning = document.getElementById('melody-readiness-warning');
    const btn     = document.getElementById('btn-melody-generate');
    const missing = [];

    if (!hasStyle)  missing.push(t('melody.missingStyle'));
    if (!hasLyrics) missing.push(t('melody.missingLyrics'));

    if (missing.length > 0) {
      warning.innerHTML = `<strong>${t('melody.notReadyTitle')}</strong> ${t('melody.missingBake')}<br>` +
        missing.map(m => `&bull; ${m}`).join('<br>');
      warning.classList.remove('hidden');
      if (btn) btn.disabled = true;
    } else {
      warning.classList.add('hidden');
      if (btn) btn.disabled = false;
    }
  }

  // ─── Vocal-first reordering ────────────────────────────────────────────────
  // Suno's NLP assigns highest token weight to early tokens. Ensure vocal
  // keywords appear right after the first genre tag so they aren't buried.
  const VOCAL_KEYWORDS = [
    'male vocal', 'female vocal', 'androgynous', 'duet', 'choir',
    'rap', 'spoken word', 'belting', 'falsetto', 'whisper', 'growl',
    'operatic', 'humming', 'scat', 'no vocal', 'instrumental',
    'gritty', 'breathy', 'airy', 'warm', 'raspy', 'smooth',
    'powerful', 'delicate', 'deep pitch', 'high pitch', 'rich tone',
    'thin voice', 'nasal', 'husky'
  ];

  function ensureVocalFirst(tags) {
    if (!tags) return tags;
    const parts = tags.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length < 2) return tags;

    const vocalParts = [];
    const otherParts = [];
    parts.forEach(p => {
      const lower = p.toLowerCase();
      if (VOCAL_KEYWORDS.some(kw => lower.includes(kw))) {
        vocalParts.push(p);
      } else {
        otherParts.push(p);
      }
    });

    if (!vocalParts.length) return tags; // nothing to reorder

    // Place vocal right after the first tag (genre) for maximum token weight
    const result = [otherParts[0], ...vocalParts, ...otherParts.slice(1)];
    return result.join(', ');
  }

  // ─── Generate ──────────────────────────────────────────────────────────────
  async function generate() {
    const apiKey = getApiKey();
    if (!apiKey) { showNotification(t('melody.enterApiKey'), 'error'); return; }

    const title  = document.getElementById('melody-title')?.value.trim()  || '';
    const style  = document.getElementById('melody-style')?.value.trim()  || '';
    const lyrics = document.getElementById('melody-lyrics')?.value.trim() || '';

    if (!style)  { showNotification(t('melody.styleEmpty'),  'error'); return; }
    if (!lyrics) { showNotification(t('melody.lyricsEmpty'), 'error'); return; }

    const btn = document.getElementById('btn-melody-generate');
    const origHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="btn-spinner"></span> ${t('melody.submitBtn')}`;

    document.getElementById('melody-tracks').innerHTML = '';
    showResults(true);
    setStatus('queued', t('melody.submitting'));

    const tags = ensureVocalFirst(style);
    const body = { prompt: lyrics, mv: SUNO_MODEL, tags };
    if (title) body.title = title;

    try {
      const res  = await fetch(`${SUNO_API_BASE}/suno/submit/music`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      const codeOk = !json.code || ['0', 0, 200, 'success', 'ok'].includes(json.code);
      if (!res.ok || !codeOk) throw new Error(json.message || `HTTP ${res.status}`);

      const taskId = typeof json.data === 'string' ? json.data : (json.data?.taskId || json.taskId);
      if (!taskId) throw new Error('No task ID in response');

      showNotification(`${t('melody.submitted')} ${taskId}`, 'success');
      pollTask(taskId, apiKey, title);
    } catch (e) {
      showNotification(`${t('melody.submitError')} ${e.message}`, 'error');
      setStatus('error', e.message);
    } finally {
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }
  }

  // ─── Poll ──────────────────────────────────────────────────────────────────
  function pollTask(taskId, apiKey, songTitle) {
    setStatus('queued', t('melody.polling'));
    let attempts = 0;
    const MAX = 150;

    const poll = async () => {
      if (attempts++ > MAX) {
        setStatus('error', `${t('melody.statusTimedOut')} ${taskId}`);
        return;
      }
      try {
        const res  = await fetch(`${SUNO_API_BASE}/suno/fetch/${taskId}`, {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        const json = await res.json();
        const status = extractStatus(json);
        const clips  = extractClips(json);

        if (clips.length > 0 && (status === 'SUCCESS' || status === 'FIRST_SUCCESS')) {
          const done = status === 'SUCCESS';
          setStatus(
            done ? 'success' : 'progress',
            done
              ? `${t('melody.tracksDone')} ${clips.length} ${t('melody.tracksGenerated')}`
              : `${t('melody.tracksFirstReady')} (${clips.length} ${t('melody.tracksSoFar')}`
          );

          clips.forEach((clip, index) => {
            renderTrack(clip);
            const f = getClipFields(clip);
            if (f.clipId && !autoDownloadedClipIds.has(f.clipId)) {
              autoDownloadedClipIds.add(f.clipId);
              // Stagger downloads: each clip waits an extra DOWNLOAD_STAGGER_MS to avoid
              // the browser blocking simultaneous download prompts
              const stagger = index * DOWNLOAD_STAGGER_MS;
              setTimeout(() => scheduleWavAutoDownload(f.clipId, apiKey, f.audioUrl, songTitle || f.title), stagger);
            }
          });

          if (!savedToHistoryTasks.has(taskId)) {
            savedToHistoryTasks.add(taskId);
            const displayTitle = songTitle || getClipFields(clips[0]).title || 'Untitled';
            History.add('song', displayTitle, { taskId });
          }

          if (!done) setTimeout(poll, 4000);
          return;
        }

        const errStatuses = ['CREATE_TASK_FAILED','GENERATE_AUDIO_FAILED','CALLBACK_EXCEPTION','SENSITIVE_WORD_ERROR','FAILED','FAILURE'];
        if (errStatuses.includes(status)) {
          const task = json?.data || json;
          setStatus('error', `Failed (${status}): ${task.errorMessage || task.failReason || ''} — Task: ${taskId}`);
          return;
        }

        const label = {
          PENDING:      t('melody.statusPending'),
          TEXT_SUCCESS: t('melody.statusTextSuccess'),
          QUEUED:       t('melody.statusQueued')
        }[status] || t('melody.statusWaiting');
        setStatus('queued', `${label} (${attempts})`);
        setTimeout(poll, 4000);
      } catch (e) {
        setStatus('queued', `${t('melody.networkError')} (${attempts})`);
        setTimeout(poll, 5000);
      }
    };

    poll();
  }

  // ─── WAV auto-download ─────────────────────────────────────────────────────
  function scheduleWavAutoDownload(clipId, apiKey, audioUrl, title) {
    const trigger = () => fetchWavAndDownload(clipId, apiKey, title, true, 8);
    if (audioUrl) {
      fetch(audioUrl, { method: 'HEAD' }).catch(() => {}).finally(() => setTimeout(trigger, 5000));
    } else {
      setTimeout(trigger, 5000);
    }
  }

  async function fetchWavAndDownload(clipId, apiKey, title, autoDownload, retriesLeft) {
    try {
      const res  = await fetch(`${SUNO_API_BASE}/suno/act/wav/${clipId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      const json = await res.json();
      const url  = [json.data, json.wav_file_url, json.url]
        .find(v => typeof v === 'string' && v.startsWith('http')) || null;

      if (!url) {
        if (autoDownload && retriesLeft > 0) {
          showNotification(`${t('melody.wavNotReady')} (${retriesLeft} ${t('melody.wavLeft')}`, 'info');
          setTimeout(() => fetchWavAndDownload(clipId, apiKey, title, true, retriesLeft - 1), 6000);
          return;
        }
        throw new Error(json.message || 'No WAV URL in response');
      }

      // Update any existing player on the card to the WAV URL
      const audioEl = document.querySelector(`#melody-tracks audio[data-clip="${CSS.escape(clipId)}"]`);
      if (audioEl) { audioEl.src = url; audioEl.load(); }

      // Inject WAV download button onto the card
      addWavDownloadButton(clipId, url, title);

      if (autoDownload) {
        await triggerBlobDownload(url, safeFilename(title, clipId));
        showNotification(t('melody.wavDownloaded'), 'success');
      }
    } catch (e) {
      if (autoDownload && retriesLeft > 0) {
        setTimeout(() => fetchWavAndDownload(clipId, apiKey, title, true, retriesLeft - 1), 6000);
        return;
      }
      showNotification(`${t('melody.wavFailed')} ${e.message}`, 'error');
    }
  }

  function addWavDownloadButton(clipId, wavUrl, title) {
    const actionsEl = document.querySelector(`#melody-tracks .melody-track-actions[data-clip="${CSS.escape(clipId)}"]`);
    if (!actionsEl || actionsEl.querySelector('.wav-dl-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost btn-sm wav-dl-btn';
    btn.textContent = t('melody.downloadWav');
    btn.onclick = async () => {
      btn.disabled = true;
      btn.textContent = t('melody.downloading');
      try {
        await triggerBlobDownload(wavUrl, safeFilename(title, clipId));
        showNotification(t('melody.wavDownloaded'), 'success');
      } catch (e) {
        showNotification(`${t('melody.downloadFailed')} ${e.message}`, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = t('melody.downloadWav');
      }
    };
    actionsEl.prepend(btn);
  }

  async function triggerBlobDownload(url, filename) {
    const r    = await fetch(url);
    const blob = await r.blob();
    const burl = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = burl; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(burl), 10000);
  }

  function safeFilename(title, clipId) {
    const safe = (title || 'suno').replace(/[^a-zA-Z0-9\-_ ]/g, '').trim().replace(/\s+/g, '-').slice(0, 40);
    return `${safe || 'suno'}-${clipId.slice(0, 8)}.wav`;
  }

  // ─── Direct CDN download ────────────────────────────────────────────────────
  async function downloadFromCdn(clipId, title) {
    const url = `https://cdn1.suno.ai/${clipId}.wav`;
    try {
      await triggerBlobDownload(url, safeFilename(title, clipId));
      showNotification(t('melody.wavDownloaded'), 'success');
    } catch (e) {
      showNotification(`${t('melody.wavFailed')} ${e.message}`, 'error');
    }
  }

  // ─── Download from history ──────────────────────────────────────────────────
  async function downloadSongFromHistory(taskId) {
    const apiKey = getApiKey();
    if (!apiKey) { showNotification(t('melody.enterApiKeyForHistory'), 'error'); return; }

    showNotification(t('melody.fetchingInfo'), 'info');
    try {
      const res   = await fetch(`${SUNO_API_BASE}/suno/fetch/${taskId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      const json  = await res.json();
      const clips = extractClips(json);

      if (!clips.length) { showNotification(t('melody.noClipsFound'), 'error'); return; }

      showNotification(t('melody.fetchingWav'), 'info');
      for (let i = 0; i < clips.length; i++) {
        const f = getClipFields(clips[i]);
        if (!f.clipId) continue;
        // Download directly from Suno CDN: https://cdn1.suno.ai/<clipId>.wav
        await downloadFromCdn(f.clipId, f.title);
        // Stagger: wait DOWNLOAD_STAGGER_MS before next download to avoid browser blocking
        if (i < clips.length - 1) await new Promise(r => setTimeout(r, DOWNLOAD_STAGGER_MS));
      }
    } catch (e) {
      showNotification(`${t('melody.fetchFailed')} ${e.message}`, 'error');
    }
  }

  // ─── Data helpers ──────────────────────────────────────────────────────────
  function extractStatus(json) {
    const candidates = [
      json?.data?.status, json?.data?.state,
      json?.status,       json?.state,
      json?.data?.taskStatus, json?.taskStatus
    ];
    for (const c of candidates) if (c) return String(c).toUpperCase();
    return '';
  }

  function looksLikeClip(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
    return AUDIO_KEYS.some(k => typeof obj[k] === 'string' && obj[k].startsWith('http'));
  }

  function deepFindClips(node, depth = 0, found = []) {
    if (depth > 8 || node === null || node === undefined) return found;
    if (looksLikeClip(node)) { found.push(node); return found; }
    if (Array.isArray(node)) { node.forEach(n => deepFindClips(n, depth + 1, found)); return found; }
    if (typeof node === 'object') { Object.values(node).forEach(v => deepFindClips(v, depth + 1, found)); }
    return found;
  }

  function extractClips(json) {
    const task = json?.data || json;
    if (Array.isArray(task?.response?.sunoData) && task.response.sunoData.length) return task.response.sunoData;
    if (Array.isArray(task?.data) && looksLikeClip(task.data[0])) return task.data;
    if (looksLikeClip(task?.data)) return [task.data];
    return deepFindClips(json);
  }

  function getClipFields(clip) {
    const audioUrl = AUDIO_KEYS.map(k => clip[k]).find(v => typeof v === 'string' && v.startsWith('http')) || '';
    const imageUrl = IMAGE_KEYS.map(k => clip[k]).find(v => typeof v === 'string' && v.startsWith('http')) || '';
    return {
      clipId:   clip.id || clip.clip_id || clip.clipId || '',
      title:    clip.title || clip.display_name || clip.name || 'Untitled',
      tags:     clip.tags || clip.style || clip.metadata?.tags || '',
      model:    clip.modelName || clip.model_name || clip.metadata?.model_name || '',
      audioUrl, imageUrl,
      duration: clip.duration || ''
    };
  }

  // ─── UI ────────────────────────────────────────────────────────────────────
  function renderTrack(clip) {
    const container = document.getElementById('melody-tracks');
    if (!container || !clip) return;
    const f = getClipFields(clip);

    const card = document.createElement('div');
    card.className = 'melody-track-card';
    card.innerHTML = `
      <div class="melody-track-header">
        ${f.imageUrl
          ? `<img src="${esc(f.imageUrl)}" alt="cover" class="melody-track-art" onerror="this.style.display='none'">`
          : `<div class="melody-track-art-placeholder">🎵</div>`}
        <div class="melody-track-info">
          <div class="melody-track-title">${esc(f.title)}</div>
          <div class="melody-track-tags">${esc(f.tags)}</div>
          ${f.model    ? `<div class="melody-track-meta"><span class="melody-model-badge">⚡ ${esc(f.model)}</span></div>` : ''}
          ${f.duration ? `<div class="melody-track-meta">⏱ ${Math.round(f.duration)}s</div>` : ''}
          ${f.clipId   ? `<div class="melody-track-meta" style="font-family:var(--font-mono);font-size:0.72rem;color:var(--text-muted);margin-top:3px;">ID: ${esc(f.clipId)}</div>` : ''}
        </div>
      </div>
      <audio controls data-clip="${esc(f.clipId)}" style="width:100%;margin:10px 0 4px;border-radius:8px;outline:none;">
        ${f.audioUrl ? `<source src="${esc(f.audioUrl)}" type="audio/mpeg">
        <source src="${esc(f.audioUrl)}" type="audio/wav">` : ''}
        Your browser does not support audio.
      </audio>
      <div class="melody-track-actions" data-clip="${esc(f.clipId)}">
        ${f.audioUrl ? `<a href="${esc(f.audioUrl)}" target="_blank" class="btn btn-ghost btn-sm">${t('melody.openAudio')}</a>` : ''}
        ${f.clipId   ? `<button class="btn btn-ghost btn-sm" onclick="navigator.clipboard.writeText('${esc(f.clipId)}').then(()=>showNotification('${t('melody.clipIdCopied')}','success'))">
          ${t('melody.copyId')}</button>` : ''}
      </div>`;

    container.prepend(card);
  }

  function showResults(show) {
    const section = document.getElementById('melody-results-section');
    if (section) section.classList.toggle('hidden', !show);
  }

  function setStatus(state, msg) {
    const bar = document.getElementById('melody-status-bar');
    if (!bar) return;
    const stateClass = { queued: 'status-queued', progress: 'status-progress', success: 'status-success', error: 'status-error' }[state] || '';
    bar.innerHTML = `<div class="melody-status-dot ${stateClass}"></div><span>${esc(msg)}</span>`;
    bar.classList.remove('hidden');
  }

  return { init, refreshFromBaker, downloadSongFromHistory };
})();
