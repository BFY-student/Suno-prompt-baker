const MetaTags = (() => {
  const tags = {
    structure: [
      { tag: '[Intro]', desc: 'Song introduction' },
      { tag: '[Verse 1]', desc: 'First verse' },
      { tag: '[Verse 2]', desc: 'Second verse' },
      { tag: '[Verse 3]', desc: 'Third verse' },
      { tag: '[Pre-Chorus]', desc: 'Build before chorus' },
      { tag: '[Chorus]', desc: 'Main hook/refrain' },
      { tag: '[Bridge]', desc: 'Contrasting section' },
      { tag: '[Outro]', desc: 'Song ending' },
      { tag: '[Interlude]', desc: 'Instrumental break' },
      { tag: '[Break]', desc: 'Rhythmic break' },
      { tag: '[Hook]', desc: 'Catchy melodic phrase' },
      { tag: '[Refrain]', desc: 'Repeated lyrical phrase' }
    ],
    energy: [
      { tag: '[Energy: Low]', desc: 'Quiet, sparse arrangement' },
      { tag: '[Energy: Medium]', desc: 'Moderate dynamics' },
      { tag: '[Energy: High]', desc: 'Maximum frequency saturation' },
      { tag: '[Zenith intensity]', desc: 'Peak energy moment' },
      { tag: '[Minimal]', desc: 'Stripped down arrangement' },
      { tag: '[Full band]', desc: 'All instruments present' },
      { tag: '[Quiet arrangement]', desc: 'Soft, intimate dynamics' },
      { tag: '[Explosive]', desc: 'Sudden high energy burst' }
    ],
    tension: [
      { tag: '[Build]', desc: 'Gradual intensity increase' },
      { tag: '[Drop]', desc: 'Sudden release of tension' },
      { tag: '[Breakdown]', desc: 'Stripped elements, rhythmic focus' },
      { tag: '[Gradual swell]', desc: 'Slow crescendo' },
      { tag: '[Sudden stop]', desc: 'Abrupt silence' },
      { tag: '[Fade in]', desc: 'Gradual volume increase' },
      { tag: '[Fade out]', desc: 'Gradual volume decrease' },
      { tag: '[Crescendo]', desc: 'Building loudness' },
      { tag: '[Decrescendo]', desc: 'Decreasing loudness' }
    ],
    vocal: [
      { tag: '[Gritty]', desc: 'Raw, textured vocal quality' },
      { tag: '[Breathy]', desc: 'Airy, whispered vocal tone' },
      { tag: '[Layered Vocals]', desc: 'Multiple vocal tracks' },
      { tag: '[Auto-tuned]', desc: 'Digitally pitch-corrected' },
      { tag: '[Falsetto]', desc: 'High register, light voice' },
      { tag: '[Belting]', desc: 'Powerful, high-energy singing' },
      { tag: '[Whisper]', desc: 'Very soft, intimate vocal' },
      { tag: '[Aggressive delivery]', desc: 'Intense, forceful vocal' },
      { tag: '[Smooth delivery]', desc: 'Polished, controlled vocal' },
      { tag: '[Raspy]', desc: 'Rough, gravelly vocal texture' }
    ],
    harmonic: [
      { tag: '[Key change]', desc: 'Modulation to new key' },
      { tag: '[Modulation]', desc: 'Harmonic shift' },
      { tag: '[Circle of fifths]', desc: 'Classic progression pattern' },
      { tag: '[Enharmonic modulation]', desc: 'Pivot chord key change' },
      { tag: '[Neapolitan chord]', desc: 'Flat-II major chord' },
      { tag: '[Diminished seventh]', desc: 'Tense harmonic color' },
      { tag: '[Suspended harmony]', desc: 'Unresolved chord tension' },
      { tag: '[Chromatic descent]', desc: 'Stepwise harmonic movement' }
    ],
    dsp: [
      { tag: '(*Low Pass Filter*)', desc: 'Removes high frequencies' },
      { tag: '(*High Pass Filter*)', desc: 'Removes low frequencies' },
      { tag: '(*Reverb*)', desc: 'Spatial echo effect' },
      { tag: '(*Delay*)', desc: 'Time-based echo effect' },
      { tag: '(*Tape saturation*)', desc: 'Analog warmth effect' },
      { tag: '(*Distortion*)', desc: 'Harmonic saturation' },
      { tag: '(*Sidechain compression*)', desc: 'Pumping rhythm effect' },
      { tag: '(*Phaser*)', desc: 'Sweeping frequency effect' },
      { tag: '(*Flanger*)', desc: 'Jet plane sweep effect' },
      { tag: '(*Chorus effect*)', desc: 'Doubling thickening' }
    ]
  };

  function getAll() {
    return tags;
  }

  function getCategory(category) {
    return tags[category] || [];
  }

  return { getAll, getCategory };
})();
