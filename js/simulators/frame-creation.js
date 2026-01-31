(function () {
  'use strict';

  var STEPS = [
    {
      name: 'Archaeology',
      description: 'Excavate the history of the problem. Uncover past attempts, hidden assumptions, and the sedimented layers of thinking that have shaped the current situation.',
      prompts: [
        'What is the apparent problem as currently stated?',
        'What solutions have been tried before, and why did they fall short?',
        'What assumptions underlie past attempts at resolution?'
      ]
    },
    {
      name: 'Paradox',
      description: 'Identify the core paradox at the heart of the problem. What contradictions make conventional solutions impossible? Where do reasonable propositions clash?',
      prompts: [
        'What core tensions make this problem resistant to straightforward solutions?',
        'Where do seemingly reasonable propositions contradict each other?'
      ]
    },
    {
      name: 'Context',
      description: 'Map the broader context surrounding the problem. Move beyond the narrow initial framing to see the social, cultural, economic, and political landscape.',
      prompts: [
        'What broader social, cultural, or economic context surrounds this problem?',
        'What factors become visible only when you step back from the narrow view?'
      ]
    },
    {
      name: 'Field',
      description: 'Identify all players in the field. Map stakeholders, their interests, relationships, and unexpected connections that may not be obvious at first glance.',
      prompts: [
        'Who are all the stakeholders, including those not immediately obvious?',
        'What unexpected connections or relationships exist between players in the field?'
      ]
    },
    {
      name: 'Themes',
      description: 'Discover deep themes that cut across stakeholder concerns. Look for fundamental human needs, values, and patterns that transcend individual perspectives.',
      prompts: [
        'What deep patterns or themes cut across the concerns of different stakeholders?',
        'What fundamental human needs are at play beneath the surface?'
      ]
    },
    {
      name: 'Frames',
      description: 'Create new frames — novel patterns of relationships that could produce the desired value. This is the creative leap: constructing a new way of seeing the situation.',
      prompts: [
        'What new pattern of relationships could create the desired value?',
        'Can you express this new frame as a metaphor or analogy?'
      ]
    },
    {
      name: 'Futures',
      description: 'Explore the implications of each frame. If this frame were adopted, what futures would it open up? What obstacles might arise? Think through consequences.',
      prompts: [
        'If this frame were widely adopted, what would the resulting situation look like?',
        'What obstacles or unintended consequences might arise from this frame?'
      ]
    },
    {
      name: 'Transformation',
      description: 'Assess whether the frame can be realized in practice. What changes in organizations, policies, or systems would be required to enact this new frame?',
      prompts: [
        'Can this frame be practically implemented in the real world?',
        'What organizational, institutional, or systemic changes would be needed?'
      ]
    },
    {
      name: 'Integration',
      description: 'Connect the new frame to actionable strategies. Bridge the gap between the reframed understanding and concrete steps that move from current reality toward the new approach.',
      prompts: [
        'How does this frame connect to actionable strategies and concrete interventions?',
        'What is the path from the current reality to the new approach?'
      ]
    }
  ];

  var state = {
    currentStep: 0,
    problemStatement: '',
    stepNotes: ['', '', '', '', '', '', '', '', ''],
    completedSteps: new Set(),
    framesCount: 0,
    started: false
  };

  var els = {};

  function init() {
    els.problemInput = document.getElementById('problem-input');
    els.btnStart = document.getElementById('btn-start');
    els.btnReset = document.getElementById('btn-reset');
    els.statSteps = document.getElementById('stat-steps');
    els.statPhase = document.getElementById('stat-phase');
    els.statFrames = document.getElementById('stat-frames');
    els.pipeline = document.getElementById('pipeline');
    els.stepTracker = document.getElementById('step-tracker');
    els.stepContent = document.getElementById('step-content');
    els.stepCard = document.getElementById('step-card');
    els.logPanel = document.getElementById('log-panel');

    buildPipeline();
    buildStepTracker();

    els.btnStart.addEventListener('click', startProcess);
    els.btnReset.addEventListener('click', resetAll);
  }

  function buildPipeline() {
    var html = '';
    for (var i = 0; i < STEPS.length; i++) {
      html += '<div class="pipeline-node" data-step="' + i + '">';
      html += '<div class="pipeline-circle">' + (i + 1) + '</div>';
      html += '<div class="pipeline-label">' + STEPS[i].name + '</div>';
      html += '</div>';
      if (i < STEPS.length - 1) {
        html += '<div class="pipeline-connector" data-after="' + i + '"></div>';
      }
    }
    els.pipeline.innerHTML = html;
  }

  function buildStepTracker() {
    var html = '';
    for (var i = 0; i < STEPS.length; i++) {
      html += '<div class="step-item" data-step="' + i + '">';
      html += '<span class="step-num">' + (i + 1) + '.</span> ' + STEPS[i].name;
      html += '</div>';
    }
    els.stepTracker.innerHTML = html;

    var items = els.stepTracker.querySelectorAll('.step-item');
    for (var j = 0; j < items.length; j++) {
      items[j].addEventListener('click', (function (idx) {
        return function () {
          if (state.started) navigateToStep(idx);
        };
      })(j));
    }
  }

  function startProcess() {
    var text = els.problemInput.value.trim();
    if (!text) {
      els.problemInput.style.borderColor = '#f43f5e';
      els.problemInput.style.boxShadow = '0 0 0 3px #ffe4e6';
      setTimeout(function () {
        els.problemInput.style.borderColor = '';
        els.problemInput.style.boxShadow = '';
      }, 1500);
      return;
    }

    state.problemStatement = text;
    state.started = true;
    els.problemInput.disabled = true;
    els.btnStart.disabled = true;

    log('Process started with problem: "' + truncate(text, 80) + '"');
    navigateToStep(0);
    updateStats();
  }

  function navigateToStep(idx) {
    if (idx < 0 || idx >= STEPS.length) return;

    saveCurrentNotes();
    state.currentStep = idx;
    renderStepContent(idx);
    updateStepTracker();
    updatePipeline();
    updateStats();
  }

  function renderStepContent(idx) {
    var step = STEPS[idx];
    var notes = state.stepNotes[idx];
    var done = state.completedSteps.has(idx);

    var html = '';
    html += '<div class="step-card-inner fade-in">';
    html += '<div class="step-card-header">';
    html += '<span class="step-badge">Step ' + (idx + 1) + ' of 9</span>';
    if (done) html += '<span class="step-done-badge">Completed</span>';
    html += '</div>';
    html += '<h3 class="step-card-title">' + step.name + '</h3>';
    html += '<p class="step-card-desc">' + step.description + '</p>';
    html += '<div class="step-prompts">';
    html += '<h4 class="step-prompts-heading">Guiding Questions</h4>';
    html += '<ul class="step-prompts-list">';
    for (var i = 0; i < step.prompts.length; i++) {
      html += '<li>' + step.prompts[i] + '</li>';
    }
    html += '</ul>';
    html += '</div>';
    html += '<div class="step-notes-area">';
    html += '<label class="control-label" for="step-notes">Your Notes &amp; Responses</label>';
    html += '<textarea class="control-textarea step-notes-input" id="step-notes" placeholder="Record your thinking for this step...">' + escapeHtml(notes) + '</textarea>';
    html += '</div>';
    html += '<div class="step-actions">';
    if (idx > 0) {
      html += '<button class="sim-btn sim-btn-secondary" id="btn-prev-step">&larr; Previous</button>';
    }
    if (!done) {
      html += '<button class="sim-btn sim-btn-primary" id="btn-complete-step">Complete Step</button>';
    }
    if (idx < STEPS.length - 1) {
      html += '<button class="sim-btn sim-btn-secondary" id="btn-next-step">Next &rarr;</button>';
    }
    html += '</div>';
    html += '</div>';

    els.stepCard.innerHTML = html;
    els.stepContent.style.display = '';

    var btnComplete = document.getElementById('btn-complete-step');
    var btnPrev = document.getElementById('btn-prev-step');
    var btnNext = document.getElementById('btn-next-step');

    if (btnComplete) {
      btnComplete.addEventListener('click', function () {
        completeStep(idx);
      });
    }
    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        navigateToStep(idx - 1);
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', function () {
        navigateToStep(idx + 1);
      });
    }
  }

  function completeStep(idx) {
    saveCurrentNotes();
    state.completedSteps.add(idx);

    if (idx === 5) {
      state.framesCount++;
    }

    log('Completed step ' + (idx + 1) + ': ' + STEPS[idx].name);

    updatePipeline();
    updateStepTracker();
    updateStats();

    var circle = els.pipeline.querySelector('.pipeline-node[data-step="' + idx + '"] .pipeline-circle');
    if (circle) {
      circle.classList.add('pulse-highlight');
      setTimeout(function () { circle.classList.remove('pulse-highlight'); }, 600);
    }

    if (idx < STEPS.length - 1) {
      setTimeout(function () { navigateToStep(idx + 1); }, 350);
    } else {
      renderStepContent(idx);
      log('All 9 steps complete. Frame creation process finished.');
    }
  }

  function saveCurrentNotes() {
    var textarea = document.getElementById('step-notes');
    if (textarea) {
      state.stepNotes[state.currentStep] = textarea.value;
    }
  }

  function updateStepTracker() {
    var items = els.stepTracker.querySelectorAll('.step-item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove('active', 'completed');
      if (state.completedSteps.has(i)) {
        items[i].classList.add('completed');
      }
      if (i === state.currentStep && state.started) {
        items[i].classList.add('active');
      }
    }
  }

  function updatePipeline() {
    var nodes = els.pipeline.querySelectorAll('.pipeline-node');
    var connectors = els.pipeline.querySelectorAll('.pipeline-connector');

    for (var i = 0; i < nodes.length; i++) {
      var circle = nodes[i].querySelector('.pipeline-circle');
      nodes[i].classList.remove('is-active', 'is-completed');
      circle.classList.remove('filled');

      if (state.completedSteps.has(i)) {
        nodes[i].classList.add('is-completed');
        circle.classList.add('filled');
      } else if (i === state.currentStep && state.started) {
        nodes[i].classList.add('is-active');
      }
    }

    for (var j = 0; j < connectors.length; j++) {
      var afterIdx = parseInt(connectors[j].getAttribute('data-after'), 10);
      connectors[j].classList.toggle('is-filled', state.completedSteps.has(afterIdx));
    }
  }

  function updateStats() {
    els.statSteps.textContent = state.completedSteps.size + ' / 9';
    els.statFrames.textContent = state.framesCount;

    if (!state.started) {
      els.statPhase.textContent = 'Not Started';
    } else if (state.completedSteps.size === 9) {
      els.statPhase.textContent = 'Complete';
    } else {
      els.statPhase.textContent = STEPS[state.currentStep].name;
    }
  }

  function resetAll() {
    state.currentStep = 0;
    state.problemStatement = '';
    state.stepNotes = ['', '', '', '', '', '', '', '', ''];
    state.completedSteps = new Set();
    state.framesCount = 0;
    state.started = false;

    els.problemInput.value = '';
    els.problemInput.disabled = false;
    els.btnStart.disabled = false;
    els.stepContent.style.display = 'none';
    els.stepCard.innerHTML = '';

    updateStepTracker();
    updatePipeline();
    updateStats();

    els.logPanel.innerHTML = '<div class="log-entry"><span class="timestamp">[' + timestamp() + ']</span> Simulator reset.</div>';
    log('Ready. Enter a problem statement to begin.');
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

  function truncate(str, max) {
    return str.length > max ? str.substring(0, max) + '...' : str;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
