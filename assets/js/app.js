$(async function () {
  'use strict';
  const page = document.body.dataset.page;
  const traits = ['Courage', 'Strategy', 'Teamwork', 'Creativity'];
  const draftKey = 'arena-id-draft-v1';
  const resultKey = 'arena-id-result-v1';
  let characters = [];
  let questions = [];
  let state = null;
  let toastTimer;
  let storageWarningShown = false;
  let shareText = '';

  function escapeHtml(value) {
    return $('<span>').text(String(value)).html().replace(/"/g, '&quot;');
  }
  function notify(message) {
    clearTimeout(toastTimer);
    $('#notification').text(message).prop('hidden', false);
    toastTimer = setTimeout(function () { $('#notification').prop('hidden', true); }, 4500);
  }
  function readStorage(key) {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch (error) { return null; }
  }
  function writeStorage(key, value) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      if (!storageWarningShown) {
        notify('Browser storage is unavailable. Keep this tab open to finish your quiz.');
        storageWarningShown = true;
      }
    }
  }
  function validNickname(name) { return typeof name === 'string' && /^[\p{L}\p{N}_ -]{2,20}$/u.test(name) && name.trim().length >= 2; }
  function validState(value, complete) {
    return value && validNickname(value.nickname) && Array.isArray(value.answers)
      && value.answers.length === questions.length
      && Number.isInteger(value.index) && value.index >= 0 && value.index < questions.length
      && value.answers.every(function (answer, index) {
        return (!complete && answer === null) || (Number.isInteger(answer) && answer >= 0 && answer < questions[index].options.length);
      });
  }

  function characterCard(character, detail) {
    const name = escapeHtml(character.name);
    const button = detail
      ? `<button type="button" class="card-detail" data-character="${character.id}" aria-label="Read about ${name}">Read profile</button>`
      : '';

    return `
      <div class="col-6 col-lg-3">
        <article class="character-card">
          <div class="character-art">
            <span class="elixir" aria-label="${character.elixir} elixir">${character.elixir}</span>
            <img src="assets/images/${character.id}.png" alt="${name} card"
              loading="lazy" width="302" height="363">
          </div>
          <div class="character-body">
            <h3>${name}</h3>
            <p>${escapeHtml(character.role)}</p>
            ${button}
          </div>
        </article>
      </div>
    `;
  }

  function initCatalogue() {
    function filterCharacters() {
      const query = $('#character-search').val().trim().toLowerCase();
      const type = $('#character-type').val();
      const filtered = characters.filter(function (character) {
        const searchable = [character.name, character.role, character.description, character.type].join(' ').toLowerCase();
        return searchable.includes(query) && (type === 'all' || character.type === type);
      });
      $('#character-grid').html(filtered.map(function (character) { return characterCard(character, true); }).join(''));
      $('#character-count').text('Showing ' + filtered.length + ' of ' + characters.length + ' characters');
      $('#no-characters').prop('hidden', filtered.length !== 0);
    }
    $('#character-search').on('input', filterCharacters);
    $('#character-type').on('change', filterCharacters);
    $('#clear-filters').on('click', function () {
      $('#character-search').val('');
      $('#character-type').val('all');
      filterCharacters();
      $('#character-search').trigger('focus');
    });
    $('#character-grid').on('click', '[data-character]', function () {
      const trigger = this;
      const character = characters.find(item => item.id === trigger.dataset.character);
      $('#character-modal-title').text(character.name + ' · ' + character.role);
      $('#character-modal-body').html(`
        <img class="modal-character-image" src="assets/images/${character.id}.png"
          alt="${escapeHtml(character.name)} card">
        <p>${escapeHtml(character.description)}</p>
        <h3>Strength</h3>
        <p>${escapeHtml(character.strength)}</p>
        <h3>Something to try</h3>
        <p>${escapeHtml(character.growth)}</p>
      `);
      $('#character-modal').one('hidden.bs.modal', function () { trigger.focus(); });
      bootstrap.Modal.getOrCreateInstance(document.getElementById('character-modal')).show();
    });
    filterCharacters();
  }

  function showScreen(id) {
    $('#quiz-intro, #quiz-question, #quiz-result, #quiz-loading').prop('hidden', true);
    $(id).prop('hidden', false);
  }
  function showIntro() {
    showScreen('#quiz-intro');
    const draft = readStorage(draftKey);
    const saved = readStorage(resultKey);
    $('#resume-box').prop('hidden', true);
    $('#last-result').remove();
    if (validState(draft, false)) {
      $('#nickname').val(draft.nickname);
      const answered = draft.answers.filter(function (answer) { return answer !== null; }).length;
      $('#resume-description').text('Welcome back, ' + draft.nickname + '. ' + answered + ' of ' + questions.length + ' answers saved.');
      $('#resume-box').prop('hidden', false);
    }
    if (validState(saved, true)) {
      $('<button>', { id: 'last-result', type: 'button', class: 'link-button mt-3', text: 'View your last result' })
        .on('click', function () { showResult(saved, false); }).appendTo('#quiz-intro');
    }
  }
  function saveDraft() {
    writeStorage(draftKey, state);
  }

  function updateProgress() {
    const answered = state.answers.filter(answer => answer !== null).length;
    const percent = answered / questions.length * 100;
    $('#quiz-progress').css('width', `${percent}%`);
    $('#quiz-progress').parent().attr({
      'aria-valuenow': answered,
      'aria-valuemax': questions.length
    });
  }

  function renderQuestion() {
    showScreen('#quiz-question');
    const question = questions[state.index];
    $('#question-count').text('Question ' + (state.index + 1) + ' / ' + questions.length);
    $('#question-category').text(question.category);
    updateProgress();
    $('#question-title').text(question.text);
    const options = question.options.map((option, index) => {
      const checked = state.answers[state.index] === index ? 'checked' : '';
      return `<label class="answer-option" for="answer-${index}">
        <input type="radio" id="answer-${index}" name="answer" value="${index}"
          required aria-describedby="answer-error" ${checked}>
        <span>${escapeHtml(option.text)}</span>
      </label>`;
    });
    $('#answer-options').html(options.join(''));
    $('#answer-error').text('');
    $('#previous-question').prop('disabled', state.index === 0);
    $('#next-question').text(state.index === questions.length - 1 ? 'See my result' : 'Next question →');
    document.getElementById('quiz-question').scrollIntoView({ block: 'start', behavior: 'instant' });
    document.getElementById('question-title').focus({ preventScroll: true });
  }

  function showResult(completed, save) {
    const profile = QuizScoring.calculateTraits(questions, completed.answers);
    const ranked = QuizScoring.rankCharacters(characters, profile);
    const winner = ranked[0].character;
    if (save) {
      writeStorage(resultKey, completed);
      writeStorage(draftKey, null);
    }
    const bars = traits.map((trait, index) => `
      <div class="trait-row">
        <div class="trait-label"><span>${trait}</span><strong>${profile[index]} / 100</strong></div>
        <div class="trait-track" aria-hidden="true">
          <div class="trait-fill" style="width:${profile[index]}%"></div>
        </div>
      </div>
    `);
    $('#result-scores').html(bars.join(''));
    $('#result-image').attr({ src: `assets/images/${winner.id}.png`, alt: `${winner.name} card` });
    $('#result-player').text(`${completed.nickname}, your closest match is`);
    $('#result-title').text(winner.name);
    $('#result-role').text(winner.role);
    $('#result-description').text(winner.description);
    $('#result-strength').text(winner.strength);
    $('#result-growth').text(winner.growth);
    $('#result-alternatives').text(`${ranked[1].character.name} and ${ranked[2].character.name}`);
    $('#share-fallback').prop('hidden', true);
    const scores = traits.map((trait, index) => `${trait} ${profile[index]}/100`);
    shareText = `I got ${winner.name} in Arena ID! ${scores.join(', ')}.`;
    showScreen('#quiz-result');
    document.getElementById('result-title').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function initQuiz() {
    showIntro();
    $('#copy-result').on('click', async function () {
      try {
        await navigator.clipboard.writeText(shareText);
        notify('Result copied.');
      } catch (error) {
        $('#share-fallback').prop('hidden', false);
        $('#share-text').val(shareText).trigger('focus').trigger('select');
        notify('Clipboard unavailable. You can copy the selected text manually.');
      }
    });
    $('#retake-quiz').on('click', function () {
      showIntro();
      $('#nickname').trigger('focus');
    });
    $('#nickname-form').on('submit', function (event) {
      event.preventDefault();
      const nickname = $('#nickname').val().trim();
      if (!validNickname(nickname)) {
        $('#nickname-error').text('Use 2–20 characters: letters, numbers, spaces, _ or -.');
        $('#nickname').attr('aria-invalid', 'true').addClass('is-invalid').trigger('focus');
        return;
      }
      $('#nickname-error').text('');
      $('#nickname').removeAttr('aria-invalid').removeClass('is-invalid');
      state = { nickname: nickname, index: 0, answers: new Array(questions.length).fill(null) };
      saveDraft();
      renderQuestion();
    });
    $('#nickname').on('input', function () { $(this).removeAttr('aria-invalid').removeClass('is-invalid'); $('#nickname-error').text(''); });
    $('#resume-quiz').on('click', function () {
      const draft = readStorage(draftKey);
      if (validState(draft, false)) { state = draft; renderQuestion(); }
      else { showIntro(); notify('Saved progress is no longer available. Start a new round.'); }
    });
    $('#answer-options').on('change', 'input', function () {
      state.answers[state.index] = Number(this.value);
      $('#answer-error').text('');
      updateProgress();
      saveDraft();
    });
    $('#answer-form').on('submit', function (event) {
      event.preventDefault();
      if (state.answers[state.index] === null) {
        $('#answer-error').text('Choose one answer before moving on.');
        $('#answer-options input').first().trigger('focus');
        return;
      }
      if (state.index < questions.length - 1) {
        state.index += 1;
        saveDraft();
        renderQuestion();
      } else {
        // An older draft can contain a skipped question.
        const missing = state.answers.indexOf(null);
        if (missing !== -1) { state.index = missing; renderQuestion(); notify('Answer this question to complete your profile.'); return; }
        showResult(state, true);
      }
    });
    $('#previous-question').on('click', function () {
      if (state.index > 0) { state.index -= 1; saveDraft(); renderQuestion(); }
    });
    $('#confirm-restart').on('click', function () {
      writeStorage(draftKey, null);
      state = null;
      showIntro();
      $('#restart-modal').one('hidden.bs.modal', function () { $('#nickname').trigger('focus'); });
    });
  }

  async function loadPage() {
    try {
      if (page === 'about') return;
      characters = await $.getJSON('assets/data/characters.json');
      if (page === 'index') {
        const featured = ['knight', 'hog-rider', 'wizard', 'mini-pekka']
          .map(id => characters.find(character => character.id === id));
        $('#featured-characters').html(featured.map(character => characterCard(character, false)).join(''));
      } else if (page === 'characters') initCatalogue();
      else if (page === 'quiz') { questions = await $.getJSON('assets/data/questions.json'); initQuiz(); }
    } catch (error) {
      const target = page === 'quiz' ? '#quiz-loading' : page === 'index' ? '#featured-characters' : '#character-count';
      const message = location.protocol === 'file:' ? 'Open this project through a local server (see README.md) so the JSON files can load.' : 'The arena could not load. Check your connection to the local server and try again.';
      $(target).empty().append($('<p>').text(message)).append($('<button>', { type: 'button', class: 'btn btn-outline-dark', text: 'Try again' }).on('click', loadPage));
    }
  }
  await loadPage();
});
