import React from 'react';
import { ShoppingBag, Apple, DollarSign, Star, TrendingUp } from 'lucide-react';
import { useFarmStore } from '../store/farmStore';

export const FarmUI: React.FC = () => {
  const { player, selectedTool, selectedItem, selectTool, toggleShop, notifications } = useFarmStore();

  const xpForNextLevel = player.level * 100;
  const xpProgress = (player.experience / xpForNextLevel) * 100;

  const tools = [
    { id: 'select', icon: '👆', label: 'Select', color: 'bg-slate-600' },
    { id: 'plant', icon: '🌱', label: 'Plant', color: 'bg-green-600' },
    { id: 'water', icon: '💧', label: 'Water', color: 'bg-blue-600' },
    { id: 'harvest', icon: '🌾', label: 'Harvest', color: 'bg-yellow-600' },
    { id: 'feed', icon: '🌾', label: 'Feed', color: 'bg-orange-600' }
  ];

  return (
    <>
      {/* Top HUD */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-2xl p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Player Info */}
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-eco-600 to-eco-500 p-3 rounded-xl">
              <Star size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Level {player.level}</h2>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-eco-500 to-eco-400 transition-all"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <span className="text-sm text-slate-400">{player.experience}/{xpForNextLevel} XP</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="flex items-center gap-2 bg-green-600/20 px-4 py-2 rounded-lg">
                <DollarSign size={24} className="text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-white">${player.cash}</div>
                  <div className="text-xs text-slate-400">Cash</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 bg-eco-600/20 px-4 py-2 rounded-lg">
                <Apple size={24} className="text-eco-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{player.cropsHarvested}</div>
                  <div className="text-xs text-slate-400">Harvested</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 bg-purple-600/20 px-4 py-2 rounded-lg">
                <TrendingUp size={24} className="text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{player.buildingsConstructed}</div>
                  <div className="text-xs text-slate-400">Buildings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Button */}
          <button
            onClick={toggleShop}
            className="bg-gradient-to-r from-eco-600 to-eco-500 hover:from-eco-500 hover:to-eco-400 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg"
          >
            <ShoppingBag size={24} />
            Shop
          </button>
        </div>
      </div>

      {/* Tool Bar */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-2xl p-4 mb-4">
        <div className="flex items-center gap-2 justify-center flex-wrap">
          <span className="text-slate-400 font-semibold mr-2">Tools:</span>
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => selectTool(tool.id as any)}
              className={`${
                selectedTool === tool.id
                  ? 'bg-eco-600 scale-110'
                  : 'bg-slate-700 hover:bg-slate-600'
              } text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2 min-w-[100px] justify-center`}
            >
              <span className="text-2xl">{tool.icon}</span>
              <span className="text-sm">{tool.label}</span>
            </button>
          ))}
        </div>

        {selectedTool && (
          <div className="mt-3 text-center text-eco-400 text-sm animate-pulse">
            {selectedTool === 'plant' && selectedItem && `Click on brown soil to plant ${selectedItem}`}
            {selectedTool === 'plant' && !selectedItem && 'Buy seeds from shop first!'}
            {selectedTool === 'place-animal' && selectedItem && `Click on empty grass to place ${selectedItem}`}
            {selectedTool === 'place-animal' && !selectedItem && 'Buy an animal from shop first!'}
            {selectedTool === 'water' && 'Click on crops to water them'}
            {selectedTool === 'harvest' && 'Click on fully grown crops (glowing) to harvest'}
            {selectedTool === 'feed' && 'Click on animals to feed them'}
            {selectedTool === 'build' && selectedItem && `Click on empty area to place ${selectedItem}`}
            {selectedTool === 'build' && !selectedItem && 'Buy a building from shop first!'}
            {selectedTool === 'select' && 'Click on crops, animals, or buildings to see details'}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 z-40 space-y-2">
        {notifications.map((notification, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-eco-600 to-eco-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-in-right"
          >
            {notification}
          </div>
        ))}
      </div>
    </>
  );
};
