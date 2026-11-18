(function (root) {
  'use strict';
  function calculateTraits(questions, answers) {
    if (questions.length !== answers.length || !questions.length) throw new Error('Complete every question.');
    const totals = [0, 0, 0, 0];
    questions.forEach(function (question, index) {
      const answer = answers[index];
      if (!Number.isInteger(answer) || !question.options[answer]) throw new Error('Invalid answer.');
      question.options[answer].scores.forEach(function (score, trait) { totals[trait] += score; });
    });
    const maxScore = questions.length * 3;
    return totals.map(total => Math.round(total / maxScore * 100));
  }
  function rankCharacters(characters, traits) {
    // Sort ties by ID so rearranging the JSON file doesn't change the result.
    return characters.map(function (character) {
      const distance = character.profile.reduce(function (sum, value, index) {
        return sum + Math.abs(value - traits[index]);
      }, 0);
      return { character, distance };
    }).sort((a, b) => a.distance - b.distance || a.character.id.localeCompare(b.character.id));
  }
  const api = { calculateTraits, rankCharacters };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.QuizScoring = api;
})(typeof window !== 'undefined' ? window : globalThis);
