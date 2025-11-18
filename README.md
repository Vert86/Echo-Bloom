# 🌿 Echo Bloom: The Micro-Ecosystem Builder

A production-ready strategy game focused on building a resilient, circular economy in a post-cataclysm world.

## 🎮 Game Overview

Echo Bloom challenges you to manage a small community in an isolated valley where resources are scarce and non-renewable. Your goal is to create perfectly balanced, closed-loop systems where every waste product becomes an input for another system.

### Core Mechanics

- **Systemic Load Meter**: Your main constraint. Tracks unused waste, unmet needs, and resource deficits. Stay below 100% or face collapse!
- **Three Micro-Cultures**: Each with unique needs and outputs
  - 🌿 Hydroponic Guild: Food production
  - ⚙️ Bio-Engineers: Technology and recycling
  - 📚 Archive Keepers: Research and social harmony
- **Resource Cycling**: Create closed loops where waste becomes input
- **Power-Ups**: Flow Peek, Rewind Cycle, and System Auditor

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Platform Support

- **Web**: Fully responsive, works on all modern browsers
- **Mobile**: PWA-enabled for mobile installation
- **Touch Controls**: Optimized for touch interfaces

## 🎯 Game Features

### Production Ready

- ✅ TypeScript for type safety
- ✅ React 18 with modern hooks
- ✅ Zustand for state management
- ✅ PWA capabilities for offline play
- ✅ LocalStorage save/load system
- ✅ Responsive design (mobile & desktop)
- ✅ Touch-optimized controls

### Gameplay Features

- ✅ Build and upgrade buildings
- ✅ Manage complex resource flows
- ✅ Three unique Micro-Cultures
- ✅ Strategic power-up system
- ✅ Tutorial system for new players
- ✅ Real-time systemic load tracking
- ✅ Production cycle simulation
- ✅ Save/Load functionality

## 🏗️ Architecture

```
src/
├── components/       # React components
│   ├── GameBoard.tsx
│   ├── ResourcePanel.tsx
│   ├── SystemicLoadMeter.tsx
│   ├── BuildMenu.tsx
│   ├── PowerUps.tsx
│   └── ...
├── store/           # Zustand state management
│   └── gameStore.ts
├── data/            # Game data and blueprints
│   └── buildings.ts
├── types.ts         # TypeScript type definitions
└── main.tsx         # Application entry point
```

## 🎨 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PWA**: vite-plugin-pwa

## 🎓 How to Play

1. **Start Building**: Construct buildings to produce resources
2. **Create Loops**: Connect outputs to inputs for efficiency
3. **Monitor Load**: Keep Systemic Load below critical levels
4. **Use Power-Ups**: Strategic tools for optimization
5. **Survive**: Avoid 5 consecutive cycles at 100% load

## 📊 Performance

- Optimized bundle size with code splitting
- Efficient re-renders with React hooks
- LocalStorage for fast save/load
- PWA caching for offline performance

## 🔧 Development

```bash
# Run linter
npm run lint

# Type checking
npm run build
```

## 📄 License

MIT License - Feel free to use this project as you wish!

## 🤝 Contributing

This is a complete, production-ready game. Feel free to fork and extend it!

---

Built with ❤️ for strategy game enthusiasts
