(function () {
  'use strict';

  var STEP_NAMES = [
    'Archaeology',
    'Paradox',
    'Context',
    'Field',
    'Themes',
    'Frames',
    'Futures',
    'Transformation',
    'Integration'
  ];

  var STEP_EXPLANATIONS = [
    'Excavate the history of the problem. Uncover past attempts, hidden assumptions, and the sedimented layers of thinking that have shaped the current situation.',
    'Identify the core paradox — the fundamental contradiction that makes conventional solutions impossible within the current frame.',
    'Map the broader context surrounding the problem. Move beyond the narrow initial framing to see the full social, cultural, economic, and political landscape.',
    'Identify all players in the field. Map stakeholders, their interests, relationships, power dynamics, and unexpected connections.',
    'Discover deep themes that cut across stakeholder concerns. Look for fundamental human needs, values, and patterns that transcend individual perspectives.',
    'Create new frames — novel patterns of relationships that could produce the desired value. This is the creative leap: a new way of seeing the situation.',
    'Explore the implications of the new frame. If adopted, what futures does it open up? What concrete changes would follow?',
    'Assess whether the frame can be realized in practice. What changes in organizations, policies, or systems would be required?',
    'Connect the new frame to actionable strategies. Bridge the gap between the reframed understanding and concrete, measurable outcomes.'
  ];

  var STEP_QUESTIONS = [
    ['What is the apparent problem as currently stated?', 'What solutions have been tried before?', 'Why did past approaches fall short?'],
    ['What contradictions make this problem resistant to straightforward solutions?', 'Where do reasonable propositions clash with each other?'],
    ['What broader factors become visible when you step back from the narrow view?', 'What social, cultural, or economic dynamics are at play?'],
    ['Who are all the stakeholders, including non-obvious ones?', 'What relationships and power dynamics exist between them?'],
    ['What deep patterns cut across the concerns of different stakeholders?', 'What fundamental human needs lie beneath the surface?'],
    ['What new pattern of relationships could create desired value?', 'Can you express this frame as a metaphor or analogy?'],
    ['What would the resulting situation look like if this frame were adopted?', 'What obstacles or unintended consequences might arise?'],
    ['What organizational or systemic changes would be needed?', 'Who needs to change their behavior or mindset?'],
    ['How does this frame connect to concrete interventions?', 'What is the path from current reality to the new approach?']
  ];

  var CASES = {
    'kings-cross': {
      name: 'Kings Cross',
      steps: [
        'The Kings Cross entertainment district has faced alcohol-fueled violence for decades. Police responses, surveillance, and stricter licensing have been tried repeatedly with limited success.',
        'The area needs nightlife for economic vitality, but nightlife generates violence. You can\'t have one without the other — within the current frame.',
        'Kings Cross is a dense urban area with bars, clubs, restaurants, and residences in close proximity. It\'s a major economic driver for Sydney but also the city\'s most problematic area for alcohol-related incidents.',
        'Police, venue owners, residents, city council, health services, transport authority, visitors, media, liquor licensing, emergency services — each with their own perspective and proposed solutions.',
        'The theme of "hosting" emerged — the idea that good hosts create environments where guests naturally behave well. This bridges all stakeholder concerns.',
        'Frame: "Kings Cross as festival terrain." If we treat the entertainment district like a well-run music festival, we can use crowd management, lighting, programming, and flow design to create safe enjoyment.',
        'Adopting the festival frame would mean: professional crowd management, better lighting and wayfinding, public entertainment in shared spaces, designated chill-out zones, improved late-night transport.',
        'Implementation requires collaboration between police, council, venue owners, and transport. Each must adopt a "hosting" mindset rather than their traditional professional frame.',
        'The festival frame led to practical interventions that reduced violence while maintaining economic vitality. Same people, same alcohol — radically different outcomes through reframing.'
      ]
    },
    'high-speed-train': {
      name: 'High-Speed Train',
      steps: [
        'Holland planned a high-speed rail link for 15 years. Community consultation, impact studies, and political negotiations led to deadlock. Each proposed route faced NIMBY opposition.',
        'The country needs the train connection (consensus) but nobody wants the impact in their area (universal opposition). The problem can\'t be solved within a routing frame.',
        'Small, densely populated country. Strong democratic traditions. Rise of Internet enabled stakeholder multiplication. Multiple competing proposals with "independent" studies.',
        'Railway company, airports, local councils, citizen groups, environmental NGOs, national government, EU transport planners, construction industry, affected communities.',
        'Theme of "shared value creation" — instead of distributing harm, how can the project create value for every community it touches?',
        'Frame: Not a routing problem but a regional development opportunity. The train becomes a catalyst for creating value along its corridor — economic development, improved services, enhanced connectivity for all communities.',
        'Each community along the route gains tangible benefits: economic development, improved local transport, community facilities. The train becomes something communities want, not just tolerate.',
        'Requires shifting from a transportation ministry project to a multi-ministry regional development initiative. Communities become partners, not victims.',
        'By reframing from routing to regional development, the adversarial dynamic dissolves. Communities negotiate for benefits rather than against impact.'
      ]
    },
    'library': {
      name: 'Library',
      steps: [
        'Book borrowing declining steadily as information goes digital. Budgets under pressure. Some libraries closing. Traditional responses: add computers, expand digital collections.',
        'Libraries defined by books face obsolescence in a digital world. But communities still need what libraries provide — just not in the form of book lending.',
        'Public funding pressures, digital transformation, changing demographics, growing social isolation, need for lifelong learning, remote work trends, community service gaps.',
        'Librarians, local government, community groups, students, elderly residents, parents with children, homeless populations, local businesses, publishers, educators.',
        'Theme of "public living room" — a place that belongs to everyone, where people come to learn, connect, create, and participate in community life.',
        'Frame: Library as "community learning ecosystem." Not a place for books but a platform for learning, connection, and community participation. Books are one element of a much richer offering.',
        'The library becomes: a maker space, a co-working venue, a community meeting point, a learning center, a social services hub, a cultural venue — with books as one component.',
        'Requires retraining librarians as community facilitators, redesigning physical spaces, developing new programming, building partnerships with social services and educational institutions.',
        'Libraries that adopted this frame have become the most vital public institutions in their communities — busier and more valued than ever, despite lending fewer books.'
      ]
    }
  };

  var state = {
    currentCase: null,
    currentStep: 0,
    userNotes: [],
    completedSteps: new Set()
  };

  var els = {};

  function init() {
    els.caseSelect = document.getElementById('case-select');
    els.statsBar = document.getElementById('stats-bar');
    els.statSteps = document.getElementById('stat-steps');
    els.statCurrent = document.getElementById('stat-current');
    els.statCase = document.getElementById('stat-case');
    els.progressBar = document.getElementById('progress-bar');
    els.progressSteps = document.getElementById('progress-steps');
    els.stepCardsContainer = document.getElementById('step-cards-container');
    els.navButtons = document.getElementById('nav-buttons');
    els.btnPrev = document.getElementById('btn-prev');
    els.btnNext = document.getElementById('btn-next');
    els.summaryPanel = document.getElementById('summary-panel');
    els.summaryJourney = document.getElementById('summary-journey');
    els.logPanel = document.getElementById('log-panel');

    els.caseSelect.addEventListener('change', selectCase);
    els.btnPrev.addEventListener('click', previousStep);
    els.btnNext.addEventListener('click', nextStep);
  }

  function selectCase() {
    var key = els.caseSelect.value;
    if (!key) return;

    var caseData = CASES[key];
    state.currentCase = caseData;
    state.currentStep = 0;
    state.userNotes = [];
    state.completedSteps = new Set();
    for (var i = 0; i < 9; i++) state.userNotes.push('');

    els.statsBar.style.display = '';
    els.progressBar.style.display = '';
    els.navButtons.style.display = '';
    els.summaryPanel.classList.remove('visible');

    buildProgressBar();
    buildStepCards(caseData);
    navigateToStep(0);
    updateStats();

    log('Selected case study: ' + caseData.name);
  }

  function buildProgressBar() {
    var html = '';
    for (var i = 0; i < 9; i++) {
      html += '<div class="progress-node" data-step="' + i + '">';
      html += '<div class="progress-circle">' + (i + 1) + '</div>';
      html += '<div class="progress-step-label">' + STEP_NAMES[i] + '</div>';
      html += '</div>';
      if (i < 8) {
        html += '<div class="progress-connector" data-after="' + i + '"></div>';
      }
    }
    els.progressSteps.innerHTML = html;

    var nodes = els.progressSteps.querySelectorAll('.progress-node');
    for (var j = 0; j < nodes.length; j++) {
      nodes[j].addEventListener('click', (function (idx) {
        return function () { navigateToStep(idx); };
      })(j));
    }
  }

  function buildStepCards(caseData) {
    var html = '';
    for (var i = 0; i < 9; i++) {
      html += '<div class="step-card" id="step-card-' + i + '" data-step="' + i + '">';
      html += '<div class="step-card-header" data-step="' + i + '">';
      html += '<div class="step-number">' + (i + 1) + '</div>';
      html += '<h4 class="step-card-title">' + STEP_NAMES[i] + '</h4>';
      html += '<span class="step-card-chevron">&#9662;</span>';
      html += '</div>';
      html += '<div class="step-card-body">';

      html += '<div class="step-section">';
      html += '<div class="step-section-label">What This Step Does</div>';
      html += '<p>' + STEP_EXPLANATIONS[i] + '</p>';
      html += '</div>';

      html += '<div class="step-section">';
      html += '<div class="step-section-label">In This Case...</div>';
      html += '<p>' + escapeHtml(caseData.steps[i]) + '</p>';
      html += '</div>';

      html += '<div class="step-section">';
      html += '<div class="step-section-label">Key Questions</div>';
      html += '<ul class="step-questions">';
      for (var q = 0; q < STEP_QUESTIONS[i].length; q++) {
        html += '<li>' + STEP_QUESTIONS[i][q] + '</li>';
      }
      html += '</ul>';
      html += '</div>';

      html += '<div class="step-notes-area">';
      html += '<label class="control-label" for="notes-' + i + '">Your Notes</label>';
      html += '<textarea class="control-textarea" id="notes-' + i + '" placeholder="Record your insights for this step..."></textarea>';
      html += '</div>';

      html += '<button class="sim-btn sim-btn-primary step-proceed-btn" data-step="' + i + '">I Understand, Proceed</button>';

      html += '</div>';
      html += '</div>';
    }
    els.stepCardsContainer.innerHTML = html;

    var headers = els.stepCardsContainer.querySelectorAll('.step-card-header');
    for (var h = 0; h < headers.length; h++) {
      headers[h].addEventListener('click', (function (idx) {
        return function () { toggleCard(idx); };
      })(parseInt(headers[h].getAttribute('data-step'), 10)));
    }

    var proceedBtns = els.stepCardsContainer.querySelectorAll('.step-proceed-btn');
    for (var p = 0; p < proceedBtns.length; p++) {
      proceedBtns[p].addEventListener('click', (function (idx) {
        return function () { completeStep(idx); };
      })(parseInt(proceedBtns[p].getAttribute('data-step'), 10)));
    }
  }

  function navigateToStep(idx) {
    if (idx < 0 || idx >= 9) return;

    saveNotes();
    state.currentStep = idx;

    var cards = els.stepCardsContainer.querySelectorAll('.step-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove('current', 'expanded');
    }

    var targetCard = document.getElementById('step-card-' + idx);
    if (targetCard) {
      targetCard.classList.add('current', 'expanded');
      setTimeout(function () {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }

    updateProgressBar();
    updateStepCardStates();
    updateNavButtons();
    updateStats();
  }

  function toggleCard(idx) {
    var card = document.getElementById('step-card-' + idx);
    if (!card) return;

    if (card.classList.contains('expanded')) {
      card.classList.remove('expanded');
    } else {
      card.classList.add('expanded');
      state.currentStep = idx;
      updateProgressBar();
      updateNavButtons();
      updateStats();
    }
  }

  function completeStep(idx) {
    saveNotes();
    state.completedSteps.add(idx);

    log('Completed step ' + (idx + 1) + ': ' + STEP_NAMES[idx]);

    var card = document.getElementById('step-card-' + idx);
    if (card) card.classList.add('done');

    updateProgressBar();
    updateStepCardStates();
    updateStats();

    if (state.completedSteps.size === 9) {
      showSummary();
      log('All 9 steps complete. Frame creation journey finished for ' + state.currentCase.name + '.');
    } else if (idx < 8) {
      setTimeout(function () { navigateToStep(idx + 1); }, 300);
    }
  }

  function nextStep() {
    if (state.currentStep < 8) {
      navigateToStep(state.currentStep + 1);
    }
  }

  function previousStep() {
    if (state.currentStep > 0) {
      navigateToStep(state.currentStep - 1);
    }
  }

  function saveNotes() {
    for (var i = 0; i < 9; i++) {
      var textarea = document.getElementById('notes-' + i);
      if (textarea) {
        state.userNotes[i] = textarea.value;
      }
    }
  }

  function updateProgressBar() {
    var nodes = els.progressSteps.querySelectorAll('.progress-node');
    var connectors = els.progressSteps.querySelectorAll('.progress-connector');

    for (var i = 0; i < nodes.length; i++) {
      nodes[i].classList.remove('active', 'completed');
      if (state.completedSteps.has(i)) {
        nodes[i].classList.add('completed');
      }
      if (i === state.currentStep) {
        nodes[i].classList.add('active');
      }
    }

    for (var j = 0; j < connectors.length; j++) {
      var afterIdx = parseInt(connectors[j].getAttribute('data-after'), 10);
      connectors[j].classList.toggle('filled', state.completedSteps.has(afterIdx));
    }
  }

  function updateStepCardStates() {
    var cards = els.stepCardsContainer.querySelectorAll('.step-card');
    for (var i = 0; i < cards.length; i++) {
      var idx = parseInt(cards[i].getAttribute('data-step'), 10);
      cards[i].classList.toggle('done', state.completedSteps.has(idx));
    }
  }

  function updateNavButtons() {
    els.btnPrev.disabled = state.currentStep === 0;
    els.btnNext.disabled = state.currentStep === 8;
  }

  function updateStats() {
    els.statSteps.textContent = state.completedSteps.size + ' / 9';
    els.statCurrent.textContent = STEP_NAMES[state.currentStep];
    els.statCase.textContent = state.currentCase ? state.currentCase.name : '--';
  }

  function showSummary() {
    var html = '';
    for (var i = 0; i < 9; i++) {
      html += '<div class="summary-step fade-in" style="animation-delay:' + (i * 0.06) + 's;">';
      html += '<div class="summary-step-num">' + (i + 1) + '</div>';
      html += '<div class="summary-step-content">';
      html += '<div class="summary-step-name">' + STEP_NAMES[i] + '</div>';
      html += '<div class="summary-step-text">' + escapeHtml(state.currentCase.steps[i]) + '</div>';
      html += '</div>';
      html += '</div>';
    }
    els.summaryJourney.innerHTML = html;
    els.summaryPanel.classList.add('visible');

    setTimeout(function () {
      els.summaryPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  function log(msg) {
    var entry = document.createElement('div');
    entry.className = 'log-entry fade-in';
    entry.innerHTML = '<span class="timestamp">[' + timestamp() + ']</span> ' + escapeHtml(msg);
    els.logPanel.appendChild(entry);
    els.logPanel.scrollTop = els.logPanel.scrollHeight;
  }

  function timestamp() {
    var d = new Date();
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
