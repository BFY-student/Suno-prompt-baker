const LyricsBaker = (() => {
  const LYRICS_SYSTEM_PROMPT = `You are a professional songwriter, lyricist, and music arranger specializing in creating songs for Suno AI. You create complete songs with structure, arrangement, and lyrics.

Rules:
1. The FIRST LINE of your output must be a title in the exact format:
   Genre - Song Title - VocalType
   where Genre is the primary genre from the style context, Song Title is a creative and fitting name, and VocalType is one of: Male, Female, Duet, or Instrumental (determined from the vocal style or style context). Follow the title with an empty line, then the song.
2. Design a complete song structure appropriate to the style (e.g., Intro, Verse, Pre-Chorus, Chorus, Bridge, Outro). Be creative and genre-appropriate — don't always use the same template.
3. Specify instrument arrangement per section using square bracket tags. Example:
   [Intro - Soft Piano, Light Strings]
   [Verse 1 - Acoustic Guitar, Soft Drums, Male Vocal]
4. ALL non-lyrical structural and performance instructions must be in square brackets []. This includes section labels, instrument directions, vocal directions, dynamic markings, transitions.
5. Include vocal performance cues in parentheses within lyrics where useful: (softly), (building intensity), (whisper), (falsetto), (belting).
6. Distribute instruments thoughtfully across sections to create dynamic contrast and progression. Not every section should be at the same intensity.
7. Write lyrics in the language specified by the user. Bracket tags, structural directions, and the title line are ALWAYS in English regardless of lyric language.
8. Output ONLY the title line followed by the formatted song. No explanations, meta-commentary, or notes outside the song itself.
9. Ensure the song has emotional arc and narrative progression.
10. Match the lyrical tone, vocabulary, and imagery to the musical style.
11. NEVER use the word "skank" or its variants — it is banned by Suno. Use "offbeat strum", "ska rhythm", or "upstroke guitar" instead when describing ska/reggae techniques.
12. DSP/Processing Instructions - Asterisk Notation: For any DSP processing instructions (filters, effects, audio processing), wrap them in ASTERISKS to prevent Suno from attempting to sing them phonetically. CORRECT: (*Low Pass Filter*), (*Reverb Tail*), (*Sidechain Pump*), (*Tape Saturation*). INCORRECT: [Low Pass Filter], (Low Pass Filter). This signals the NLP parser to treat these as processing commands rather than lyrics.
13. Energy Arc Progression: When an Energy Arc is provided, strictly follow the energy levels. Insert the appropriate [Energy: Low/Medium/High] or [Zenith intensity] tag BEFORE each section label and adjust arrangement density accordingly. [Energy: Low] = sparse arrangement, minimal instrumentation, quiet dynamics. [Energy: Medium] = moderate fullness, balanced mix. [Energy: High] = maximum frequency saturation, full instrumentation. [Zenith intensity] = peak climactic moment.`;

  let currentMode = 'full';

  // NEW: Energy arc mapping
  let energyMap = {
    'Intro': { energy: 'Low', repeat: 1 },
    'Verse 1': { energy: 'Medium', repeat: 1 },
    'Pre-Chorus': { energy: 'Medium', repeat: 1 },
    'Chorus': { energy: 'High', repeat: 2 },
    'Verse 2': { energy: 'Medium', repeat: 1 },
    'Bridge': { energy: 'Low', repeat: 1 },
    'Chorus': { energy: 'High', repeat: 2 },
    'Outro': { energy: 'Medium', repeat: 1 }
  };

  // NEW: Chain state for section-by-section generation
  let chainState = {
    sections: ['Intro', 'Verse 1', 'Pre-Chorus', 'Chorus', 'Verse 2', 'Bridge', 'Outro'],
    currentIndex: 0,
    accumulated: '',
    active: false,
    sectionConcepts: {}, // Store concepts for each section
    sectionResults: {} // Store generated results for each section
  };

  let scaffoldState = {
    active: false,
    phase: 1, // 1: Phonetic, 2: Lock/Review, 3: Semantic
    phoneticTemplate: '',
    syllableCounts: [],
    lockedTemplate: '',
    finalLyrics: ''
  };

  function init() {
    bindEvents();
    renderEnergyArcControls(); // NEW
    bindMetaTagToolbar(); // NEW
  }

  function bindEvents() {
    // Mode toggle
    document.querySelectorAll('input[name="lyrics-mode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        currentMode = e.target.value;
        document.getElementById('lyrics-full-input').classList.toggle('hidden', currentMode !== 'full');
        document.getElementById('lyrics-expand-input').classList.toggle('hidden', currentMode !== 'expand');

        // NEW: Handle chain mode
        if (currentMode === 'chain') {
          chainState.active = true;
          if (scaffoldState.active) {
            hideScaffoldControls();
            resetScaffoldState();
          }
          renderChainControls();
        } else if (currentMode === 'scaffold') {
          scaffoldState.active = true;
          if (chainState.active) {
            hideChainControls();
            resetChainState();
          }
          renderScaffoldControls();
        } else {
          if (chainState.active) {
            hideChainControls();
            resetChainState();
          }
          if (scaffoldState.active) {
            hideScaffoldControls();
            resetScaffoldState();
          }
        }
      });
    });

    // Instrumental toggle
    const instrumentalCheck = document.getElementById('lyrics-instrumental');
    if (instrumentalCheck) {
      instrumentalCheck.addEventListener('change', (e) => {
        const langGroup = document.getElementById('lyrics-lang-group');
        if (langGroup) langGroup.classList.toggle('hidden', e.target.checked);
        // Update concept placeholder
        const conceptArea = document.getElementById('lyrics-concept');
        if (conceptArea) {
          conceptArea.placeholder = e.target.checked
            ? I18n.t('lyrics.instrumentalConceptPlaceholder')
            : I18n.t('lyrics.conceptPlaceholder');
        }
      });
    }

    // Language selection
    const langSelect = document.getElementById('lyrics-language');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        const customInput = document.getElementById('lyrics-lang-custom');
        if (customInput) {
          customInput.classList.toggle('hidden', e.target.value !== 'other');
        }
      });
    }

    // Bake button
    const bakeBtn = document.getElementById('btn-bake-lyrics');
    if (bakeBtn) {
      bakeBtn.addEventListener('click', bakeLyrics);
    }

    // Regenerate
    const regenBtn = document.getElementById('btn-regen-lyrics');
    if (regenBtn) {
      regenBtn.addEventListener('click', bakeLyrics);
    }

    // Copy
    const copyBtn = document.getElementById('btn-copy-lyrics');
    if (copyBtn) {
      copyBtn.addEventListener('click', copyLyrics);
    }

    // Copy title
    const copyTitleBtn = document.getElementById('btn-copy-title');
    if (copyTitleBtn) {
      copyTitleBtn.addEventListener('click', () => {
        const titleArea = document.getElementById('lyrics-title');
        if (titleArea && titleArea.value) {
          navigator.clipboard.writeText(titleArea.value).then(() => {
            showNotification(I18n.t('lyrics.copied'), 'success');
          });
        }
      });
    }

    // NEW: Style context change - suggest language from genre
    const styleContext = document.getElementById('lyrics-style-context');
    if (styleContext) {
      styleContext.addEventListener('input', suggestLanguageFromGenre);
    }

    // NEW: Compare button
    const compareBtn = document.getElementById('btn-compare-lyrics');
    if (compareBtn) {
      compareBtn.addEventListener('click', () => showCompareModal('lyrics'));
    }
  }

  function getLyricsLanguage() {
    const select = document.getElementById('lyrics-language');
    if (!select) return 'English';
    const val = select.value;

    const langMap = {
      en: 'English',
      zh: 'Chinese (Mandarin)',
      es: 'Spanish',
      fr: 'French',
      ja: 'Japanese',
      ko: 'Korean',
      pt: 'Portuguese',
      de: 'German',
      hi: 'Hindi',
      ar: 'Arabic',
      multi: 'Multilingual (code-switching between languages)'
    };

    if (val === 'other') {
      return document.getElementById('lyrics-lang-custom')?.value?.trim() || 'English';
    }

    return langMap[val] || 'English';
  }

  function isInstrumental() {
    return document.getElementById('lyrics-instrumental')?.checked || false;
  }

  function buildUserPrompt() {
    const styleContext = document.getElementById('lyrics-style-context')?.value?.trim() || '';
    const duration = document.getElementById('lyrics-duration')?.value || '';
    const instrumental = isInstrumental();

    const parts = [];

    if (styleContext) {
      parts.push(`Musical Style: ${styleContext}`);
    }

    if (instrumental) {
      parts.push('Type: PURE INSTRUMENTAL (no vocals, no lyrics)');
    } else {
      const lyricsLang = getLyricsLanguage();
      parts.push(`Lyrics Language: ${lyricsLang}`);
    }

    if (duration && duration !== 'auto') {
      const durationMap = {
        short: 'Short song (~2 minutes, fewer sections)',
        medium: 'Medium song (~3 minutes, standard sections)',
        long: 'Long song (~4+ minutes, extended structure with more sections)'
      };
      parts.push(`Duration: ${durationMap[duration] || duration}`);
    }

    // NEW: Energy Arc
    const energyMapStr = Object.entries(energyMap)
      .map(([sec, data]) => {
        const repeatStr = data.repeat > 1 ? ` x${data.repeat}` : '';
        return `${sec}(${data.energy})${repeatStr}`;
      })
      .join(' → ');

    if (Object.keys(energyMap).length > 0) {
      parts.push(`\nEnergy Arc: ${energyMapStr}`);
      parts.push('IMPORTANT: Honor this energy progression by inserting [Energy: Low/Medium/High] or [Zenith intensity] tags BEFORE each corresponding section and adjusting arrangement density accordingly. If a section is marked with repetition (e.g., x2, x3), repeat that section the specified number of times.');
    }

    if (currentMode === 'full') {
      const concept = document.getElementById('lyrics-concept')?.value?.trim() || '';
      if (concept) {
        parts.push(`\nTheme/Concept: ${concept}`);
      }
      if (instrumental) {
        parts.push('\nThis is a PURE INSTRUMENTAL piece. Generate ONLY section structure with detailed instrument arrangements, dynamics, texture changes, transitions, and performance directions. Do NOT include any lyrics or vocal parts. Use instrumental section names like Intro, Theme A, Theme B, Development, Bridge, Interlude, Coda, Outro. The title VocalType must be "Instrumental".');
      } else {
        parts.push('\nPlease generate a complete song with structure, instrument arrangement per section, and full lyrics.');
      }
    } else {
      const partial = document.getElementById('lyrics-partial')?.value?.trim() || '';
      if (partial) {
        parts.push(`\nPartial structure/draft to expand:\n${partial}`);
      }
      if (instrumental) {
        parts.push('\nThis is a PURE INSTRUMENTAL piece. Expand and structure this into a complete instrumental arrangement with detailed section structure, dynamics, and performance directions. Do NOT include any lyrics or vocal parts. The title VocalType must be "Instrumental".');
      } else {
        parts.push('\nPlease expand, complete, and structure these lyrics with full arrangement. Preserve the spirit and key phrases of the original while adding structure, sections, and instrument arrangement.');
      }
    }

    return parts.join('\n');
  }

  async function bakeLyrics() {
    if (!API.isConfigured()) {
      showNotification(I18n.t('settings.noProvider'), 'error');
      return;
    }

    // NEW: Handle chain mode
    if (chainState.active) {
      await generateChainSection();
      return;
    }

    // NEW: Handle scaffold mode
    if (scaffoldState.active) {
      await executeScaffoldPhase();
      return;
    }

    // Validate input
    if (currentMode === 'full') {
      const concept = document.getElementById('lyrics-concept')?.value?.trim();
      if (!concept) {
        showNotification(I18n.t('errors.emptyInput'), 'error');
        return;
      }
    } else {
      const partial = document.getElementById('lyrics-partial')?.value?.trim();
      if (!partial) {
        showNotification(I18n.t('errors.emptyInput'), 'error');
        return;
      }
    }

    const btn = document.getElementById('btn-bake-lyrics');
    const resultArea = document.getElementById('lyrics-result');
    const resultSection = document.getElementById('lyrics-result-section');

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> ${I18n.t('lyrics.baking')}`;

    try {
      const userPrompt = buildUserPrompt();
      const raw = await API.generate(LYRICS_SYSTEM_PROMPT, userPrompt);
      const result = sanitizeOutput(raw);

      // Extract title from the first line
      const lines = result.split('\n');
      const titleLine = lines[0].trim();
      const lyricsBody = lines.slice(1).join('\n').trimStart();

      const titleArea = document.getElementById('lyrics-title');
      const titleSection = document.getElementById('lyrics-title-section');
      if (titleArea && titleSection) {
        titleArea.value = titleLine;
        titleSection.classList.remove('hidden');
      }

      resultArea.value = lyricsBody;
      resultSection.classList.remove('hidden');

      // Save full output (title + lyrics) to history
      History.add('lyrics', result);

      // NEW: Save to versions for comparison
      const params = {
        styleContext: document.getElementById('lyrics-style-context')?.value?.trim() || '',
        language: getLyricsLanguage(),
        duration: document.getElementById('lyrics-duration')?.value || 'auto',
        instrumental: isInstrumental(),
        energyMap: {...energyMap}
      };
      Versions.saveVersion('lyrics', result, params);
    } catch (e) {
      showNotification(I18n.t('errors.apiError') + e.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> ${I18n.t('lyrics.bake')}`;
    }
  }

  function copyLyrics() {
    const resultArea = document.getElementById('lyrics-result');
    if (resultArea && resultArea.value) {
      navigator.clipboard.writeText(resultArea.value).then(() => {
        showNotification(I18n.t('lyrics.copied'), 'success');
      });
    }
  }

  function loadFromHistory(content) {
    const resultArea = document.getElementById('lyrics-result');
    const resultSection = document.getElementById('lyrics-result-section');
    if (resultArea) {
      // Extract title from the first line
      const lines = content.split('\n');
      const titleLine = lines[0].trim();
      const lyricsBody = lines.slice(1).join('\n').trimStart();

      const titleArea = document.getElementById('lyrics-title');
      const titleSection = document.getElementById('lyrics-title-section');
      if (titleArea && titleSection) {
        titleArea.value = titleLine;
        titleSection.classList.remove('hidden');
      }

      resultArea.value = lyricsBody;
      resultSection.classList.remove('hidden');
    }
  }

  // NEW FUNCTIONS

  function renderEnergyArcControls() {
    const container = document.getElementById('energy-arc-controls');
    if (!container) return;

    container.innerHTML = Object.keys(energyMap).map(section => {
      const data = energyMap[section];
      return `
      <div class="energy-selector">
        <label>${section}</label>
        <div class="energy-controls-row">
          <div class="energy-control-group">
            <label>Energy</label>
            <select data-section="${section}" data-type="energy">
              <option value="Low" ${data.energy === 'Low' ? 'selected' : ''}>Low</option>
              <option value="Medium" ${data.energy === 'Medium' ? 'selected' : ''}>Medium</option>
              <option value="High" ${data.energy === 'High' ? 'selected' : ''}>High</option>
              <option value="Zenith" ${data.energy === 'Zenith' ? 'selected' : ''}>Zenith</option>
            </select>
          </div>
          <div class="energy-repeat-group">
            <label>Repeat</label>
            <input type="number" min="1" max="8" value="${data.repeat}" data-section="${section}" data-type="repeat" title="Number of repetitions">
          </div>
        </div>
      </div>
    `;
    }).join('');

    // Bind energy select changes
    container.querySelectorAll('select[data-type="energy"]').forEach(sel => {
      sel.addEventListener('change', (e) => {
        energyMap[e.target.dataset.section].energy = e.target.value;
      });
    });

    // Bind repetition input changes
    container.querySelectorAll('input[data-type="repeat"]').forEach(input => {
      input.addEventListener('change', (e) => {
        const value = parseInt(e.target.value) || 1;
        energyMap[e.target.dataset.section].repeat = Math.max(1, Math.min(8, value));
        e.target.value = energyMap[e.target.dataset.section].repeat;
      });
    });
  }

  function bindMetaTagToolbar() {
    const categorySelect = document.getElementById('metatag-category');
    const tagSelect = document.getElementById('metatag-tag');
    const insertBtn = document.getElementById('btn-insert-tag');
    const lyricsArea = document.getElementById('lyrics-result');

    if (!categorySelect || !tagSelect || !insertBtn || !lyricsArea) return;

    categorySelect.addEventListener('change', () => {
      const category = categorySelect.value;
      if (!category) {
        tagSelect.disabled = true;
        tagSelect.innerHTML = '<option value="">Select tag...</option>';
        insertBtn.disabled = true;
        return;
      }

      const tags = MetaTags.getCategory(category);
      tagSelect.disabled = false;
      tagSelect.innerHTML = '<option value="">Select tag...</option>' +
        tags.map(t => `<option value="${t.tag}" title="${t.desc}">${t.tag} - ${t.desc}</option>`).join('');
    });

    tagSelect.addEventListener('change', () => {
      insertBtn.disabled = !tagSelect.value;
    });

    insertBtn.addEventListener('click', () => {
      const tag = tagSelect.value;
      if (!tag) return;

      const start = lyricsArea.selectionStart;
      const end = lyricsArea.selectionEnd;
      const text = lyricsArea.value;

      lyricsArea.value = text.substring(0, start) + tag + '\n' + text.substring(end);
      lyricsArea.selectionStart = lyricsArea.selectionEnd = start + tag.length + 1;
      lyricsArea.focus();

      showNotification(`${I18n.t('lyrics.tagInserted')} ${tag}`, 'success');
    });
  }

  function suggestLanguageFromGenre() {
    const styleContext = document.getElementById('lyrics-style-context')?.value || '';
    const hint = document.getElementById('lang-suggestion');
    if (!hint) return;

    const genreLangMap = {
      'K-Pop': { lang: 'ko', name: 'Korean' },
      'J-Pop': { lang: 'ja', name: 'Japanese' },
      'Bossa Nova': { lang: 'pt', name: 'Portuguese' },
      'Chanson': { lang: 'fr', name: 'French' },
      'Latin': { lang: 'es', name: 'Spanish' },
      'Reggaeton': { lang: 'es', name: 'Spanish' },
      'Flamenco': { lang: 'es', name: 'Spanish' }
    };

    for (const [genre, langInfo] of Object.entries(genreLangMap)) {
      if (styleContext.toLowerCase().includes(genre.toLowerCase())) {
        hint.innerHTML = `💡 Suggested: ${genre} typically uses <a href="#" id="apply-lang-suggestion" data-lang="${langInfo.lang}" style="color: var(--accent); text-decoration: underline;">${langInfo.name} lyrics</a>`;

        setTimeout(() => {
          document.getElementById('apply-lang-suggestion')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('lyrics-language').value = e.target.dataset.lang;
            hint.textContent = '';
          });
        }, 100);
        return;
      }
    }

    hint.textContent = '';
  }

  function renderChainControls() {
    const fullInput = document.getElementById('lyrics-full-input');
    if (!fullInput) return;

    fullInput.insertAdjacentHTML('afterend', `
      <div id="chain-controls" style="margin-top: 16px; padding: 16px; background: var(--bg-elevated); border-radius: 8px;">
        <h4 style="margin: 0 0 12px 0; font-size: 1rem; color: var(--text);">Generate section-by-section</h4>
        <div id="chain-progress" style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
          ${chainState.sections.map((sec, idx) => {
            const isCompleted = idx < chainState.currentIndex;
            const isCurrent = idx === chainState.currentIndex;
            const bgColor = isCurrent ? 'var(--accent)' : isCompleted ? '#4caf50' : 'var(--bg)';
            const textColor = (isCurrent || isCompleted) ? '#fff' : 'var(--text-muted)';
            return `
            <div class="chain-step" data-section-index="${idx}"
                 style="flex: 1; min-width: 80px; padding: 8px; text-align: center; border-radius: 4px; border: 1px solid var(--border);
                        background: ${bgColor}; color: ${textColor}; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
                        ${isCompleted ? 'box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);' : ''}"
                 title="${isCompleted ? 'Click to edit this section' : isCurrent ? 'Current section' : 'Not yet generated'}">
              ${isCompleted ? '✓ ' : ''}${sec}
            </div>
          `;
          }).join('')}
        </div>
        <div id="chain-current-section" style="margin-bottom: 12px; font-size: 0.95rem; color: var(--text);">
          <strong>Current Section:</strong> <span id="chain-current-name">${chainState.sections[chainState.currentIndex]}</span>
        </div>
        <textarea id="chain-section-concept" rows="3" placeholder="Describe what happens in ${chainState.sections[chainState.currentIndex]}..." style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--text); font-family: inherit;"></textarea>
      </div>
    `);

    fullInput.classList.add('hidden');

    // Bind click handlers to chain steps
    document.querySelectorAll('.chain-step').forEach(step => {
      step.addEventListener('click', () => {
        const idx = parseInt(step.getAttribute('data-section-index'));
        selectChainSection(idx);
      });

      // Hover effect
      step.addEventListener('mouseenter', function() {
        if (parseInt(this.getAttribute('data-section-index')) <= chainState.currentIndex) {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        }
      });
      step.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        const idx = parseInt(this.getAttribute('data-section-index'));
        if (idx < chainState.currentIndex) {
          this.style.boxShadow = '0 0 0 2px rgba(76, 175, 80, 0.2)';
        } else {
          this.style.boxShadow = 'none';
        }
      });
    });

    // Load saved concept if exists
    const savedConcept = chainState.sectionConcepts[chainState.currentIndex];
    if (savedConcept) {
      document.getElementById('chain-section-concept').value = savedConcept;
    }
  }

  function selectChainSection(idx) {
    // Only allow selecting current or completed sections
    if (idx > chainState.currentIndex) {
      showNotification('Please complete previous sections first', 'info');
      return;
    }

    // Save current concept before switching
    const currentConcept = document.getElementById('chain-section-concept')?.value;
    if (currentConcept) {
      chainState.sectionConcepts[chainState.currentIndex] = currentConcept;
    }

    // Switch to selected section
    chainState.currentIndex = idx;

    // Re-render controls
    hideChainControls();
    renderChainControls();

    // Update button text
    const btn = document.getElementById('btn-bake-lyrics');
    const sectionName = chainState.sections[idx];
    const isRegenerate = chainState.sectionResults[idx];
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> ${isRegenerate ? 'Regenerate' : 'Generate'} ${sectionName}`;
    btn.disabled = false;
  }

  function hideChainControls() {
    document.getElementById('chain-controls')?.remove();
    document.getElementById('lyrics-full-input')?.classList.remove('hidden');
  }

  function resetChainState() {
    chainState = {
      sections: ['Intro', 'Verse 1', 'Pre-Chorus', 'Chorus', 'Verse 2', 'Bridge', 'Outro'],
      currentIndex: 0,
      accumulated: '',
      active: false,
      sectionConcepts: {},
      sectionResults: {}
    };
  }

  async function generateChainSection() {
    const currentIdx = chainState.currentIndex;
    const sectionName = chainState.sections[currentIdx];
    const sectionConcept = document.getElementById('chain-section-concept')?.value?.trim() || '';
    const styleContext = document.getElementById('lyrics-style-context')?.value?.trim() || '';
    const lyricsLang = getLyricsLanguage();
    const instrumental = isInstrumental();

    if (!sectionConcept) {
      showNotification(I18n.t('lyrics.sectionDescRequired'), 'error');
      return;
    }

    // Save the concept
    chainState.sectionConcepts[currentIdx] = sectionConcept;

    // Build context from previous sections
    const previousSections = [];
    for (let i = 0; i < currentIdx; i++) {
      if (chainState.sectionResults[i]) {
        previousSections.push(chainState.sectionResults[i]);
      }
    }

    const userPrompt = `Style Context: ${styleContext}

${instrumental ? 'Type: PURE INSTRUMENTAL (no vocals, no lyrics)' : `Lyrics Language: ${lyricsLang}`}

Previous Sections Generated:
${previousSections.length > 0 ? previousSections.join('\n\n') : '(This is the first section)'}

Now generate ONLY the ${sectionName} section.
Section Description: ${sectionConcept}

Output ONLY the ${sectionName} section with appropriate meta-tags, energy tags, and arrangement instructions. Do not regenerate previous sections.`;

    const btn = document.getElementById('btn-bake-lyrics');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Generating ${sectionName}...`;

    try {
      const raw = await API.generate(LYRICS_SYSTEM_PROMPT, userPrompt);
      const result = sanitizeOutput(raw);

      // Store this section's result
      chainState.sectionResults[currentIdx] = result;

      // Rebuild accumulated from all sections
      chainState.accumulated = chainState.sections
        .map((_, idx) => chainState.sectionResults[idx])
        .filter(r => r)
        .join('\n\n');

      const resultArea = document.getElementById('lyrics-result');
      const resultSection = document.getElementById('lyrics-result-section');
      resultArea.value = chainState.accumulated;
      resultSection.classList.remove('hidden');

      // If this was not the last section, move to next uncompleted section
      const wasRegenerate = currentIdx < chainState.sections.length - 1 && chainState.sectionResults[currentIdx + 1];

      if (!wasRegenerate && currentIdx < chainState.sections.length - 1) {
        chainState.currentIndex++;
      }

      // Check if all sections are complete
      const allComplete = chainState.sections.every((_, idx) => chainState.sectionResults[idx]);

      if (allComplete) {
        showNotification(I18n.t('lyrics.chainComplete'), 'success');

        History.add('lyrics', chainState.accumulated);
        Versions.saveVersion('lyrics', chainState.accumulated, {
          styleContext,
          mode: 'chain',
          sections: chainState.sections.length
        });
      } else {
        showNotification(`${sectionName} ${I18n.t('lyrics.sectionComplete')}`, 'success');
      }

      // Re-render controls
      hideChainControls();
      renderChainControls();
      document.getElementById('chain-section-concept')?.focus();

    } catch (e) {
      showNotification('Error: ' + e.message, 'error');
      btn.disabled = false;
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> Generate ${sectionName}`;
    }
  }

  // ===== SCAFFOLDING MODE FUNCTIONS =====

  function renderScaffoldControls() {
    const fullInput = document.getElementById('lyrics-full-input');
    if (!fullInput) return;

    const phaseLabels = [
      'Phase 1: Generate Phonetic Template',
      'Phase 2: Lock Melodic Motif',
      'Phase 3: Inject Semantic Lyrics'
    ];

    fullInput.insertAdjacentHTML('afterend', `
      <div id="scaffold-controls" style="margin-top: 16px; padding: 16px; background: var(--bg-elevated); border-radius: 8px;">
        <h4 style="margin: 0 0 12px 0; font-size: 1rem; color: var(--text);">Scaffolding Mode</h4>

        <!-- Phase Indicator -->
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
          ${[1, 2, 3].map(p => `
            <div style="flex: 1; padding: 8px; text-align: center; border-radius: 4px; border: 1px solid var(--border);
                        background: ${p === scaffoldState.phase ? 'var(--accent)' : p < scaffoldState.phase ? '#4caf50' : 'var(--bg)'};
                        color: ${p <= scaffoldState.phase ? '#fff' : 'var(--text-muted)'}; font-size: 0.85rem;">
              ${p < scaffoldState.phase ? '✓ ' : ''}Phase ${p}
            </div>
          `).join('')}
        </div>

        <!-- Current Phase Info -->
        <div style="margin-bottom: 12px; padding: 12px; background: rgba(124, 92, 252, 0.1); border-left: 3px solid var(--accent); border-radius: 4px;">
          <div style="font-weight: 600; margin-bottom: 4px; color: var(--text);">${phaseLabels[scaffoldState.phase - 1]}</div>
          <div id="scaffold-phase-desc" style="font-size: 0.9rem; color: var(--text-muted);"></div>
        </div>

        <!-- Phase-specific Content -->
        <div id="scaffold-phase-content"></div>
      </div>
    `);

    fullInput.classList.add('hidden');
    updateScaffoldPhaseUI();
  }

  function updateScaffoldPhaseUI() {
    const desc = document.getElementById('scaffold-phase-desc');
    const content = document.getElementById('scaffold-phase-content');
    if (!desc || !content) return;

    if (scaffoldState.phase === 1) {
      desc.textContent = 'Generate a phonetic scaffold with vowel sounds and syllable patterns to establish rhythm and melody.';
      content.innerHTML = `
        <textarea id="scaffold-concept" rows="3" placeholder="Describe the theme and mood of your song..." style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--text); font-family: inherit; margin-bottom: 12px;"></textarea>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          💡 Example phonetic template: "Ah-oh-ee, ee-ah-oh / Mmm-ah-ee, oh-ee-oh"
        </div>
      `;
    } else if (scaffoldState.phase === 2) {
      desc.textContent = 'Review and edit the phonetic template. Make adjustments to syllable count and stress patterns.';
      content.innerHTML = `
        <label style="display: block; font-size: 0.9rem; font-weight: 500; margin-bottom: 8px; color: var(--text);">Phonetic Template:</label>
        <textarea id="scaffold-template" rows="8" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--text); font-family: var(--font-mono); margin-bottom: 12px;">${escapeHtml(scaffoldState.phoneticTemplate)}</textarea>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          Edit the template above if needed, then click "Lock & Continue" to proceed.
        </div>
      `;
    } else if (scaffoldState.phase === 3) {
      desc.textContent = 'Generate meaningful lyrics that match the locked syllable count and rhythm structure.';
      content.innerHTML = `
        <div style="padding: 12px; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; margin-bottom: 12px;">
          <div style="font-weight: 600; margin-bottom: 8px; color: var(--text);">Locked Template:</div>
          <pre style="font-size: 0.85rem; color: var(--text-muted); margin: 0; white-space: pre-wrap; font-family: var(--font-mono);">${escapeHtml(scaffoldState.lockedTemplate)}</pre>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          Now generating lyrics that match the syllable count and rhythm...
        </div>
      `;
    }
  }

  function hideScaffoldControls() {
    document.getElementById('scaffold-controls')?.remove();
    document.getElementById('lyrics-full-input')?.classList.remove('hidden');
  }

  function resetScaffoldState() {
    scaffoldState = {
      active: false,
      phase: 1,
      phoneticTemplate: '',
      syllableCounts: [],
      lockedTemplate: '',
      finalLyrics: ''
    };
  }

  async function executeScaffoldPhase() {
    if (scaffoldState.phase === 1) {
      await generatePhoneticTemplate();
    } else if (scaffoldState.phase === 2) {
      lockTemplate();
    } else if (scaffoldState.phase === 3) {
      await generateSemanticLyrics();
    }
  }

  async function generatePhoneticTemplate() {
    const concept = document.getElementById('scaffold-concept')?.value?.trim() || '';
    const styleContext = document.getElementById('lyrics-style-context')?.value?.trim() || '';

    if (!concept) {
      showNotification('Please describe your song theme', 'error');
      return;
    }

    const systemPrompt = `You are a phonetic scaffold generator for song lyrics. Your task is to create a phonetic template using vowel sounds and syllable patterns that establish rhythm and melody.

RULES:
1. Output ONLY phonetic sounds using vowels (Ah, Oh, Ee, Oo, Mm, etc.)
2. Use hyphens to separate syllables within words
3. Use commas for phrase breaks
4. Use forward slashes for line breaks
5. Include section tags like [Verse], [Chorus]
6. Match the syllable count to the typical structure for the genre
7. Create natural stress patterns and rhythmic flow

Example output:
[Verse]
Ah-oh-ee, ee-ah-oh
Mmm-ah-ee, oh-ee-oh
[Chorus]
Ee-ah-oh-ah, mm-oh-ee
Ah-oh-ee-ah, oh-ah-ee`;

    const userPrompt = `Style Context: ${styleContext}

Theme: ${concept}

Generate a phonetic scaffold for this song. Create vowel sound patterns that establish a natural melodic flow.`;

    const btn = document.getElementById('btn-bake-lyrics');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Generating phonetic template...';

    try {
      const result = await API.generate(systemPrompt, userPrompt);
      scaffoldState.phoneticTemplate = result;
      scaffoldState.phase = 2;

      hideScaffoldControls();
      renderScaffoldControls();

      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg> Lock & Continue';
      btn.disabled = false;

      showNotification('Phonetic template generated! Review and edit if needed.', 'success');
    } catch (e) {
      showNotification('Error: ' + e.message, 'error');
      btn.disabled = false;
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> Generate Phonetic Template';
    }
  }

  function lockTemplate() {
    const template = document.getElementById('scaffold-template')?.value || '';
    if (!template.trim()) {
      showNotification('Template is empty', 'error');
      return;
    }

    scaffoldState.lockedTemplate = template;
    scaffoldState.syllableCounts = countSyllablesInTemplate(template);
    scaffoldState.phase = 3;

    hideScaffoldControls();
    renderScaffoldControls();

    const btn = document.getElementById('btn-bake-lyrics');
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> Generate Lyrics';
    btn.disabled = false;

    showNotification('Template locked! Ready to generate semantic lyrics.', 'success');
  }

  async function generateSemanticLyrics() {
    const styleContext = document.getElementById('lyrics-style-context')?.value?.trim() || '';
    const concept = document.getElementById('scaffold-concept')?.value?.trim() || '';
    const lyricsLang = getLyricsLanguage();

    const systemPrompt = `You are a lyric writer. Your task is to generate meaningful lyrics that EXACTLY match the syllable count and rhythm structure of the provided phonetic template.

CRITICAL RULES:
1. Each line in your output must have the EXACT same syllable count as the corresponding template line
2. Preserve the natural stress patterns and rhythm
3. Replace phonetic sounds with real words while maintaining flow
4. Include all section tags ([Verse], [Chorus], etc.) exactly as in the template
5. The lyrics must make thematic sense while matching the syllable structure

Template format:
[Section]
Ah-oh-ee (3 syllables) → Replace with 3-syllable phrase
Mm-ah-oh-ee (4 syllables) → Replace with 4-syllable phrase`;

    const userPrompt = `Style Context: ${styleContext}

Theme: ${concept}

Language: ${lyricsLang}

Phonetic Template (MATCH THIS SYLLABLE COUNT EXACTLY):
${scaffoldState.lockedTemplate}

Generate lyrics that match this template's syllable count line-by-line while expressing the theme.`;

    const btn = document.getElementById('btn-bake-lyrics');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Generating semantic lyrics...';

    try {
      const result = await API.generate(systemPrompt, userPrompt);
      const sanitized = sanitizeOutput(result);
      scaffoldState.finalLyrics = sanitized;

      const resultArea = document.getElementById('lyrics-result');
      const titleArea = document.getElementById('lyrics-title');
      const resultSection = document.getElementById('lyrics-result-section');

      resultArea.value = sanitized;
      resultSection.classList.remove('hidden');

      // Try to extract title from first line or generate generic one
      const firstLine = sanitized.split('\n')[0];
      if (!firstLine.startsWith('[') && firstLine.length < 50) {
        titleArea.value = firstLine.replace(/[^a-zA-Z0-9\s]/g, '').trim();
      }

      History.add('lyrics', sanitized);
      Versions.saveVersion('lyrics', sanitized, {
        styleContext,
        mode: 'scaffold',
        concept
      });

      showNotification('Scaffolding complete! Lyrics generated.', 'success');

      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> Regenerate Lyrics';
      btn.disabled = false;

    } catch (e) {
      showNotification('Error: ' + e.message, 'error');
      btn.disabled = false;
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> Generate Lyrics';
    }
  }

  function countSyllablesInTemplate(template) {
    const lines = template.split('\n').filter(line => line.trim() && !line.startsWith('['));
    return lines.map(line => {
      // Count hyphens + 1 for each phrase, commas don't break syllables
      const phrases = line.split(/[,/]/).map(p => p.trim()).filter(p => p);
      return phrases.map(phrase => {
        const syllables = phrase.split('-').length;
        return syllables;
      });
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  return { init, loadFromHistory };
})();
