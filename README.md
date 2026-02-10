# 🌳 XX-Tree — Knowledge Constellation

**Watch history grow.** XX-Tree is an interactive knowledge visualization tool that renders the evolution of any topic as a living, breathing constellation tree. Enter a keyword — like *"Artificial Intelligence"* — and watch branches of innovation unfold across a cosmic timeline.

![XX-Tree](https://img.shields.io/badge/status-alpha-blue) ![React](https://img.shields.io/badge/React-18-61dafb?logo=react) ![D3](https://img.shields.io/badge/D3.js-7-f9a03c?logo=d3.js) ![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)

---

## ✨ Features

### 🔭 Cosmic Timeline Visualization
- **Horizontal branching tree** — nodes are placed chronologically on a timeline (left → right = older → newer)
- **Branch-colored constellations** — each discipline gets a unique color (Neural Networks = blue, NLP = green, etc.)
- **Cross-reference arcs** — dashed electric arcs show interdisciplinary connections between nodes

### 🌟 Living Visual Effects
- **Breathing nodes** — concentric pulse rings expand and contract at desynchronized rhythms, giving each node a heartbeat
- **Inner energy cores** — a pulsing glow inside each node swells and dims
- **Rotating orbit rings** — dashed rings slowly orbit non-root nodes like satellites
- **Energy-flow links** — organic turbulence-textured lines with luminous dots traveling from parent to child
- **Electric cross-references** — animated turbulence filter makes relationship arcs shimmer like electricity
- **Particle overlay** — a Canvas layer renders tiny orbiting sparks around every node, synced with zoom/pan
- **Starfield background** — drifting, twinkling particles create a deep-space atmosphere

### 🔍 Search & Explore
- Enter **any keyword** to generate a history tree (built-in rich dataset for "AI / Artificial Intelligence")
- **Click any node** to open a detail panel with description, official link, parent/children, and cross-references
- Navigate between connected nodes from the detail panel
- **Pan & zoom** (scroll to zoom, drag to pan) with fit-to-view button

### 🌿 Animated Tree Growth
- Nodes reveal one-by-one with staggered scale-in transitions
- Links draw themselves with a stroke animation as branches extend
- Cross-references fade in after the tree structure is complete
- A progress bar shows the crawl phase (root → branches → connections → done)

### 🧩 Modular & Extensible
- Swap in **any topic** — the architecture treats every keyword as a new tree root
- Plug in real APIs (Semantic Scholar, NewsAPI, Wikipedia) to replace the mock crawler
- Node classification and parent-finding are abstracted for future AI-powered placement

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/xx-tree.git
cd xx-tree

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run preview    # Preview the production build locally
```

---

## 📖 Usage

1. **Launch the app** — you'll see a centered search bar with the XX-Tree logo
2. **Enter a topic** — type "Artificial Intelligence" (or click a suggestion chip) and press Enter / click "Explore"
3. **Watch it grow** — the tree animates in node-by-node with a progress bar at the bottom
4. **Explore** — scroll to zoom, drag to pan, click any node to see its details
5. **Navigate** — use the detail panel to jump between parent, children, and cross-referenced nodes
6. **Try another topic** — use the search bar (now at the top) to start a new tree

### Keyboard & Mouse

| Action | Input |
|---|---|
| Search | Type keyword + `Enter` |
| Zoom in/out | Scroll wheel / `+` `−` buttons |
| Pan | Click + drag |
| Select node | Click on node |
| Close detail panel | Click `✕` |
| Fit to view | Click `⊡` button |

---

## 🏗 Architecture

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Root component, orchestrates search → crawl → render
├── index.css                   # Global styles, theme, all animations
├── store/
│   └── useTreeStore.js         # Zustand store — tree data, crawl state, UI state
├── data/
│   └── mockData.js             # AI history dataset + generic tree generator + color maps
├── services/
│   └── crawlerService.js       # Simulated crawler with progressive node reveal
├── utils/
│   └── treeLayout.js           # D3 hierarchy layout, Bézier path generators, timeline
└── components/
    ├── SearchBar.jsx            # Landing / top search input with suggestion chips
    ├── TreeVisualization.jsx    # Core SVG tree: nodes, links, cross-refs, filters, zoom
    ├── NodeParticleOverlay.jsx  # Canvas particle system orbiting nodes
    ├── ParticleBackground.jsx   # Canvas starfield background
    ├── NodeDetailPanel.jsx      # Slide-in panel with node info + navigation
    ├── CrawlStatus.jsx          # Bottom progress bar during crawling
    └── Legend.jsx               # Node type & branch color legend
```

### Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 |
| Visualization | D3.js 7 (hierarchy, zoom, scales) + SVG + Canvas |
| State | Zustand |
| Build | Vite 5 |
| Styling | Plain CSS with custom properties |
| Effects | SVG filters (turbulence, displacement, blur), SMIL animations, Canvas 2D |

### Data Flow

```
User Input → crawlerService (simulated / API) → useTreeStore → D3 layout → SVG render
                                                      ↓
                                              NodeParticleOverlay (Canvas)
```

---

## 🔌 Extending with Real APIs

The `crawlerService.js` is designed to be swapped with real data sources. Replace the mock with:

| Source | API | What it provides |
|---|---|---|
| **Papers** | [Semantic Scholar API](https://api.semanticscholar.org/) | Research papers, citations, abstracts |
| **Software** | [GitHub API](https://docs.github.com/en/rest) / ProductHunt | Repos, release dates, descriptions |
| **News & Events** | [NewsAPI](https://newsapi.org/) / HackerNews | Trending articles, event timelines |
| **General Knowledge** | [Wikipedia API](https://www.mediawiki.org/wiki/API:Main_page) | Foundational context, history sections |

The node classification (`classifyNodeBranch`) and parent-finding (`findParentNode`) functions in `crawlerService.js` are stubs ready for LLM-powered or embedding-based implementation.

---

## 📄 License

MIT

---

<p align="center">
  <b>XX-Tree</b> — Every breakthrough has roots. Watch them grow. 🌳
</p>
