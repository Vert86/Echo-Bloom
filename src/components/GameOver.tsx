import React from 'react';
import { useGameStore } from '../store/gameStore';
import { RotateCcw } from 'lucide-react';

export const GameOver: React.FC = () => {
  const { isGameOver, gameOverReason, currentCycle, resetGame } = useGameStore();

  if (!isGameOver) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-lg w-full p-8 text-center">
        <div className="text-6xl mb-4">💀</div>
        <h2 className="text-3xl font-bold text-red-400 mb-4">System Collapse</h2>

        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
          <p className="text-slate-300 mb-4">{gameOverReason}</p>
          <div className="text-sm text-slate-400">
            <p>You survived for <span className="text-eco-400 font-bold">{currentCycle}</span> cycles</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={resetGame}
            className="btn btn-primary w-full"
          >
            <RotateCcw size={18} className="inline mr-2" />
            Try Again
          </button>

          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-3">
            <p className="text-xs text-blue-300 leading-relaxed">
              <strong>Tip:</strong> Focus on creating closed-loop systems where each building's
              waste becomes another's input. Monitor the Systemic Load closely and use power-ups
              strategically to avoid overload.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
