const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { calculateTraits, rankCharacters } = require('../assets/js/scoring.js');
const questions = require('../assets/data/questions.json');
const characters = require('../assets/data/characters.json');

test('Data contains 12 valid questions and 8 distinct, illustrated characters', () => {
  assert.equal(questions.length, 12);
  assert.equal(characters.length, 8);
  assert.equal(new Set(characters.map(c => c.id)).size, 8);
  questions.forEach(q => {
    assert.equal(q.options.length, 4);
    q.options.forEach(o => {
      assert.equal(o.scores.length, 4);
      o.scores.forEach(s => assert.ok(Number.isInteger(s) && s >= 0 && s <= 3));
    });
  });
  characters.forEach(c => {
    assert.equal(c.profile.length, 4);
    c.profile.forEach(s => assert.ok(s >= 0 && s <= 100));
    assert.ok(fs.statSync(path.join(__dirname, '../assets/images', c.id + '.png')).size > 1000);
  });
});
test('Known answers produce a predictable average, not a random result', () => {
  const sample = [{ options: [{ scores: [3, 0, 2, 1] }] }, { options: [{ scores: [0, 3, 2, 2] }] }];
  assert.deepEqual(calculateTraits(sample, [0, 0]), [50, 50, 67, 50]);
  assert.deepEqual(rankCharacters(characters, characters[0].profile)[0].character.id, 'knight');
});
test('Incomplete or invalid answers cannot produce a result', () => {
  for (const invalid of [[], new Array(12).fill(null), new Array(12).fill(-1), new Array(12).fill(4), new Array(12).fill('0')]) {
    assert.throws(() => calculateTraits(questions, invalid));
  }
});
test('Changing an answer replaces its contribution instead of adding twice', () => {
  const answers = new Array(12).fill(0);
  const first = calculateTraits(questions, answers);
  answers[0] = 1;
  assert.notDeepEqual(calculateTraits(questions, answers), first);
  answers[0] = 0;
  assert.deepEqual(calculateTraits(questions, answers), first);
});
test('A tied distance uses a stable ID order', () => {
  const tied = [{ id: 'z', profile: [0, 0, 0, 0] }, { id: 'a', profile: [0, 0, 0, 0] }];
  assert.equal(rankCharacters(tied, [50, 50, 50, 50])[0].character.id, 'a');
});
test('All eight characters can be reached with actual quiz answers', () => {
  // Deterministic pseudo-random exploration guards against unreachable profiles.
  let seed = 203;
  const reached = new Set();
  for (let i = 0; i < 100000 && reached.size < characters.length; i++) {
    const answers = questions.map(() => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return Math.floor(seed / 4294967296 * 4);
    });
    reached.add(rankCharacters(characters, calculateTraits(questions, answers))[0].character.id);
  }
  assert.deepEqual([...reached].sort(), characters.map(c => c.id).sort());
});
