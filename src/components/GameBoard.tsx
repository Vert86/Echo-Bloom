import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BUILDING_BLUEPRINTS } from '../data/buildings';
import { Trash2, TrendingUp } from 'lucide-react';

interface GameBoardProps {
  onBuildingSelect?: (buildingId: string) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ onBuildingSelect }) => {
  const { buildings, removeBuilding, upgradeBuilding } = useGameStore();
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const handleBuildingClick = (id: string) => {
    setSelectedBuilding(id === selectedBuilding ? null : id);
    onBuildingSelect?.(id);
  };

  const handleUpgrade = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    upgradeBuilding(id);
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this building?')) {
      removeBuilding(id);
      if (selectedBuilding === id) {
        setSelectedBuilding(null);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Buildings */}
      <div className="relative w-full h-full p-4">
        {buildings.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-400">
              <div className="text-6xl mb-4">🏗️</div>
              <p className="text-lg">No buildings yet</p>
              <p className="text-sm">Use the Build Menu to construct your first building</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {buildings.map((building) => {
              const blueprint = BUILDING_BLUEPRINTS[building.type];
              const isSelected = selectedBuilding === building.id;

              return (
                <div
                  key={building.id}
                  onClick={() => handleBuildingClick(building.id)}
                  className={`
                    card cursor-pointer transition-all duration-200 hover:scale-105
                    ${isSelected ? 'ring-2 ring-eco-500 shadow-eco-500/50' : ''}
                  `}
                >
                  {/* Building Icon & Name */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{blueprint.icon}</span>
                      <div>
                        <h3 className="font-bold text-sm">{blueprint.name}</h3>
                        <span className="text-xs text-slate-400">Level {building.level}</span>
                      </div>
                    </div>
                  </div>

                  {/* Efficiency Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Efficiency</span>
                      <span className="text-eco-400">{Math.round(building.efficiency * 100)}%</span>
                    </div>
                    <div className="resource-bar">
                      <div
                        className="resource-fill bg-eco-500"
                        style={{ width: `${building.efficiency * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Inputs & Outputs */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="text-slate-400 mb-1">Inputs:</div>
                      <div className="flex flex-wrap gap-1">
                        {building.inputs.map((input, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-700 rounded text-blue-300">
                            {input.amount} {input.type}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-1">Outputs:</div>
                      <div className="flex flex-wrap gap-1">
                        {building.outputs.map((output, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-700 rounded text-eco-300">
                            {output.amount} {output.type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {isSelected && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700">
                      <button
                        onClick={(e) => handleUpgrade(e, building.id)}
                        className="btn btn-primary flex-1 text-xs py-1"
                        title="Upgrade building"
                      >
                        <TrendingUp size={14} className="inline mr-1" />
                        Upgrade
                      </button>
                      <button
                        onClick={(e) => handleRemove(e, building.id)}
                        className="btn btn-danger text-xs py-1"
                        title="Remove building"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
