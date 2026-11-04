# Zen Meditation Interval Timer

A minimalist, responsive single-page interval timer designed for distraction-free mindfulness and Zazen practice. Built with React and modern CSS, optimized for both touch-first mobile devices and desktop viewports.

---

## ✨ Features & Design Highlights

### 1. Zen Minimalist Aesthetic
- **Warm Dark Palette**: Deep charcoal / stone tones (`#121413`), muted sage accents (`#9cb197`), and gentle sand highlights (`#dfd5c6`).
- **Serene Typography**: Classic serif (`Cormorant Garamond`) for meditative time and titles paired with clean geometric sans (`Plus Jakarta Sans`) for legible parameters.
- **Ambient Aura**: Soft, subtle breathing glow in the background that expands and contracts gently.

### 2. Configuration UI
- **Intervals Stepper**: Direct number input + tactile stepper buttons with large touch targets.
- **Minutes per Interval Stepper**: Adjust duration per meditation cycle.
- **Live Session Duration Calculation**: Automatically computes and highlights total duration (e.g. `4 × 5 min = 20 minutes total`).
- **Quick-Select Preset Pills**: One-tap presets (`4 × 5m`, `3 × 10m`, `6 × 5m`, `2 × 15m`, `1 × 20m`, `4 × 15m`).

### 3. Active Timer View
- **Large Central Countdown**: High-legibility `MM:SS` display with tabular numerals.
- **Depleting SVG Circular Ring**: Smooth SVG progress ring that gracefully depletes as time progresses.
- **Subtle Interval Indicator**: Gentle pill display (`Interval 2 of 4`) with an ambient pulsing indicator.
- **Ergonomic Zen Controls**: Tactile Play/Pause (72px) and Reset buttons designed for mobile thumbs.
- **Mock State Inspection Toolbar**: Interactive slider and preset triggers to preview any interval stage or ring depletion percentage.

### 4. Responsive Layout
- **Mobile Touch Screens**: Single column focus, minimum 48px touch targets, full-height (`100dvh`) safe viewport handling.
- **Desktop / Wide Screens**: Tranquil side-by-side Dual View or focused card presentation.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📂 Project Architecture

```
meditation-bell/
├── index.html                  # HTML entry point with Zen typography
├── package.json                # Project dependencies and scripts
├── vite.config.js              # Vite configuration
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # App layout, state coordination & view modes
    ├── index.css               # Zen design system & responsive styling
    └── components/
        ├── Header.jsx          # Serene Zen header & logo mark
        ├── IntervalConfig.jsx  # Configuration view & session duration banner
        ├── Stepper.jsx         # Accessible stepper with + / - controls
        ├── PresetPills.jsx     # Quick-select interval presets
        ├── ActiveTimer.jsx     # Central countdown & interval indicator
        ├── CircularProgress.jsx# SVG circular progress ring
        └── ZenControls.jsx     # Mobile-optimized Play/Pause & Reset buttons
```
