const Templates = (() => {
  const templates = [
    {
      id: 'structured-pop',
      name: 'Structured Pop (Energy Dynamics)',
      description: 'Radio-ready pop with clear dynamic contrast and energy progression. Demonstrates proper use of Energy Mechanics tags.',
      tags: ['Pop', 'Energy Control', 'Dynamic Contrast'],
      genre: ['Pop'],
      moods: ['Uplifting'],
      tempo: 'Medium',
      bpm: 102,
      vocals: ['Female Vocal'],
      vocalTexture: ['Breathy'],
      instruments: {
        high: ['Synth Lead'],
        mid: ['Acoustic Guitar', 'Piano'],
        low: []
      },
      production: ['Clean radio mix'],
      stylePrompt: 'Modern pop, emotional female vocals, bright synths + acoustic guitar blend, clean radio mix, mid-tempo 102 BPM, uplifting but bittersweet',
      lyricsBlueprint: `[Mood: Introspective]
[Energy: Medium]

[Intro]
(Sparse acoustic guitar, soft atmospheric pads)

[Verse 1]
Walking through the static, trying to find the signal
Every shadow shifting in the pale moonlight

[Pre-Chorus]
(Synths begin to swell, rhythmic hi-hats enter)
The frequency is rising, I can feel it in my bones

[Chorus]
[Energy: High]
[Layered Vocals]
THIS IS THE SIGNAL BREAKING THROUGH!
A brilliant flash of neon blue!

(Drop all drums. Just piano and breathy vocals)
Can you hear it? Can you hear it?

[Outro]
[Zenith intensity]
(Full band return)
Breaking through!

(Fade out)`,
      sunoSettings: {
        weirdness: '20-40%',
        styleInfluence: '80-85%',
        notes: 'Low weirdness for radio-ready structure. High Style Influence ensures BPM lock.'
      }
    },
    {
      id: 'dark-electronic',
      name: 'Dark Electronic Instrumental (Timbre Focus)',
      description: 'Repetitive techno track with specific DSP instructions using asterisk trick to prevent vocal hallucination.',
      tags: ['Electronic', 'Instrumental', 'DSP Control'],
      genre: ['Techno'],
      moods: ['Dark', 'Mysterious'],
      tempo: 'Medium-Fast',
      bpm: 128,
      vocals: ['Instrumental (No Vocals)'],
      vocalTexture: [],
      instruments: {
        high: ['Metallic Synth'],
        mid: ['909 Hats'],
        low: ['Sub Bass', '808 Bass']
      },
      production: ['Analog tape saturation', 'Dark warehouse'],
      exclusions: 'no vocals',
      stylePrompt: '[Instrumental] Dark warehouse techno, rolling sub bassline, metallic synth stabs, 909 hats, hypnotic repetition, analog tape saturation, 128 BPM',
      lyricsBlueprint: `[Intro]
(Slow filter sweep, isolated kick drum)

(Introduce metallic synth stabs and 909 hats)

(*Low Pass Filter*)

(Maximum intensity rolling bassline)

(Granular textures and tape delay effects)`,
      sunoSettings: {
        weirdness: '60-70%',
        styleInfluence: '70%',
        notes: 'Higher weirdness for experimental textures. [Instrumental] tag at start suppresses vocals.'
      }
    },
    {
      id: 'cinematic-score',
      name: 'Cinematic Score (Narrative Blueprinting)',
      description: 'Orchestral piece using narrative prompting for Director\'s Perspective. Demonstrates custom structural tags.',
      tags: ['Orchestral', 'Cinematic', 'Blueprint Mode'],
      genre: ['Classical'],
      moods: ['Epic', 'Mysterious'],
      tempo: 'Slow',
      bpm: 90,
      vocals: ['Instrumental (No Vocals)'],
      vocalTexture: [],
      instruments: {
        high: ['Violin'],
        mid: ['Cello', 'French Horn'],
        low: ['Double Bass', 'Timpani']
      },
      production: ['Wide spatial mix', 'Film soundtrack energy'],
      stylePrompt: 'Cinematic orchestral score, string ostinatos, heavy brass swells, taiko drums, emotional arcs, film soundtrack energy, wide spatial mix, slow build 80-120 BPM',
      lyricsBlueprint: `[Intro]
[Quiet arrangement]
A single melancholic cello plays a slow, mournful melody. Faint wind ambiance.

[Movement 1]
[Gradual swell]
Violin section joins the cello. The harmony shifts to a major key, providing a sense of yielding resolution.

[Movement 2]
[Ominous uplift]
Tempo increases. Staccato string ostinatos begin. French horns enter with a dark counter-melody.

[Climax]
[Orchestral swell]
Massive taiko drums strike. Full brass section blares a triumphant, zenith intensity motif.

[Outro]
[Zeroing resolution]
Sudden stop. A single sustained violin note fades into the reverb tail.`,
      sunoSettings: {
        weirdness: '40-50%',
        styleInfluence: '85%',
        notes: 'Blueprint mode works best for complex, evolving compositions. Custom tags like [Movement 1] guide structure.'
      }
    },
    {
      id: 'uk-drill',
      name: 'UK Drill (Vocal Cadence & Rhythm)',
      description: 'Fast-paced drill track with vocal performance tags for syllabic phrasing control.',
      tags: ['Hip-Hop', 'Drill', 'Vocal Control'],
      genre: ['Drill', 'Hip-Hop'],
      moods: ['Aggressive', 'Dark'],
      tempo: 'Medium-Fast',
      bpm: 142,
      vocals: ['Rap', 'Male Vocal'],
      vocalTexture: ['Aggressive delivery'],
      instruments: {
        high: ['Hi-Hat'],
        mid: [],
        low: ['Sliding 808s']
      },
      production: ['Crisp dark production', 'Heavy sidechain compression'],
      stylePrompt: 'UK drill, sliding 808s, aggressive male rap, dramatic minor-key strings, crisp dark production, fast hi-hats, 142 BPM',
      lyricsBlueprint: `[Intro]
(Eerie strings fade in, a single sliding 808 hits)

[Verse 1]
[Aggressive delivery]
Step in the room and the temperature drops
Moving in silence, avoiding the cops

(Gunshot FX)

Check the perimeter, watch how I move
Nothing to lose, got nothing to prove

[Chorus]
YEAH WE SLIDING THROUGH THE NIGHT!
KEEP THE CIRCLE TIGHT!`,
      sunoSettings: {
        weirdness: '30%',
        styleInfluence: '80%',
        notes: 'Low weirdness keeps drill structure tight. Explicit BPM and [Aggressive delivery] tag lock rhythm.'
      }
    },
    {
      id: 'ambient-soundscape',
      name: 'Ambient Soundscape (Prompt Chaining)',
      description: 'Evolving ambient texture designed for multi-stage generation. Use Section Chain mode for best results.',
      tags: ['Ambient', 'Experimental', 'Chaining'],
      genre: ['Ambient'],
      moods: ['Dreamy', 'Ethereal'],
      tempo: 'Slow',
      bpm: 60,
      vocals: ['Instrumental (No Vocals)'],
      vocalTexture: [],
      instruments: {
        high: ['Bells', 'Synth Lead'],
        mid: ['Pad (Warm)', 'Mellotron'],
        low: []
      },
      production: ['Natural flow', 'No percussion', 'Field recordings'],
      exclusions: 'no percussion',
      stylePrompt: 'Ambient Soundscape, evolving pads, long-attack synths, granular textures, faint field recordings, natural flow, no percussion, 60 BPM',
      lyricsBlueprint: `[Intro]
[Fluid movement]
(Deep drone synthesis begins. Slowly introduce distant wind field recordings.)

(Pads slowly open their filter frequency. A sense of expansive horizon.)

Note: For extended ambient pieces, generate this in 30-second segments using Chain Mode, feeding each output back as context for the next section.`,
      sunoSettings: {
        weirdness: '70-80%',
        styleInfluence: '60%',
        notes: 'High weirdness for experimental textures. Lower Style Influence allows AI creativity for ambient evolution.'
      }
    }
  ];

  function getAll() {
    return templates;
  }

  function getById(id) {
    return templates.find(t => t.id === id);
  }

  return { getAll, getById };
})();
