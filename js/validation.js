const Validation = (() => {
  // Vague terms that provide no actionable data
  const vagueTerms = [
    'nice', 'cool', 'good', 'great', 'awesome', 'amazing', 'sick', 'fire',
    'dope', 'lit', 'banging', 'vibes', 'chill vibes', 'good beat', 'nice sound'
  ];

  // Mood conflict matrix
  const moodConflicts = {
    'Peaceful': ['Aggressive', 'Intense', 'Energetic'],
    'Aggressive': ['Peaceful', 'Dreamy', 'Chill'],
    'Melancholic': ['Joyful', 'Uplifting', 'Triumphant'],
    'Joyful': ['Melancholic', 'Somber', 'Dark'],
    'Dark': ['Joyful', 'Uplifting', 'Playful'],
    'Energetic': ['Peaceful', 'Chill', 'Dreamy'],
    'Minimal': ['Epic', 'Intense'],
    'Epic': ['Minimal', 'Intimate']
  };

  // Suggestions for vague terms
  const vagueSuggestions = {
    'nice beat': 'syncopated drum pattern, offbeat hi-hats, 808 kick',
    'cool sound': 'tape-saturated, lo-fi crunch, vintage synth',
    'good vibes': 'warm major chords, laid-back groove, mellow tempo',
    'chill': 'slow tempo (70 BPM), soft pads, minimal percussion'
  };

  function checkVagueTerms(text) {
    if (!text) return null;
    const lowerText = text.toLowerCase();

    for (const term of vagueTerms) {
      if (lowerText.includes(term)) {
        const suggestion = vagueSuggestions[term] ||
          'Use concrete acoustic parameters: specific BPM, instrument names, production terms';
        return {
          found: term,
          message: `"${term}" is too vague for Suno`,
          suggestion: `Try: ${suggestion}`
        };
      }
    }
    return null;
  }

  function checkMoodConflicts(selectedMoods) {
    if (!selectedMoods || selectedMoods.length < 2) return null;

    for (const mood of selectedMoods) {
      const conflicts = moodConflicts[mood] || [];
      for (const conflict of conflicts) {
        if (selectedMoods.includes(conflict)) {
          return {
            mood1: mood,
            mood2: conflict,
            message: `"${mood}" and "${conflict}" may create conflicting directions`,
            suggestion: 'Choose one primary mood to avoid diluting the output'
          };
        }
      }
    }
    return null;
  }

  function checkOverstuffing(params) {
    const warnings = [];

    // Genre overstuffing (report recommends 1-3)
    if (params.genres && params.genres.length > 3) {
      warnings.push({
        type: 'genres',
        message: `${params.genres.length} genres selected - may cause "keyword soup"`,
        suggestion: 'Limit to 1-3 genres for clean output. Extra genres dilute the acoustic identity.'
      });
    }

    // Instrument overstuffing per register (report recommends 2-3 max)
    ['high', 'mid', 'low'].forEach(register => {
      const count = params.instruments?.[register]?.length || 0;
      if (count > 3) {
        warnings.push({
          type: `instruments-${register}`,
          message: `${count} ${register}-register instruments - may cause muddy separation`,
          suggestion: `Limit to 2-3 instruments per register for frequency clarity`
        });
      }
    });

    // Mood overstuffing
    if (params.moods && params.moods.length > 3) {
      warnings.push({
        type: 'moods',
        message: `${params.moods.length} moods selected - may flatten emotional impact`,
        suggestion: 'Focus on 1-2 primary moods for stronger emotional character'
      });
    }

    return warnings.length > 0 ? warnings : null;
  }

  function checkCharacterLength(text, thresholds = { optimal: 120, acceptable: 200 }) {
    if (!text) return null;
    const length = text.length;

    if (length <= thresholds.optimal) {
      return { length, quality: 'optimal', message: 'Optimal conciseness', color: 'good' };
    } else if (length <= thresholds.acceptable) {
      return { length, quality: 'acceptable', message: 'Acceptable length', color: 'ok' };
    } else {
      return {
        length,
        quality: 'poor',
        message: 'May cause attention dilution',
        color: 'bad',
        suggestion: 'Reduce to under 200 characters for best results'
      };
    }
  }

  return {
    checkVagueTerms,
    checkMoodConflicts,
    checkOverstuffing,
    checkCharacterLength
  };
})();
