(function () {
  'use strict';

  var TYPE_COLORS = {
    Government: '#3b82f6',
    Business:   '#f59e0b',
    Community:  '#10b981',
    Individual: '#8b5cf6',
    NGO:        '#f43f5e'
  };

  var OPPOSING_VALUES = [
    ['control', 'freedom'],
    ['order', 'spontaneity'],
    ['profit', 'wellbeing'],
    ['regulation', 'deregulation'],
    ['growth', 'preservation'],
    ['entertainment', 'peace'],
    ['control', 'entertainment']
  ];

  var KINGS_CROSS = [
    { name: 'Police',          type: 'Government',  concerns: 'crime, violence, public safety',           values: 'order, control' },
    { name: 'Venue Owners',    type: 'Business',    concerns: 'revenue, regulation, reputation',          values: 'profit, entertainment' },
    { name: 'Residents',       type: 'Community',   concerns: 'noise, safety, property values',           values: 'peace, quality of life' },
    { name: 'City Council',    type: 'Government',  concerns: 'tourism, reputation, safety',              values: 'economic growth, livability' },
    { name: 'Health Services', type: 'Government',  concerns: 'alcohol harm, injuries, mental health',    values: 'wellbeing, prevention' },
    { name: 'Visitors',        type: 'Individual',  concerns: 'fun, safety, transport',                   values: 'entertainment, experience' }
  ];

  var state = {
    stakeholders: [],
    nextId: 1,
    connections: [],
    dragging: null,
    dragOffset: { x: 0, y: 0 }
  };

  var els = {
    nameInput: document.getElementById('stakeholder-name'),
    typeSelect: document.getElementById('stakeholder-type'),
    btnAdd: document.getElementById('btn-add'),
    btnLoad: document.getElementById('btn-load-example'),
    btnBridges: document.getElementById('btn-find-bridges'),
    btnReset: document.getElementById('btn-reset'),
    cards: document.getElementById('stakeholder-cards'),
    networkPanel: document.getElementById('network-panel'),
    networkSvg: document.getElementById('network-svg'),
    networkNodes: document.getElementById('network-nodes'),
    emptyState: document.getElementById('empty-state'),
    bridgingThemes: document.getElementById('bridging-themes'),
    statStakeholders: document.getElementById('stat-stakeholders'),
    statConnections: document.getElementById('stat-connections'),
    statShared: document.getElementById('stat-shared'),
    statConflicts: document.getElementById('stat-conflicts'),
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

  function tokenize(text) {
    return text.toLowerCase()
      .split(/[,;\s]+/)
      .map(function (w) { return w.trim(); })
      .filter(function (w) { return w.length > 2; });
  }

  function addStakeholder(name, type, concerns, values) {
    if (!name.trim()) return;

    var panelRect = els.networkPanel.getBoundingClientRect();
    var count = state.stakeholders.length;
    var angle = (count / Math.max(count + 1, 6)) * 2 * Math.PI - Math.PI / 2;
    var cx = panelRect.width / 2;
    var cy = panelRect.height / 2;
    var radius = Math.min(cx, cy) * 0.6;

    var s = {
      id: state.nextId++,
      name: name.trim(),
      type: type,
      concerns: concerns || '',
      values: values || '',
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle)
    };

    state.stakeholders.push(s);
    renderCard(s);
    calculateConnections();
    renderNetwork();
    updateStats();
    log('Added stakeholder: <strong>' + s.name + '</strong> (' + s.type + ')');
  }

  function removeStakeholder(id) {
    var s = state.stakeholders.find(function (s) { return s.id === id; });
    state.stakeholders = state.stakeholders.filter(function (s) { return s.id !== id; });
    var cardEl = document.querySelector('[data-stakeholder-id="' + id + '"]');
    if (cardEl) cardEl.remove();
    calculateConnections();
    renderNetwork();
    updateStats();
    if (s) log('Removed stakeholder: <strong>' + s.name + '</strong>');
  }

  function renderCard(s) {
    var card = document.createElement('div');
    card.className = 'stakeholder-card';
    card.dataset.stakeholderId = s.id;
    card.style.setProperty('--card-color', TYPE_COLORS[s.type] || '#d1d5db');

    card.innerHTML =
      '<div class="stakeholder-card-header">' +
        '<span class="stakeholder-name">' + escapeHtml(s.name) + '</span>' +
        '<div style="display:flex;align-items:center;gap:6px;">' +
          '<span class="stakeholder-type-badge type-' + s.type + '">' + s.type + '</span>' +
          '<button class="btn-remove-stakeholder" data-remove="' + s.id + '" title="Remove">&times;</button>' +
        '</div>' +
      '</div>' +
      '<label>Concerns</label>' +
      '<textarea class="concerns-input" data-field="concerns" data-id="' + s.id + '" placeholder="e.g., safety, noise, revenue">' + escapeHtml(s.concerns) + '</textarea>' +
      '<label>Values</label>' +
      '<textarea class="values-input" data-field="values" data-id="' + s.id + '" placeholder="e.g., order, profit, wellbeing">' + escapeHtml(s.values) + '</textarea>';

    els.cards.appendChild(card);

    card.querySelector('[data-remove]').addEventListener('click', function () {
      removeStakeholder(s.id);
    });

    card.querySelectorAll('textarea').forEach(function (ta) {
      ta.addEventListener('input', function () {
        var sid = parseInt(ta.dataset.id);
        var field = ta.dataset.field;
        var stakeholder = state.stakeholders.find(function (st) { return st.id === sid; });
        if (stakeholder) {
          stakeholder[field] = ta.value;
          calculateConnections();
          renderNetwork();
          updateStats();
        }
      });
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function calculateConnections() {
    state.connections = [];
    var stk = state.stakeholders;

    for (var i = 0; i < stk.length; i++) {
      for (var j = i + 1; j < stk.length; j++) {
        var tokensA = tokenize(stk[i].concerns + ', ' + stk[i].values);
        var tokensB = tokenize(stk[j].concerns + ', ' + stk[j].values);
        var shared = [];

        tokensA.forEach(function (w) {
          if (tokensB.indexOf(w) !== -1 && shared.indexOf(w) === -1) {
            shared.push(w);
          }
        });

        if (shared.length > 0) {
          state.connections.push({
            from: stk[i].id,
            to: stk[j].id,
            shared: shared,
            weight: shared.length
          });
        }
      }
    }
  }

  function detectConflicts() {
    var conflicts = [];
    var stk = state.stakeholders;

    for (var i = 0; i < stk.length; i++) {
      for (var j = i + 1; j < stk.length; j++) {
        var valsA = tokenize(stk[i].values);
        var valsB = tokenize(stk[j].values);

        OPPOSING_VALUES.forEach(function (pair) {
          var aHas0 = valsA.indexOf(pair[0]) !== -1;
          var aHas1 = valsA.indexOf(pair[1]) !== -1;
          var bHas0 = valsB.indexOf(pair[0]) !== -1;
          var bHas1 = valsB.indexOf(pair[1]) !== -1;

          if ((aHas0 && bHas1) || (aHas1 && bHas0)) {
            var label = stk[i].name + ' vs ' + stk[j].name + ' (' + pair[0] + '/' + pair[1] + ')';
            if (conflicts.indexOf(label) === -1) conflicts.push(label);
          }
        });
      }
    }
    return conflicts;
  }

  function renderNetwork() {
    els.networkNodes.innerHTML = '';
    els.networkSvg.innerHTML = '';

    if (state.stakeholders.length === 0) {
      els.emptyState.style.display = 'flex';
      return;
    }
    els.emptyState.style.display = 'none';

    var maxConns = {};
    state.stakeholders.forEach(function (s) { maxConns[s.id] = 0; });
    state.connections.forEach(function (c) {
      maxConns[c.from] = (maxConns[c.from] || 0) + c.weight;
      maxConns[c.to] = (maxConns[c.to] || 0) + c.weight;
    });

    var globalMax = 1;
    Object.keys(maxConns).forEach(function (k) {
      if (maxConns[k] > globalMax) globalMax = maxConns[k];
    });

    state.connections.forEach(function (conn) {
      var fromS = state.stakeholders.find(function (s) { return s.id === conn.from; });
      var toS = state.stakeholders.find(function (s) { return s.id === conn.to; });
      if (!fromS || !toS) return;

      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', fromS.x);
      line.setAttribute('y1', fromS.y);
      line.setAttribute('x2', toS.x);
      line.setAttribute('y2', toS.y);
      line.setAttribute('stroke', '#10b981');
      line.setAttribute('stroke-opacity', '0.35');
      line.setAttribute('stroke-width', Math.max(1, conn.weight * 2));
      els.networkSvg.appendChild(line);
    });

    state.stakeholders.forEach(function (s) {
      var connCount = maxConns[s.id] || 0;
      var size = 36 + (connCount / globalMax) * 28;

      var node = document.createElement('div');
      node.className = 'network-node';
      node.dataset.nodeId = s.id;
      node.style.width = size + 'px';
      node.style.height = size + 'px';
      node.style.left = (s.x - size / 2) + 'px';
      node.style.top = (s.y - size / 2) + 'px';
      node.style.background = TYPE_COLORS[s.type] || '#6b7280';

      var label = document.createElement('div');
      label.className = 'network-node-label';
      label.textContent = s.name;
      node.appendChild(label);

      node.addEventListener('mousedown', function (e) {
        startDrag(e, s, node, size);
      });
      node.addEventListener('touchstart', function (e) {
        var touch = e.touches[0];
        startDrag(touch, s, node, size);
        e.preventDefault();
      }, { passive: false });

      els.networkNodes.appendChild(node);
    });
  }

  function startDrag(e, stakeholder, node, size) {
    state.dragging = { stakeholder: stakeholder, node: node, size: size };
    var rect = els.networkPanel.getBoundingClientRect();
    state.dragOffset.x = e.clientX - rect.left - stakeholder.x;
    state.dragOffset.y = e.clientY - rect.top - stakeholder.y;
  }

  document.addEventListener('mousemove', function (e) {
    if (!state.dragging) return;
    moveDrag(e.clientX, e.clientY);
  });

  document.addEventListener('touchmove', function (e) {
    if (!state.dragging) return;
    var touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
    e.preventDefault();
  }, { passive: false });

  function moveDrag(clientX, clientY) {
    var d = state.dragging;
    var rect = els.networkPanel.getBoundingClientRect();
    var x = clientX - rect.left - state.dragOffset.x;
    var y = clientY - rect.top - state.dragOffset.y;

    x = Math.max(d.size / 2, Math.min(rect.width - d.size / 2, x));
    y = Math.max(d.size / 2, Math.min(rect.height - d.size / 2, y));

    d.stakeholder.x = x;
    d.stakeholder.y = y;
    d.node.style.left = (x - d.size / 2) + 'px';
    d.node.style.top = (y - d.size / 2) + 'px';

    updateSvgLines();
  }

  function endDrag() {
    state.dragging = null;
  }

  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchend', endDrag);

  function updateSvgLines() {
    var lines = els.networkSvg.querySelectorAll('line');
    var idx = 0;
    state.connections.forEach(function (conn) {
      var fromS = state.stakeholders.find(function (s) { return s.id === conn.from; });
      var toS = state.stakeholders.find(function (s) { return s.id === conn.to; });
      if (!fromS || !toS || idx >= lines.length) return;
      lines[idx].setAttribute('x1', fromS.x);
      lines[idx].setAttribute('y1', fromS.y);
      lines[idx].setAttribute('x2', toS.x);
      lines[idx].setAttribute('y2', toS.y);
      idx++;
    });
  }

  function findBridgingThemes() {
    var wordCount = {};

    state.stakeholders.forEach(function (s) {
      var tokens = tokenize(s.concerns + ', ' + s.values);
      var unique = [];
      tokens.forEach(function (t) {
        if (unique.indexOf(t) === -1) unique.push(t);
      });
      unique.forEach(function (w) {
        wordCount[w] = (wordCount[w] || 0) + 1;
      });
    });

    var bridging = [];
    Object.keys(wordCount).forEach(function (w) {
      if (wordCount[w] >= 2) {
        bridging.push({ word: w, count: wordCount[w] });
      }
    });

    bridging.sort(function (a, b) { return b.count - a.count; });

    var conflicts = detectConflicts();

    els.bridgingThemes.innerHTML = '';

    if (bridging.length === 0 && conflicts.length === 0) {
      els.bridgingThemes.innerHTML = '<span style="color:#9ca3af;font-size:0.85rem;">No bridging themes found yet. Add more concerns and values.</span>';
      log('No bridging themes found');
      return;
    }

    bridging.forEach(function (b) {
      var tag = document.createElement('span');
      tag.className = 'bridging-tag';
      tag.innerHTML = b.word + '<span class="tag-count">' + b.count + '</span>';
      els.bridgingThemes.appendChild(tag);
    });

    conflicts.forEach(function (c) {
      var tag = document.createElement('span');
      tag.className = 'bridging-tag conflict-tag';
      tag.innerHTML = c + '<span class="tag-count">!</span>';
      els.bridgingThemes.appendChild(tag);
    });

    log('Found <strong>' + bridging.length + '</strong> bridging theme(s) and <strong>' + conflicts.length + '</strong> potential conflict(s)');
  }

  function updateStats() {
    els.statStakeholders.textContent = state.stakeholders.length;
    els.statConnections.textContent = state.connections.length;

    var sharedWords = new Set();
    state.connections.forEach(function (c) {
      c.shared.forEach(function (w) { sharedWords.add(w); });
    });
    els.statShared.textContent = sharedWords.size;

    var conflicts = detectConflicts();
    els.statConflicts.textContent = conflicts.length;
  }

  function resetAll() {
    state.stakeholders = [];
    state.connections = [];
    state.nextId = 1;
    els.cards.innerHTML = '';
    els.bridgingThemes.innerHTML = '';
    renderNetwork();
    updateStats();
    log('Reset all stakeholders');
  }

  function loadKingsCross() {
    resetAll();
    KINGS_CROSS.forEach(function (s) {
      addStakeholder(s.name, s.type, s.concerns, s.values);
    });
    log('Loaded Kings Cross nightlife scenario');
  }

  function layoutCircle() {
    var panelRect = els.networkPanel.getBoundingClientRect();
    var cx = panelRect.width / 2;
    var cy = panelRect.height / 2;
    var radius = Math.min(cx, cy) * 0.6;
    var count = state.stakeholders.length;

    state.stakeholders.forEach(function (s, i) {
      var angle = (i / count) * 2 * Math.PI - Math.PI / 2;
      s.x = cx + radius * Math.cos(angle);
      s.y = cy + radius * Math.sin(angle);
    });
  }

  els.btnAdd.addEventListener('click', function () {
    var name = els.nameInput.value.trim();
    var type = els.typeSelect.value;
    if (!name) {
      els.nameInput.focus();
      return;
    }
    addStakeholder(name, type, '', '');
    els.nameInput.value = '';
    els.nameInput.focus();
  });

  els.nameInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') els.btnAdd.click();
  });

  els.btnLoad.addEventListener('click', function () {
    loadKingsCross();
    setTimeout(function () {
      layoutCircle();
      renderNetwork();
    }, 50);
  });

  els.btnBridges.addEventListener('click', findBridgingThemes);
  els.btnReset.addEventListener('click', resetAll);

  updateStats();
})();
