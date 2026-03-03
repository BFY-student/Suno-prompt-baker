# Suno Prompt Baker v2.1

A comprehensive, research-backed web application for crafting **style prompts** and **lyrics** for [Suno AI](https://suno.com) music generation. Implements 19+ advanced features based on peer-reviewed prompt engineering research.

![Version](https://img.shields.io/badge/version-2.1-orange)
![Dark Theme](https://img.shields.io/badge/theme-dark-1a1a2e)
![No Build](https://img.shields.io/badge/build-none%20required-green)
![Bilingual](https://img.shields.io/badge/language-EN%20%7C%20%E4%B8%AD%E6%96%87-orange)

**No server, no build step — just open `index.html` in your browser.**

---

## What's New in v2.1

- **Local LLM support** — Connect to Ollama or LM Studio with pre-filled base URL (`http://localhost:11434/v1`) and API key (`ollama`). No cloud API key required.
- **Active provider badge** — The currently selected provider is shown in the top-right corner of the header at all times.
- **Settings UX** — Active provider selector and Save button are now at the top of the settings dialog for faster switching.
- **Suno orange theme** — UI accent color updated to match Suno's brand orange.

---

## What's New in v2.0

### Research-Backed Enhancements
- **Scaffolding Mode** — 3-phase phonetic workflow to prevent syllabic compression
- **Section Chain Mode** — Generate lyrics section-by-section with editable progress
- **Energy Arc Mapping** — Control dynamic progression with repetition counts
- **Exact BPM Control** — Mathematical rhythmic grid locking (40–220 BPM)
- **Production/Mix Layer** — 20 professional mastering characteristics with tooltips
- **Blueprint Prompting** — Narrative prose mode for V4.5/V5 transformer processing
- **Template Library** — 5 pre-built case study templates (Pop, Electronic, Cinematic, Drill, Ambient)
- **Voice Type & Character** — Reorganized vocals: Type (gender/delivery) + Character (tone/texture)
- **Meta-Tag Palette** — 60+ insertable tags across 6 categories
- **Version Comparison** — A/B testing with parameter diff highlighting
- **Custom Instruments** — Add instruments not in the preset list with + buttons
- **Real-Time Validation** — Overstuffing warnings, conflict detection, vagueness checking
- **Character Counter** — Quality indicators (Optimal <120, Acceptable <200, Poor 200+)
- **Suno Parameter Guidance** — Genre-specific Weirdness/Style Influence recommendations
- **Expanded Language Support** — 12 languages including Spanish, Japanese, Korean, Portuguese, German, Hindi, Arabic
- **Optimized Token Ordering** — Research-backed `[Mood] + [Genre] + [Instruments] + [Production] + [BPM] + [Vocal]` sequence

---

## Quick Start

1. **Download** this repository (or clone it)
2. **Open `index.html`** in your browser
3. **Configure API** (⚙️ Settings icon) — choose a provider at the top, fill in credentials, hit **Save**:

   | Provider | What to fill in |
   |---|---|
   | OpenAI-Compatible | Base URL + API key + model name |
   | Google Gemini | API key + model name |
   | Local LLM (Ollama) | Pre-filled — just pick the model you have pulled |

   > **Local LLM / CORS note:** If you open the app via `file://`, Ollama will block requests.
   > Fix it one of two ways:
   > - Restart Ollama with: `OLLAMA_ORIGINS=* ollama serve`
   > - Or serve the folder: `python3 -m http.server 8000` then open `http://localhost:8000`

4. **Style Baker** → Select parameters → "Bake Style"
5. **Lyrics Baker** → Choose mode → "Bake Lyrics"
6. **Copy & Paste** into Suno

---

## Features Overview

### Style Prompt Baker

**Core:**
- **Genre & Mood Selection** — Multi-select chips with validation
- **BPM Control** — Tempo dropdown + numeric BPM override (40–220)
- **Voice Type** — Gender and delivery style (Male/Female/Rap/Operatic/etc.)
- **Voice Character** — Tone quality and texture (Gritty/Breathy/Warm/etc.) — *optional*
- **Instruments** — Organized by register (High/Mid/Low) with search + AI suggestions
- **Custom Instruments** — Add your own with **+** buttons
- **Production/Mix Quality** — 20 characteristics (Tape saturated, Wide stereo, etc.) with hover tooltips
- **Exclusions** — Negative prompt filtering (e.g., "no vocals, no piano")
- **Era/Aesthetic** — Vintage, 80s, Modern, etc.

**Advanced:**
- **Prompt Mode Toggle:**
  - **Keyword Mode** (Classic) — Comma-separated tags, optimized ordering
  - **Blueprint Mode** (Narrative) — Prose descriptions for V4.5/V5
- **Template Library** — Load pre-built templates for common genres
- **Genre Presets** — One-click instrument loading (11 genres)
- **Real-Time Validation** — Warns against overstuffing, conflicts, vague terms
- **Character Counter** — Shows prompt quality (green / yellow / red)
- **Suno Guidance** — Recommends Weirdness/Style Influence percentages per genre

**Output:**
- Optimized style prompt (<120 chars recommended)
- Auto-passes to Lyrics Baker
- Version saved for comparison

---

### Lyrics & Arrangement Baker

**Generation Modes:**

**1. Full Generation**
Provide theme/concept → complete song with structure and lyrics.

**2. Expand / Complete**
Paste partial lyrics → AI structures and expands.

**3. Section Chain**
Generate section-by-section (Intro → Verse → Chorus → etc.). Editable progress tracker — click any section to regenerate.

**4. Scaffolding Mode**
- **Phase 1:** Generate phonetic template (vowel sounds, syllable patterns)
- **Phase 2:** Lock melodic motif (review/edit template)
- **Phase 3:** Inject semantic lyrics (match syllable count exactly)

Prevents syllabic hyper-compression in Suno V4/V5.

**Advanced:**
- **Energy Arc Mapping** — Set energy level (Low/Medium/High/Zenith) + repetition count per section
- **Meta-Tag Toolbar** — Insert 60+ tags (structure, energy, vocal, harmonic, DSP)
- **Language Support** — 12 languages with auto-suggestion based on genre (K-Pop → Korean)
- **Instrumental Mode** — Pure instrumental arrangements with no lyrics
- **Duration Control** — Short (~2 min) / Medium (~3 min) / Long (~4+ min)
- **Auto-Generated Title** — Format: `Genre - Song Title - Vocal Type`

---

### General Features

- 🌍 **Bilingual** — English / 中文 with one-click toggle
- 🎨 **Dark Theme** — Music production aesthetic, Suno orange accent
- 📱 **Responsive** — Desktop and tablet optimized
- 💾 **History** — Last 50 generations stored in localStorage
- 🔒 **Privacy** — API keys never leave your browser
- 🔄 **Version Comparison** — Compare multiple generations side-by-side
- 📊 **Parameter Diff** — Highlights what changed between versions

**API Support:**
- **OpenAI-Compatible** — GPT, DeepSeek, Groq, Together AI, and more
- **Google Gemini** — Gemini 2.0 Flash, Gemini Pro
- **Local LLM** — Ollama, LM Studio (any OpenAI-compatible local server)
- **Connection Testing** — Verify setup before generation

---

## Research Principles Applied

### Algorithmic Prompt Formula
```
[Mood] + [Genre/Era] + [Key Instruments (2-3 max)] + [Production] + [BPM] + [Vocal]
```

NLP tokenizers weight left-to-right — most critical elements (mood, genre) receive maximum computational weighting.

### Prompt Layering (Four Layers)
1. **Foundation** — Genre, BPM, lead instrument
2. **Emotional** — Mood, atmosphere
3. **Technical** — Production quality, mix characteristics
4. **Vocal** — Biometric traits, performance style

### Constraint Principles
- **Conciseness** — Target <120 characters (optimal), <200 (acceptable)
- **Specificity** — Concrete parameters (128 BPM) > vague terms (fast tempo)
- **Instrument Limits** — 2–3 per register prevents muddy separation
- **Genre Limits** — 1–3 genres prevents attention dilution

### Meta-Tag Syntax
- **Architectural:** `[Intro]`, `[Verse]`, `[Chorus]`, `[Bridge]`
- **Dynamic:** `[Energy: Low/Medium/High]`, `[Zenith intensity]`
- **Tension:** `[Build]`, `[Drop]`, `[Gradual swell]`
- **Vocal:** `[Gritty]`, `[Breathy]`, `[Aggressive delivery]`
- **Harmonic:** `[Key change]`, `[Circle of fifths]`
- **DSP:** `(*Low Pass Filter*)`, `(*Reverb*)` — *asterisk prevents singing*

---

## Template Library

| # | Name | Focus | Suno Settings |
|---|---|---|---|
| 1 | Structured Pop | Dynamic contrast, energy progression | Weirdness 20–40%, Style Influence 80–85% |
| 2 | Dark Electronic Instrumental | Repetitive techno with DSP control | Weirdness 60–70%, Style Influence 70% |
| 3 | Cinematic Score | Orchestral arc via Blueprint Mode | Weirdness 40–50%, Style Influence 85% |
| 4 | UK Drill | Fast-paced drill, exact BPM lock (142) | Weirdness 30%, Style Influence 80% |
| 5 | Ambient Soundscape | Evolving texture, multi-stage generation | Weirdness 70–80%, Style Influence 60% |

---

## Suno Parameter Cheat Sheet

| Genre | Weirdness | Style Influence | Notes |
|---|---|---|---|
| Pop/Rock | 20–40% | 80–85% | Radio-ready structure |
| Electronic | 50–70% | 70–80% | Experimental textures |
| Ambient | 70–85% | 60% | Maximum creativity |
| Classical | 20–40% | 85% | High fidelity to style |
| Hip-Hop/Drill | 25–45% | 80% | Rhythmic precision |
| **Optimal Default** | **60%** | **80–85%** | Research sweet spot |

### Character Length Guidelines
- **0–120 chars** — Optimal (sharp acoustic identity)
- **121–200 chars** — Acceptable (minor dilution)
- **201+ chars** — Poor (attention dilution, muddy output)

---

## Example Outputs

### Style Prompt (Keyword Mode)
```
Melancholic, Indie Folk, Acoustic Guitar, Soft Piano, Clean production, 102 BPM, Female Vocal, Breathy
```

### Style Prompt (Blueprint Mode)
```
The song opens with a sparse acoustic guitar fingerpicking pattern, establishing a melancholic mood.
A soft piano enters at the 8-bar mark, adding gentle harmonic support. The female vocal is breathy
and intimate, locked at 102 BPM with clean production that preserves the organic texture.
```

### Lyrics with Energy Arc (Section Chain Mode)
```
Indie Folk - Autumn Letters - Female

[Intro]
[Energy: Low]
(Soft acoustic guitar, minimalist)

[Verse 1]
[Energy: Medium]
Autumn leaves are falling down
Painting gold on cobblestone ground...

[Chorus] x2
[Energy: High]
But I'll keep walking through the rain
Carrying the beauty and the pain...
```

### Scaffolding Mode

**Phase 1 — Phonetic Template:**
```
[Verse]
Ah-oh-ee, ee-ah-oh
Mmm-ah-ee, oh-ee-oh
```

**Phase 3 — Semantic Lyrics:**
```
[Verse]
Walking home, feeling low
Memories, letting go
```
*(Each line matches exact syllable count from template)*

---

## Project Structure

```
Suno-prompt-baker-main/
├── index.html          Main app (all UI components)
├── css/
│   └── style.css       Dark theme, responsive styling
├── js/
│   ├── app.js          Main coordinator, modals, notifications
│   ├── api.js          API abstraction (OpenAI / Gemini / Local LLM)
│   ├── style-baker.js  Style generation, templates, validation
│   ├── lyrics-baker.js Lyrics generation, scaffolding, energy arc
│   ├── history.js      localStorage history management
│   ├── i18n.js         Bilingual strings (EN / 中文)
│   ├── instruments.js  Instrument database by register
│   ├── meta-tags.js    60+ meta-tag database
│   ├── templates.js    5 case study templates
│   ├── validation.js   Conflict/vagueness detection
│   └── versions.js     A/B comparison backend
└── README.md
```

---

## Tech Stack

- **Vanilla HTML / CSS / JavaScript** — No frameworks, no build tools
- **Pure client-side** — All processing in your browser
- **LocalStorage** — History and settings persistence
- **No backend required** — Works from `file://` or any static server

---

## Known Limitations

1. **Suno API Integration** — No official public API; workflow is copy-paste based
2. **Multi-Track Stem Separation** — Outside scope
3. **Emoji-Driven Semantic Vectors** — Experimental technique, not implemented

---

## License

MIT License — Free to use, modify, and distribute.

---

## Acknowledgments

- **Research Foundation:** "Comprehensive Research Investigation into Suno Prompt Engineering and Generative Audio Workflows"
- **Case Studies:** 5 annotated examples from research report
- **Community Resources:** Jack Righteous Guides, Suno Meta-Tag databases

---

**Vanilla JavaScript · No frameworks · No build tools · Works in all modern browsers**
