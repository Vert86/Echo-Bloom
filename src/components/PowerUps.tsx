import { useGameStore } from '../store/gameStore';
import { Eye, RotateCcw, BarChart3 } from 'lucide-react';

export const PowerUps: React.FC = () => {
  const {
    powerUps,
    activateFlowPeek,
    deactivateFlowPeek,
    useRewindCycle
  } = useGameStore();

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-4 text-eco-400">Power-Ups</h2>

      <div className="space-y-3">
        {/* Flow Peek */}
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye size={20} className="text-blue-400" />
              <div>
                <h3 className="font-semibold text-sm">Flow Peek</h3>
                <p className="text-xs text-slate-400">Preview next 3 cycles</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-slate-600 rounded text-xs font-bold">
              {powerUps.flowPeek.available}
            </span>
          </div>
          <button
            onClick={() => {
              if (powerUps.flowPeek.isActive) {
                deactivateFlowPeek();
              } else {
                activateFlowPeek();
              }
            }}
            disabled={powerUps.flowPeek.available <= 0 && !powerUps.flowPeek.isActive}
            className={`w-full btn text-xs ${
              powerUps.flowPeek.isActive
                ? 'btn-danger'
                : powerUps.flowPeek.available > 0
                ? 'btn-primary'
                : 'btn-secondary opacity-50 cursor-not-allowed'
            }`}
          >
            {powerUps.flowPeek.isActive ? 'Close Preview' : 'Activate'}
          </button>

          {/* Predictions Display */}
          {powerUps.flowPeek.isActive && powerUps.flowPeek.predictions && (
            <div className="mt-3 space-y-2">
              {powerUps.flowPeek.predictions.map((pred, idx) => (
                <div key={idx} className="bg-slate-800 rounded p-2 text-xs">
                  <div className="font-bold text-blue-300 mb-1">
                    Cycle {pred.cycle}
                  </div>
                  <div className="text-yellow-400">
                    Load: {Math.round(pred.systemicLoad)}%
                  </div>
                  {pred.warnings.length > 0 && (
                    <div className="mt-1 text-red-400">
                      {pred.warnings.map((w, wi) => (
                        <div key={wi}>⚠ {w}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rewind Cycle */}
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <RotateCcw size={20} className="text-purple-400" />
              <div>
                <h3 className="font-semibold text-sm">Rewind Cycle</h3>
                <p className="text-xs text-slate-400">Undo last cycle</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-slate-600 rounded text-xs font-bold">
              {powerUps.rewindCycle.available}
            </span>
          </div>
          <button
            onClick={useRewindCycle}
            disabled={powerUps.rewindCycle.available <= 0 || !powerUps.rewindCycle.canRewind}
            className={`w-full btn text-xs ${
              powerUps.rewindCycle.available > 0 && powerUps.rewindCycle.canRewind
                ? 'btn-primary'
                : 'btn-secondary opacity-50 cursor-not-allowed'
            }`}
          >
            {!powerUps.rewindCycle.canRewind
              ? 'No Cycles to Rewind'
              : 'Activate'}
          </button>
        </div>

        {/* System Auditor */}
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-green-400" />
              <div>
                <h3 className="font-semibold text-sm">System Auditor</h3>
                <p className="text-xs text-slate-400">View building analytics</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-slate-600 rounded text-xs font-bold">
              {powerUps.systemAuditor.available}
            </span>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800 rounded p-2">
            {powerUps.systemAuditor.isActive
              ? '✓ Active: Click a building to view detailed analytics'
              : 'Activate and click any building to view its performance history'}
          </div>
        </div>
      </div>
    </div>
  );
};
