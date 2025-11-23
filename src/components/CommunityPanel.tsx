import React from 'react';
import { Users, Home, TrendingUp, Heart } from 'lucide-react';
import { useFarmStore } from '../store/farmStore';

export const CommunityPanel: React.FC = () => {
  const { player, workers, buildings, animals } = useFarmStore();

  // Calculate community stats
  const population = workers.length;
  const happiness = workers.length > 0
    ? Math.floor(workers.reduce((sum, w) => sum + (w.level * 10 + 50), 0) / workers.length)
    : 100;
  const constructedBuildings = buildings.filter(b => b.isConstructed).length;
  const totalAnimals = animals.length;
  const avgAnimalHappiness = animals.length > 0
    ? Math.floor(animals.reduce((sum, a) => sum + a.happiness, 0) / animals.length)
    : 0;

  // Community growth stages
  const getCommunityStage = () => {
    if (player.level < 3) return { name: 'Small Homestead', icon: '🏡', color: 'text-green-400' };
    if (player.level < 6) return { name: 'Growing Farm', icon: '🌾', color: 'text-eco-400' };
    if (player.level < 10) return { name: 'Thriving Community', icon: '🏘️', color: 'text-blue-400' };
    if (player.level < 15) return { name: 'Farming Village', icon: '🏛️', color: 'text-purple-400' };
    return { name: 'Agricultural Empire', icon: '👑', color: 'text-yellow-400' };
  };

  const stage = getCommunityStage();

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users size={32} className="text-eco-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Community</h2>
          <p className="text-slate-400 text-sm">Your farming community status</p>
        </div>
      </div>

      {/* Community Stage */}
      <div className="bg-gradient-to-r from-eco-600 to-eco-500 rounded-xl p-4 mb-6 text-center">
        <div className="text-5xl mb-2">{stage.icon}</div>
        <h3 className={`text-2xl font-bold ${stage.color}`}>{stage.name}</h3>
        <p className="text-white text-sm mt-1">Level {player.level} Settlement</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} className="text-blue-400" />
            <span className="text-sm text-slate-400">Workers</span>
          </div>
          <div className="text-3xl font-bold text-white">{population}</div>
          <div className="text-xs text-slate-400 mt-1">
            💼 {workers.filter(w => w.isWorking).length} working
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Home size={20} className="text-purple-400" />
            <span className="text-sm text-slate-400">Buildings</span>
          </div>
          <div className="text-3xl font-bold text-white">{constructedBuildings}</div>
          <div className="text-xs text-slate-400 mt-1">
            🏗️ {buildings.length - constructedBuildings} in progress
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={20} className="text-pink-400" />
            <span className="text-sm text-slate-400">Happiness</span>
          </div>
          <div className="text-3xl font-bold text-white">{happiness}%</div>
          <div className="w-full h-2 bg-slate-600 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-pink-400 transition-all"
              style={{ width: `${happiness}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-green-400" />
            <span className="text-sm text-slate-400">Livestock</span>
          </div>
          <div className="text-3xl font-bold text-white">{totalAnimals}</div>
          <div className="text-xs text-slate-400 mt-1">
            😊 {avgAnimalHappiness}% happy
          </div>
        </div>
      </div>

      {/* Community Milestones */}
      <div className="mt-6 bg-slate-700/30 rounded-lg p-4">
        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
          <span>🎯</span> Next Milestone
        </h4>
        <div className="space-y-2 text-sm">
          {player.level < 3 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">• Reach level 3 to become a Growing Farm</span>
            </div>
          )}
          {player.level >= 3 && player.level < 5 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">• Build 5 structures to unlock new crops</span>
            </div>
          )}
          {workers.length < 3 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">• Hire 3 workers for efficient farming</span>
            </div>
          )}
          {totalAnimals < 5 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">• Raise 5 animals for steady income</span>
            </div>
          )}
        </div>
      </div>

      {/* Achievement Highlights */}
      <div className="mt-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-4 border border-yellow-600/30">
        <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
          <span>🏆</span> Achievements
        </h4>
        <div className="text-xs text-slate-300 space-y-1">
          <div>💰 Total Earned: ${player.totalEarnings}</div>
          <div>🌾 Crops Harvested: {player.cropsHarvested}</div>
          <div>🐄 Animals Sold: {player.animalsSold}</div>
          <div>🏗️ Buildings Built: {player.buildingsConstructed}</div>
        </div>
      </div>
    </div>
  );
};
