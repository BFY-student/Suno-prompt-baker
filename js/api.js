const API = (() => {
  const STORAGE_KEY = 'spb-api-config';

  const defaults = {
    openai: {
      baseUrl: 'https://api.openai.com/v1',
      apiKey: '',
      model: 'gpt-4o'
    },
    gemini: {
      baseUrl: 'https://generativelanguage.googleapis.com',
      apiKey: '',
      model: 'gemini-2.0-flash'
    }
  };

  function loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return {
      providers: {
        openai: { ...defaults.openai },
        gemini: { ...defaults.gemini }
      },
      active: ''
    };
  }

  function saveConfig(config) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }

  function getConfig() {
    return loadConfig();
  }

  function getActiveProvider() {
    const config = loadConfig();
    return config.active;
  }

  function isConfigured() {
    const config = loadConfig();
    if (!config.active) return false;
    const provider = config.providers[config.active];
    return provider && provider.apiKey && provider.model;
  }

  async function testConnection(providerType) {
    const config = loadConfig();
    const provider = config.providers[providerType];
    if (!provider || !provider.apiKey) {
      throw new Error('API key not set');
    }

    if (providerType === 'openai') {
      return await testOpenAI(provider);
    } else if (providerType === 'gemini') {
      return await testGemini(provider);
    }
    throw new Error('Unknown provider type');
  }

  async function testOpenAI(provider) {
    const url = `${provider.baseUrl.replace(/\/+$/, '')}/chat/completions`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5
      })
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`${resp.status}: ${err}`);
    }
    return true;
  }

  async function testGemini(provider) {
    const baseUrl = provider.baseUrl.replace(/\/+$/, '');
    const url = `${baseUrl}/v1beta/models/${provider.model}:generateContent?key=${provider.apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hi' }] }],
        generationConfig: { maxOutputTokens: 5 }
      })
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`${resp.status}: ${err}`);
    }
    return true;
  }

  async function generate(systemPrompt, userPrompt) {
    const config = loadConfig();
    if (!config.active) {
      throw new Error('No active API provider configured');
    }
    const provider = config.providers[config.active];
    if (!provider || !provider.apiKey) {
      throw new Error('API key not configured');
    }

    if (config.active === 'openai') {
      return await generateOpenAI(provider, systemPrompt, userPrompt);
    } else if (config.active === 'gemini') {
      return await generateGemini(provider, systemPrompt, userPrompt);
    }
    throw new Error('Unknown provider type');
  }

  async function generateOpenAI(provider, systemPrompt, userPrompt) {
    const url = `${provider.baseUrl.replace(/\/+$/, '')}/chat/completions`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8
      })
    });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`API ${resp.status}: ${errText}`);
    }
    const data = await resp.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  }

  async function generateGemini(provider, systemPrompt, userPrompt) {
    const baseUrl = provider.baseUrl.replace(/\/+$/, '');
    const url = `${baseUrl}/v1beta/models/${provider.model}:generateContent?key=${provider.apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.8 }
      })
    });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`API ${resp.status}: ${errText}`);
    }
    const data = await resp.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  }

  return { getConfig, saveConfig, getActiveProvider, isConfigured, testConnection, generate, defaults };
})();
