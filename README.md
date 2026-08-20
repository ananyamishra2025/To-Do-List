# ✏️ Focus — Handcrafted Personal Task Manager

> A feature-rich, human-centered To-Do & Task Management web application built with **React 18**, **Vite**, and custom **Vanilla CSS**. Designed around human psychology, warm tactile aesthetics, and fluid productivity workflows.

![Focus App Interface](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ✨ Features Highlight

### 🎯 Human-Centered Design & Experience
- **Time-Aware Greeting & Dynamic Copy**: Friendly greetings (`Good morning`, `Good afternoon`) and time-sensitive motivational notes rather than generic robotic jargon.
- **Inline Quick Task Bar**: Add tasks directly from the main view (like Things 3 / Todoist) by typing and pressing `Enter ↵`.
- **Tactile Micro-Animations**: Spring-like checkmark animations, soft progress ring stroke, and organic HTML5 Canvas confetti particle bursts.
- **Web Audio API Tactile Sound**: Synthesized wooden pop sound on checking off tasks (native `AudioContext`, 0 asset files required). Toggle on/off anytime with `S`.

### ⚡ Advanced Task Management
- **Interactive Subtask Checklist**: Add nested checklist items inside any task card with a live progress bar indicator.
- **Task Pinning 📌**: Pin crucial tasks to stay permanently anchored at the top of your list.
- **Distraction-Free Focus Mode 🎯**: Spotlight spotlight view featuring a single active task, integrated **Stopwatch / Focus Timer**, and subtask checklist.
- **Estimated Task Duration**: Assign estimated completion times (`15 min`, `30 min`, `1 hr`, `2 hrs`).
- **Multi-Faceted Search, Filter & Sort**: Filter by status (`All`, `Active`, `Completed`), custom categories, priorities (`High`, `Medium`, `Low`), and sort by Date, Priority, or Title.
- **Backup & Restore (JSON)**: Export your complete task database to JSON and restore it anytime with one click.
- **LocalStorage Persistence**: Automatic browser state synchronization.

---

## ⌨️ Keyboard Shortcuts

Press `?` inside the app anytime to open the keyboard shortcuts cheatsheet:

| Key | Action |
| --- | --- |
| `N` | Create a new task modal |
| `F` | Focus search and filter input |
| `D` | Toggle Dark / Light theme |
| `S` | Toggle tactile sound effects |
| `P` | Toggle Distraction-Free Focus Mode |
| `Esc` | Close dialogs or clear focus |
| `?` | Open keyboard shortcuts guide |

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Custom Vanilla CSS with CSS Variables, Dark/Light Themes, and SVG animations
- **Audio & Visual Effects**: Web Audio API Synthesizer & Canvas Particle Systems

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ananyamishra2025/To-Do-List.git
   cd To-Do-List
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production bundle will be generated in the `dist/` directory.

---

## 📁 Project Structure

```
To-Do List/
├── index.html                  # Main HTML entry with Google Fonts
├── vite.config.js              # Vite configuration
├── package.json                # Manifest and dependencies
├── .env                        # Local environment variables
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── src/
│   ├── main.jsx                # React app entry
│   ├── App.jsx                 # Main state container & keyboard shortcuts
│   ├── App.css                 # Component layout & theme styles
│   ├── index.css               # Design system tokens & CSS reset
│   ├── components/
│   │   ├── Navbar.jsx          # Header navigation & backup controls
│   │   ├── TaskStats.jsx       # Analytics overview & streak badge
│   │   ├── ProgressRing.jsx    # SVG progress ring component
│   │   ├── QuickAdd.jsx        # Inline quick task creator bar
│   │   ├── TaskFilter.jsx      # Search, tabs, and filter controls
│   │   ├── TaskList.jsx        # Pinned & regular task groups
│   │   ├── TaskItem.jsx        # Task card with nested subtasks & pinning
│   │   ├── TaskModal.jsx       # Detailed create & edit dialog
│   │   ├── FocusMode.jsx       # Distraction-free spotlight overlay
│   │   ├── ShortcutsModal.jsx  # Keyboard shortcuts cheatsheet
│   │   └── Toast.jsx           # Notification toast alerts
│   ├── hooks/
│   │   └── useLocalStorage.js  # Persistent browser state hook
│   └── utils/
│       ├── audioAndCanvas.js   # Web Audio API pop & particle burst
│       └── taskExportImport.js # JSON export & restore helpers
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
