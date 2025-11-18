import React from 'react';
import { useGameStore } from '../store/gameStore';
import { AlertTriangle } from 'lucide-react';

export const SystemicLoadMeter: React.FC = () => {
  const { systemicLoad, consecutiveCyclesAtFullLoad, maxCyclesAtFullLoad } = useGameStore();

  const getLoadColor = () => {
    if (systemicLoad >= 100) return 'bg-red-500';
    if (systemicLoad >= 80) return 'bg-orange-500';
    if (systemicLoad >= 60) return 'bg-yellow-500';
    return 'bg-eco-500';
  };

  const getLoadStatus = () => {
    if (systemicLoad >= 100) return 'CRITICAL';
    if (systemicLoad >= 80) return 'DANGER';
    if (systemicLoad >= 60) return 'WARNING';
    if (systemicLoad >= 40) return 'CAUTION';
    return 'STABLE';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-eco-400">Systemic Load</h2>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          systemicLoad >= 80 ? 'bg-red-500/20 text-red-400' :
          systemicLoad >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-eco-500/20 text-eco-400'
        }`}>
          {getLoadStatus()}
        </div>
      </div>

      {/* Load Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Load Level</span>
          <span className="font-bold text-white">{Math.round(systemicLoad)}%</span>
        </div>
        <div className="h-6 rounded-full overflow-hidden bg-slate-700 relative">
          <div
            className={`h-full transition-all duration-500 ${getLoadColor()}`}
            style={{ width: `${Math.min(100, systemicLoad)}%` }}
          >
            {systemicLoad >= 100 && (
              <div className="absolute inset-0 animate-pulse-slow bg-red-600/50" />
            )}
          </div>
        </div>
      </div>

      {/* Warning if at critical load */}
      {systemicLoad >= 100 && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-xs text-red-300">
              <p className="font-bold mb-1">SYSTEM OVERLOAD!</p>
              <p>Consecutive cycles at max load: {consecutiveCyclesAtFullLoad} / {maxCyclesAtFullLoad}</p>
              <p className="mt-1 text-red-200">
                If load remains at 100% for {maxCyclesAtFullLoad - consecutiveCyclesAtFullLoad} more cycle(s),
                the community will collapse!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Warning zones */}
      {systemicLoad >= 60 && systemicLoad < 100 && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
          <p className="text-xs text-yellow-300">
            {systemicLoad >= 80
              ? 'System stress is very high. Reduce waste and meet resource needs urgently!'
              : 'System stress is elevated. Monitor resource flows carefully.'}
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 leading-relaxed">
          The Systemic Load tracks environmental and social balance. High load indicates
          unused waste, unmet needs, or resource deficits. At 100% for {maxCyclesAtFullLoad} cycles,
          the game ends.
        </p>
      </div>
    </div>
  );
};
