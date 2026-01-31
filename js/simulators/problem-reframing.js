(function () {
  'use strict';

  var SCENARIOS = {
    nightlife: {
      title: 'Nightlife District Violence',
      problem: 'The Kings Cross entertainment district in Sydney generates persistent alcohol-fueled violence every weekend. Despite years of police intervention, CCTV surveillance, and stricter regulations, the problem persists. Hundreds of assaults occur annually, creating fear and reputational damage to the area.',
      frames: [
        {
          name: 'Crime Prevention',
          metaphor: 'War zone',
          description: 'Treat the district as a law enforcement problem. The violence is criminal behavior that must be suppressed through deterrence, surveillance, and punishment.',
          solutions: [
            'Increased police patrols and visible presence',
            'Expanded CCTV camera network',
            'Stricter venue licensing and lockout laws',
            'Mandatory ID scanning at venues',
            'Higher penalties for alcohol-related offenses'
          ],
          impact: 'Addresses symptoms but creates an adversarial, fortress-like atmosphere. May displace rather than reduce violence. Punitive approach does not address underlying behavioral dynamics.'
        },
        {
          name: 'Festival Terrain',
          metaphor: 'Music festival',
          description: 'Manage the district like a well-run music festival — with crowd flow design, ambient programming, strategic lighting, and positive environmental cues that shape behavior naturally.',
          solutions: [
            'Improved lighting and wayfinding throughout the district',
            'Public entertainment and street performances',
            'Chill-out zones with seating, water, and food',
            'Improved late-night public transport options',
            'Ambient music and environmental design'
          ],
          impact: 'Creates a positive atmosphere that naturally reduces aggression. Treats visitors as guests to be managed, not criminals to be deterred. Addresses environmental triggers of violence rather than just consequences.'
        },
        {
          name: 'Public Health',
          metaphor: 'Hospital triage',
          description: 'Treat the situation as a health and wellbeing issue. Violence is a symptom of excessive alcohol consumption, dehydration, fatigue, and poor self-regulation in a high-stimulation environment.',
          solutions: [
            'Free hydration stations and water distribution',
            'Safe spaces and first-aid stations staffed with nurses',
            'Late-night transport hubs with rest areas',
            'Harm reduction outreach teams',
            'Alcohol education campaigns targeting young adults'
          ],
          impact: 'Reduces harm directly and treats root physiological causes. Compassionate approach, but does not address the broader cultural dynamics or environmental design factors that drive the behavior.'
        }
      ]
    },
    mall: {
      title: 'Declining Shopping Mall',
      problem: 'A large suburban shopping mall is losing foot traffic and tenants year after year. Online retail is capturing an increasing share of consumer spending. Anchor stores are closing, vacancy rates are climbing, and the surrounding community feels the economic impact.',
      frames: [
        {
          name: 'Transaction Hub',
          metaphor: 'Marketplace',
          description: 'The mall is a place for buying things. The problem is that online competitors offer better prices, convenience, and selection. The mall must compete on transactional terms.',
          solutions: [
            'Price-matching guarantees with online retailers',
            'Same-day delivery and buy-online-pickup-in-store',
            'Loyalty programs with aggressive discounts',
            'Extended hours and free parking incentives',
            'Digital kiosks for expanded product catalogs'
          ],
          impact: 'Fights on the competitor\'s terrain. Difficult to win a price and convenience war against Amazon. May slow decline but unlikely to reverse the fundamental trend.'
        },
        {
          name: 'Experience Destination',
          metaphor: 'Theme park',
          description: 'The mall is not a store — it is a destination for experiences that cannot be replicated online. Entertainment, dining, social interaction, and sensory experiences become the core offering.',
          solutions: [
            'Experiential tenants: cooking classes, escape rooms, art studios',
            'Rotating pop-up experiences and seasonal events',
            'High-quality food halls and craft dining',
            'Indoor recreation: climbing walls, mini-golf, VR arcades',
            'Live music, performances, and community events'
          ],
          impact: 'Differentiates fundamentally from online retail. Creates reasons to visit that e-commerce cannot replicate. Requires significant investment in new tenant mix and programming.'
        },
        {
          name: 'Community Center',
          metaphor: 'Town square',
          description: 'The mall is the community\'s shared gathering space — a civic commons where people come together for connection, services, learning, and belonging.',
          solutions: [
            'Co-working spaces and small business incubators',
            'Public library branch and community meeting rooms',
            'Health clinic, government services, and childcare',
            'Community garden and farmers market',
            'Senior programs, youth spaces, and cultural organizations'
          ],
          impact: 'Repositions the mall as essential civic infrastructure. Generates steady foot traffic from service needs. Revenue model shifts from pure retail rent to mixed-use community economics.'
        }
      ]
    },
    library: {
      title: 'Library Losing Visitors',
      problem: 'A public library system is experiencing steep declines in visits and borrowing. Digital media has transformed how people access information and entertainment. The library\'s traditional role as a repository of books feels increasingly irrelevant to many community members.',
      frames: [
        {
          name: 'Digital Archive',
          metaphor: 'Cloud service',
          description: 'The library is an information access point. The problem is that its delivery mechanism (physical books) is outdated. It must digitize and compete as a content platform.',
          solutions: [
            'Massive expansion of e-book and audiobook collections',
            'Streaming media partnerships (films, music, courses)',
            'Digital literacy workshops and tech support',
            'App-based borrowing and recommendation engine',
            'Online databases and research tools'
          ],
          impact: 'Keeps pace with digital expectations but competes directly with well-funded commercial platforms. Risks becoming a lesser version of Netflix/Audible rather than something distinctive.'
        },
        {
          name: 'Community Living Room',
          metaphor: 'Living room',
          description: 'The library is the community\'s shared living room — a warm, free, inclusive third place where anyone can spend time, connect, and feel welcome regardless of their ability to pay.',
          solutions: [
            'Comfortable, home-like seating and gathering spaces',
            'Free Wi-Fi, charging stations, and quiet work areas',
            'Children\'s play areas and teen hangout zones',
            'Community events: author talks, game nights, movie screenings',
            'Social services: job help, immigration resources, tax assistance'
          ],
          impact: 'Positions the library as irreplaceable social infrastructure. Serves populations who need free third places most. Shifts success metrics from borrowing counts to community engagement and wellbeing.'
        },
        {
          name: 'Learning Ecosystem',
          metaphor: 'University without walls',
          description: 'The library is a lifelong learning platform — not just for consuming information but for creating knowledge, developing skills, and building human capacity.',
          solutions: [
            'Maker spaces with 3D printers, laser cutters, recording studios',
            'Skill-building workshops: coding, language, financial literacy',
            'Mentorship matching and peer learning circles',
            'Partnerships with schools, colleges, and employers',
            'Creator-in-residence programs for artists and entrepreneurs'
          ],
          impact: 'Transforms the library from passive to active, from consumption to creation. Addresses the modern need for continuous upskilling. Requires staff with new competencies beyond traditional librarianship.'
        }
      ]
    },
    traffic: {
      title: 'Traffic Congestion',
      problem: 'A growing city faces chronic traffic congestion. Commute times are lengthening, air quality is declining, and economic productivity is lost to time spent in gridlock. The transportation network was designed for a much smaller population.',
      frames: [
        {
          name: 'Infrastructure Problem',
          metaphor: 'Plumbing',
          description: 'Traffic is a flow problem — the pipes are too small for the volume. The solution is to build bigger, better infrastructure to accommodate the throughput demand.',
          solutions: [
            'Widen major highways and arterial roads',
            'Build new ring roads and bypass routes',
            'Add highway interchanges and grade separations',
            'Implement intelligent traffic signal timing',
            'Construct more parking structures downtown'
          ],
          impact: 'Provides short-term relief but triggers induced demand — wider roads attract more cars, restoring congestion within a few years. Extremely expensive and often displaces communities.'
        },
        {
          name: 'Mobility Design',
          metaphor: 'Orchestra',
          description: 'The problem is not road capacity but modal imbalance. A well-functioning city orchestrates multiple mobility options so that people choose the best mode for each journey.',
          solutions: [
            'Rapid transit network (rail, BRT) connecting major corridors',
            'Protected cycling infrastructure and bike-sharing',
            'Congestion pricing to reflect true cost of driving',
            'Mobility-as-a-service apps integrating all transport modes',
            'Park-and-ride hubs at transit nodes'
          ],
          impact: 'Reduces car dependency by making alternatives genuinely competitive. Requires sustained investment and political will. Transforms urban form over time toward transit-oriented development.'
        },
        {
          name: 'City for People',
          metaphor: 'Garden',
          description: 'The deeper problem is not how to move cars but how to bring people and activities closer together. Redesign the city so that fewer and shorter trips are needed.',
          solutions: [
            'Mixed-use zoning: homes, jobs, and services in the same neighborhoods',
            'Walkable 15-minute neighborhood design',
            'Remote work infrastructure and distributed office hubs',
            'Car-free zones and pedestrian-priority streets',
            'Green corridors connecting neighborhoods'
          ],
          impact: 'Addresses root cause — the spatial separation of daily activities. Long-term transformation that reduces transport demand itself. Requires fundamental rethinking of urban planning and zoning.'
        }
      ]
    }
  };

  var state = {
    scenariosExplored: new Set(),
    framesCompared: 0,
    activeFrame: null,
    currentScenario: null,
    customFrames: [
      { name: '', metaphor: '', description: '', solutions: [''], impact: '' },
      { name: '', metaphor: '', description: '', solutions: [''], impact: '' },
      { name: '', metaphor: '', description: '', solutions: [''], impact: '' }
    ]
  };

  var els = {};

  function init() {
    els.scenarioSelect = document.getElementById('scenario-select');
    els.customInputArea = document.getElementById('custom-input-area');
    els.customProblem = document.getElementById('custom-problem');
    els.btnCustomGo = document.getElementById('btn-custom-go');
    els.scenarioContent = document.getElementById('scenario-content');
    els.comparePanel = document.getElementById('compare-panel');
    els.logPanel = document.getElementById('log-panel');
    els.statScenarios = document.getElementById('stat-scenarios');
    els.statCompared = document.getElementById('stat-compared');
    els.statActive = document.getElementById('stat-active');

    els.scenarioSelect.addEventListener('change', onScenarioChange);
    if (els.btnCustomGo) {
      els.btnCustomGo.addEventListener('click', onCustomGo);
    }
  }

  function onScenarioChange() {
    var val = els.scenarioSelect.value;
    els.customInputArea.style.display = val === 'custom' ? '' : 'none';
    els.scenarioContent.innerHTML = '';
    els.comparePanel.style.display = 'none';
    state.activeFrame = null;
    updateStats();

    if (val && val !== 'custom' && SCENARIOS[val]) {
      selectScenario(val);
    }
  }

  function onCustomGo() {
    var text = els.customProblem.value.trim();
    if (!text) return;
    renderCustomFrameEditor(text);
    log('Custom problem entered: "' + truncate(text, 60) + '"');
  }

  function selectScenario(id) {
    var scenario = SCENARIOS[id];
    if (!scenario) return;

    state.currentScenario = id;
    state.scenariosExplored.add(id);
    state.activeFrame = null;

    log('Loaded scenario: ' + scenario.title);
    renderScenario(scenario);
    updateStats();
  }

  function renderScenario(scenario) {
    var html = '';

    html += '<div class="scenario-problem-card fade-in">';
    html += '<h3 class="scenario-problem-title">' + scenario.title + '</h3>';
    html += '<p class="scenario-problem-text">' + scenario.problem + '</p>';
    html += '</div>';

    html += '<div class="frame-cards-row">';
    for (var i = 0; i < scenario.frames.length; i++) {
      var f = scenario.frames[i];
      html += renderFrameCard(f, i);
    }
    html += '</div>';

    html += '<div style="text-align: center; margin: 24px 0 8px;">';
    html += '<button class="sim-btn sim-btn-primary" id="btn-compare">Compare All Frames</button>';
    html += '</div>';

    els.scenarioContent.innerHTML = html;

    var cards = els.scenarioContent.querySelectorAll('.frame-card');
    for (var j = 0; j < cards.length; j++) {
      cards[j].addEventListener('click', (function (idx) {
        return function () { activateFrame(idx); };
      })(j));
    }

    var btnCompare = document.getElementById('btn-compare');
    if (btnCompare) {
      btnCompare.addEventListener('click', function () {
        renderCompareView(scenario);
      });
    }
  }

  function renderFrameCard(frame, idx) {
    var html = '';
    html += '<div class="frame-card slide-up" data-frame="' + idx + '" style="animation-delay: ' + (idx * 0.1) + 's;">';
    html += '<div class="frame-card-header">';
    html += '<h4 class="frame-card-name">' + escapeHtml(frame.name) + '</h4>';
    html += '<span class="frame-card-metaphor">' + escapeHtml(frame.metaphor) + '</span>';
    html += '</div>';
    html += '<p class="frame-card-desc">' + escapeHtml(frame.description) + '</p>';
    html += '<div class="frame-card-solutions">';
    html += '<h5>Resulting Solutions</h5>';
    html += '<ul>';
    for (var s = 0; s < frame.solutions.length; s++) {
      html += '<li>' + escapeHtml(frame.solutions[s]) + '</li>';
    }
    html += '</ul>';
    html += '</div>';
    html += '<div class="frame-card-impact">';
    html += '<h5>Stakeholder Impact</h5>';
    html += '<p>' + escapeHtml(frame.impact) + '</p>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  function activateFrame(idx) {
    var cards = els.scenarioContent.querySelectorAll('.frame-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.toggle('is-active', i === idx);
    }

    var scenario = SCENARIOS[state.currentScenario];
    if (scenario && scenario.frames[idx]) {
      state.activeFrame = scenario.frames[idx].name;
      state.framesCompared++;
      log('Selected frame: ' + scenario.frames[idx].name + ' (' + scenario.frames[idx].metaphor + ')');
      updateStats();
    }
  }

  function renderCompareView(scenario) {
    var html = '';
    html += '<div class="compare-matrix fade-in">';
    html += '<h3 class="compare-title">Frame Comparison Matrix</h3>';
    html += '<div class="compare-table-wrap">';
    html += '<table class="compare-table">';
    html += '<thead><tr>';
    html += '<th>Dimension</th>';
    for (var i = 0; i < scenario.frames.length; i++) {
      html += '<th>' + escapeHtml(scenario.frames[i].name) + '</th>';
    }
    html += '</tr></thead>';
    html += '<tbody>';

    html += '<tr><td class="compare-dim">Metaphor</td>';
    for (var m = 0; m < scenario.frames.length; m++) {
      html += '<td><em>' + escapeHtml(scenario.frames[m].metaphor) + '</em></td>';
    }
    html += '</tr>';

    html += '<tr><td class="compare-dim">Core Idea</td>';
    for (var d = 0; d < scenario.frames.length; d++) {
      html += '<td>' + escapeHtml(scenario.frames[d].description) + '</td>';
    }
    html += '</tr>';

    html += '<tr><td class="compare-dim">Key Solutions</td>';
    for (var s = 0; s < scenario.frames.length; s++) {
      html += '<td><ul>';
      var top = scenario.frames[s].solutions.slice(0, 3);
      for (var t = 0; t < top.length; t++) {
        html += '<li>' + escapeHtml(top[t]) + '</li>';
      }
      html += '</ul></td>';
    }
    html += '</tr>';

    html += '<tr><td class="compare-dim">Impact</td>';
    for (var p = 0; p < scenario.frames.length; p++) {
      html += '<td>' + escapeHtml(scenario.frames[p].impact) + '</td>';
    }
    html += '</tr>';

    html += '</tbody></table>';
    html += '</div>';
    html += '</div>';

    els.comparePanel.innerHTML = html;
    els.comparePanel.style.display = '';
    log('Comparing all frames for: ' + scenario.title);
    state.framesCompared += scenario.frames.length;
    updateStats();
  }

  function renderCustomFrameEditor(problemText) {
    var html = '';
    html += '<div class="scenario-problem-card fade-in">';
    html += '<h3 class="scenario-problem-title">Custom Problem</h3>';
    html += '<p class="scenario-problem-text">' + escapeHtml(problemText) + '</p>';
    html += '</div>';

    html += '<div class="frame-cards-row">';
    for (var i = 0; i < 3; i++) {
      html += '<div class="frame-card frame-card-editable slide-up" style="animation-delay: ' + (i * 0.1) + 's;">';
      html += '<div class="frame-edit-group">';
      html += '<label class="control-label">Frame ' + (i + 1) + ' Name</label>';
      html += '<input class="control-input custom-frame-name" data-idx="' + i + '" placeholder="e.g., The Hospitality Frame">';
      html += '</div>';
      html += '<div class="frame-edit-group">';
      html += '<label class="control-label">Metaphor</label>';
      html += '<input class="control-input custom-frame-metaphor" data-idx="' + i + '" placeholder="e.g., Hotel lobby">';
      html += '</div>';
      html += '<div class="frame-edit-group">';
      html += '<label class="control-label">Description</label>';
      html += '<textarea class="control-textarea custom-frame-desc" data-idx="' + i + '" placeholder="How does this frame redefine the problem?" style="min-height: 70px;"></textarea>';
      html += '</div>';
      html += '<div class="frame-edit-group">';
      html += '<label class="control-label">Solutions (one per line)</label>';
      html += '<textarea class="control-textarea custom-frame-solutions" data-idx="' + i + '" placeholder="Solution 1\nSolution 2\nSolution 3" style="min-height: 70px;"></textarea>';
      html += '</div>';
      html += '<div class="frame-edit-group">';
      html += '<label class="control-label">Stakeholder Impact</label>';
      html += '<textarea class="control-textarea custom-frame-impact" data-idx="' + i + '" placeholder="What is the overall effect on stakeholders?" style="min-height: 50px;"></textarea>';
      html += '</div>';
      html += '</div>';
    }
    html += '</div>';

    html += '<div style="text-align: center; margin: 24px 0 8px;">';
    html += '<button class="sim-btn sim-btn-primary" id="btn-custom-compare">Compare My Frames</button>';
    html += '</div>';

    els.scenarioContent.innerHTML = html;
    state.scenariosExplored.add('custom');
    updateStats();

    var btnCustomCompare = document.getElementById('btn-custom-compare');
    if (btnCustomCompare) {
      btnCustomCompare.addEventListener('click', function () {
        var frames = collectCustomFrames();
        if (frames.length === 0) return;
        var customScenario = {
          title: 'Custom Problem',
          problem: problemText,
          frames: frames
        };
        renderCompareView(customScenario);
        log('Comparing custom frames');
      });
    }
  }

  function collectCustomFrames() {
    var frames = [];
    var names = document.querySelectorAll('.custom-frame-name');
    var metaphors = document.querySelectorAll('.custom-frame-metaphor');
    var descs = document.querySelectorAll('.custom-frame-desc');
    var sols = document.querySelectorAll('.custom-frame-solutions');
    var impacts = document.querySelectorAll('.custom-frame-impact');

    for (var i = 0; i < 3; i++) {
      var name = names[i] ? names[i].value.trim() : '';
      if (!name) name = 'Frame ' + (i + 1);
      frames.push({
        name: name,
        metaphor: metaphors[i] ? metaphors[i].value.trim() || '—' : '—',
        description: descs[i] ? descs[i].value.trim() || '—' : '—',
        solutions: sols[i] ? sols[i].value.trim().split('\n').filter(function (s) { return s.trim(); }) : [],
        impact: impacts[i] ? impacts[i].value.trim() || '—' : '—'
      });
    }
    return frames;
  }

  function updateStats() {
    els.statScenarios.textContent = state.scenariosExplored.size;
    els.statCompared.textContent = state.framesCompared;
    els.statActive.textContent = state.activeFrame || 'None';
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
