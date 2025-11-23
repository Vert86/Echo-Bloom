import React, { useState } from 'react';
import { X, ShoppingCart, Sprout, PawPrint, Building, Users } from 'lucide-react';
import { useFarmStore } from '../store/farmStore';
import { CROP_DATA, ANIMAL_DATA, BUILDING_DATA } from '../types/farming';

export const FarmShop: React.FC = () => {
  const { player, toggleShop, selectTool, canAfford } = useFarmStore();
  const [activeTab, setActiveTab] = useState<'crops' | 'animals' | 'buildings' | 'workers'>('crops');

  const handleBuyItem = (type: string, category: 'crops' | 'animals' | 'buildings') => {
    if (category === 'crops') {
      selectTool('plant', type);
      toggleShop();
    } else if (category === 'animals') {
      selectTool('place-animal', type);
      toggleShop();
    } else if (category === 'buildings') {
      selectTool('build', type);
      toggleShop();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-eco-600 to-eco-500 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart size={32} className="text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Farm Shop</h2>
              <p className="text-eco-100">Build your farming empire!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <span className="text-white font-bold text-xl">💰 ${player.cash}</span>
            </div>
            <button
              onClick={toggleShop}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {[
            { id: 'crops', label: 'Seeds', icon: <Sprout size={20} /> },
            { id: 'animals', label: 'Animals', icon: <PawPrint size={20} /> },
            { id: 'buildings', label: 'Buildings', icon: <Building size={20} /> },
            { id: 'workers', label: 'Workers', icon: <Users size={20} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 transition-colors ${
                activeTab === tab.id
                  ? 'bg-eco-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              <span className="font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Crops Tab */}
          {activeTab === 'crops' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(CROP_DATA).map(([key, crop]) => {
                const affordable = canAfford(crop.buyPrice);
                return (
                  <div
                    key={key}
                    className={`card ${affordable ? 'hover:scale-105 cursor-pointer' : 'opacity-50'} transition-all`}
                    onClick={() => affordable && handleBuyItem(key, 'crops')}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-2">{crop.icon}</div>
                      <h3 className="font-bold text-white mb-1">{crop.name}</h3>
                      <div className="text-sm space-y-1 mb-3">
                        <p className="text-eco-400">Grow Time: {crop.growthTime}s</p>
                        <p className="text-green-400">Sell: ${crop.sellPrice}</p>
                        <p className="text-slate-400">Water: {crop.waterNeeded}x</p>
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-bold ${affordable ? 'bg-eco-600' : 'bg-slate-700'}`}>
                        💰 ${crop.buyPrice}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Animals Tab */}
          {activeTab === 'animals' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(ANIMAL_DATA).map(([key, animal]) => {
                const affordable = canAfford(animal.buyPrice);
                return (
                  <div
                    key={key}
                    className={`card ${affordable ? 'hover:scale-105 cursor-pointer' : 'opacity-50'} transition-all`}
                    onClick={() => affordable && handleBuyItem(key, 'animals')}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-2">{animal.icon}</div>
                      <h3 className="font-bold text-white mb-1">{animal.name}</h3>
                      <div className="text-sm space-y-1 mb-3">
                        <p className="text-green-400">Sell: ${animal.sellPrice}</p>
                        <p className="text-yellow-400">Feed: ${animal.feedCost}/day</p>
                        {animal.productionType && (
                          <p className="text-purple-400">
                            {animal.productionType}: ${animal.productionValue}
                          </p>
                        )}
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-bold ${affordable ? 'bg-eco-600' : 'bg-slate-700'}`}>
                        💰 ${animal.buyPrice}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Buildings Tab */}
          {activeTab === 'buildings' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(BUILDING_DATA).map(([key, building]) => {
                const affordable = canAfford(building.buildCost);
                return (
                  <div
                    key={key}
                    className={`card ${affordable ? 'hover:scale-105 cursor-pointer' : 'opacity-50'} transition-all`}
                    onClick={() => affordable && handleBuyItem(key, 'buildings')}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-2">{building.icon}</div>
                      <h3 className="font-bold text-white mb-1">{building.name}</h3>
                      <p className="text-sm text-slate-400 mb-2">{building.description}</p>
                      <div className="text-sm space-y-1 mb-3">
                        <p className="text-eco-400">Size: {building.size.width}x{building.size.height}</p>
                        <p className="text-yellow-400">Build Time: {building.buildTime}s</p>
                        {building.capacity && (
                          <p className="text-purple-400">Capacity: {building.capacity}</p>
                        )}
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-bold ${affordable ? 'bg-eco-600' : 'bg-slate-700'}`}>
                        💰 ${building.buildCost}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Workers Tab */}
          {activeTab === 'workers' && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: 'farmer', icon: '👨‍🌾', name: 'Farmer', desc: 'Plants and harvests crops automatically' },
                { type: 'rancher', icon: '👨‍🍳', name: 'Rancher', desc: 'Feeds animals and collects products' },
                { type: 'builder', icon: '👷', name: 'Builder', desc: 'Constructs and upgrades buildings faster' },
                { type: 'merchant', icon: '🧙‍♂️', name: 'Merchant', desc: 'Sells products for better prices' }
              ].map(worker => {
                const affordable = canAfford(200);
                return (
                  <div
                    key={worker.type}
                    className={`card ${affordable ? 'hover:scale-105 cursor-pointer' : 'opacity-50'} transition-all`}
                    onClick={() => affordable && useFarmStore.getState().hireWorker(worker.type as any)}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-2">{worker.icon}</div>
                      <h3 className="font-bold text-white mb-1">{worker.name}</h3>
                      <p className="text-sm text-slate-400 mb-3">{worker.desc}</p>
                      <div className={`px-4 py-2 rounded-lg font-bold ${affordable ? 'bg-eco-600' : 'bg-slate-700'}`}>
                        💰 $200
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
