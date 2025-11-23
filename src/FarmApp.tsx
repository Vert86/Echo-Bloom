import React, { useEffect } from 'react';
import { useFarmStore } from './store/farmStore';
import { FarmGrid } from './components/FarmGrid';
import { FarmUI } from './components/FarmUI';
import { FarmShop } from './components/FarmShop';
import { DialogueBox } from './components/DialogueBox';
import { CommunityPanel } from './components/CommunityPanel';
import { DIALOGUE_TEMPLATES } from './types/farming';

export const FarmApp: React.FC = () => {
  const {
    initializeFarm,
    showShop,
    showDialogue,
    showDialogueBox,
    loadGame
  } = useFarmStore();

  useEffect(() => {
    // Try to load saved game first
    loadGame();

    // If no saved game, initialize new farm
    const tiles = useFarmStore.getState().tiles;
    if (tiles.every(row => row.every(tile => tile.type === 'empty'))) {
      initializeFarm();
    }

    // Show welcome dialogue after 2 seconds
    setTimeout(() => {
      const welcomeDialogue = DIALOGUE_TEMPLATES.farmer[0];
      showDialogueBox(welcomeDialogue);
    }, 2000);

    // Auto-save every 30 seconds
    const saveInterval = setInterval(() => {
      useFarmStore.getState().saveGame();
    }, 30000);

    return () => clearInterval(saveInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-eco-900 p-4 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-eco-400 to-eco-600 mb-2">
            🌾 Echo Bloom Farm 🌾
          </h1>
          <p className="text-slate-400 text-lg">
            Build your farming empire from the ground up!
          </p>
        </div>

        {/* UI Components */}
        <FarmUI />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Farm Grid - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <FarmGrid />
          </div>

          {/* Community Panel - Takes 1 column */}
          <div className="lg:col-span-1">
            <CommunityPanel />
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-4 text-center text-slate-400 text-sm bg-slate-800/50 rounded-lg p-4">
          <p className="mb-2">💡 <strong>Quick Start Guide:</strong></p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <p>🛒 Buy seeds from the shop and plant them on soil</p>
            <p>💧 Water your crops regularly to help them grow</p>
            <p>🌾 Harvest mature crops to earn cash</p>
            <p>🐄 Purchase animals for steady income</p>
            <p>🏗️ Build structures to expand your farm</p>
            <p>👨‍🌾 Hire workers to automate tasks</p>
          </div>
        </div>

        {/* Shop Modal */}
        {showShop && <FarmShop />}

        {/* Dialogue Modal */}
        {showDialogue && <DialogueBox />}
      </div>
    </div>
  );
};
