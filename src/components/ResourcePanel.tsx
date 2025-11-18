import React from 'react';
import { useGameStore } from '../store/gameStore';
import { RESOURCE_NAMES, RESOURCE_COLORS, ResourceType } from '../types';

const RESOURCE_ICONS: Record<ResourceType, string> = {
  cleanWater: '💧',
  biogas: '⚡',
  food: '🌾',
  grayWater: '💨',
  socialWaste: '📦',
  rawBiomass: '🍂',
  metal: '⚙️',
  tools: '🔧',
  researchCredits: '🔬',
  morale: '😊'
};

export const ResourcePanel: React.FC = () => {
  const { resources } = useGameStore();

  const resourceEntries = Object.entries(resources) as [ResourceType, number][];

  return (
    <div className="card">
      <h2 className="text-lg font-bold mb-4 text-eco-400">Resources</h2>
      <div className="grid grid-cols-2 gap-3">
        {resourceEntries.map(([type, amount]) => (
          <div key={type} className="bg-slate-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{RESOURCE_ICONS[type]}</span>
              <span className="text-xs font-medium text-slate-300">
                {RESOURCE_NAMES[type]}
              </span>
            </div>
            <div className="text-xl font-bold" style={{ color: RESOURCE_COLORS[type] }}>
              {Math.floor(amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
