import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BuildingType } from '../types';
import { BUILDING_BLUEPRINTS, MICRO_CULTURE_DESCRIPTIONS } from '../data/buildings';
import { X } from 'lucide-react';

interface BuildMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BuildMenu: React.FC<BuildMenuProps> = ({ isOpen, onClose }) => {
  const { addBuilding, canAffordBuilding, resources } = useGameStore();
  const [selectedCulture, setSelectedCulture] = useState<string>('all');

  if (!isOpen) return null;

  const handleBuild = (type: BuildingType) => {
    // Random position for now - in a more advanced version, you'd let user place it
    const position = {
      x: Math.floor(Math.random() * 400),
      y: Math.floor(Math.random() * 400)
    };
    addBuilding(type, position);
  };

  const buildingEntries = Object.entries(BUILDING_BLUEPRINTS) as [BuildingType, typeof BUILDING_BLUEPRINTS[BuildingType]][];
  const filteredBuildings = buildingEntries.filter(([_, blueprint]) =>
    selectedCulture === 'all' || blueprint.culture === selectedCulture
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-eco-400">Build Menu</h2>
          <button onClick={onClose} className="btn btn-secondary p-2">
            <X size={20} />
          </button>
        </div>

        {/* Culture Filter */}
        <div className="flex gap-2 p-4 border-b border-slate-700 overflow-x-auto">
          <button
            onClick={() => setSelectedCulture('all')}
            className={`btn text-sm whitespace-nowrap ${
              selectedCulture === 'all' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            All Buildings
          </button>
          {Object.entries(MICRO_CULTURE_DESCRIPTIONS).map(([key, desc]) => (
            <button
              key={key}
              onClick={() => setSelectedCulture(key)}
              className={`btn text-sm whitespace-nowrap ${
                selectedCulture === key ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {desc.icon} {desc.name}
            </button>
          ))}
        </div>

        {/* Buildings Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBuildings.map(([type, blueprint]) => {
              const canBuild = canAffordBuilding(type);

              return (
                <div
                  key={type}
                  className={`card ${!canBuild ? 'opacity-50' : ''}`}
                >
                  {/* Building Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{blueprint.icon}</span>
                      <div>
                        <h3 className="font-bold">{blueprint.name}</h3>
                        <p className="text-xs text-slate-400">{blueprint.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Culture Badge */}
                  <div className="mb-3">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${MICRO_CULTURE_DESCRIPTIONS[blueprint.culture].color}20`,
                        color: MICRO_CULTURE_DESCRIPTIONS[blueprint.culture].color
                      }}
                    >
                      {MICRO_CULTURE_DESCRIPTIONS[blueprint.culture].icon} {MICRO_CULTURE_DESCRIPTIONS[blueprint.culture].name}
                    </span>
                  </div>

                  {/* Cost */}
                  <div className="mb-3">
                    <div className="text-xs text-slate-400 mb-1">Build Cost:</div>
                    <div className="flex flex-wrap gap-2">
                      {blueprint.baseCost.map((cost, idx) => {
                        const hasEnough = resources[cost.type] >= cost.amount;
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs ${
                              hasEnough
                                ? 'bg-slate-700 text-slate-300'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {cost.amount} {cost.type}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Production Info */}
                  <div className="space-y-2 text-xs mb-3">
                    <div>
                      <div className="text-slate-400 mb-1">Requires per cycle:</div>
                      <div className="flex flex-wrap gap-1">
                        {blueprint.baseInputs.map((input, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded">
                            {input.amount} {input.type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">Produces per cycle:</div>
                      <div className="flex flex-wrap gap-1">
                        {blueprint.baseOutputs.map((output, idx) => (
                          <span key={idx} className="px-2 py-1 bg-eco-500/20 text-eco-300 rounded">
                            {output.amount} {output.type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Build Button */}
                  <button
                    onClick={() => handleBuild(type)}
                    disabled={!canBuild}
                    className={`w-full btn ${canBuild ? 'btn-primary' : 'btn-secondary cursor-not-allowed'}`}
                  >
                    {canBuild ? 'Build' : 'Insufficient Resources'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
