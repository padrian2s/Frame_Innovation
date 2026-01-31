# Site Features

## Overview

Interactive study guide for academic papers — built as a static site with zero external dependencies (vanilla JavaScript, CSS, HTML). Combines a full document reader with hands-on interactive simulators.

---

## Landing Page

- Hero section with gradient background and document metadata
- Quick action buttons for primary navigation (read document, explore simulators)
- Table of contents organized by topic with color-coded cards and icons
- Simulator showcase grid with preview cards
- Hover effects on all cards (translateY, shadow, scale)
- Deep linking — clicking a section navigates directly to the relevant page in the reader
- Responsive layout with CSS Grid auto-fill

---

## Document Reader

### Navigation
- Arrow navigation (buttons + keyboard ← →)
- Page number input for direct jump
- Progress bar showing current position in document
- Page counter badge (top-right)

### Dual View
- **Image View** (default) — original page images
- **Text View** — structured HTML transcription with per-page commentary
- Toggle between modes via keyboard shortcut (`V`) or menu

### Per-Page Commentary (Text View)

This is the core educational feature. Every single page has a dedicated, hand-crafted text view that goes far beyond a simple transcription. The user doesn't just read — they get a guided digest of each page.

**Why this matters:** Academic papers are dense. A reader can stare at a page and miss the point, misunderstand the implications, or not see how a concept connects to practice. The per-page commentary solves this by layering explanation on top of the original content, page by page, so the user never has to wonder "what does this actually mean?"

Each page's text view is structured in two layers:

#### Layer 1 — Original Content (faithfully transcribed)
- Full text of the page, structured with proper headings, lists, and paragraphs
- **Definition boxes** (green) — core definitions and formal concepts, visually isolated so they stand out
- **Highlight boxes** (blue) — important data, tables, key findings
- **Figure boxes** (yellow) — descriptions of figures and visual content, explaining what the diagram shows and why it matters
- Citations preserved and styled for reference

#### Layer 2 — Analysis & Commentary (the digest)
- Appears below the original content on every page, inside distinct gray blocks
- Breaks down the page's ideas into plain-language explanations
- Structured with sub-sections such as:
  - **Summary** — what this page is actually saying, in simple terms
  - **Key Patterns** — recurring themes or mechanisms the reader should notice
  - **Practical Applications** — how the concept applies in real-world systems
  - **Real-World Examples** — concrete, relatable scenarios that illustrate abstract concepts (see below)
  - **Selection Criteria** — when to choose one approach over another
  - **Key Contributions** — what this section adds to the field

#### Real-World Examples (AI-generated, on demand)
The commentary includes real-world examples wherever they help understanding. This is not applied uniformly — the AI decides per page whether an example adds value:

- **When a topic is abstract or hard to grasp**, the commentary generates a concrete scenario the reader can relate to (e.g., explaining a planning algorithm by comparing it to how a GPS recalculates a route, or illustrating multi-agent collaboration through a team of specialists diagnosing a patient)
- **When a topic is already concrete or self-evident**, no forced example is added — the commentary stays lean and doesn't pad with unnecessary analogies
- **The decision is contextual**: a page introducing mathematical formalism gets a grounding example; a page listing benchmark results does not
- Examples are meant to bridge the gap between theory and intuition — they answer "what would this look like in a real system?" without oversimplifying the concept

**How the user should use it:**
1. Start in Image View to see the original paper as-is
2. Press `V` to switch to Text View for the same page
3. Read the original content first, then scroll to the analysis section
4. The analysis acts as a personal tutor — it tells you what matters, what to remember, and how to apply it
5. Use this on every page, not just the hard ones — even familiar topics get context and connections you might miss

**Why every page has commentary, not just selected ones:**
- Skipping pages creates gaps in understanding; the paper builds concepts incrementally
- Even "simple" pages (introductions, overviews) set up terminology and framing that the analysis clarifies
- Reference pages get commentary on key themes and groupings, not just raw citations
- The goal is that a reader can go cover-to-cover in text view and come out with a complete, deep understanding — not just a surface read

### Zoom
- 8 zoom levels: 70% – 140%
- Hidden slide-out panel on the left edge, activated on hover
- Active level highlighted
- Open image in new tab

### Context Menu
- Floating action button (bottom-right)
- Opens via click or keyboard shortcut (`M`)
- Contains: navigation controls, view toggle, search, quick actions
- Semi-transparent overlay backdrop

### Search
- Real-time search across page titles and content
- Minimum 2 characters to trigger
- Up to 5 results displayed
- Click result to jump to page

### Keyboard Shortcuts
- `←` Previous page
- `→` Next page
- `V` Toggle Image/Text view
- `M` Toggle menu
- `Escape` Close menu

### Persistence
- View mode saved in localStorage
- Zoom level saved in localStorage
- Restored on page reload

---

## Interactive Simulators

Each simulator includes: concept explanation, interactive controls (sliders, inputs, dropdowns), Start/Step/Reset buttons, animation speed control, real-time visualization, log panel, live statistics, and a unique color theme.

### Tree of Thoughts
- Problem input with configurable target
- Search strategy selector: BFS, DFS, Beam Search
- Beam width slider
- Dynamic animated tree canvas
- Color-coded node states: root, exploring, evaluated, solution, pruned
- Pulse animations on active nodes
- Visual legend for node states
- Live stats: nodes explored, current depth, best score

### ReAct Agent
- Query/task input
- Max iterations slider
- Interactive tool cards (Search, Calculate, Lookup) with active highlighting
- Trace panel with 4 color-coded entry types: Thought, Action, Observation, Answer
- Visualized knowledge base

### Reflexion Feedback
- Task selector with dynamic description
- 3-step workflow diagram: Generate → Evaluate → Reflect
- Iteration cards with status badges (pass/fail/pending)
- Per-iteration sections: generated code, test results, errors, reflection, revised approach
- Memory panel storing past reflections
- Gradient progress bar

### Agentic Memory
- Memory architecture selector: Flat, Graph, Hierarchical
- Actions: add memory, clear all, retrieval test
- Dual-panel view: Memory Store + Retrieval Results
- Interactive graph visualization (drag-and-drop nodes, relational edges)
- Color-coded relevance scores per result
- Timestamp and access count tracking

### Multi-Agent Collaboration
- Task input for team problem-solving
- Topology selector: Star, Mesh, Pipeline
- Agent cards with avatars, role labels, and status indicators (active, thinking, idle)
- Message feed with bubbles (sender, message type, timestamp)
- Pulse animations when an agent communicates
- Subtask panel with status icons

### Agentic RAG
- Side-by-side comparison: Traditional RAG vs Agentic RAG
- Step-by-step pipeline visualization
- Document cards with snippet, title, and relevance score (high/med/low)
- Thought bubbles showing agent reasoning
- Comparative metrics: documents retrieved, iterations, relevant documents found

### POMDP Agent
- Interactive grid world with fog of war
- Goal position selector, obstacle slider, observation radius slider
- Manual action controls (directional + sense)
- Belief state grid with displayed probabilities and color-coded intensity
- Execution trace: Think, Act, Observe
- Live stats: steps taken, goal distance, belief entropy, total reward
- Policy diagram with formula display

---

## UX Patterns

### Design System
- Unique color theme per simulator
- Typography: serif for headings, system sans-serif for UI, monospace for code
- Rounded corners throughout (8-15px border radius)
- Hover states on all buttons (transform + shadow)
- Smooth transitions (0.2-0.3s ease)
- Animations: pulse, fadeIn, slideIn, blink

### Responsive Design
- Landing page: flexible auto-fill grids
- Reader: breakpoint at 768px with adapted fonts and padding
- Simulators: controls collapse to single column on mobile
- Touch-friendly button sizes (40-56px)

### Accessibility
- Full keyboard navigation
- ARIA labels on buttons and interactive elements
- High contrast text/background
- Semantic HTML structure (h1-h4, nav, header, main)
- Readable font sizes (14-18px)

### Performance
- Lazy loading — content loaded on demand
- Zero external dependencies
- Modular ES6 architecture
- CSS custom properties for theming
- GPU-accelerated transforms (transform, opacity)
- LocalStorage caching

---

## What the User Gets

1. **Page-by-page commentary on every single page** — the defining feature; each page has a structured digest with plain-language summary, key patterns, practical applications, and analysis that turns a dense paper into an accessible learning experience
2. **Two-layer reading** — see the original content first, then read the commentary below it; the user controls the depth of engagement per page
3. **Full document reader** with zoom, search, fast navigation, and dual view modes
4. **Interactive simulators** demonstrating concepts through direct manipulation
5. **Zero-friction experience** — no install, no dependencies, runs entirely in the browser
6. **Session persistence** — zoom level and view mode preserved between visits
7. **Intuitive navigation** — keyboard shortcuts, progress bar, search, deep links
8. **Responsive design** — works on desktop and mobile
9. **Active learning** — each simulator allows experimenting with parameters and observing results in real time
