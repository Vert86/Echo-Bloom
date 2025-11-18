import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Play, Pause, RotateCcw, Save, Upload } from 'lucide-react';

interface GameControlsProps {
  onOpenBuildMenu: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ onOpenBuildMenu }) => {
  const {
    isPaused,
    currentCycle,
    togglePause,
    runProductionCycle,
    resetGame,
    saveGame,
    loadGame
  } = useGameStore();

  const handleRunCycle = () => {
    runProductionCycle();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      resetGame();
    }
  };

  const handleSave = () => {
    saveGame();
    alert('Game saved successfully!');
  };

  const handleLoad = () => {
    loadGame();
    alert('Game loaded successfully!');
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-eco-400">Cycle {currentCycle}</h2>
          <p className="text-xs text-slate-400">Current production cycle</p>
        </div>
        <button
          onClick={togglePause}
          className={`btn ${isPaused ? 'btn-primary' : 'btn-secondary'} p-3`}
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </button>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          onClick={handleRunCycle}
          disabled={isPaused}
          className={`btn ${isPaused ? 'btn-secondary opacity-50' : 'btn-primary'}`}
        >
          Run Cycle
        </button>
        <button
          onClick={onOpenBuildMenu}
          className="btn btn-primary"
        >
          🏗️ Build
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleSave}
          className="btn btn-secondary text-xs"
          title="Save game"
        >
          <Save size={14} className="inline mr-1" />
          Save
        </button>
        <button
          onClick={handleLoad}
          className="btn btn-secondary text-xs"
          title="Load game"
        >
          <Upload size={14} className="inline mr-1" />
          Load
        </button>
        <button
          onClick={handleReset}
          className="btn btn-danger text-xs"
          title="Reset game"
        >
          <RotateCcw size={14} className="inline mr-1" />
          Reset
        </button>
      </div>

      {isPaused && (
        <div className="mt-3 bg-yellow-500/10 border border-yellow-500/50 rounded p-2">
          <p className="text-xs text-yellow-400 text-center">
            Game is paused
          </p>
        </div>
      )}
    </div>
  );
};
