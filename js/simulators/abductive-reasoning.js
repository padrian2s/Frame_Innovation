(function () {
  'use strict';

  var EXAMPLES = [
    {
      name: 'Morning energy',
      what: 'Coffee',
      how: 'Chemical stimulus (caffeine)',
      value: 'Feel energized',
      alternatives: [
        { what: 'Group exercise class', how: 'Social interaction + movement' },
        { what: 'Cold shower routine', how: 'Sympathetic nervous system activation' },
        { what: 'Meditation practice', how: 'Mindful awareness and breathing' }
      ]
    },
    {
      name: 'Wayfinding',
      what: 'Environmental cues',
      how: 'Anxiety reduction',
      value: 'Confident navigation',
      alternatives: [
        { what: 'Color-coded pathways', how: 'Intuitive spatial encoding' },
        { what: 'Community greeters', how: 'Social trust and guidance' },
        { what: 'Soundscapes and landmarks', how: 'Multisensory orientation' }
      ]
    },
    {
      name: 'Community building',
      what: 'Storytelling platform',
      how: 'Shared narratives',
      value: 'Social cohesion',
      alternatives: [
        { what: 'Neighborhood kitchen', how: 'Shared meals and rituals' },
        { what: 'Collaborative garden', how: 'Joint stewardship of place' },
        { what: 'Skill exchange network', how: 'Mutual reciprocity and trust' }
      ]
    }
  ];

  var state = {
    mode: 'deduction',
    currentExample: -1,
    exploredExamples: new Set(),
    combinationsCreated: 0,
    alternativeIndex: 0
  };

  var els = {
    modeTabs: document.getElementById('mode-tabs'),
    boxWhat: document.getElementById('box-what'),
    boxHow: document.getElementById('box-how'),
    boxValue: document.getElementById('box-value'),
    inputWhat: document.getElementById('input-what'),
    inputHow: document.getElementById('input-how'),
    inputValue: document.getElementById('input-value'),
    btnAlternative: document.getElementById('btn-alternative'),
    btnReset: document.getElementById('btn-reset'),
    statExplored: document.getElementById('stat-explored'),
    statMode: document.getElementById('stat-mode'),
    statCombos: document.getElementById('stat-combos'),
    logPanel: document.getElementById('log-panel')
  };

  function timestamp() {
    var d = new Date();
    return '[' +
      String(d.getHours()).padStart(2, '0') + ':' +
      String(d.getMinutes()).padStart(2, '0') + ':' +
      String(d.getSeconds()).padStart(2, '0') + ']';
  }

  function log(msg) {
    var entry = document.createElement('div');
    entry.className = 'log-entry fade-in';
    entry.innerHTML = '<span class="timestamp">' + timestamp() + '</span> ' + msg;
    els.logPanel.appendChild(entry);
    els.logPanel.scrollTop = els.logPanel.scrollHeight;
  }

  function updateStats() {
    els.statExplored.textContent = state.exploredExamples.size;
    var modeLabels = { deduction: 'Deduction', normal: 'Normal Abduction', design: 'Design Abduction' };
    els.statMode.textContent = modeLabels[state.mode];
    els.statCombos.textContent = state.combinationsCreated;
  }

  function setBoxState(box, input, status) {
    box.classList.remove('known', 'unknown', 'editable');
    box.classList.add(status);
    if (status === 'unknown') {
      input.setAttribute('readonly', '');
    } else {
      input.removeAttribute('readonly');
    }
  }

  function setMode(mode) {
    state.mode = mode;
    state.alternativeIndex = 0;

    document.querySelectorAll('.mode-tab').forEach(function (tab) {
      tab.classList.toggle('active', tab.dataset.mode === mode);
    });

    if (mode === 'deduction') {
      setBoxState(els.boxWhat, els.inputWhat, 'known');
      setBoxState(els.boxHow, els.inputHow, 'known');
      setBoxState(els.boxValue, els.inputValue, 'unknown');
      els.btnAlternative.classList.remove('visible');
    } else if (mode === 'normal') {
      setBoxState(els.boxWhat, els.inputWhat, 'unknown');
      setBoxState(els.boxHow, els.inputHow, 'known');
      setBoxState(els.boxValue, els.inputValue, 'known');
      els.btnAlternative.classList.remove('visible');
    } else {
      setBoxState(els.boxWhat, els.inputWhat, 'unknown');
      setBoxState(els.boxHow, els.inputHow, 'unknown');
      setBoxState(els.boxValue, els.inputValue, 'known');
      els.btnAlternative.classList.add('visible');
    }

    if (state.currentExample >= 0) {
      populateFromExample(state.currentExample);
    } else if (state.currentExample === -2) {
      makeAllEditable();
    }

    log('Switched to <strong>' + els.statMode.textContent + '</strong> mode');
    updateStats();
  }

  function populateFromExample(idx) {
    var ex = EXAMPLES[idx];
    if (!ex) return;

    state.currentExample = idx;
    state.exploredExamples.add(idx);

    if (state.mode === 'deduction') {
      els.inputWhat.value = ex.what;
      els.inputHow.value = ex.how;
      els.inputValue.value = '';
      setBoxState(els.boxWhat, els.inputWhat, 'known');
      setBoxState(els.boxHow, els.inputHow, 'known');
      setBoxState(els.boxValue, els.inputValue, 'unknown');
    } else if (state.mode === 'normal') {
      els.inputWhat.value = '';
      els.inputHow.value = ex.how;
      els.inputValue.value = ex.value;
      setBoxState(els.boxWhat, els.inputWhat, 'unknown');
      setBoxState(els.boxHow, els.inputHow, 'known');
      setBoxState(els.boxValue, els.inputValue, 'known');
    } else {
      els.inputWhat.value = '';
      els.inputHow.value = '';
      els.inputValue.value = ex.value;
      setBoxState(els.boxWhat, els.inputWhat, 'unknown');
      setBoxState(els.boxHow, els.inputHow, 'unknown');
      setBoxState(els.boxValue, els.inputValue, 'known');
    }

    highlightChip(idx);
    log('Loaded example: <strong>' + ex.name + '</strong>');
    updateStats();
  }

  function makeAllEditable() {
    state.currentExample = -2;
    setBoxState(els.boxWhat, els.inputWhat, 'editable');
    setBoxState(els.boxHow, els.inputHow, 'editable');
    setBoxState(els.boxValue, els.inputValue, 'editable');
    els.inputWhat.value = '';
    els.inputHow.value = '';
    els.inputValue.value = '';
    els.btnAlternative.classList.remove('visible');
    highlightChip(3);
    log('Try Your Own mode &mdash; all fields are editable');
    updateStats();
  }

  function highlightChip(idx) {
    document.querySelectorAll('.example-chip').forEach(function (chip, i) {
      chip.classList.toggle('active', parseInt(chip.dataset.index) === idx);
    });
  }

  function generateAlternative() {
    if (state.currentExample < 0 || state.currentExample >= EXAMPLES.length) return;
    var ex = EXAMPLES[state.currentExample];
    if (!ex.alternatives || ex.alternatives.length === 0) return;

    var alt = ex.alternatives[state.alternativeIndex % ex.alternatives.length];
    state.alternativeIndex++;
    state.combinationsCreated++;

    els.inputWhat.value = alt.what;
    els.inputHow.value = alt.how;

    setBoxState(els.boxWhat, els.inputWhat, 'known');
    setBoxState(els.boxHow, els.inputHow, 'known');

    els.boxWhat.classList.add('pulse-highlight');
    els.boxHow.classList.add('pulse-highlight');
    setTimeout(function () {
      els.boxWhat.classList.remove('pulse-highlight');
      els.boxHow.classList.remove('pulse-highlight');
    }, 700);

    log('Generated alternative: <strong>' + alt.what + '</strong> via <strong>' + alt.how + '</strong>');
    updateStats();
  }

  function resetAll() {
    state.currentExample = -1;
    state.alternativeIndex = 0;
    els.inputWhat.value = '';
    els.inputHow.value = '';
    els.inputValue.value = '';
    setMode(state.mode);
    highlightChip(-1);
    log('Reset all fields');
  }

  function onInputChange(field) {
    state.combinationsCreated++;
    log('Edited <strong>' + field + '</strong> field');
    updateStats();

    var allFilled = els.inputWhat.value.trim() && els.inputHow.value.trim() && els.inputValue.value.trim();
    if (allFilled) {
      log('All three elements defined &mdash; equation complete');
    }
  }

  els.modeTabs.addEventListener('click', function (e) {
    var tab = e.target.closest('.mode-tab');
    if (tab && tab.dataset.mode) {
      setMode(tab.dataset.mode);
    }
  });

  document.querySelectorAll('.example-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var idx = parseInt(chip.dataset.index);
      if (idx === 3) {
        makeAllEditable();
      } else {
        populateFromExample(idx);
      }
    });
  });

  els.btnAlternative.addEventListener('click', generateAlternative);
  els.btnReset.addEventListener('click', resetAll);

  els.inputWhat.addEventListener('input', function () { onInputChange('WHAT'); });
  els.inputHow.addEventListener('input', function () { onInputChange('HOW'); });
  els.inputValue.addEventListener('input', function () { onInputChange('VALUE'); });

  setMode('deduction');
  updateStats();
})();
