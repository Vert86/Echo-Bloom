import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { GameBoard } from './components/GameBoard';
import { ResourcePanel } from './components/ResourcePanel';
import { SystemicLoadMeter } from './components/SystemicLoadMeter';
import { BuildMenu } from './components/BuildMenu';
import { PowerUps } from './components/PowerUps';
import { GameControls } from './components/GameControls';
import { GameOver } from './components/GameOver';
import { Tutorial } from './components/Tutorial';
import { MicroCulturePanel } from './components/MicroCulturePanel';
import { Menu, X } from 'lucide-react';

function App() {
  const [buildMenuOpen, setBuildMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loadGame } = useGameStore();

  // Load saved game on mount
  useEffect(() => {
    loadGame();
  }, [loadGame]);

  return (
    <div className="w-full h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌿</span>
          <div>
            <h1 className="text-xl font-bold text-eco-400">Echo Bloom</h1>
            <p className="text-xs text-slate-400">The Micro-Ecosystem Builder</p>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn btn-secondary p-2 md:hidden"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Game Controls & Resources */}
        <aside
          className={`
            w-full md:w-80 bg-slate-800 border-r border-slate-700 overflow-y-auto p-4 space-y-4
            ${sidebarOpen ? 'block' : 'hidden'} md:block
            absolute md:relative h-full z-40
          `}
        >
          <GameControls onOpenBuildMenu={() => setBuildMenuOpen(true)} />
          <ResourcePanel />
          <MicroCulturePanel />
        </aside>

        {/* Main Game Board */}
        <main className="flex-1 p-4 overflow-hidden">
          <GameBoard />
        </main>

        {/* Right Sidebar - Status & Power-ups */}
        <aside
          className={`
            w-full md:w-80 bg-slate-800 border-l border-slate-700 overflow-y-auto p-4 space-y-4
            ${sidebarOpen ? 'block' : 'hidden'} md:block
            absolute md:relative h-full z-40 right-0
          `}
        >
          <SystemicLoadMeter />
          <PowerUps />

          {/* Quick Tips */}
          <div className="card bg-gradient-to-br from-eco-900/20 to-eco-800/10 border-eco-700/50">
            <h3 className="font-bold text-sm text-eco-400 mb-2">💡 Quick Tips</h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li>• Build closed-loop systems where waste becomes input</li>
              <li>• Keep Systemic Load below 80% to avoid penalties</li>
              <li>• Use power-ups strategically in critical situations</li>
              <li>• Balance all three Micro-Cultures for stability</li>
              <li>• Upgrade buildings to increase efficiency</li>
            </ul>
          </div>

          {/* Game Info */}
          <div className="card">
            <h3 className="font-bold text-sm text-eco-400 mb-2">📖 About</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Echo Bloom is a strategy game about building resilient circular economies.
              Manage three unique Micro-Cultures, optimize resource flows, and prevent
              system collapse in a post-cataclysm world.
            </p>
          </div>
        </aside>
      </div>

      {/* Overlays */}
      <BuildMenu isOpen={buildMenuOpen} onClose={() => setBuildMenuOpen(false)} />
      <GameOver />
      <Tutorial />

      {/* Close sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
