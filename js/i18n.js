const I18n = (() => {
  let currentLang = localStorage.getItem('spb-lang') || 'en';
  let strings = {};

  const langData = {
    en: {
      app: { title: "Suno Prompt Baker", subtitle: "Craft style prompts & lyrics for Suno AI" },
      nav: { styleBaker: "Style Baker", lyricsBaker: "Lyrics Baker", history: "History", settings: "Settings" },
      settings: {
        title: "API Configuration", provider: "Provider", providerOpenAI: "OpenAI-Compatible", providerGemini: "Google Gemini",
        baseUrl: "API Base URL", apiKey: "API Key", model: "Model Name",
        testConnection: "Test Connection", testing: "Testing...", testSuccess: "Connection successful!", testFail: "Connection failed: ",
        activeProvider: "Active Provider", save: "Save", saved: "Settings saved!",
        noProvider: "Please configure an API provider in Settings first."
      },
      style: {
        title: "Style Prompt Baker", genre: "Genre", genrePlaceholder: "Select genres...",
        subGenre: "Sub-genre / Fusion", subGenrePlaceholder: "e.g., French Chanson, Neo-Soul, Synthwave",
        mood: "Mood / Emotion", moodPlaceholder: "Select moods...",
        tempo: "Tempo", tempoSlow: "Slow", tempoMediumSlow: "Medium-Slow", tempoMedium: "Medium", tempoMediumFast: "Medium-Fast", tempoFast: "Fast",
        bpm: "BPM",
        vocal: "Vocal Style", vocalPlaceholder: "Select vocal styles...",
        voiceType: "Voice Type",
        voiceTypeHint: "Gender and delivery style",
        vocalTexture: "Vocal Texture / Quality",
        voiceCharacter: "Voice Character",
        voiceCharacterHint: "Tone quality and texture (optional)",
        era: "Era / Aesthetic", eraPlaceholder: "e.g., 80s, 90s, Modern, Vintage",
        instruments: "Instruments", instrumentsHigh: "High Register", instrumentsMid: "Mid Register", instrumentsLow: "Low Register",
        instrumentSearch: "Search instruments...", suggestInstruments: "AI Suggest", suggestingInstruments: "Suggesting...",
        production: "Production / Mix Quality",
        exclusions: "Exclusions (Negative Prompt)",
        freeform: "Additional Description", freeformPlaceholder: "Describe your vision... e.g., \"I want it to sound like a rainy afternoon in Paris\"",
        promptMode: "Prompt Mode",
        modeKeyword: "Keyword (Classic)",
        modeBlueprint: "Blueprint (Narrative)",
        loadTemplate: "Load Template",
        templateLoaded: "Loaded template",
        instrumentsLoaded: "Loaded typical instruments for",
        comparisonInfo: "Comparison feature - see version history",
        bake: "Bake Style", baking: "Baking...", result: "Generated Style Prompt",
        copy: "Copy", copied: "Copied!", regenerate: "Regenerate", passToLyrics: "Passed to Lyrics Baker",
        compare: "Compare",
        sunoSettings: "Recommended Suno Settings"
      },
      lyrics: {
        title: "Lyrics & Arrangement Baker", mode: "Generation Mode", modeFull: "Full Generation", modeExpand: "Expand / Complete",
        modeChain: "Section Chain",
        modeScaffold: "Scaffolding Mode",
        styleContext: "Style Context (from Style Baker)", styleContextPlaceholder: "No style context yet. Generate one in Style Baker first, or type manually.",
        lyricsLanguage: "Lyrics Language",
        lyricsLangEn: "English", lyricsLangZh: "Chinese", lyricsLangEs: "Spanish", lyricsLangFr: "French",
        lyricsLangJa: "Japanese", lyricsLangKo: "Korean", lyricsLangPt: "Portuguese", lyricsLangDe: "German",
        lyricsLangHi: "Hindi", lyricsLangAr: "Arabic", lyricsLangMulti: "Multilingual",
        lyricsLangOther: "Other", lyricsLangCustomPlaceholder: "Type language name...",
        instrumental: "Instrumental (No Lyrics)", instrumentalConceptPlaceholder: "Describe the mood and atmosphere... e.g., \"A peaceful morning in a mountain village\"",
        duration: "Song Duration", durationNone: "Auto", durationShort: "Short (~2 min)", durationMedium: "Medium (~3 min)", durationLong: "Long (~4+ min)",
        energyArc: "Energy Arc / Dynamic Progression",
        conceptLabel: "Theme / Concept / Story", conceptPlaceholder: "Describe the theme of your song... e.g., \"A love letter to autumn in Bordeaux\"",
        expandLabel: "Partial Lyrics / Draft", expandPlaceholder: "Paste your partial lyrics, outline, or rough draft here...",
        bake: "Bake Lyrics", baking: "Baking...", result: "Generated Lyrics",
        titleLabel: "Song Title",
        tagInserted: "Inserted",
        sectionDescRequired: "Please describe what happens in this section",
        chainComplete: "Chain complete! All sections generated.",
        sectionComplete: "complete! Continue to next section.",
        copy: "Copy", copied: "Copied!", regenerate: "Regenerate",
        compare: "Compare",
        styleCopied: "Style copied to clipboard!",
        lyricsCopied: "Lyrics copied to clipboard!"
      },
      history: {
        title: "Generation History", empty: "No history yet. Start generating!",
        typeStyle: "Style", typeLyrics: "Lyrics", load: "Load", delete: "Delete",
        clearAll: "Clear All", clearConfirm: "Delete all history entries?"
      },
      templates: {
        title: "Prompt Templates"
      },
      compare: {
        title: "Version Comparison",
        needAtLeast: "Need at least 2",
        generationsToCompare: "generations to compare"
      },
      sunoPreview: {
        title: "Suno-Ready Output"
      },
      errors: {
        noProvider: "No API provider configured. Please set up in Settings.",
        emptyInput: "Please provide some input before generating.",
        apiError: "API Error: ", networkError: "Network error. Please check your connection and API settings.",
        unknownError: "An unexpected error occurred."
      }
    },
    zh: {
      app: { title: "Suno Prompt Baker", subtitle: "为 Suno AI 制作风格提示词与歌词" },
      nav: { styleBaker: "风格烘焙", lyricsBaker: "歌词烘焙", history: "历史记录", settings: "设置" },
      settings: {
        title: "API 配置", provider: "服务商", providerOpenAI: "OpenAI 兼容", providerGemini: "Google Gemini",
        baseUrl: "API 基础 URL", apiKey: "API 密钥", model: "模型名称",
        testConnection: "测试连接", testing: "测试中...", testSuccess: "连接成功！", testFail: "连接失败：",
        activeProvider: "当前使用的服务商", save: "保存", saved: "设置已保存！",
        noProvider: "请先在设置中配置 API 服务商。"
      },
      style: {
        title: "风格提示词烘焙", genre: "曲风", genrePlaceholder: "选择曲风...",
        subGenre: "子曲风 / 融合", subGenrePlaceholder: "例如：French Chanson, Neo-Soul, Synthwave",
        mood: "情绪 / 氛围", moodPlaceholder: "选择情绪...",
        tempo: "节奏速度", tempoSlow: "慢速", tempoMediumSlow: "中慢速", tempoMedium: "中速", tempoMediumFast: "中快速", tempoFast: "快速",
        bpm: "每分钟节拍数",
        vocal: "人声风格", vocalPlaceholder: "选择人声风格...",
        voiceType: "声音类型",
        voiceTypeHint: "性别与演唱方式",
        vocalTexture: "人声质感 / 特质",
        voiceCharacter: "声音特质",
        voiceCharacterHint: "音色与质感（可选）",
        era: "年代 / 美学", eraPlaceholder: "例如：80s, 90s, Modern, Vintage",
        instruments: "乐器", instrumentsHigh: "高音区", instrumentsMid: "中音区", instrumentsLow: "低音区",
        instrumentSearch: "搜索乐器...", suggestInstruments: "AI 推荐", suggestingInstruments: "推荐中...",
        production: "制作 / 混音品质",
        exclusions: "排除项（负向提示词）",
        freeform: "自由描述", freeformPlaceholder: "描述你的音乐构想... 例如：\"我想要听起来像巴黎雨后午后的感觉\"",
        promptMode: "提示词模式",
        modeKeyword: "关键词（经典）",
        modeBlueprint: "蓝图（叙事）",
        loadTemplate: "加载模板",
        templateLoaded: "已加载模板",
        instrumentsLoaded: "已加载典型乐器：",
        comparisonInfo: "对比功能 - 查看版本历史",
        bake: "烘焙风格", baking: "烘焙中...", result: "生成的风格提示词",
        copy: "复制", copied: "已复制！", regenerate: "重新生成", passToLyrics: "已传递到歌词模块",
        compare: "对比",
        sunoSettings: "推荐的 Suno 设置"
      },
      lyrics: {
        title: "歌词与编曲烘焙", mode: "生成模式", modeFull: "完整生成", modeExpand: "扩展 / 补全",
        modeChain: "分段链式",
        modeScaffold: "脚手架模式",
        styleContext: "风格上下文（来自风格烘焙）", styleContextPlaceholder: "暂无风格上下文。请先在风格烘焙中生成，或手动输入。",
        lyricsLanguage: "歌词语言",
        lyricsLangEn: "英语", lyricsLangZh: "中文", lyricsLangEs: "西班牙语", lyricsLangFr: "法语",
        lyricsLangJa: "日语", lyricsLangKo: "韩语", lyricsLangPt: "葡萄牙语", lyricsLangDe: "德语",
        lyricsLangHi: "印地语", lyricsLangAr: "阿拉伯语", lyricsLangMulti: "多语言",
        lyricsLangOther: "其他", lyricsLangCustomPlaceholder: "输入语言名称...",
        instrumental: "纯器乐（无歌词）", instrumentalConceptPlaceholder: "描述氛围与意境... 例如：\"山间清晨的宁静\"",
        duration: "歌曲时长", durationNone: "自动", durationShort: "短 (~2分钟)", durationMedium: "中 (~3分钟)", durationLong: "长 (~4分钟+)",
        energyArc: "能量弧线 / 动态进程",
        conceptLabel: "主题 / 概念 / 故事", conceptPlaceholder: "描述你的歌曲主题... 例如：\"写给波尔多秋天的情书\"",
        expandLabel: "部分歌词 / 草稿", expandPlaceholder: "在此粘贴你的部分歌词、大纲或草稿...",
        bake: "烘焙歌词", baking: "烘焙中...", result: "生成的歌词",
        titleLabel: "歌曲标题",
        tagInserted: "已插入",
        sectionDescRequired: "请描述此段落的内容",
        chainComplete: "链式生成完成！所有段落已生成。",
        sectionComplete: "已完成！继续下一段落。",
        copy: "复制", copied: "已复制！", regenerate: "重新生成",
        compare: "对比",
        styleCopied: "风格已复制到剪贴板！",
        lyricsCopied: "歌词已复制到剪贴板！"
      },
      history: {
        title: "生成历史", empty: "暂无历史记录。开始生成吧！",
        typeStyle: "风格", typeLyrics: "歌词", load: "加载", delete: "删除",
        clearAll: "清空全部", clearConfirm: "确定要删除所有历史记录吗？"
      },
      templates: {
        title: "提示词模板"
      },
      compare: {
        title: "版本对比",
        needAtLeast: "至少需要",
        generationsToCompare: "个生成结果才能对比"
      },
      sunoPreview: {
        title: "Suno 输出预览"
      },
      errors: {
        noProvider: "未配置 API 服务商。请在设置中配置。",
        emptyInput: "请在生成前提供一些输入内容。",
        apiError: "API 错误：", networkError: "网络错误。请检查网络连接和 API 设置。",
        unknownError: "发生了意外错误。"
      }
    }
  };

  function init() {
    strings = langData[currentLang] || langData['en'];
    applyTranslations();
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('spb-lang', lang);
    strings = langData[lang] || langData['en'];
    applyTranslations();
  }

  function getLang() {
    return currentLang;
  }

  function t(key) {
    const keys = key.split('.');
    let val = strings;
    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k];
      } else {
        // Fallback to English
        val = langData['en'];
        for (const fk of keys) {
          if (val && typeof val === 'object' && fk in val) {
            val = val[fk];
          } else {
            return key;
          }
        }
        return val;
      }
    }
    return val;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = t(key);
    });
    // Dispatch event for dynamic components
    document.dispatchEvent(new CustomEvent('langChanged', { detail: { lang: currentLang } }));
  }

  return { init, setLanguage, getLang, t, applyTranslations };
})();
