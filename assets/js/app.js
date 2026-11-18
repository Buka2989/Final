$(function () {
  const page = document.body.dataset.page;

    // Toast Notification System
  let toastTimer;

  function showToast(message, type = 'info') {
    clearTimeout(toastTimer);

    // Create notification container if it doesn't exist
    if ($('#toast-notification').length === 0) {
      $('body').append(`
        <div id="toast-notification"
             class="notification"
             role="status"
             aria-live="polite">
        </div>
      `);
    }

    const toast = $('#toast-notification');

    toast
      .removeClass('toast-success toast-error toast-info')
      .addClass(`toast-${type}`)
      .text(message)
      .addClass('toast-visible');

    // Hide notification after 3 seconds
    toastTimer = setTimeout(function () {
      toast.removeClass('toast-visible');
    }, 3000);
  }

  function escapeHtml(value) {
    return $('<span>').text(value).html().replace(/"/g, '&quot;');
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
      const filtered = characters.filter(function (character) {
        const searchable = [character.name, character.role, character.description].join(' ').toLowerCase();
        return searchable.includes(query);
      });
      $('#character-grid').html(filtered.map(function (character) { return characterCard(character, true); }).join(''));
      $('#character-count').text('Showing ' + filtered.length + ' of ' + characters.length + ' characters');
      $('#no-characters').prop('hidden', filtered.length !== 0);
    }
    $('#character-search').on('input', filterCharacters);
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

  function initQuiz() {
    let current = 0;
    const answers = Array(questions.length).fill(null);

    function updateProgress() {
      const answered = answers.filter(answer => answer !== null).length;
      $('#quiz-progress').css('width', `${answered / questions.length * 100}%`);
      $('#quiz-progress').parent().attr({
        'aria-valuenow': answered,
        'aria-valuemax': questions.length
      });
    }

    function showQuestion(focus = true) {
      const question = questions[current];
      $('#question-count').text(`Question ${current + 1} / ${questions.length}`);
      $('#question-category').text(question.category);
      $('#question-title').text(question.text);
      $('#answer-options').empty();

      question.options.forEach((option, index) => {
        const radio = $('<input>', {
          type: 'radio',
          name: 'answer',
          value: index,
          'aria-describedby': 'answer-error'
        }).prop('checked', answers[current] === index);

        $('<label>', { class: 'answer-option' })
          .append(radio, $('<span>').text(option.text))
          .appendTo('#answer-options');
      });

      updateProgress();
      $('#answer-error').text('');
      $('#previous-question').prop('disabled', current === 0);
      $('#next-question').text(current === questions.length - 1 ? 'See my result' : 'Next question →');

      if (focus) document.getElementById('question-title').focus();
    }

    function showResult() {
      const totals = [0, 0, 0, 0];
      questions.forEach((question, index) => {
        question.options[answers[index]].scores.forEach((points, trait) => {
          totals[trait] += points;
        });
      });

      // Each answer gives up to 3 points per trait. Profiles use a 0–100 scale.
      const scores = totals.map(total => Math.round(total / (questions.length * 3) * 100));
      const ranked = characters.map(character => {
        const distance = character.profile.reduce((sum, value, index) => {
          return sum + Math.abs(value - scores[index]);
        }, 0);
        return { character, distance };
      });
      ranked.sort((a, b) => a.distance - b.distance || a.character.id.localeCompare(b.character.id));
      const winner = ranked[0].character;

      const traits = ['Courage', 'Strategy', 'Teamwork', 'Creativity'];
      $('#result-scores').html(traits.map((trait, index) => `
        <div class="trait-row">
          <div class="trait-label"><span>${trait}</span><strong>${scores[index]} / 100</strong></div>
          <div class="trait-track" aria-hidden="true">
            <div class="trait-fill" style="width:${scores[index]}%"></div>
          </div>
        </div>
      `).join(''));

      $('#result-image').attr({ src: `assets/images/${winner.id}.png`, alt: `${winner.name} card` });
      $('#result-title').text(winner.name);
      $('#result-role').text(winner.role);
      $('#result-description').text(winner.description);
      $('#result-strength').text(winner.strength);
      $('#result-growth').text(winner.growth);

      $('#quiz-question').prop('hidden', true);
      $('#quiz-result').prop('hidden', false);
      document.getElementById('result-title').focus({ preventScroll: true });
      document.getElementById('quiz-result').scrollIntoView();
      showToast('Congratulations! Your result is ready!', 'success');
    }

    $('#answer-options').on('change', 'input', function () {
      answers[current] = Number(this.value);
      $('#answer-error').text('');
      updateProgress();
    });

    $('#answer-form').on('submit', function (event) {
      event.preventDefault();
      if (answers[current] === null) {
        $('#answer-error').text('Choose one answer before moving on.');
        $('#answer-options input').first().trigger('focus');
        showToast('Please select an answer first!', 'error');
      } else if (current === questions.length - 1) {
        showResult();
      } else {
        current += 1;
        showQuestion();
      }
    });

    $('#previous-question').on('click', function () {
      current -= 1;
      showQuestion();
    });

    $('#restart-quiz, #retake-quiz').on('click', function () {
      answers.fill(null);
      current = 0;
      $('#quiz-result').prop('hidden', true);
      $('#quiz-question').prop('hidden', false);
      showQuestion();
      showToast('A new quiz has started!', 'info');
    });

    showQuestion(false);
    $('#quiz-question').prop('hidden', false);
  }

  if (page === 'index') {
    const featured = ['knight', 'hog-rider', 'wizard', 'mini-pekka']
      .map(id => characters.find(character => character.id === id));
    $('#featured-characters').html(featured.map(character => characterCard(character, false)).join(''));
  } else if (page === 'characters') {
    initCatalogue();
  } else if (page === 'quiz') {
    initQuiz();
  }
});
