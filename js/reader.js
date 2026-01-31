/**
 * reader.js - Document Reader Module
 *
 * Handles page navigation, view toggling (image/text), zoom controls,
 * context menu, search, keyboard shortcuts, and localStorage persistence
 * for a 221-page document reader.
 */
(function () {
  'use strict';

  // ── Constants ──────────────────────────────────────────────────────
  const TOTAL_PAGES = 221;
  const ZOOM_LEVELS = [70, 80, 90, 100, 110, 120, 130, 140];
  const LS_PAGE = 'reader-page';
  const LS_VIEW = 'reader-view';
  const LS_ZOOM = 'reader-zoom';

  // ── State ──────────────────────────────────────────────────────────
  let currentPage = 1;
  let viewMode = 'image'; // 'image' | 'text'
  let zoomLevel = 100;
  let contextMenuOpen = false;

  // ── DOM References ─────────────────────────────────────────────────
  const els = {};

  function cacheDom() {
    els.pageCounter   = document.getElementById('page-counter');
    els.pageDisplay   = document.getElementById('page-display');
    els.imageView     = document.getElementById('image-view');
    els.textView      = document.getElementById('text-view');
    els.textContent   = document.getElementById('text-content');
    els.pageImage     = document.getElementById('page-image');
    els.btnPrev       = document.getElementById('btn-prev');
    els.btnNext       = document.getElementById('btn-next');
    els.pageInput     = document.getElementById('page-input');
    els.progressBar   = document.getElementById('progress-bar');
    els.zoomPanel     = document.getElementById('zoom-panel');
    els.openNewTab    = document.getElementById('open-new-tab');
    els.contextFab    = document.getElementById('context-fab');
    els.contextMenu   = document.getElementById('context-menu');
    els.ctxPrev       = document.getElementById('ctx-prev');
    els.ctxNext       = document.getElementById('ctx-next');
    els.ctxPageLabel  = document.getElementById('ctx-page-label');
    els.ctxToggleView = document.getElementById('ctx-toggle-view');
    els.ctxClose      = document.getElementById('ctx-close');
    els.searchInput   = document.getElementById('search-input');
    els.searchResults = document.getElementById('search-results');
  }

  // ── Helpers ────────────────────────────────────────────────────────

  /** Zero-pad a number to 4 digits: 1 -> "0001" */
  function pad(n) {
    return String(n).padStart(4, '0');
  }

  /** Build the image path for a given page number. */
  function imagePath(page) {
    return 'pages/page_' + pad(page) + '.jpg';
  }

  /** Build the text fragment path for a given page number. */
  function textPath(page) {
    return 'text/page_' + pad(page) + '.html';
  }

  /** Clamp a value between min and max. */
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  // ── Persistence ────────────────────────────────────────────────────

  function saveState() {
    try {
      localStorage.setItem(LS_PAGE, String(currentPage));
      localStorage.setItem(LS_VIEW, viewMode);
      localStorage.setItem(LS_ZOOM, String(zoomLevel));
    } catch (_) {
      // localStorage may be unavailable; silently ignore
    }
  }

  function loadState() {
    try {
      var savedPage = parseInt(localStorage.getItem(LS_PAGE), 10);
      if (savedPage >= 1 && savedPage <= TOTAL_PAGES) currentPage = savedPage;

      var savedView = localStorage.getItem(LS_VIEW);
      if (savedView === 'image' || savedView === 'text') viewMode = savedView;

      var savedZoom = parseInt(localStorage.getItem(LS_ZOOM), 10);
      if (ZOOM_LEVELS.indexOf(savedZoom) !== -1) zoomLevel = savedZoom;
    } catch (_) {
      // Ignore
    }
  }

  // ── URL Param Parsing ──────────────────────────────────────────────

  function parseUrlPage() {
    var params = new URLSearchParams(window.location.search);
    var p = parseInt(params.get('page'), 10);
    if (p >= 1 && p <= TOTAL_PAGES) {
      currentPage = p; // URL param overrides localStorage
    }
  }

  function updateUrlParam() {
    var url = new URL(window.location);
    url.searchParams.set('page', currentPage);
    history.replaceState(null, '', url);
  }

  // ── Navigation ─────────────────────────────────────────────────────

  /**
   * Navigate to a specific page.
   * Validates the page number, updates all UI elements, fetches text
   * if in text mode, and persists state.
   */
  function goToPage(n) {
    n = clamp(n, 1, TOTAL_PAGES);
    currentPage = n;

    // Update image source
    els.pageImage.src = imagePath(n);
    els.pageImage.alt = 'Page ' + n;

    // If in text view, fetch the HTML fragment
    if (viewMode === 'text') {
      fetchTextContent(n);
    }

    // Update progress bar
    var progress = ((n - 1) / (TOTAL_PAGES - 1)) * 100;
    els.progressBar.style.width = progress + '%';

    // Update page counter
    els.pageCounter.textContent = 'Page ' + n + ' of ' + TOTAL_PAGES;

    // Update page input
    els.pageInput.value = n;

    // Update context menu page label
    els.ctxPageLabel.textContent = 'Page ' + n;

    // Update "Open in new tab" link
    els.openNewTab.href = imagePath(n);

    // Update URL and persist
    updateUrlParam();
    saveState();
  }

  /** Fetch and inject the HTML text fragment for a page. */
  function fetchTextContent(page) {
    els.textContent.innerHTML = '<p style="color:#5f6368;">Loading text...</p>';
    fetch(textPath(page))
      .then(function (res) {
        if (!res.ok) throw new Error('Not found');
        return res.text();
      })
      .then(function (html) {
        els.textContent.innerHTML = html;
      })
      .catch(function () {
        els.textContent.innerHTML =
          '<p style="color:#d93025;">Text not available for this page.</p>';
      });
  }

  // ── View Toggle ────────────────────────────────────────────────────

  /** Switch between image and text display modes. */
  function toggleView() {
    if (viewMode === 'image') {
      viewMode = 'text';
      els.imageView.style.display = 'none';
      els.textView.style.display = 'block';
      fetchTextContent(currentPage);
      els.ctxToggleView.textContent = 'Switch to Image View';
    } else {
      viewMode = 'image';
      els.imageView.style.display = 'block';
      els.textView.style.display = 'none';
      els.ctxToggleView.textContent = 'Switch to Text View';
    }
    saveState();
  }

  // ── Zoom ───────────────────────────────────────────────────────────

  /** Apply a zoom level to the page display area. */
  function setZoom(level) {
    if (ZOOM_LEVELS.indexOf(level) === -1) return;
    zoomLevel = level;

    // Scale the page display container
    var scale = level / 100;
    els.pageDisplay.style.transform = 'scale(' + scale + ')';

    // Highlight the active zoom button
    var buttons = els.zoomPanel.querySelectorAll('.zoom-btn');
    buttons.forEach(function (btn) {
      btn.classList.toggle('active', parseInt(btn.dataset.zoom, 10) === level);
    });

    saveState();
  }

  // ── Context Menu ───────────────────────────────────────────────────

  function openContextMenu() {
    contextMenuOpen = true;
    els.contextMenu.style.display = 'flex';
    els.searchInput.value = '';
    els.searchResults.innerHTML = '';
  }

  function closeContextMenu() {
    contextMenuOpen = false;
    els.contextMenu.style.display = 'none';
  }

  function toggleContextMenu() {
    if (contextMenuOpen) {
      closeContextMenu();
    } else {
      openContextMenu();
    }
  }

  // ── Search ─────────────────────────────────────────────────────────

  /**
   * Filter window.pagesData by title and searchText fields.
   * pagesData is expected to be a global array of objects with at least
   * { page: number, title: string, searchText?: string }.
   */
  function performSearch(query) {
    els.searchResults.innerHTML = '';

    if (!query || query.length < 2) return;
    if (!window.pagesData || !Array.isArray(window.pagesData)) return;

    var lower = query.toLowerCase();
    var matches = [];

    for (var i = 0; i < window.pagesData.length && matches.length < 5; i++) {
      var entry = window.pagesData[i];
      var title = (entry.title || '').toLowerCase();
      var text = (entry.searchText || '').toLowerCase();
      if (title.indexOf(lower) !== -1 || text.indexOf(lower) !== -1) {
        matches.push(entry);
      }
    }

    matches.forEach(function (entry) {
      var li = document.createElement('li');
      li.innerHTML =
        '<span class="result-page">p.' + entry.page + '</span>' +
        '<span class="result-title">' + escapeHtml(entry.title || 'Untitled') + '</span>';
      li.addEventListener('click', function () {
        goToPage(entry.page);
        closeContextMenu();
      });
      els.searchResults.appendChild(li);
    });
  }

  /** Basic HTML escape for search result display. */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Keyboard Shortcuts ─────────────────────────────────────────────

  function handleKeydown(e) {
    // Ignore shortcuts when typing in an input field
    var tag = (e.target.tagName || '').toLowerCase();
    var isInput = tag === 'input' || tag === 'textarea';

    if (e.key === 'Escape') {
      closeContextMenu();
      return;
    }

    // Page input: Enter jumps to page
    if (isInput && e.target === els.pageInput && e.key === 'Enter') {
      var val = parseInt(els.pageInput.value, 10);
      if (val >= 1 && val <= TOTAL_PAGES) goToPage(val);
      return;
    }

    // Skip remaining shortcuts if user is typing in an input
    if (isInput) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPage(currentPage - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToPage(currentPage + 1);
        break;
      case 'v':
      case 'V':
        toggleView();
        break;
      case 'm':
      case 'M':
        toggleContextMenu();
        break;
    }
  }

  // ── Event Binding ──────────────────────────────────────────────────

  function bindEvents() {
    // Navigation buttons
    els.btnPrev.addEventListener('click', function () {
      goToPage(currentPage - 1);
    });
    els.btnNext.addEventListener('click', function () {
      goToPage(currentPage + 1);
    });

    // Page input: navigate on Enter
    els.pageInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var val = parseInt(els.pageInput.value, 10);
        if (val >= 1 && val <= TOTAL_PAGES) goToPage(val);
      }
    });

    // Zoom panel: event delegation on zoom buttons
    els.zoomPanel.addEventListener('click', function (e) {
      var btn = e.target.closest('.zoom-btn');
      if (btn && btn.dataset.zoom) {
        setZoom(parseInt(btn.dataset.zoom, 10));
      }
    });

    // Context menu FAB
    els.contextFab.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleContextMenu();
    });

    // Close context menu: click outside the card
    els.contextMenu.addEventListener('click', function (e) {
      if (e.target === els.contextMenu) {
        closeContextMenu();
      }
    });

    // Context menu buttons
    els.ctxPrev.addEventListener('click', function () {
      goToPage(currentPage - 1);
    });
    els.ctxNext.addEventListener('click', function () {
      goToPage(currentPage + 1);
    });
    els.ctxToggleView.addEventListener('click', function () {
      toggleView();
    });
    els.ctxClose.addEventListener('click', function () {
      closeContextMenu();
    });

    // Search input: filter on typing
    els.searchInput.addEventListener('input', function () {
      performSearch(els.searchInput.value.trim());
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeydown);
  }

  // ── Initialization ─────────────────────────────────────────────────

  function init() {
    cacheDom();

    // Load persisted state, then check URL param (URL overrides stored page)
    loadState();
    parseUrlPage();

    // Apply view mode
    if (viewMode === 'text') {
      els.imageView.style.display = 'none';
      els.textView.style.display = 'block';
      els.ctxToggleView.textContent = 'Switch to Image View';
    }

    // Apply zoom level
    setZoom(zoomLevel);

    // Navigate to the resolved page (renders everything)
    goToPage(currentPage);

    // Bind all event listeners
    bindEvents();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
