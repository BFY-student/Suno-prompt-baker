const InstrumentDB = (() => {
  const data = {
    high: [
      'Piccolo', 'Flute', 'Violin', 'Soprano Saxophone', 'Glockenspiel',
      'Celesta', 'Whistle', 'Female Humming', 'Harmonica (High)',
      'Mandolin', 'Ukulele', 'Bells', 'Synth Lead', 'Triangle',
      'Xylophone', 'Harp (Upper)', 'Oboe', 'Recorder', 'Banjo',
      'Music Box', 'Chimes', 'Clavinet', 'Sitar (High)', 'Steel Drum'
    ],
    mid: [
      'Piano', 'Acoustic Guitar', 'Electric Guitar', 'Clarinet',
      'Trumpet', 'Alto Saxophone', 'Viola', 'Cello (Upper Range)',
      'Organ', 'Male Humming', 'Accordion', 'Marimba', 'Synth Pad',
      'Voice (Spoken)', 'French Horn', 'Tenor Saxophone', 'Trombone',
      'Vibraphone', 'Electric Piano', 'Rhodes', 'Wurlitzer',
      'Mellotron', 'Sitar', 'Erhu', 'Kalimba', 'Strings Ensemble',
      'Brass Section', 'Pad (Warm)', 'Pad (Choir)', 'Arp Synth'
    ],
    low: [
      'Bass Guitar', 'Double Bass', 'Cello (Lower Range)', 'Tuba',
      'Baritone Saxophone', 'Bassoon', 'Timpani', 'Bass Drum',
      'Low Synth', 'Male Bass Voice', 'Didgeridoo',
      'Pipe Organ (Pedals)', '808 Bass', 'Sub Bass', 'Contrabassoon',
      'Bass Clarinet', 'Taiko Drum', 'Floor Tom', 'Kick Drum',
      'Synth Bass', 'Moog Bass', 'Tuba', 'Bass Trombone',
      'Low Strings', 'Conga', 'Djembe'
    ]
  };

  function getAll() {
    return data;
  }

  function getByRegister(register) {
    return data[register] || [];
  }

  function search(query) {
    const q = query.toLowerCase();
    const results = { high: [], mid: [], low: [] };
    for (const [register, instruments] of Object.entries(data)) {
      results[register] = instruments.filter(i => i.toLowerCase().includes(q));
    }
    return results;
  }

  return { getAll, getByRegister, search };
})();
