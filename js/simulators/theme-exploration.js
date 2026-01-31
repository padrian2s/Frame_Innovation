(function () {
  'use strict';

  var SCENARIOS = {
    'kings-cross': {
      name: 'Kings Cross Entertainment District',
      stakeholders: [
        {
          name: 'Police',
          color: '#3b82f6',
          concerns: ['public safety', 'alcohol-fueled violence', 'crime reduction', 'late-night policing', 'resource strain']
        },
        {
          name: 'Venue Owners',
          color: '#f59e0b',
          concerns: ['business revenue', 'entertainment experience', 'customer attraction', 'licensing freedom', 'nightlife vibrancy']
        },
        {
          name: 'Residents',
          color: '#10b981',
          concerns: ['noise reduction', 'neighborhood safety', 'quality of life', 'property values', 'peaceful living']
        },
        {
          name: 'Council',
          color: '#8b5cf6',
          concerns: ['economic vitality', 'public order', 'urban reputation', 'regulatory balance', 'community wellbeing']
        },
        {
          name: 'Visitors',
          color: '#f43f5e',
          concerns: ['fun experience', 'safe night out', 'entertainment variety', 'transport access', 'welcoming atmosphere']
        }
      ],
      themes: {
        'hosting': {
          keywords: ['host', 'hosting', 'hospitality', 'welcoming', 'welcome', 'care', 'guest', 'experience', 'managing', 'stewardship'],
          bridges: ['Police', 'Venue Owners', 'Residents', 'Council', 'Visitors'],
          description: 'Good hosts create environments where guests naturally behave well. This theme reframes every stakeholder as a host with responsibility for the collective experience.'
        },
        'safety': {
          keywords: ['safe', 'safety', 'security', 'protection', 'secure', 'wellbeing', 'harm reduction', 'prevention'],
          bridges: ['Police', 'Residents', 'Council'],
          description: 'Safety connects the core concerns of those responsible for public order and quality of life, but misses the economic and entertainment dimensions.'
        },
        'entertainment': {
          keywords: ['entertainment', 'fun', 'nightlife', 'enjoyment', 'leisure', 'amusement', 'recreation', 'pleasure'],
          bridges: ['Venue Owners', 'Visitors'],
          description: 'Entertainment captures the economic and experiential dimensions but fails to address safety and residential concerns.'
        },
        'festival': {
          keywords: ['festival', 'celebration', 'event', 'gathering', 'carnival', 'spectacle'],
          bridges: ['Venue Owners', 'Visitors', 'Council'],
          description: 'A festival frame suggests organized, managed enjoyment with infrastructure and planning, bridging business, visitor, and governance concerns.'
        },
        'community': {
          keywords: ['community', 'neighborhood', 'belonging', 'togetherness', 'shared', 'collective'],
          bridges: ['Residents', 'Council', 'Visitors'],
          description: 'Community connects those who live, govern, and visit the area but may not speak to commercial or policing priorities.'
        }
      }
    },
    'social-housing': {
      name: 'Social Housing Renewal',
      stakeholders: [
        {
          name: 'Housing Authority',
          color: '#3b82f6',
          concerns: ['cost efficiency', 'building maintenance', 'occupancy rates', 'regulatory compliance', 'asset management']
        },
        {
          name: 'Residents',
          color: '#10b981',
          concerns: ['home pride', 'personal dignity', 'sense of belonging', 'safe environment', 'stable housing']
        },
        {
          name: 'Social Workers',
          color: '#f59e0b',
          concerns: ['resident wellbeing', 'mental health support', 'community integration', 'dignity of care', 'vulnerability reduction']
        },
        {
          name: 'Local Business',
          color: '#8b5cf6',
          concerns: ['customer base', 'area reputation', 'economic activity', 'foot traffic', 'local identity']
        },
        {
          name: 'Youth',
          color: '#f43f5e',
          concerns: ['recreation spaces', 'identity expression', 'future opportunities', 'social connection', 'creative outlet']
        }
      ],
      themes: {
        'belonging': {
          keywords: ['belonging', 'belong', 'home', 'place', 'roots', 'identity', 'attachment', 'ownership', 'pride'],
          bridges: ['Housing Authority', 'Residents', 'Social Workers', 'Local Business', 'Youth'],
          description: 'Belonging transforms housing from shelter into home. When people belong, they invest in their environment, creating value for every stakeholder.'
        },
        'storytelling': {
          keywords: ['story', 'storytelling', 'narrative', 'history', 'heritage', 'memory', 'voice', 'expression', 'culture'],
          bridges: ['Residents', 'Youth', 'Local Business'],
          description: 'Stories create identity and connection. Residents share histories, youth express aspirations, businesses build on local narrative and character.'
        },
        'dignity': {
          keywords: ['dignity', 'respect', 'worth', 'value', 'esteem', 'empowerment', 'agency', 'autonomy'],
          bridges: ['Residents', 'Social Workers'],
          description: 'Dignity centers the human experience of care and housing, connecting those who receive and provide support in a relationship of mutual respect.'
        },
        'stewardship': {
          keywords: ['stewardship', 'steward', 'caretaking', 'responsibility', 'maintenance', 'investment', 'custodian'],
          bridges: ['Housing Authority', 'Residents', 'Local Business'],
          description: 'Stewardship reframes the relationship from landlord-tenant to shared caretaking, where everyone has a stake in the environment.'
        },
        'growth': {
          keywords: ['growth', 'development', 'learning', 'opportunity', 'potential', 'aspiration', 'progress'],
          bridges: ['Youth', 'Social Workers', 'Residents'],
          description: 'Growth connects those seeking development and those supporting it, but may not engage the institutional and commercial stakeholders.'
        }
      }
    },
    'library': {
      name: 'Library Transformation',
      stakeholders: [
        {
          name: 'Librarians',
          color: '#3b82f6',
          concerns: ['knowledge curation', 'professional purpose', 'information access', 'collection stewardship', 'reader guidance']
        },
        {
          name: 'Community',
          color: '#10b981',
          concerns: ['meeting space', 'social connection', 'local identity', 'free access', 'inclusive gathering']
        },
        {
          name: 'Students',
          color: '#f59e0b',
          concerns: ['study environment', 'research resources', 'quiet space', 'digital access', 'learning support']
        },
        {
          name: 'Council',
          color: '#8b5cf6',
          concerns: ['budget justification', 'public value', 'service efficiency', 'political support', 'measurable outcomes']
        },
        {
          name: 'Publishers',
          color: '#f43f5e',
          concerns: ['content distribution', 'author exposure', 'reading culture', 'intellectual property', 'market access']
        }
      ],
      themes: {
        'learning ecosystem': {
          keywords: ['learning', 'ecosystem', 'education', 'knowledge', 'discovery', 'understanding', 'literacy', 'wisdom', 'growth'],
          bridges: ['Librarians', 'Community', 'Students', 'Council', 'Publishers'],
          description: 'A learning ecosystem reframes the library from a book repository to a living network of knowledge creation and sharing that serves every stakeholder.'
        },
        'third place': {
          keywords: ['third place', 'gathering', 'meeting', 'social', 'hangout', 'commons', 'agora', 'living room', 'hub'],
          bridges: ['Community', 'Students'],
          description: 'The third place (neither home nor work) captures the library as a social infrastructure, connecting those who need space for connection and study.'
        },
        'cultural access': {
          keywords: ['culture', 'cultural', 'access', 'exposure', 'distribution', 'curation', 'heritage', 'arts', 'literature'],
          bridges: ['Librarians', 'Publishers', 'Community'],
          description: 'Cultural access connects the keepers, creators, and consumers of culture in a shared mission of making knowledge and art available to all.'
        },
        'public platform': {
          keywords: ['platform', 'public', 'civic', 'infrastructure', 'service', 'institution', 'foundation'],
          bridges: ['Council', 'Community', 'Librarians'],
          description: 'Framing the library as public platform emphasizes its role as essential civic infrastructure, justifying investment and broadening purpose.'
        },
        'discovery': {
          keywords: ['discovery', 'exploration', 'curiosity', 'finding', 'browsing', 'serendipity', 'wonder'],
          bridges: ['Students', 'Librarians', 'Publishers'],
          description: 'Discovery centers the experience of finding something unexpected, connecting those who seek, curate, and create knowledge.'
        }
      }
    }
  };

  var SYNONYM_MAP = {
    'host': ['hosting', 'hospitality', 'welcoming', 'welcome', 'care', 'guest'],
    'safe': ['safety', 'security', 'protection', 'secure'],
    'belong': ['belonging', 'home', 'place', 'roots', 'identity', 'attachment'],
    'dignity': ['respect', 'worth', 'esteem', 'empowerment'],
    'story': ['storytelling', 'narrative', 'history', 'heritage', 'memory', 'voice'],
    'learn': ['learning', 'education', 'knowledge', 'literacy', 'study'],
    'community': ['togetherness', 'collective', 'shared', 'social', 'connection'],
    'culture': ['cultural', 'heritage', 'arts', 'literature'],
    'growth': ['development', 'opportunity', 'potential', 'progress', 'aspiration'],
    'platform': ['infrastructure', 'foundation', 'service', 'institution'],
    'festival': ['celebration', 'event', 'carnival', 'gathering'],
    'ecosystem': ['network', 'system', 'web', 'environment'],
    'steward': ['stewardship', 'caretaking', 'custodian', 'maintenance'],
    'discover': ['discovery', 'exploration', 'curiosity', 'serendipity', 'wonder'],
    'entertain': ['entertainment', 'fun', 'nightlife', 'enjoyment', 'leisure', 'recreation']
  };

  var state = {
    currentScenario: null,
    proposedThemes: [],
    bestScore: 0,
    maxBridged: 0,
    currentBridged: []
  };

  var els = {};

  function init() {
    els.scenarioSelect = document.getElementById('scenario-select');
    els.stakeholderTags = document.getElementById('stakeholder-tags');
    els.stakeholderTagsArea = document.getElementById('stakeholder-tags-area');
    els.themePanel = document.getElementById('theme-panel');
    els.themeInput = document.getElementById('theme-input');
    els.btnTestTheme = document.getElementById('btn-test-theme');
    els.statsBar = document.getElementById('stats-bar');
    els.statTested = document.getElementById('stat-tested');
    els.statBest = document.getElementById('stat-best');
    els.statBridged = document.getElementById('stat-bridged');
    els.vennPanel = document.getElementById('venn-panel');
    els.vennContainer = document.getElementById('venn-container');
    els.vennThemeBadge = document.getElementById('venn-theme-badge');
    els.resultsPanel = document.getElementById('results-panel');
    els.scoreText = document.getElementById('score-text');
    els.scoreFill = document.getElementById('score-fill');
    els.scoreDescription = document.getElementById('score-description');
    els.bridgedList = document.getElementById('bridged-list');
    els.suggestionsContainer = document.getElementById('suggestions-container');
    els.suggestedThemes = document.getElementById('suggested-themes');
    els.logPanel = document.getElementById('log-panel');

    els.scenarioSelect.addEventListener('change', loadScenario);
    els.btnTestTheme.addEventListener('click', function () { testTheme(els.themeInput.value); });
    els.themeInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') testTheme(els.themeInput.value);
    });
  }

  function loadScenario() {
    var key = els.scenarioSelect.value;
    if (!key) return;

    var scenario = SCENARIOS[key];
    state.currentScenario = scenario;
    state.proposedThemes = [];
    state.bestScore = 0;
    state.maxBridged = 0;
    state.currentBridged = [];

    renderStakeholderTags(scenario.stakeholders);
    els.stakeholderTagsArea.style.display = '';
    els.themePanel.style.display = '';
    els.statsBar.style.display = '';
    els.vennPanel.style.display = '';
    els.resultsPanel.style.display = 'none';
    els.themeInput.value = '';
    els.vennThemeBadge.classList.remove('visible');

    renderVennDiagram(scenario.stakeholders, []);
    renderSuggestions(scenario.themes);
    updateStats();

    log('Loaded scenario: ' + scenario.name + ' (' + scenario.stakeholders.length + ' stakeholders)');
  }

  function renderStakeholderTags(stakeholders) {
    var html = '';
    for (var i = 0; i < stakeholders.length; i++) {
      var s = stakeholders[i];
      html += '<div class="stakeholder-tag" style="background:' + s.color + ';">';
      html += s.name;
      html += '<span class="concern-count">' + s.concerns.length + '</span>';
      html += '</div>';
    }
    els.stakeholderTags.innerHTML = html;
  }

  function testTheme(text) {
    text = text.trim().toLowerCase();
    if (!text || !state.currentScenario) return;

    var scenario = state.currentScenario;
    var bridged = [];
    var matchDetails = {};

    var knownTheme = findKnownTheme(text, scenario.themes);

    if (knownTheme) {
      bridged = knownTheme.bridges.slice();
      for (var b = 0; b < bridged.length; b++) {
        matchDetails[bridged[b]] = true;
      }
    } else {
      var expandedKeywords = expandThemeKeywords(text);

      for (var i = 0; i < scenario.stakeholders.length; i++) {
        var s = scenario.stakeholders[i];
        var matched = false;

        for (var j = 0; j < s.concerns.length; j++) {
          var concern = s.concerns[j].toLowerCase();
          for (var k = 0; k < expandedKeywords.length; k++) {
            if (concern.indexOf(expandedKeywords[k]) !== -1 || expandedKeywords[k].indexOf(concern.split(' ')[0]) !== -1) {
              matched = true;
              break;
            }
          }
          if (matched) break;
        }

        if (!matched) {
          for (var t in scenario.themes) {
            var themeData = scenario.themes[t];
            for (var ki = 0; ki < themeData.keywords.length; ki++) {
              if (text.indexOf(themeData.keywords[ki]) !== -1 || themeData.keywords[ki].indexOf(text) !== -1) {
                if (themeData.bridges.indexOf(s.name) !== -1) {
                  matched = true;
                  break;
                }
              }
            }
            if (matched) break;
          }
        }

        if (matched) {
          bridged.push(s.name);
          matchDetails[s.name] = true;
        }
      }
    }

    var score = Math.round((bridged.length / scenario.stakeholders.length) * 100);

    state.proposedThemes.push({ text: text, score: score, bridged: bridged });
    state.currentBridged = bridged;
    if (score > state.bestScore) state.bestScore = score;
    if (bridged.length > state.maxBridged) state.maxBridged = bridged.length;

    renderVennDiagram(scenario.stakeholders, bridged);
    renderResults(text, score, bridged, scenario.stakeholders, knownTheme);
    updateStats();

    els.vennThemeBadge.textContent = text.charAt(0).toUpperCase() + text.slice(1);
    els.vennThemeBadge.classList.add('visible');

    var label = score >= 80 ? 'Excellent' : score >= 50 ? 'Good' : score > 0 ? 'Partial' : 'No match';
    log('Tested theme "' + text + '" — Score: ' + score + '% (' + label + '), bridges ' + bridged.length + '/' + scenario.stakeholders.length + ' stakeholders');

    els.themeInput.value = '';
    els.themeInput.focus();
  }

  function findKnownTheme(text, themes) {
    for (var key in themes) {
      if (text === key) return themes[key];
      var kws = themes[key].keywords;
      for (var i = 0; i < kws.length; i++) {
        if (text === kws[i]) return themes[key];
      }
    }

    for (var key2 in themes) {
      if (text.indexOf(key2) !== -1 || key2.indexOf(text) !== -1) return themes[key2];
    }
    return null;
  }

  function expandThemeKeywords(text) {
    var keywords = [text];
    var words = text.split(/\s+/);
    for (var i = 0; i < words.length; i++) {
      if (keywords.indexOf(words[i]) === -1) keywords.push(words[i]);
    }

    for (var root in SYNONYM_MAP) {
      var group = [root].concat(SYNONYM_MAP[root]);
      var found = false;
      for (var g = 0; g < group.length; g++) {
        if (text.indexOf(group[g]) !== -1) {
          found = true;
          break;
        }
      }
      if (found) {
        for (var s = 0; s < group.length; s++) {
          if (keywords.indexOf(group[s]) === -1) keywords.push(group[s]);
        }
      }
    }

    return keywords;
  }

  function renderVennDiagram(stakeholders, bridged) {
    var container = els.vennContainer;
    var oldCircles = container.querySelectorAll('.venn-circle, .venn-label, .venn-concerns');
    for (var r = 0; r < oldCircles.length; r++) {
      oldCircles[r].remove();
    }

    var w = container.offsetWidth;
    var h = container.offsetHeight;
    var cx = w / 2;
    var cy = h / 2;
    var n = stakeholders.length;
    var circleRadius = Math.min(w, h) * 0.28;
    var orbitRadius = Math.min(w, h) * 0.22;

    for (var i = 0; i < n; i++) {
      var angle = (2 * Math.PI * i / n) - Math.PI / 2;
      var x = cx + orbitRadius * Math.cos(angle) - circleRadius;
      var y = cy + orbitRadius * Math.sin(angle) - circleRadius;

      var circle = document.createElement('div');
      circle.className = 'venn-circle';
      if (bridged.indexOf(stakeholders[i].name) !== -1) {
        circle.classList.add('bridged');
      }
      circle.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + (circleRadius * 2) + 'px;height:' + (circleRadius * 2) + 'px;background:' + stakeholders[i].color + ';';
      container.appendChild(circle);

      var labelX = cx + (orbitRadius + circleRadius * 0.65) * Math.cos(angle);
      var labelY = cy + (orbitRadius + circleRadius * 0.65) * Math.sin(angle);
      var label = document.createElement('div');
      label.className = 'venn-label';
      label.textContent = stakeholders[i].name;
      label.style.cssText = 'left:' + labelX + 'px;top:' + labelY + 'px;transform:translate(-50%,-50%);';
      container.appendChild(label);

      var concernX = cx + (orbitRadius * 0.6) * Math.cos(angle);
      var concernY = cy + (orbitRadius * 0.6) * Math.sin(angle);
      var concerns = document.createElement('div');
      concerns.className = 'venn-concerns';
      concerns.textContent = stakeholders[i].concerns.slice(0, 2).join(', ');
      concerns.style.cssText = 'left:' + concernX + 'px;top:' + concernY + 'px;transform:translate(-50%,-50%);';
      container.appendChild(concerns);
    }
  }

  function renderResults(themeText, score, bridged, stakeholders, knownTheme) {
    els.resultsPanel.style.display = '';
    els.resultsPanel.classList.add('fade-in');

    els.scoreText.textContent = score + '%';
    els.scoreFill.style.width = score + '%';

    if (knownTheme) {
      els.scoreDescription.textContent = knownTheme.description;
    } else if (score >= 80) {
      els.scoreDescription.textContent = 'This theme resonates across nearly all stakeholder groups, creating a strong foundation for frame creation.';
    } else if (score >= 50) {
      els.scoreDescription.textContent = 'This theme connects several stakeholder groups but leaves some concerns unaddressed. Consider how to broaden its reach.';
    } else if (score > 0) {
      els.scoreDescription.textContent = 'This theme only partially connects stakeholders. Look for deeper patterns that bridge more perspectives.';
    } else {
      els.scoreDescription.textContent = 'This theme does not clearly connect to stakeholder concerns. Try a different angle or explore the suggested themes below.';
    }

    var html = '';
    for (var i = 0; i < stakeholders.length; i++) {
      var isBridged = bridged.indexOf(stakeholders[i].name) !== -1;
      html += '<li style="background:' + stakeholders[i].color + ';" class="' + (isBridged ? '' : 'not-bridged') + '">';
      html += (isBridged ? '&#10003; ' : '&#10007; ') + stakeholders[i].name;
      html += '</li>';
    }
    els.bridgedList.innerHTML = html;
  }

  function renderSuggestions(themes) {
    var html = '';
    for (var key in themes) {
      html += '<button class="suggestion-chip" data-theme="' + key + '">' + key.charAt(0).toUpperCase() + key.slice(1) + '</button>';
    }
    els.suggestionsContainer.innerHTML = html;

    var chips = els.suggestionsContainer.querySelectorAll('.suggestion-chip');
    for (var i = 0; i < chips.length; i++) {
      chips[i].addEventListener('click', function () {
        var t = this.getAttribute('data-theme');
        els.themeInput.value = t;
        testTheme(t);
      });
    }
  }

  function updateStats() {
    els.statTested.textContent = state.proposedThemes.length;
    els.statBest.textContent = state.bestScore + '%';
    els.statBridged.textContent = state.maxBridged;
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
