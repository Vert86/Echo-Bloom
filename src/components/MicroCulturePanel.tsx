import React from 'react';
import { useGameStore } from '../store/gameStore';
import { MICRO_CULTURE_DESCRIPTIONS } from '../data/buildings';

export const MicroCulturePanel: React.FC = () => {
  const { microCultures } = useGameStore();

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-4 text-eco-400">Micro-Cultures</h2>

      <div className="space-y-3">
        {microCultures.map((culture) => {
          const desc = MICRO_CULTURE_DESCRIPTIONS[culture.type];

          return (
            <div
              key={culture.type}
              className="bg-slate-700/50 rounded-lg p-3"
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="text-3xl">{desc.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm" style={{ color: desc.color }}>
                    {culture.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{culture.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                <div>
                  <div className="text-slate-400 mb-1">Population</div>
                  <div className="font-bold">{culture.population}</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Buildings</div>
                  <div className="font-bold">{culture.buildings.length}</div>
                </div>
              </div>

              {/* Morale Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Morale</span>
                  <span className="text-eco-400">{Math.round(culture.morale)}%</span>
                </div>
                <div className="resource-bar">
                  <div
                    className="resource-fill bg-eco-500"
                    style={{ width: `${Math.min(100, culture.morale)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
