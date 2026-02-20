// Global notification helper
function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  if (!container) return;
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.textContent = message;
  container.appendChild(notif);
  requestAnimationFrame(() => notif.classList.add('visible'));
  setTimeout(() => {
    notif.classList.remove('visible');
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Sanitize AI output: replace words banned by Suno
function sanitizeOutput(text) {
  return text.replace(/\bskank(s|ing|ed)?\b/gi, 'offbeat strum');
}

const App = (() => {
  async function init() {
    await I18n.init();
    StyleBaker.init();
    LyricsBaker.init();
    bindNavigation();
    bindSettings();
    bindHistory();
    bindLanguageToggle();
    bindModals();
    loadSettings();
    renderHistory();

    // Listen for history changes
    document.addEventListener('historyChanged', renderHistory);
    document.addEventListener('langChanged', () => {
      renderHistory();
    });

    // Show style tab by default
    switchTab('style');
  }

  function bindNavigation() {
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.getAttribute('data-tab'));
      });
    });
  }

  function switchTab(tabName) {
    // Update nav buttons
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    // Update panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('hidden', panel.id !== `panel-${tabName}`);
    });
  }

  function bindLanguageToggle() {
    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const newLang = I18n.getLang() === 'en' ? 'zh' : 'en';
        I18n.setLanguage(newLang);
        toggle.textContent = newLang === 'en' ? '中文' : 'EN';
      });
      toggle.textContent = I18n.getLang() === 'en' ? '中文' : 'EN';
    }
  }

  function bindSettings() {
    const settingsBtn = document.getElementById('btn-settings');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtn = document.getElementById('settings-close');

    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        loadSettings();
        settingsModal.classList.add('visible');
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        settingsModal.classList.remove('visible');
      });
    }

    // Save settings
    const saveBtn = document.getElementById('btn-save-settings');
    if (saveBtn) {
      saveBtn.addEventListener('click', saveSettings);
    }

    // Test connections
    document.getElementById('btn-test-openai')?.addEventListener('click', () => testProvider('openai'));
    document.getElementById('btn-test-gemini')?.addEventListener('click', () => testProvider('gemini'));
  }

  function loadSettings() {
    const config = API.getConfig();
    const p = config.providers;

    document.getElementById('openai-base-url').value = p.openai?.baseUrl || API.defaults.openai.baseUrl;
    document.getElementById('openai-api-key').value = p.openai?.apiKey || '';
    document.getElementById('openai-model').value = p.openai?.model || API.defaults.openai.model;

    document.getElementById('gemini-base-url').value = p.gemini?.baseUrl || API.defaults.gemini.baseUrl;
    document.getElementById('gemini-api-key').value = p.gemini?.apiKey || '';
    document.getElementById('gemini-model').value = p.gemini?.model || API.defaults.gemini.model;

    const activeRadios = document.querySelectorAll('input[name="active-provider"]');
    activeRadios.forEach(r => {
      r.checked = r.value === config.active;
    });
  }

  function saveSettings() {
    const config = {
      providers: {
        openai: {
          baseUrl: document.getElementById('openai-base-url').value.trim(),
          apiKey: document.getElementById('openai-api-key').value.trim(),
          model: document.getElementById('openai-model').value.trim()
        },
        gemini: {
          baseUrl: document.getElementById('gemini-base-url').value.trim(),
          apiKey: document.getElementById('gemini-api-key').value.trim(),
          model: document.getElementById('gemini-model').value.trim()
        }
      },
      active: document.querySelector('input[name="active-provider"]:checked')?.value || ''
    };
    API.saveConfig(config);
    showNotification(I18n.t('settings.saved'), 'success');
  }

  async function testProvider(type) {
    // Save first so test uses current values
    saveSettings();
    const btn = document.getElementById(`btn-test-${type}`);
    const status = document.getElementById(`test-status-${type}`);
    btn.disabled = true;
    btn.textContent = I18n.t('settings.testing');
    status.textContent = '';
    status.className = 'test-status';

    try {
      await API.testConnection(type);
      status.textContent = I18n.t('settings.testSuccess');
      status.className = 'test-status success';
    } catch (e) {
      status.textContent = I18n.t('settings.testFail') + e.message;
      status.className = 'test-status error';
    } finally {
      btn.disabled = false;
      btn.textContent = I18n.t('settings.testConnection');
    }
  }

  function bindHistory() {
    const historyBtn = document.getElementById('btn-history');
    const historyModal = document.getElementById('history-modal');
    const closeBtn = document.getElementById('history-close');

    if (historyBtn) {
      historyBtn.addEventListener('click', () => {
        renderHistory();
        historyModal.classList.add('visible');
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        historyModal.classList.remove('visible');
      });
    }

    const clearBtn = document.getElementById('btn-clear-history');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm(I18n.t('history.clearConfirm'))) {
          History.clearAll();
        }
      });
    }
  }

  function renderHistory() {
    const container = document.getElementById('history-list');
    if (!container) return;
    const entries = History.getAll();

    if (!entries.length) {
      container.innerHTML = `<p class="empty-state">${I18n.t('history.empty')}</p>`;
      return;
    }

    container.innerHTML = entries.map(entry => `
      <div class="history-item" data-id="${entry.id}">
        <div class="history-meta">
          <span class="history-type badge-${entry.type}">${entry.type === 'style' ? I18n.t('history.typeStyle') : I18n.t('history.typeLyrics')}</span>
          <span class="history-time">${History.formatTime(entry.timestamp)}</span>
        </div>
        <div class="history-preview">${escapeHtml(entry.preview)}</div>
        <div class="history-actions">
          <button class="btn btn-sm btn-ghost" onclick="App.loadHistoryEntry('${entry.id}', '${entry.type}')">${I18n.t('history.load')}</button>
          <button class="btn btn-sm btn-ghost btn-danger" onclick="App.deleteHistoryEntry('${entry.id}')">${I18n.t('history.delete')}</button>
        </div>
      </div>
    `).join('');
  }

  function loadHistoryEntry(id, type) {
    const entries = History.getAll();
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    if (type === 'style') {
      StyleBaker.loadFromHistory(entry.content);
      switchTab('style');
    } else {
      LyricsBaker.loadFromHistory(entry.content);
      switchTab('lyrics');
    }

    document.getElementById('history-modal')?.classList.remove('visible');
  }

  function deleteHistoryEntry(id) {
    History.remove(id);
  }

  function bindModals() {
    // Close modals on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('visible');
        }
      });
    });

    // Suggestion modal close
    const suggCloseBtn = document.getElementById('suggestion-close');
    if (suggCloseBtn) {
      suggCloseBtn.addEventListener('click', () => {
        document.getElementById('suggestion-modal')?.classList.remove('visible');
      });
    }

    // NEW: Template modal close
    const templateCloseBtn = document.getElementById('template-close');
    if (templateCloseBtn) {
      templateCloseBtn.addEventListener('click', () => {
        document.getElementById('template-modal')?.classList.remove('visible');
      });
    }

    // NEW: Compare modal close
    const compareCloseBtn = document.getElementById('compare-close');
    if (compareCloseBtn) {
      compareCloseBtn.addEventListener('click', () => {
        document.getElementById('compare-modal')?.classList.remove('visible');
      });
    }

    // NEW: Suno preview modal close
    const sunoPreviewCloseBtn = document.getElementById('suno-preview-close');
    if (sunoPreviewCloseBtn) {
      sunoPreviewCloseBtn.addEventListener('click', () => {
        document.getElementById('suno-preview-modal')?.classList.remove('visible');
      });
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // NEW FUNCTIONS

  function showCompareModal(type) {
    const modal = document.getElementById('compare-modal');
    const selectA = document.getElementById('compare-version-a');
    const selectB = document.getElementById('compare-version-b');
    const content = document.getElementById('compare-content');

    if (!modal || !selectA || !selectB || !content) return;

    const versions = Versions.getVersions(type);

    if (versions.length < 2) {
      showNotification(`${I18n.t('compare.needAtLeast')} 2 ${type} ${I18n.t('compare.generationsToCompare')}`, 'info');
      return;
    }

    const optionsHTML = versions.map((v, idx) =>
      `<option value="${v.id}">Version ${versions.length - idx}: ${Versions.formatTimestamp(v.timestamp)} - ${v.preview}...</option>`
    ).join('');

    selectA.innerHTML = optionsHTML;
    selectB.innerHTML = optionsHTML;
    selectB.selectedIndex = Math.min(1, versions.length - 1);

    function renderComparison() {
      const idA = selectA.value;
      const idB = selectB.value;

      if (idA === idB) {
        content.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 32px;">Please select two different versions to compare.</p>';
        return;
      }

      const comparison = Versions.compareVersions(type, idA, idB);
      if (!comparison) {
        content.innerHTML = '<p style="color: #f44336;">Error loading comparison</p>';
        return;
      }

      const paramDiffHTML = renderParamDiff(comparison.paramDiff);

      content.innerHTML = `
        <div class="compare-panel">
          <h3 style="font-size: 1rem; margin: 0 0 12px 0;">Version A - ${Versions.formatTimestamp(comparison.versionA.timestamp)}</h3>
          <textarea readonly rows="12" style="width: 100%; margin-bottom: 12px; padding: 12px; font-family: monospace; font-size: 0.9rem; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; color: var(--text);">${comparison.versionA.content}</textarea>
          ${paramDiffHTML.removed}
        </div>
        <div class="compare-panel">
          <h3 style="font-size: 1rem; margin: 0 0 12px 0;">Version B - ${Versions.formatTimestamp(comparison.versionB.timestamp)}</h3>
          <textarea readonly rows="12" style="width: 100%; margin-bottom: 12px; padding: 12px; font-family: monospace; font-size: 0.9rem; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; color: var(--text);">${comparison.versionB.content}</textarea>
          ${paramDiffHTML.added}
        </div>
      `;
    }

    function renderParamDiff(diff) {
      const addedHTML = diff.added.length > 0
        ? `<div class="compare-diff-add" style="padding: 8px; margin-bottom: 8px;">
             <strong>➕ Added:</strong> ${diff.added.map(i => `${i.param} (${i.values.join(', ')})`).join('; ')}
           </div>`
        : '';

      const removedHTML = diff.removed.length > 0
        ? `<div class="compare-diff-remove" style="padding: 8px; margin-bottom: 8px;">
             <strong>➖ Removed:</strong> ${diff.removed.map(i => `${i.param} (${i.values.join(', ')})`).join('; ')}
           </div>`
        : '';

      const changedHTML = diff.changed.length > 0
        ? `<div style="padding: 8px; background: rgba(124, 92, 252, 0.1); margin-bottom: 8px; border-radius: 4px;">
             <strong>🔄 Changed:</strong> ${diff.changed.map(i => `${i.param}: "${i.from}" → "${i.to}"`).join('; ')}
           </div>`
        : '';

      return {
        removed: removedHTML + changedHTML,
        added: addedHTML + changedHTML
      };
    }

    selectA.addEventListener('change', renderComparison);
    selectB.addEventListener('change', renderComparison);

    renderComparison();
    modal.classList.add('visible');
  }

  function showSunoPreview() {
    const modal = document.getElementById('suno-preview-modal');
    const styleField = document.getElementById('suno-style-field');
    const lyricsField = document.getElementById('suno-lyrics-field');
    const titleDisplay = document.getElementById('suno-title-display');
    const titleContainer = document.getElementById('suno-title-field-container');

    if (!modal || !styleField || !lyricsField) return;

    const style = document.getElementById('style-result')?.value || '';
    const lyrics = document.getElementById('lyrics-result')?.value || '';
    const title = document.getElementById('lyrics-title')?.value || '';

    styleField.value = style || '(No style generated yet - use Style Baker first)';
    lyricsField.value = lyrics || '(No lyrics generated yet - use Lyrics Baker first)';

    if (title) {
      titleDisplay.textContent = title;
      titleContainer.classList.remove('hidden');
    } else {
      titleContainer.classList.add('hidden');
    }

    modal.classList.add('visible');
  }

  // Bind Suno preview copy buttons
  document.getElementById('btn-copy-suno-style')?.addEventListener('click', () => {
    const field = document.getElementById('suno-style-field');
    if (!field) return;
    navigator.clipboard.writeText(field.value).then(() => {
      showNotification(I18n.t('lyrics.styleCopied'), 'success');
    });
  });

  document.getElementById('btn-copy-suno-lyrics')?.addEventListener('click', () => {
    const field = document.getElementById('suno-lyrics-field');
    if (!field) return;
    navigator.clipboard.writeText(field.value).then(() => {
      showNotification(I18n.t('lyrics.lyricsCopied'), 'success');
    });
  });

  // Expose functions globally for buttons
  window.showCompareModal = showCompareModal;
  window.showSunoPreview = showSunoPreview;

  return { init, loadHistoryEntry, deleteHistoryEntry, showCompareModal, showSunoPreview };
})();

// Boot
document.addEventListener('DOMContentLoaded', App.init);
