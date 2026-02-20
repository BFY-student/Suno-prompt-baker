const StyleBaker = (() => {
  const genres = [
    'Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'Hip-Hop', 'R&B',
    'Folk', 'Country', 'Latin', 'Reggae', 'Blues', 'Metal', 'Punk',
    'Indie', 'Ambient', 'Lo-fi', 'Chanson', 'Bossa Nova', 'Soul',
    'Funk', 'Gospel', 'World', 'K-Pop', 'Disco', 'House', 'Techno',
    'Trap', 'Drill', 'Grunge', 'Ska', 'Afrobeat', 'Dancehall'
  ];

  const moods = [
    'Joyful', 'Melancholic', 'Energetic', 'Dreamy', 'Dark', 'Romantic',
    'Nostalgic', 'Aggressive', 'Peaceful', 'Triumphant', 'Mysterious',
    'Playful', 'Ethereal', 'Intense', 'Chill', 'Uplifting', 'Haunting',
    'Bittersweet', 'Euphoric', 'Somber', 'Whimsical', 'Epic',
    'Sensual', 'Rebellious', 'Hopeful', 'Lonely'
  ];

  // Voice Type: Gender and delivery style
  const vocalStyles = [
    'Male Vocal', 'Female Vocal', 'Androgynous', 'Duet', 'Choir',
    'Rap', 'Spoken Word', 'Belting', 'Falsetto',
    'Whisper', 'Growl', 'Operatic', 'Humming', 'Scat',
    'Autotune', 'Harmony Vocals', 'Call and Response',
    'Instrumental (No Vocals)'
  ];

  // Voice Character: Tone quality and texture (optional refinements)
  const vocalTextures = [
    'Gritty', 'Breathy', 'Airy', 'Warm', 'Raspy', 'Smooth',
    'Powerful', 'Delicate', 'Deep pitch', 'High pitch',
    'Rich tone', 'Thin voice', 'Nasal', 'Husky'
  ];

  // NEW: Production/Mix characteristics
  const productionQualities = [
    'Clean production', 'Crisp production', 'Lo-fi production',
    'Tape saturated', 'Analog warmth', 'Wide stereo mix', 'Mono mix',
    'Heavy sidechain compression', 'Brick-wall limiting', 'Dynamic range',
    'Live room acoustics', 'Studio polish', 'Dark production',
    'Bright production', 'Reverb-heavy', 'Dry mix', 'Intimate close-mic',
    'Wide cinematic mix', 'Radio-ready', 'Raw unpolished'
  ];

  const productionDescriptions = {
    'Clean production': 'Minimal noise, transparent sound, professional polish',
    'Crisp production': 'Clear high-end, sharp transients, defined edges',
    'Lo-fi production': 'Degraded quality, tape hiss, vintage charm',
    'Tape saturated': 'Analog warmth from tape compression, harmonic distortion',
    'Analog warmth': 'Smooth, rounded tones from analog processing',
    'Wide stereo mix': 'Expansive stereo field, spacious soundstage',
    'Mono mix': 'Centered, focused mono image',
    'Heavy sidechain compression': 'Pumping effect, ducking bass against kick',
    'Brick-wall limiting': 'Maximum loudness, minimal dynamics',
    'Dynamic range': 'Wide volume variation, natural dynamics preserved',
    'Live room acoustics': 'Natural room reverb, live performance feel',
    'Studio polish': 'Refined, controlled, professionally treated sound',
    'Dark production': 'Recessed highs, emphasized lows and low-mids',
    'Bright production': 'Boosted high frequencies, airy and present',
    'Reverb-heavy': 'Lush, spacious with lots of reverb',
    'Dry mix': 'Minimal reverb/delay, upfront and direct',
    'Intimate close-mic': 'Close proximity, detailed, breathy',
    'Wide cinematic mix': 'Epic stereo width, orchestral depth',
    'Radio-ready': 'Commercial loudness, compressed for broadcast',
    'Raw unpolished': 'Unprocessed, rough, DIY aesthetic'
  };

  // NEW: Genre-specific instrument presets
  const genreInstrumentPresets = {
    'Jazz': { high: ['Trumpet', 'Soprano Saxophone'], mid: ['Piano', 'Alto Saxophone'], low: ['Double Bass'] },
    'Rock': { high: ['Electric Guitar'], mid: ['Electric Guitar', 'Organ'], low: ['Bass Guitar', 'Kick Drum'] },
    'Classical': { high: ['Violin', 'Flute'], mid: ['Cello', 'French Horn'], low: ['Double Bass', 'Timpani'] },
    'Electronic': { high: ['Synth Lead'], mid: ['Synth Pad', 'Arp Synth'], low: ['Sub Bass', '808 Bass'] },
    'Hip-Hop': { high: [], mid: ['Synth Pad'], low: ['808 Bass', 'Kick Drum'] },
    'Drill': { high: ['Hi-Hat'], mid: [], low: ['Sliding 808s'] },
    'Techno': { high: ['909 Hats'], mid: [], low: ['Sub Bass', '808 Bass'] },
    'Folk': { high: ['Mandolin', 'Violin'], mid: ['Acoustic Guitar'], low: ['Double Bass'] },
    'R&B': { high: [], mid: ['Electric Piano', 'Rhodes'], low: ['Bass Guitar', '808 Bass'] },
    'Bossa Nova': { high: ['Flute'], mid: ['Classical Guitar', 'Piano'], low: ['Double Bass'] },
    'Ambient': { high: ['Bells', 'Chimes'], mid: ['Pad (Warm)', 'Mellotron'], low: [] }
  };

  // NEW: Tempo to BPM mapping
  const tempoToBPM = {
    'Slow': [60, 80],
    'Medium-Slow': [80, 100],
    'Medium': [100, 120],
    'Medium-Fast': [120, 140],
    'Fast': [140, 180]
  };

  // NEW: Genre to parameter suggestions (for Suno settings guidance)
  const genreToSunoSettings = {
    'Pop': { weirdness: '20-40%', styleInfluence: '80-85%', notes: 'Low weirdness for radio-ready structure' },
    'Rock': { weirdness: '30-50%', styleInfluence: '75-80%', notes: 'Moderate settings for classic structure' },
    'Electronic': { weirdness: '50-70%', styleInfluence: '70-80%', notes: 'Higher weirdness for experimental sounds' },
    'Techno': { weirdness: '60-80%', styleInfluence: '70%', notes: 'High weirdness for unique textures' },
    'Ambient': { weirdness: '70-85%', styleInfluence: '60%', notes: 'Maximum creativity, lower style lock' },
    'Jazz': { weirdness: '40-60%', styleInfluence: '75%', notes: 'Balanced for improvisation feel' },
    'Classical': { weirdness: '20-40%', styleInfluence: '85%', notes: 'Low weirdness, high fidelity to style' },
    'Hip-Hop': { weirdness: '25-45%', styleInfluence: '80%', notes: 'Controlled structure for rhythmic precision' },
    'Drill': { weirdness: '30%', styleInfluence: '80%', notes: 'Tight structure for drill characteristics' },
    'default': { weirdness: '60%', styleInfluence: '80-85%', notes: 'Optimal balance per research' }
  };

  // Chinese display labels for tags (underlying values remain in English for prompt generation)
  const zhTagMap = {
    // Genres
    'Pop': '流行', 'Rock': '摇滚', 'Jazz': '爵士', 'Classical': '古典',
    'Electronic': '电子', 'Hip-Hop': '嘻哈', 'R&B': '节奏布鲁斯',
    'Folk': '民谣', 'Country': '乡村', 'Latin': '拉丁', 'Reggae': '雷鬼',
    'Blues': '布鲁斯', 'Metal': '金属', 'Punk': '朋克', 'Indie': '独立',
    'Ambient': '氛围', 'Lo-fi': '低保真', 'Chanson': '香颂',
    'Bossa Nova': '波萨诺瓦', 'Soul': '灵魂乐', 'Funk': '放克',
    'Gospel': '福音', 'World': '世界音乐', 'K-Pop': '韩流',
    'Disco': '迪斯科', 'House': '浩室', 'Techno': '科技舞曲',
    'Trap': '陷阱音乐', 'Drill': '钻头音乐', 'Grunge': '垃圾摇滚',
    'Ska': '斯卡', 'Afrobeat': '非洲节拍', 'Dancehall': '舞厅雷鬼',
    // Moods
    'Joyful': '欢快', 'Melancholic': '忧郁', 'Energetic': '充满活力',
    'Dreamy': '梦幻', 'Dark': '黑暗', 'Romantic': '浪漫',
    'Nostalgic': '怀旧', 'Aggressive': '激烈', 'Peaceful': '平和',
    'Triumphant': '凯旋', 'Mysterious': '神秘', 'Playful': '俏皮',
    'Ethereal': '空灵', 'Intense': '紧张', 'Chill': '放松',
    'Uplifting': '振奋', 'Haunting': '萦绕', 'Bittersweet': '苦乐参半',
    'Euphoric': '欣快', 'Somber': '沉郁', 'Whimsical': '异想天开',
    'Epic': '史诗', 'Sensual': '性感', 'Rebellious': '叛逆',
    'Hopeful': '希望', 'Lonely': '孤独',
    // Vocal Styles
    'Male Vocal': '男声', 'Female Vocal': '女声', 'Duet': '对唱',
    'Choir': '合唱', 'Falsetto': '假声', 'Whisper': '耳语',
    'Rap': '说唱', 'Spoken Word': '口白', 'Growl': '咆哮',
    'Operatic': '歌剧式', 'Instrumental (No Vocals)': '纯器乐（无人声）',
    'Humming': '哼唱', 'Scat': '拟声唱法', 'Belting': '高亢唱腔',
    'Breathy': '气声', 'Nasal': '鼻音', 'Autotune': '自动调音',
    'Harmony Vocals': '和声', 'Call and Response': '呼应唱法',
    // Instruments - High Register
    'Piccolo': '短笛', 'Flute': '长笛', 'Violin': '小提琴',
    'Soprano Saxophone': '高音萨克斯', 'Glockenspiel': '钟琴',
    'Celesta': '钢片琴', 'Whistle': '口哨', 'Female Humming': '女声哼唱',
    'Harmonica (High)': '口琴（高音）', 'Mandolin': '曼陀林',
    'Ukulele': '尤克里里', 'Bells': '铃', 'Synth Lead': '合成器主音',
    'Triangle': '三角铁', 'Xylophone': '木琴', 'Harp (Upper)': '竖琴（高音）',
    'Oboe': '双簧管', 'Recorder': '竖笛', 'Banjo': '班卓琴',
    'Music Box': '音乐盒', 'Chimes': '风铃', 'Clavinet': '电翼琴',
    'Sitar (High)': '西塔尔（高音）', 'Steel Drum': '钢鼓',
    'Classic Guitar': '古典吉他',
    // Instruments - Mid Register
    'Piano': '钢琴', 'Acoustic Guitar': '原声吉他',
    'Electric Guitar': '电吉他', 'Clarinet': '单簧管',
    'Trumpet': '小号', 'Alto Saxophone': '中音萨克斯',
    'Viola': '中提琴', 'Cello (Upper Range)': '大提琴（高音区）',
    'Organ': '管风琴', 'Male Humming': '男声哼唱',
    'Accordion': '手风琴', 'Marimba': '马林巴',
    'Synth Pad': '合成器铺底', 'Voice (Spoken)': '人声（口白）',
    'French Horn': '圆号', 'Tenor Saxophone': '次中音萨克斯',
    'Trombone': '长号', 'Vibraphone': '颤音琴',
    'Electric Piano': '电钢琴', 'Rhodes': '罗兹电钢琴',
    'Wurlitzer': '沃利策电钢琴', 'Mellotron': '梅洛特隆',
    'Sitar': '西塔尔', 'Erhu': '二胡', 'Kalimba': '卡林巴',
    'Strings Ensemble': '弦乐合奏', 'Brass Section': '铜管组',
    'Pad (Warm)': '铺底（温暖）', 'Pad (Choir)': '铺底（合唱）',
    'Arp Synth': '琶音合成器',
    // Instruments - Low Register
    'Bass Guitar': '贝斯', 'Double Bass': '低音提琴',
    'Cello (Lower Range)': '大提琴（低音区）', 'Tuba': '大号',
    'Baritone Saxophone': '上低音萨克斯', 'Bassoon': '大管',
    'Timpani': '定音鼓', 'Bass Drum': '大鼓',
    'Low Synth': '低音合成器', 'Male Bass Voice': '男低音',
    'Didgeridoo': '迪吉里杜管', 'Pipe Organ (Pedals)': '管风琴（脚键盘）',
    '808 Bass': '808低音', 'Sub Bass': '超低音',
    'Contrabassoon': '低音大管', 'Bass Clarinet': '低音单簧管',
    'Taiko Drum': '太鼓', 'Floor Tom': '落地鼓',
    'Kick Drum': '底鼓', 'Synth Bass': '合成贝斯',
    'Moog Bass': 'Moog贝斯', 'Bass Trombone': '低音长号',
    'Low Strings': '低音弦乐', 'Conga': '康加鼓', 'Djembe': '非洲鼓',

    // Production/Mix Quality
    'Clean production': '干净制作', 'Crisp production': '清脆制作',
    'Lo-fi production': 'Lo-fi低保真', 'Tape saturated': '磁带饱和',
    'Analog warmth': '模拟温暖', 'Wide stereo mix': '宽立体声混音',
    'Mono mix': '单声道混音', 'Heavy sidechain compression': '重侧链压缩',
    'Brick-wall limiting': '砖墙限制', 'Dynamic range': '动态范围',
    'Live room acoustics': '现场室内音效', 'Studio polish': '录音室打磨',
    'Dark production': '暗色制作', 'Bright production': '明亮制作',
    'Reverb-heavy': '重混响', 'Dry mix': '干混音',
    'Intimate close-mic': '亲密近距拾音', 'Wide cinematic mix': '宽广电影混音',
    'Radio-ready': '电台就绪', 'Raw unpolished': '原始未打磨',

    // Voice Type
    'Male Vocal': '男声', 'Female Vocal': '女声', 'Androgynous': '中性',
    'Duet': '二重唱', 'Choir': '合唱',
    'Rap': '说唱', 'Spoken Word': '朗诵',
    'Belting': '高亢', 'Falsetto': '假声',
    'Whisper': '耳语', 'Growl': '低吼',
    'Operatic': '歌剧式', 'Humming': '哼唱', 'Scat': '拟声',
    'Autotune': '自动调音', 'Harmony Vocals': '和声',
    'Call and Response': '呼应', 'Instrumental (No Vocals)': '纯器乐（无人声）',

    // Voice Character/Texture
    'Gritty': '沙哑粗糙', 'Breathy': '气声',
    'Airy': '空灵', 'Warm': '温暖',
    'Raspy': '嘶哑', 'Smooth': '柔滑',
    'Powerful': '有力', 'Delicate': '细腻',
    'Deep pitch': '深沉音高', 'High pitch': '高音调',
    'Rich tone': '浑厚', 'Thin voice': '轻薄',
    'Nasal': '鼻音', 'Husky': '低沉沙哑'
  };

  function getTagLabel(tag) {
    if (I18n.getLang() === 'zh' && zhTagMap[tag]) {
      return zhTagMap[tag];
    }
    return tag;
  }

  let selectedGenres = [];
  let selectedMoods = [];
  let selectedVocals = [];
  let selectedVocalTextures = []; // NEW
  let selectedProduction = []; // NEW
  let selectedInstruments = { high: [], mid: [], low: [] };
  let lastGeneratedStyle = '';
  let currentStyleMode = 'keyword'; // NEW: keyword or blueprint

  const STYLE_SYSTEM_PROMPT_KEYWORD = `You are a Suno AI music style prompt expert. Your job is to synthesize music style parameters into a concise, effective style prompt string for Suno's style/prompt field.

You will receive structured parameters including genre, mood, tempo/BPM, vocal style, vocal texture, instruments organized by register (high/mid/low), production/mix quality, exclusions, era/aesthetic, and a freeform description.

CRITICAL ORDERING RULE - Follow this exact sequence for maximum fidelity:
[Mood] + [Genre/Era] + [Key Instruments (2-3 max)] + [Production/Mix] + [Exact BPM if provided] + [Vocal Style/Texture]

Rules:
- Output ONLY the style prompt string, nothing else
- Use comma-separated descriptive tags
- Be concise but specific - target under 120 characters for optimal results
- Always output in English
- Place the most important elements (mood, genre) at the BEGINNING for maximum token weight
- Limit to 2-3 core instruments to prevent muddy frequency separation
- Include production characteristics for Technical Layer completeness
- If exclusions are provided, integrate them naturally (e.g., "no vocals" or prefix with [Instrumental])
- When BPM is specified, include the exact number (e.g., "128 BPM") rather than qualitative terms
- Do not add explanations, headers, or commentary
- NEVER use the word "skank" or its variants — it is banned by Suno. Use "offbeat strum", "ska rhythm", or "upstroke guitar" instead`;

  const STYLE_SYSTEM_PROMPT_BLUEPRINT = `You are a Suno AI music style prompt expert specializing in V4.5/V5 "Blueprint Prompting" (narrative prose style).

You will receive structured parameters. Your job is to synthesize them into a narrative paragraph that describes the temporal evolution of the track as a scene, using Director's Perspective.

Blueprint prompting uses narrative prose to map the temporal timeline. This aligns seamlessly with the transformer's sequential processing.

CRITICAL ORDERING RULE - Describe elements in this priority:
1. Opening mood/atmosphere and genre foundation
2. Initial instrumentation and tempo/BPM
3. How the arrangement evolves over time (what enters when)
4. Production characteristics and spatial qualities
5. Vocal characteristics (if applicable)

Rules:
- Output ONLY the narrative paragraph, nothing else
- Use flowing, descriptive prose (2-4 sentences)
- Describe the sonic evolution chronologically: "The beat begins sparsely with... As the pre-chorus arrives... The chorus explodes with..."
- Target 100-150 words for optimal transformer processing
- Always output in English
- Include concrete acoustic parameters (BPM numbers, specific instruments, production terms)
- If exclusions provided, integrate naturally: "deliberately avoiding vocals" or "no percussion throughout"
- Do not add meta-commentary or explanations
- NEVER use the word "skank" — use "offbeat strum", "ska rhythm", or "upstroke guitar" instead`;

  const STYLE_SYSTEM_PROMPT = STYLE_SYSTEM_PROMPT_KEYWORD; // Default to keyword mode

  const INSTRUMENT_SUGGEST_PROMPT = `You are a music instrumentation expert. Given the genre, mood, and style parameters, suggest appropriate instruments organized by register.

Output ONLY valid JSON in this exact format:
{"high":["instrument1","instrument2"],"mid":["instrument1","instrument2"],"low":["instrument1","instrument2"]}

Suggest 3-5 instruments per register. Use common instrument names. No explanations.`;

  function init() {
    renderChipSelectors();
    renderInstrumentPanels();
    bindEvents();

    // Re-render chips when language changes
    document.addEventListener('langChanged', () => {
      renderChipSelectors();
      renderInstrumentPanels();
    });
  }

  function renderChipSelectors() {
    renderChipGroup('genre-chips', genres, selectedGenres, (item, selected) => {
      selectedGenres = selected;
      checkValidationWarnings(); // NEW
      showGenreInstrumentSuggestion(); // NEW
    });
    renderChipGroup('mood-chips', moods, selectedMoods, (item, selected) => {
      selectedMoods = selected;
      checkValidationWarnings(); // NEW
    });
    renderChipGroup('vocal-chips', vocalStyles, selectedVocals, (item, selected) => {
      selectedVocals = selected;
    });
    renderChipGroup('vocal-texture-chips', vocalTextures, selectedVocalTextures, (item, selected) => {
      selectedVocalTextures = selected;
    }); // NEW
    renderChipGroup('production-chips', productionQualities, selectedProduction, (item, selected) => {
      selectedProduction = selected;
    }, productionDescriptions); // NEW
  }

  function renderChipGroup(containerId, items, selectedList, onChange, descriptions = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    items.forEach(item => {
      const chip = document.createElement('button');
      chip.className = 'chip' + (selectedList.includes(item) ? ' selected' : '');
      chip.textContent = getTagLabel(item);
      chip.type = 'button';

      // Add tooltip if descriptions provided
      if (descriptions && descriptions[item]) {
        chip.title = descriptions[item];
      }

      chip.addEventListener('click', () => {
        const idx = selectedList.indexOf(item);
        if (idx >= 0) {
          selectedList.splice(idx, 1);
          chip.classList.remove('selected');
        } else {
          selectedList.push(item);
          chip.classList.add('selected');
        }
        onChange(item, selectedList);
      });
      container.appendChild(chip);
    });
  }

  function renderInstrumentPanels() {
    const allInstruments = InstrumentDB.getAll();
    ['high', 'mid', 'low'].forEach(register => {
      // Include any selected instruments not in the DB (e.g. from AI suggestions)
      const extra = selectedInstruments[register].filter(
        inst => !allInstruments[register].includes(inst)
      );
      renderInstrumentChips(register, [...allInstruments[register], ...extra]);
    });
  }

  function renderInstrumentChips(register, instruments) {
    const container = document.getElementById(`inst-${register}-chips`);
    if (!container) return;
    container.innerHTML = '';
    instruments.forEach(inst => {
      const chip = document.createElement('button');
      chip.className = 'chip chip-sm' + (selectedInstruments[register].includes(inst) ? ' selected' : '');
      chip.textContent = getTagLabel(inst);
      chip.type = 'button';
      chip.addEventListener('click', () => {
        const idx = selectedInstruments[register].indexOf(inst);
        if (idx >= 0) {
          selectedInstruments[register].splice(idx, 1);
          chip.classList.remove('selected');
        } else {
          selectedInstruments[register].push(inst);
          chip.classList.add('selected');
        }
      });
      container.appendChild(chip);
    });
  }

  function bindEvents() {
    // Instrument search
    const searchInput = document.getElementById('instrument-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (!query) {
          renderInstrumentPanels();
          return;
        }
        const results = InstrumentDB.search(query);
        // Also match Chinese labels when in Chinese mode
        if (I18n.getLang() === 'zh') {
          const allInstruments = InstrumentDB.getAll();
          ['high', 'mid', 'low'].forEach(register => {
            allInstruments[register].forEach(inst => {
              const zhLabel = zhTagMap[inst];
              if (zhLabel && zhLabel.includes(query) && !results[register].includes(inst)) {
                results[register].push(inst);
              }
            });
          });
        }
        ['high', 'mid', 'low'].forEach(register => {
          renderInstrumentChips(register, results[register]);
        });
      });
    }

    // AI Suggest instruments
    const suggestBtn = document.getElementById('btn-suggest-instruments');
    if (suggestBtn) {
      suggestBtn.addEventListener('click', suggestInstruments);
    }

    // Bake button
    const bakeBtn = document.getElementById('btn-bake-style');
    if (bakeBtn) {
      bakeBtn.addEventListener('click', bakeStyle);
    }

    // Regenerate
    const regenBtn = document.getElementById('btn-regen-style');
    if (regenBtn) {
      regenBtn.addEventListener('click', bakeStyle);
    }

    // Copy
    const copyBtn = document.getElementById('btn-copy-style');
    if (copyBtn) {
      copyBtn.addEventListener('click', copyStyle);
    }

    // NEW: BPM input sync with tempo dropdown
    const tempoSelect = document.getElementById('tempo-select');
    const bpmInput = document.getElementById('bpm-input');
    if (tempoSelect && bpmInput) {
      tempoSelect.addEventListener('change', () => {
        const tempo = tempoSelect.value;
        const range = tempoToBPM[tempo];
        if (range && !bpmInput.value) {
          const mid = Math.floor((range[0] + range[1]) / 2);
          bpmInput.placeholder = `${mid} (suggested)`;
        }
      });
    }

    // NEW: Style mode toggle (keyword vs blueprint)
    document.querySelectorAll('input[name="style-mode"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        currentStyleMode = e.target.value;
      });
    });

    // NEW: Load template button
    const templateBtn = document.getElementById('btn-load-template');
    if (templateBtn) {
      templateBtn.addEventListener('click', showTemplateModal);
    }

    // NEW: Add custom instrument buttons
    ['high', 'mid', 'low'].forEach(register => {
      const addBtn = document.getElementById(`btn-add-inst-${register}`);
      if (addBtn) {
        addBtn.addEventListener('click', () => addCustomInstrument(register));
      }
    });

    // NEW: Compare button
    const compareBtn = document.getElementById('btn-compare-style');
    if (compareBtn) {
      compareBtn.addEventListener('click', () => showCompareModal('style'));
    }

    // NEW: Freeform and exclusions validation
    const freeformInput = document.getElementById('freeform-input');
    const exclusionsInput = document.getElementById('exclusions-input');
    if (freeformInput) {
      freeformInput.addEventListener('input', () => checkVagueness('freeform-input', 'freeform-hint'));
    }
    if (exclusionsInput) {
      exclusionsInput.addEventListener('input', () => checkVagueness('exclusions-input', 'exclusions-hint'));
    }

    // NEW: Result textarea character counter
    const resultArea = document.getElementById('style-result');
    if (resultArea) {
      resultArea.addEventListener('input', updateCharCounter);
    }
  }

  function gatherParams() {
    const subGenre = document.getElementById('sub-genre')?.value?.trim() || '';
    const tempo = document.getElementById('tempo-select')?.value || 'Medium';
    const bpm = document.getElementById('bpm-input')?.value?.trim() || ''; // NEW
    const era = document.getElementById('era-input')?.value?.trim() || '';
    const exclusions = document.getElementById('exclusions-input')?.value?.trim() || ''; // NEW
    const freeform = document.getElementById('freeform-input')?.value?.trim() || '';

    const allInstruments = [
      ...selectedInstruments.high,
      ...selectedInstruments.mid,
      ...selectedInstruments.low
    ];

    return {
      genres: selectedGenres,
      moods: selectedMoods,
      vocals: selectedVocals,
      vocalTextures: selectedVocalTextures, // NEW
      production: selectedProduction, // NEW
      instruments: selectedInstruments, // NEW: Full object
      subGenre,
      tempo,
      bpm, // NEW
      era,
      exclusions, // NEW
      freeform,
      allInstruments
    };
  }

  function buildUserPrompt() {
    const params = gatherParams();
    const parts = [];

    // Following optimized ordering per research report
    if (selectedMoods.length) parts.push(`Mood: ${selectedMoods.join(', ')}`);
    if (selectedGenres.length) parts.push(`Genre: ${selectedGenres.join(', ')}`);
    if (params.subGenre) parts.push(`Sub-genre/Fusion: ${params.subGenre}`);
    if (params.era) parts.push(`Era/Aesthetic: ${params.era}`);

    // Instruments with register breakdown
    if (params.allInstruments.length) {
      parts.push(`Key Instruments: ${params.allInstruments.join(', ')}`);
      if (selectedInstruments.high.length) parts.push(`  High register: ${selectedInstruments.high.join(', ')}`);
      if (selectedInstruments.mid.length) parts.push(`  Mid register: ${selectedInstruments.mid.join(', ')}`);
      if (selectedInstruments.low.length) parts.push(`  Low register: ${selectedInstruments.low.join(', ')}`);
    }

    // NEW: Production/Mix layer
    if (selectedProduction.length) parts.push(`Production/Mix: ${selectedProduction.join(', ')}`);

    // Tempo/BPM
    if (params.bpm) {
      parts.push(`BPM: ${params.bpm}`);
    } else {
      parts.push(`Tempo: ${params.tempo}`);
    }

    // Vocal
    if (selectedVocals.length) parts.push(`Vocal Style: ${selectedVocals.join(', ')}`);
    if (selectedVocalTextures.length) parts.push(`Vocal Texture: ${selectedVocalTextures.join(', ')}`); // NEW

    // NEW: Exclusions
    if (params.exclusions) parts.push(`Exclusions: ${params.exclusions}`);

    // Freeform last
    if (params.freeform) parts.push(`Additional description: ${params.freeform}`);

    return parts.join('\n');
  }

  async function bakeStyle() {
    if (!API.isConfigured()) {
      showNotification(I18n.t('settings.noProvider'), 'error');
      return;
    }

    const userPrompt = buildUserPrompt();
    if (!userPrompt.trim() || userPrompt === 'Tempo: Medium') {
      showNotification(I18n.t('errors.emptyInput'), 'error');
      return;
    }

    const btn = document.getElementById('btn-bake-style');
    const resultArea = document.getElementById('style-result');
    const resultSection = document.getElementById('style-result-section');

    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> ${I18n.t('style.baking')}`;

    try {
      // Select system prompt based on mode
      const systemPrompt = currentStyleMode === 'blueprint' ? STYLE_SYSTEM_PROMPT_BLUEPRINT : STYLE_SYSTEM_PROMPT_KEYWORD;

      const raw = await API.generate(systemPrompt, userPrompt);
      const result = sanitizeOutput(raw);
      resultArea.value = result;
      resultSection.classList.remove('hidden');
      lastGeneratedStyle = result;

      // NEW: Update character counter and quality indicator
      updateCharCounter();

      // NEW: Show Suno parameter guidance
      showSunoGuidance();

      // Pass to Lyrics Baker
      const lyricsContext = document.getElementById('lyrics-style-context');
      if (lyricsContext) {
        lyricsContext.value = result;
      }
      showNotification(I18n.t('style.passToLyrics'), 'success');

      // Save to history
      History.add('style', result);

      // NEW: Save to versions for comparison
      Versions.saveVersion('style', result, gatherParams());
    } catch (e) {
      showNotification(I18n.t('errors.apiError') + e.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 12l3 3 5-5"/></svg> ${I18n.t('style.bake')}`;
    }
  }

  async function suggestInstruments() {
    if (!API.isConfigured()) {
      showNotification(I18n.t('settings.noProvider'), 'error');
      return;
    }

    const btn = document.getElementById('btn-suggest-instruments');
    const origText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> ${I18n.t('style.suggestingInstruments')}`;

    const parts = [];
    if (selectedGenres.length) parts.push(`Genre: ${selectedGenres.join(', ')}`);
    if (selectedMoods.length) parts.push(`Mood: ${selectedMoods.join(', ')}`);
    const tempo = document.getElementById('tempo-select')?.value || '';
    if (tempo) parts.push(`Tempo: ${tempo}`);
    const era = document.getElementById('era-input')?.value?.trim() || '';
    if (era) parts.push(`Era: ${era}`);

    if (!parts.length) {
      showNotification(I18n.t('errors.emptyInput'), 'error');
      btn.disabled = false;
      btn.textContent = origText;
      return;
    }

    try {
      const result = await API.generate(INSTRUMENT_SUGGEST_PROMPT, parts.join('\n'));
      // Parse JSON from result
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const suggested = JSON.parse(jsonMatch[0]);
        showInstrumentSuggestions(suggested);
      }
    } catch (e) {
      showNotification(I18n.t('errors.apiError') + e.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a5 5 0 0 1 5 5c0 2.76-2.24 5-5 5s-5-2.24-5-5a5 5 0 0 1 5-5z"/><path d="M12 14l-3 8h6l-3-8z"/></svg> ${I18n.t('style.suggestInstruments')}`;
    }
  }

  function showInstrumentSuggestions(suggested) {
    const modal = document.getElementById('suggestion-modal');
    const container = document.getElementById('suggestion-content');
    if (!modal || !container) return;

    container.innerHTML = '';
    ['high', 'mid', 'low'].forEach(register => {
      if (suggested[register] && suggested[register].length) {
        const section = document.createElement('div');
        section.className = 'suggestion-section';
        const label = register === 'high' ? I18n.t('style.instrumentsHigh') :
                      register === 'mid' ? I18n.t('style.instrumentsMid') :
                      I18n.t('style.instrumentsLow');
        section.innerHTML = `<h4>${label}</h4>`;
        const chipWrap = document.createElement('div');
        chipWrap.className = 'chip-group';
        suggested[register].forEach(inst => {
          const chip = document.createElement('button');
          const isSelected = selectedInstruments[register].includes(inst);
          chip.className = 'chip chip-suggestion' + (isSelected ? ' accepted' : '');
          chip.textContent = getTagLabel(inst);
          chip.type = 'button';
          chip.addEventListener('click', () => {
            const idx = selectedInstruments[register].indexOf(inst);
            if (idx >= 0) {
              selectedInstruments[register].splice(idx, 1);
              chip.classList.remove('accepted');
            } else {
              selectedInstruments[register].push(inst);
              chip.classList.add('accepted');
            }
            renderInstrumentPanels();
          });
          chipWrap.appendChild(chip);
        });
        section.appendChild(chipWrap);
        container.appendChild(section);
      }
    });

    modal.classList.add('visible');
  }

  function copyStyle() {
    const resultArea = document.getElementById('style-result');
    if (resultArea && resultArea.value) {
      navigator.clipboard.writeText(resultArea.value).then(() => {
        showNotification(I18n.t('style.copied'), 'success');
      });
    }
  }

  function getLastStyle() {
    return document.getElementById('style-result')?.value || lastGeneratedStyle;
  }

  function loadFromHistory(content) {
    const resultArea = document.getElementById('style-result');
    const resultSection = document.getElementById('style-result-section');
    if (resultArea) {
      resultArea.value = content;
      resultSection.classList.remove('hidden');
      lastGeneratedStyle = content;
      updateCharCounter(); // NEW
      // Also pass to lyrics
      const lyricsContext = document.getElementById('lyrics-style-context');
      if (lyricsContext) lyricsContext.value = content;
    }
  }

  // NEW FUNCTIONS

  function checkValidationWarnings() {
    const params = gatherParams();
    const warnings = Validation.checkOverstuffing(params);
    const moodConflict = Validation.checkMoodConflicts(selectedMoods);

    // Clear previous warnings
    document.querySelectorAll('.validation-warning').forEach(el => el.remove());

    // Show warnings
    if (warnings) {
      warnings.forEach(warning => {
        const badge = document.createElement('div');
        badge.className = 'validation-warning';
        badge.innerHTML = `⚠️ ${warning.message}<br><small>${warning.suggestion}</small>`;

        // Append to appropriate section
        if (warning.type === 'genres') {
          document.getElementById('genre-chips')?.parentElement?.appendChild(badge);
        } else if (warning.type.startsWith('instruments')) {
          const reg = warning.type.split('-')[1];
          document.getElementById(`inst-${reg}-chips`)?.parentElement?.appendChild(badge);
        } else if (warning.type === 'moods') {
          document.getElementById('mood-chips')?.parentElement?.appendChild(badge);
        }
      });
    }

    if (moodConflict) {
      const badge = document.createElement('div');
      badge.className = 'validation-warning';
      badge.innerHTML = `⚠️ ${moodConflict.message}<br><small>${moodConflict.suggestion}</small>`;
      document.getElementById('mood-chips')?.parentElement?.appendChild(badge);
    }
  }

  function showGenreInstrumentSuggestion() {
    if (selectedGenres.length === 0) return;

    const genre = selectedGenres[0];
    const preset = genreInstrumentPresets[genre];

    if (preset) {
      const totalSelected = selectedInstruments.high.length + selectedInstruments.mid.length + selectedInstruments.low.length;
      if (totalSelected === 0) {
        // Show subtle hint
        const hint = `💡 Tip: "${genre}" typically uses: ${preset.high.concat(preset.mid, preset.low).slice(0, 3).join(', ')}... <a href="#" id="load-genre-preset" style="color: var(--accent); text-decoration: underline;">Load typical instruments</a>`;
        const container = document.getElementById('instrument-search')?.parentElement;
        if (container) {
          let hintEl = container.querySelector('.genre-hint');
          if (!hintEl) {
            hintEl = document.createElement('small');
            hintEl.className = 'genre-hint';
            hintEl.style.cssText = 'display: block; margin-top: 8px; color: var(--text-muted);';
            container.appendChild(hintEl);
          }
          hintEl.innerHTML = hint;

          // Bind click to load preset
          document.getElementById('load-genre-preset')?.addEventListener('click', (e) => {
            e.preventDefault();
            loadGenrePreset(genre);
          });
        }
      }
    }
  }

  function loadGenrePreset(genre) {
    const preset = genreInstrumentPresets[genre];
    if (!preset) return;

    selectedInstruments.high = [...preset.high];
    selectedInstruments.mid = [...preset.mid];
    selectedInstruments.low = [...preset.low];

    renderInstrumentPanels();
    showNotification(`${I18n.t('style.instrumentsLoaded')} ${genre}`, 'success');

    // Remove hint
    document.querySelector('.genre-hint')?.remove();
  }

  function addCustomInstrument(register) {
    const lang = I18n.getLang();
    const promptText = lang === 'zh'
      ? `请输入自定义${register === 'high' ? '高音' : register === 'mid' ? '中音' : '低音'}乐器名称：`
      : `Enter custom ${register} register instrument name:`;

    const instrumentName = prompt(promptText);

    if (!instrumentName || !instrumentName.trim()) return;

    const trimmedName = instrumentName.trim();

    // Check if already selected
    if (selectedInstruments[register].includes(trimmedName)) {
      const alreadyMsg = lang === 'zh' ? '该乐器已添加' : 'Instrument already added';
      showNotification(alreadyMsg, 'info');
      return;
    }

    // Add to selected instruments
    selectedInstruments[register].push(trimmedName);

    // Re-render to show the new instrument
    renderInstrumentPanels();

    const successMsg = lang === 'zh'
      ? `已添加自定义乐器：${trimmedName}`
      : `Added custom instrument: ${trimmedName}`;
    showNotification(successMsg, 'success');
  }

  function checkVagueness(inputId, hintId) {
    const input = document.getElementById(inputId);
    const hint = document.getElementById(hintId);
    if (!input || !hint) return;

    const check = Validation.checkVagueTerms(input.value);
    if (check) {
      hint.className = 'warning-hint';
      hint.textContent = `⚠️ ${check.message}. ${check.suggestion}`;
    } else {
      hint.textContent = '';
    }
  }

  function updateCharCounter() {
    const resultArea = document.getElementById('style-result');
    const counter = document.getElementById('char-counter');
    const indicator = document.getElementById('quality-indicator');

    if (!resultArea || !counter || !indicator) return;

    const analysis = Validation.checkCharacterLength(resultArea.value);
    if (!analysis) return;

    counter.textContent = `${analysis.length} characters`;
    counter.className = analysis.color;

    indicator.textContent = analysis.message;
    indicator.className = '';
    if (analysis.quality === 'optimal') {
      indicator.className = 'optimal';
    } else if (analysis.quality === 'acceptable') {
      indicator.className = 'acceptable';
    } else {
      indicator.className = 'poor';
    }
  }

  function showSunoGuidance() {
    const guidanceSection = document.getElementById('suno-guidance');
    const guidanceContent = document.getElementById('suno-guidance-content');
    if (!guidanceSection || !guidanceContent) return;

    if (selectedGenres.length === 0) {
      guidanceSection.classList.add('hidden');
      return;
    }

    const genre = selectedGenres[0];
    const settings = genreToSunoSettings[genre] || genreToSunoSettings.default;

    guidanceContent.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 8px;">
        <div>
          <strong style="font-size: 0.85rem; color: var(--text-muted);">Weirdness:</strong>
          <div style="font-size: 1.1rem; color: var(--text);">${settings.weirdness}</div>
        </div>
        <div>
          <strong style="font-size: 0.85rem; color: var(--text-muted);">Style Influence:</strong>
          <div style="font-size: 1.1rem; color: var(--text);">${settings.styleInfluence}</div>
        </div>
      </div>
      <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted); font-style: italic;">${settings.notes}</p>
    `;

    guidanceSection.classList.remove('hidden');
  }

  function showTemplateModal() {
    const modal = document.getElementById('template-modal');
    const listContainer = document.getElementById('template-list');
    if (!modal || !listContainer) return;

    const templates = Templates.getAll();
    listContainer.innerHTML = templates.map(t => `
      <div class="template-card" data-template-id="${t.id}">
        <h3>${t.name}</h3>
        <p>${t.description}</p>
        <div class="template-tags">
          ${t.tags.map(tag => `<span>${tag}</span>`).join('')}
        </div>
      </div>
    `).join('');

    // Bind click events
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => {
        const templateId = card.getAttribute('data-template-id');
        loadTemplate(templateId);
        modal.classList.remove('visible');
      });
    });

    modal.classList.add('visible');
  }

  function loadTemplate(templateId) {
    const template = Templates.getById(templateId);
    if (!template) return;

    // Load all parameters
    selectedGenres = [...template.genre];
    selectedMoods = [...template.moods];
    selectedVocals = [...template.vocals];
    selectedVocalTextures = [...(template.vocalTexture || [])];
    selectedProduction = [...(template.production || [])];
    selectedInstruments = {
      high: [...(template.instruments.high || [])],
      mid: [...(template.instruments.mid || [])],
      low: [...(template.instruments.low || [])]
    };

    // Set form values
    document.getElementById('tempo-select').value = template.tempo;
    if (template.bpm) document.getElementById('bpm-input').value = template.bpm;
    if (template.exclusions) document.getElementById('exclusions-input').value = template.exclusions;

    // Re-render chips
    renderChipSelectors();
    renderInstrumentPanels();

    // Load style prompt if in preview mode
    if (template.stylePrompt) {
      const resultArea = document.getElementById('style-result');
      const resultSection = document.getElementById('style-result-section');
      resultArea.value = template.stylePrompt;
      resultSection.classList.remove('hidden');
      updateCharCounter();
      showSunoGuidance();
    }

    showNotification(`${I18n.t('style.templateLoaded')}: ${template.name}`, 'success');
  }

  function showCompareModal(type) {
    // This will be called from a global function in app.js
    // For now, just placeholder
    showNotification(I18n.t('style.comparisonInfo'), 'info');
  }

  function loadTemplate(templateId) {
    const template = Templates.getById(templateId);
    if (!template) return;

    // Load all parameters
    selectedGenres = [...template.genre];
    selectedMoods = [...template.moods];
    selectedVocals = [...template.vocals];
    selectedVocalTextures = [...(template.vocalTexture || [])];
    selectedProduction = [...(template.production || [])];
    selectedInstruments = {
      high: [...(template.instruments.high || [])],
      mid: [...(template.instruments.mid || [])],
      low: [...(template.instruments.low || [])]
    };

    // Set form values
    document.getElementById('tempo-select').value = template.tempo;
    if (template.bpm) document.getElementById('bpm-input').value = template.bpm;
    if (template.exclusions) document.getElementById('exclusions-input').value = template.exclusions;

    // Re-render chips
    renderChipSelectors();
    renderInstrumentPanels();

    // Load style prompt
    if (template.stylePrompt) {
      const resultArea = document.getElementById('style-result');
      const resultSection = document.getElementById('style-result-section');
      resultArea.value = template.stylePrompt;
      resultSection.classList.remove('hidden');
      updateCharCounter();
      showSunoGuidance();

      // Pass to lyrics baker
      const lyricsContext = document.getElementById('lyrics-style-context');
      if (lyricsContext) lyricsContext.value = template.stylePrompt;
    }

    showNotification(`${I18n.t('style.templateLoaded')}: ${template.name}`, 'success');
  }

  return { init, getLastStyle, loadFromHistory, loadTemplate };
})();
