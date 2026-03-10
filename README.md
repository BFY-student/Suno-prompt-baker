# Suno Prompt Baker v3.0

A comprehensive, research-backed web application for crafting **style prompts**, **lyrics**, and **generating songs** with [Suno AI](https://suno.com). Implements 19+ advanced features based on peer-reviewed prompt engineering research.

![Version](https://img.shields.io/badge/version-3.0-orange)
![Dark Theme](https://img.shields.io/badge/theme-dark-1a1a2e)
![No Build](https://img.shields.io/badge/build-none%20required-green)
![Bilingual](https://img.shields.io/badge/language-EN%20%7C%20%E4%B8%AD%E6%96%87-orange)

**No server, no build step — just open `index.html` in your browser.**

---

## What's New in v3.0

- **Melody Baker** — Full song generation tab powered by Suno's Custom Mode API (`chirp-v5`). Auto-fills title, style, and lyrics from previous Style Baker and Lyrics Baker outputs. Generates 2 tracks, streams audio in-browser, and auto-downloads WAV files with staggered timing to avoid browser blocking prompts.
- **Song History** — Generated songs are saved to History with their task ID. Clicking "Download WAV" in History re-fetches clip IDs and downloads directly from `cdn1.suno.ai`.
- **Vocal ordering fix** — Vocal style/texture now appears **2nd** in the style prompt (immediately after genre), not last. Suno's NLP tokenizer weights early tokens more heavily — placing vocals last in a long string caused them to be ignored, producing wrong-gender results.
- **Vocal-first safety reorder** — Melody Baker automatically moves vocal keywords to position 2 in the tags string before submitting, fixing any already-baked prompts that used the old ordering.
- **Chinese translation for Melody Baker** — All Melody Baker labels, statuses, and notifications are fully translated for 中文 mode.

---

## What's New in v2.2

- **AI Generate for Theme/Concept/Story** — One-click concept generation in Lyrics Baker, drawing from the generated style prompt and freeform description. Uses temperature 1.2 + rotating creative angles (10 narrative perspectives) to produce varied results on every click.
- **Suno Settings panel relocated** — Recommended Weirdness/Style Influence values now appear directly above the style prompt textarea, with a compact inline layout.
- **Genre-first prompt ordering** — Style prompts now lead with Genre/Era before Mood, matching Suno's left-to-right token weighting for stronger genre fidelity.
- **Song title genre enforcement** — Lyrics Baker title format (`Genre - Title - VocalType`) now explicitly requires a music genre word — never a mood or emotion word.
- **Variable temperature API** — `API.generate()` accepts an optional `options` parameter for per-call temperature control.

---

## What's New in v2.1

- **Local LLM support** — Connect to Ollama or LM Studio with pre-filled base URL and API key. No cloud API key required.
- **Active provider badge** — The currently selected provider is shown in the top-right corner of the header at all times.
- **Suno orange theme** — UI accent color updated to match Suno's brand orange.

---

## What's New in v2.0

- **Scaffolding Mode** — 3-phase phonetic workflow to prevent syllabic compression
- **Section Chain Mode** — Generate lyrics section-by-section with editable progress
- **Energy Arc Mapping** — Control dynamic progression with repetition counts
- **Exact BPM Control** — Mathematical rhythmic grid locking (40–220 BPM)
- **Production/Mix Layer** — 20 professional mastering characteristics with tooltips
- **Blueprint Prompting** — Narrative prose mode for V4.5/V5 transformer processing
- **Template Library** — 5 pre-built case study templates
- **Voice Type & Character** — Reorganized vocals: Type (gender/delivery) + Character (tone/texture)
- **Meta-Tag Palette** — 60+ insertable tags across 6 categories
- **Version Comparison** — A/B testing with parameter diff highlighting
- **Custom Instruments** — Add instruments not in the preset list
- **Real-Time Validation** — Overstuffing warnings, conflict detection, vagueness checking
- **Character Counter** — Quality indicators (Optimal <120, Acceptable <200, Poor 200+)

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
6. **Melody Baker** → Add Suno API key → "Generate Song" *(auto-filled from steps 4–5)*

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
- **Production/Mix Quality** — 20 characteristics with hover tooltips
- **Exclusions** — Negative prompt filtering
- **Era/Aesthetic** — Vintage, 80s, Modern, etc.

**Advanced:**
- **Prompt Mode Toggle:** Keyword (Classic) or Blueprint (Narrative prose for V4.5/V5)
- **Template Library** — Load pre-built templates for common genres
- **Real-Time Validation** — Warns against overstuffing, conflicts, vague terms
- **Character Counter** — Shows prompt quality (green / yellow / red)
- **Suno Guidance** — Recommends Weirdness/Style Influence percentages per genre

**Output:**
- Optimized style prompt (<120 chars recommended)
- Auto-passes to Lyrics Baker and Melody Baker
- Version saved for comparison

---

### Lyrics & Arrangement Baker

**Generation Modes:**

**1. Full Generation**
Provide theme/concept → complete song with structure and lyrics. Use **AI Generate** to auto-create a concept from the style prompt (10 rotating creative angles, temperature 1.2).

**2. Expand / Complete**
Paste partial lyrics → AI structures and expands.

**3. Section Chain**
Generate section-by-section (Intro → Verse → Chorus → etc.). Editable progress tracker.

**4. Scaffolding Mode**
- **Phase 1:** Generate phonetic template (vowel sounds, syllable patterns)
- **Phase 2:** Lock melodic motif
- **Phase 3:** Inject semantic lyrics (match syllable count exactly)

**Advanced:**
- **Energy Arc Mapping** — Set energy level + repetition count per section
- **Meta-Tag Toolbar** — Insert 60+ tags (structure, energy, vocal, harmonic, DSP)
- **Language Support** — 12 languages with auto-suggestion based on genre
- **Instrumental Mode** — Pure instrumental arrangements
- **Duration Control** — Short / Medium / Long

---

### Melody Baker *(New in v3.0)*

End-to-end song generation powered by the Suno API:

- **Auto-fill** — Title, style prompt, and lyrics are pulled automatically from Style Baker and Lyrics Baker outputs
- **Readiness check** — Blocks generation with a clear warning if style or lyrics haven't been baked yet
- **Model** — Always uses `chirp-v5` (Suno's latest)
- **Separate API key** — Uses its own Suno API key stored independently
- **In-browser playback** — Both generated tracks can be played directly in the app
- **WAV auto-download** — Downloads start automatically after generation; staggered 8 seconds apart to prevent the browser from blocking simultaneous downloads
- **History integration** — Songs saved to History with task ID; "Download WAV" re-fetches and downloads directly from `cdn1.suno.ai`
- **Vocal-first reorder** — Vocal keywords are moved to position 2 in the tags string before submitting, ensuring Suno's NLP tokenizer respects the vocal direction regardless of prompt ordering

---

### General Features

- 🌍 **Bilingual** — English / 中文 with one-click toggle
- 🎨 **Dark Theme** — Music production aesthetic, Suno orange accent
- 📱 **Responsive** — Desktop and tablet optimized
- 💾 **History** — Last 50 generations stored in localStorage (style, lyrics, songs)
- 🔒 **Privacy** — API keys never leave your browser
- 🔄 **Version Comparison** — Compare multiple generations side-by-side
- 📊 **Parameter Diff** — Highlights what changed between versions

**API Support:**
- **OpenAI-Compatible** — GPT, DeepSeek, Groq, Together AI, and more
- **Google Gemini** — Gemini 2.0 Flash, Gemini Pro
- **Local LLM** — Ollama, LM Studio (any OpenAI-compatible local server)
- **Suno API** — Via n1n.ai proxy (Melody Baker)

---

## Research Principles Applied

### Algorithmic Prompt Formula
```
[Genre] + [Vocal Style/Texture] + [Era/Aesthetic] + [Mood] + [Key Instruments] + [Production] + [BPM]
```

NLP tokenizers weight left-to-right — genre leads to anchor the style, and vocal direction appears immediately after so it is never buried by a long instrument list.

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
Indie Folk, Female Vocal, Breathy, Melancholic, Acoustic Guitar, Soft Piano, Clean production, 102 BPM
```
*(Vocal appears 2nd for maximum token weight)*

### Style Prompt (Blueprint Mode)
```
An Indie Folk track built on sparse acoustic guitar fingerpicking, establishing a melancholic mood from
the first bar. The female vocal is breathy and intimate throughout. A soft piano enters at the 8-bar
mark with gentle harmonic support, locked at 102 BPM with clean production.
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

---

## Project Structure

```
Suno-prompt-baker-main/
├── index.html           Main app (all UI components)
├── css/
│   └── style.css        Dark theme, responsive styling
├── js/
│   ├── app.js           Main coordinator, modals, notifications
│   ├── api.js           API abstraction (OpenAI / Gemini / Local LLM)
│   ├── style-baker.js   Style generation, templates, validation
│   ├── lyrics-baker.js  Lyrics generation, scaffolding, energy arc
│   ├── melody-baker.js  Song generation via Suno API, WAV download
│   ├── history.js       localStorage history management
│   ├── i18n.js          Bilingual strings (EN / 中文)
│   ├── instruments.js   Instrument database by register
│   ├── meta-tags.js     60+ meta-tag database
│   ├── templates.js     5 case study templates
│   ├── validation.js    Conflict/vagueness detection
│   └── versions.js      A/B comparison backend
└── README.md
```

---

## Tech Stack

- **Vanilla HTML / CSS / JavaScript** — No frameworks, no build tools
- **Pure client-side** — All processing in your browser
- **LocalStorage** — History and settings persistence
- **No backend required** — Works from `file://` or any static server

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
