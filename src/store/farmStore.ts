import { create } from 'zustand';
import {
  Crop,
  Animal,
  Worker,
  FarmBuilding,
  FarmTile,
  PlayerStats,
  CropType,
  AnimalType,
  FarmBuildingType,
  CROP_DATA,
  ANIMAL_DATA,
  BUILDING_DATA,
  WORKER_NAMES,
  Dialogue
} from '../types/farming';
import { playSoundEffect } from '../utils/soundManager';

const GRID_WIDTH = 20;
const GRID_HEIGHT = 15;

interface FarmState {
  // Grid and entities
  tiles: FarmTile[][];
  crops: Crop[];
  animals: Animal[];
  workers: Worker[];
  buildings: FarmBuilding[];

  // Player stats
  player: PlayerStats;

  // Game state
  currentTime: number;
  isPaused: boolean;
  selectedTool: 'plant' | 'water' | 'harvest' | 'feed' | 'build' | 'select' | 'place-animal' | null;
  selectedItem: string | null;

  // UI state
  showShop: boolean;
  showDialogue: boolean;
  currentDialogue: Dialogue | null;
  notifications: string[];

  // Actions
  initializeFarm: () => void;
  tick: () => void;
  selectTool: (tool: 'plant' | 'water' | 'harvest' | 'feed' | 'build' | 'select' | 'place-animal' | null, item?: string) => void;
  clickTile: (x: number, y: number) => void;

  // Crop actions
  plantCrop: (type: CropType, x: number, y: number) => void;
  waterCrop: (cropId: string) => void;
  harvestCrop: (cropId: string) => void;

  // Animal actions
  buyAnimal: (type: AnimalType, x: number, y: number) => void;
  feedAnimal: (animalId: string) => void;
  sellAnimal: (animalId: string) => void;
  breedAnimals: (animal1Id: string, animal2Id: string) => void;
  collectProduction: (animalId: string) => void;

  // Building actions
  startBuilding: (type: FarmBuildingType, x: number, y: number) => void;
  upgradeBuilding: (buildingId: string) => void;

  // Worker actions
  hireWorker: (type: Worker['type']) => void;
  assignTask: (workerId: string, task: Worker['currentTask']) => void;

  // UI actions
  toggleShop: () => void;
  showDialogueBox: (dialogue: Dialogue) => void;
  closeDialogue: () => void;
  addNotification: (message: string) => void;

  // Utility
  canAfford: (cost: number) => boolean;
  addCash: (amount: number) => void;
  spendCash: (amount: number) => void;
  addExperience: (amount: number) => void;
  saveGame: () => void;
  loadGame: () => void;
}

const createEmptyGrid = (): FarmTile[][] => {
  const grid: FarmTile[][] = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    grid[y] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      grid[y][x] = {
        x,
        y,
        type: 'empty',
        isAccessible: true
      };
    }
  }
  return grid;
};

export const useFarmStore = create<FarmState>((set, get) => ({
  // Initial state
  tiles: createEmptyGrid(),
  crops: [],
  animals: [],
  workers: [],
  buildings: [],

  player: {
    level: 1,
    experience: 0,
    cash: 500,
    totalEarnings: 0,
    totalSpent: 0,
    cropsHarvested: 0,
    animalsSold: 0,
    buildingsConstructed: 0
  },

  currentTime: Date.now(),
  isPaused: false,
  selectedTool: null,
  selectedItem: null,
  showShop: false,
  showDialogue: false,
  currentDialogue: null,
  notifications: [],

  initializeFarm: () => {
    const tiles = createEmptyGrid();

    // Create starter plot of soil
    for (let y = 5; y < 10; y++) {
      for (let x = 5; x < 10; x++) {
        tiles[y][x].type = 'soil';
      }
    }

    set({
      tiles,
      crops: [],
      animals: [],
      workers: [],
      buildings: []
    });

    get().addNotification('Welcome to your farm! Start by planting crops.');
  },

  tick: () => {
    const state = get();
    if (state.isPaused) return;

    const now = Date.now();
    const deltaSeconds = (now - state.currentTime) / 1000;

    // Update crops
    const updatedCrops = state.crops.map(crop => {
      const cropData = CROP_DATA[crop.type];
      const timeSincePlanted = (now - crop.plantedAt) / 1000;
      const growthProgress = Math.min(100, (timeSincePlanted / cropData.growthTime) * 100);

      // Determine growth stage
      let growthStage = crop.growthStage;
      if (growthProgress < 20) growthStage = 'seed';
      else if (growthProgress < 40) growthStage = 'sprout';
      else if (growthProgress < 70) growthStage = 'growing';
      else if (growthProgress < 100) growthStage = 'mature';
      else growthStage = 'harvestable';

      // Check if needs water
      const needsWater = crop.isWatered ? false : growthProgress > 30 && (now - crop.lastWatered) > 30000;

      return {
        ...crop,
        growthProgress,
        growthStage,
        needsWater
      };
    });

    // Update animals
    const updatedAnimals = state.animals.map(animal => {
      const animalData = ANIMAL_DATA[animal.type];
      const timeSinceFed = (now - animal.lastFed) / 1000;

      // Hunger increases over time
      const hunger = Math.min(100, animal.hunger + (timeSinceFed / 60) * 10);
      const happiness = Math.max(0, 100 - hunger);

      // Production progress
      let productionProgress = animal.productionProgress;
      if (animalData.productionType && happiness > 50) {
        productionProgress = Math.min(100, productionProgress + (deltaSeconds / (animalData.productionTime || 60)) * 100);
      }

      // Pregnancy progress
      let pregnancyProgress = animal.pregnancyProgress;
      if (animal.isPregnant) {
        pregnancyProgress = Math.min(100, pregnancyProgress + (deltaSeconds / animalData.breedingTime) * 100);
      }

      return {
        ...animal,
        hunger,
        happiness,
        productionProgress,
        pregnancyProgress,
        canBreed: happiness > 70 && animal.age > 30
      };
    });

    // Update buildings under construction
    const updatedBuildings = state.buildings.map(building => {
      if (!building.isConstructed) {
        const buildingData = BUILDING_DATA[building.type];
        const constructionProgress = Math.min(100, building.constructionProgress + (deltaSeconds / buildingData.buildTime) * 100);
        const isConstructed = constructionProgress >= 100;

        if (isConstructed && !building.isConstructed) {
          get().addNotification(`${buildingData.name} construction complete!`);
        }

        return {
          ...building,
          constructionProgress,
          isConstructed
        };
      }
      return building;
    });

    // Update workers
    const updatedWorkers = state.workers.map(worker => {
      if (worker.currentTask) {
        const progress = Math.min(100, worker.currentTask.progress + (deltaSeconds / worker.currentTask.duration) * 100 * worker.efficiency);

        if (progress >= 100) {
          // Task completed
          return {
            ...worker,
            currentTask: undefined,
            experience: worker.experience + 10
          };
        }

        return {
          ...worker,
          currentTask: {
            ...worker.currentTask,
            progress
          }
        };
      }
      return worker;
    });

    set({
      currentTime: now,
      crops: updatedCrops,
      animals: updatedAnimals,
      buildings: updatedBuildings,
      workers: updatedWorkers
    });
  },

  selectTool: (tool, item) => {
    set({ selectedTool: tool, selectedItem: item || null });
  },

  clickTile: (x, y) => {
    const state = get();
    const tile = state.tiles[y]?.[x];
    if (!tile) return;

    const { selectedTool, selectedItem } = state;

    if (selectedTool === 'plant' && selectedItem) {
      get().plantCrop(selectedItem as CropType, x, y);
    } else if (selectedTool === 'place-animal' && selectedItem) {
      get().buyAnimal(selectedItem as AnimalType, x, y);
      get().selectTool(null);
    } else if (selectedTool === 'water') {
      const crop = state.crops.find(c => c.position.x === x && c.position.y === y);
      if (crop) get().waterCrop(crop.id);
    } else if (selectedTool === 'harvest') {
      const crop = state.crops.find(c => c.position.x === x && c.position.y === y);
      if (crop && crop.growthStage === 'harvestable') get().harvestCrop(crop.id);
    } else if (selectedTool === 'feed') {
      const animal = state.animals.find(a => a.position.x === x && a.position.y === y);
      if (animal) get().feedAnimal(animal.id);
    } else if (selectedTool === 'build' && selectedItem) {
      get().startBuilding(selectedItem as FarmBuildingType, x, y);
    } else if (selectedTool === 'select') {
      // Show info about what's on this tile
      const crop = state.crops.find(c => c.position.x === x && c.position.y === y);
      const animal = state.animals.find(a => a.position.x === x && a.position.y === y);
      const building = state.buildings.find(b => {
        const bData = BUILDING_DATA[b.type];
        return x >= b.position.x && x < b.position.x + bData.size.width &&
               y >= b.position.y && y < b.position.y + bData.size.height;
      });

      if (crop) {
        get().addNotification(`${CROP_DATA[crop.type].name} - ${Math.floor(crop.growthProgress)}% grown`);
      } else if (animal) {
        get().addNotification(`${ANIMAL_DATA[animal.type].name} - ${Math.floor(animal.happiness)}% happy`);
      } else if (building) {
        get().addNotification(`${BUILDING_DATA[building.type].name} - Level ${building.level}`);
      }
    }
  },

  plantCrop: (type, x, y) => {
    const state = get();
    const cropData = CROP_DATA[type];
    const tile = state.tiles[y]?.[x];

    if (!tile || tile.type !== 'soil' || tile.cropId) {
      get().addNotification('Cannot plant here!');
      return;
    }

    if (!get().canAfford(cropData.buyPrice)) {
      get().addNotification('Not enough cash!');
      return;
    }

    get().spendCash(cropData.buyPrice);

    const newCrop: Crop = {
      id: `crop-${Date.now()}-${Math.random()}`,
      type,
      position: { x, y },
      growthStage: 'seed',
      growthProgress: 0,
      isWatered: false,
      lastWatered: Date.now(),
      plantedAt: Date.now(),
      harvestValue: cropData.sellPrice,
      needsWater: false
    };

    const newTiles = state.tiles.map(row => [...row]);
    newTiles[y][x] = { ...newTiles[y][x], type: 'planted', cropId: newCrop.id };

    set({
      crops: [...state.crops, newCrop],
      tiles: newTiles
    });

    playSoundEffect('plant');
    get().addNotification(`Planted ${cropData.name}!`);
  },

  waterCrop: (cropId) => {
    const state = get();
    const cropIndex = state.crops.findIndex(c => c.id === cropId);
    if (cropIndex === -1) return;

    const updatedCrops = [...state.crops];
    updatedCrops[cropIndex] = {
      ...updatedCrops[cropIndex],
      isWatered: true,
      lastWatered: Date.now(),
      needsWater: false
    };

    const { x, y } = updatedCrops[cropIndex].position;
    const newTiles = state.tiles.map(row => [...row]);
    newTiles[y][x] = { ...newTiles[y][x], type: 'watered' };

    set({ crops: updatedCrops, tiles: newTiles });
    playSoundEffect('water');
    get().addNotification('💧 Crop watered!');
  },

  harvestCrop: (cropId) => {
    const state = get();
    const crop = state.crops.find(c => c.id === cropId);
    if (!crop || crop.growthStage !== 'harvestable') return;

    const cropData = CROP_DATA[crop.type];
    get().addCash(cropData.sellPrice);
    get().addExperience(10);

    const newTiles = state.tiles.map(row => [...row]);
    newTiles[crop.position.y][crop.position.x] = {
      ...newTiles[crop.position.y][crop.position.x],
      type: 'soil',
      cropId: undefined
    };

    set({
      crops: state.crops.filter(c => c.id !== cropId),
      tiles: newTiles,
      player: {
        ...state.player,
        cropsHarvested: state.player.cropsHarvested + 1
      }
    });

    playSoundEffect('harvest');
    get().addNotification(`Harvested ${cropData.name} for $${cropData.sellPrice}!`);
  },

  buyAnimal: (type, x, y) => {
    const state = get();
    const animalData = ANIMAL_DATA[type];

    if (!get().canAfford(animalData.buyPrice)) {
      get().addNotification('Not enough cash!');
      return;
    }

    get().spendCash(animalData.buyPrice);

    const newAnimal: Animal = {
      id: `animal-${Date.now()}-${Math.random()}`,
      type,
      name: WORKER_NAMES[Math.floor(Math.random() * WORKER_NAMES.length)],
      position: { x, y },
      age: 0,
      hunger: 50,
      happiness: 100,
      lastFed: Date.now(),
      canBreed: false,
      isPregnant: false,
      pregnancyProgress: 0,
      sellValue: animalData.sellPrice,
      productionType: animalData.productionType,
      productionProgress: 0
    };

    const newTiles = state.tiles.map(row => [...row]);
    newTiles[y][x] = { ...newTiles[y][x], type: 'pasture', animalId: newAnimal.id };

    set({
      animals: [...state.animals, newAnimal],
      tiles: newTiles
    });

    playSoundEffect('animal');
    get().addNotification(`Bought ${animalData.name}!`);
  },

  feedAnimal: (animalId) => {
    const state = get();
    const animalIndex = state.animals.findIndex(a => a.id === animalId);
    if (animalIndex === -1) return;

    const animal = state.animals[animalIndex];
    const animalData = ANIMAL_DATA[animal.type];

    if (!get().canAfford(animalData.feedCost)) {
      get().addNotification('Not enough cash for feed!');
      return;
    }

    get().spendCash(animalData.feedCost);

    const updatedAnimals = [...state.animals];
    updatedAnimals[animalIndex] = {
      ...animal,
      hunger: 0,
      happiness: 100,
      lastFed: Date.now()
    };

    set({ animals: updatedAnimals });
    get().addNotification(`Fed ${animal.name}!`);
  },

  sellAnimal: (animalId) => {
    const state = get();
    const animal = state.animals.find(a => a.id === animalId);
    if (!animal) return;

    const animalData = ANIMAL_DATA[animal.type];
    get().addCash(animalData.sellPrice);
    get().addExperience(20);

    const newTiles = state.tiles.map(row => [...row]);
    newTiles[animal.position.y][animal.position.x] = {
      ...newTiles[animal.position.y][animal.position.x],
      type: 'empty',
      animalId: undefined
    };

    set({
      animals: state.animals.filter(a => a.id !== animalId),
      tiles: newTiles,
      player: {
        ...state.player,
        animalsSold: state.player.animalsSold + 1
      }
    });

    get().addNotification(`Sold ${animal.name} for $${animalData.sellPrice}!`);
  },

  breedAnimals: (animal1Id, animal2Id) => {
    const state = get();
    const animal1 = state.animals.find(a => a.id === animal1Id);
    const animal2 = state.animals.find(a => a.id === animal2Id);

    if (!animal1 || !animal2 || animal1.type !== animal2.type) return;
    if (!animal1.canBreed || !animal2.canBreed) {
      get().addNotification('Animals are not ready to breed!');
      return;
    }

    const updatedAnimals = state.animals.map(a => {
      if (a.id === animal1Id) {
        return { ...a, isPregnant: true, pregnancyProgress: 0 };
      }
      return a;
    });

    set({ animals: updatedAnimals });
    get().addNotification('Breeding started!');
  },

  collectProduction: (animalId) => {
    const state = get();
    const animal = state.animals.find(a => a.id === animalId);
    if (!animal || !animal.productionType || animal.productionProgress < 100) return;

    const animalData = ANIMAL_DATA[animal.type];
    const value = animalData.productionValue || 0;

    get().addCash(value);

    const updatedAnimals = state.animals.map(a => {
      if (a.id === animalId) {
        return { ...a, productionProgress: 0 };
      }
      return a;
    });

    set({ animals: updatedAnimals });
    get().addNotification(`Collected ${animal.productionType} for $${value}!`);
  },

  startBuilding: (type, x, y) => {
    const state = get();
    const buildingData = BUILDING_DATA[type];

    if (!get().canAfford(buildingData.buildCost)) {
      get().addNotification('Not enough cash!');
      return;
    }

    // Check if space is available
    for (let dy = 0; dy < buildingData.size.height; dy++) {
      for (let dx = 0; dx < buildingData.size.width; dx++) {
        const tile = state.tiles[y + dy]?.[x + dx];
        if (!tile || tile.type === 'building' || tile.cropId || tile.animalId) {
          get().addNotification('Not enough space here!');
          return;
        }
      }
    }

    get().spendCash(buildingData.buildCost);

    const newBuilding: FarmBuilding = {
      id: `building-${Date.now()}-${Math.random()}`,
      type,
      position: { x, y },
      size: buildingData.size,
      level: 1,
      constructionProgress: 0,
      isConstructed: false,
      capacity: buildingData.capacity,
      storedItems: 0,
      upgradeCost: buildingData.upgradeCost
    };

    const newTiles = state.tiles.map(row => [...row]);
    for (let dy = 0; dy < buildingData.size.height; dy++) {
      for (let dx = 0; dx < buildingData.size.width; dx++) {
        newTiles[y + dy][x + dx] = {
          ...newTiles[y + dy][x + dx],
          type: 'building',
          buildingId: newBuilding.id
        };
      }
    }

    set({
      buildings: [...state.buildings, newBuilding],
      tiles: newTiles,
      player: {
        ...state.player,
        buildingsConstructed: state.player.buildingsConstructed + 1
      }
    });

    playSoundEffect('build');
    get().addNotification(`Started building ${buildingData.name}!`);
  },

  upgradeBuilding: (buildingId) => {
    const state = get();
    const building = state.buildings.find(b => b.id === buildingId);
    if (!building || !building.isConstructed) return;

    if (!get().canAfford(building.upgradeCost)) {
      get().addNotification('Not enough cash!');
      return;
    }

    get().spendCash(building.upgradeCost);

    const updatedBuildings = state.buildings.map(b => {
      if (b.id === buildingId) {
        return {
          ...b,
          level: b.level + 1,
          capacity: b.capacity ? Math.floor(b.capacity * 1.5) : undefined,
          upgradeCost: Math.floor(b.upgradeCost * 1.5)
        };
      }
      return b;
    });

    set({ buildings: updatedBuildings });
    get().addNotification('Building upgraded!');
  },

  hireWorker: (type) => {
    const state = get();
    const cost = 200;

    if (!get().canAfford(cost)) {
      get().addNotification('Not enough cash!');
      return;
    }

    get().spendCash(cost);

    const newWorker: Worker = {
      id: `worker-${Date.now()}-${Math.random()}`,
      name: WORKER_NAMES[Math.floor(Math.random() * WORKER_NAMES.length)],
      type,
      level: 1,
      experience: 0,
      position: { x: 10, y: 10 },
      efficiency: 1.0,
      wages: 10,
      isWorking: false
    };

    set({ workers: [...state.workers, newWorker] });
    get().addNotification(`Hired ${newWorker.name} as ${type}!`);
  },

  assignTask: (workerId, task) => {
    const state = get();
    const updatedWorkers = state.workers.map(w => {
      if (w.id === workerId) {
        return { ...w, currentTask: task, isWorking: true };
      }
      return w;
    });

    set({ workers: updatedWorkers });
  },

  toggleShop: () => {
    set(state => ({ showShop: !state.showShop }));
  },

  showDialogueBox: (dialogue) => {
    set({ showDialogue: true, currentDialogue: dialogue });
  },

  closeDialogue: () => {
    set({ showDialogue: false, currentDialogue: null });
  },

  addNotification: (message) => {
    set(state => ({
      notifications: [...state.notifications, message].slice(-5)
    }));

    // Auto-remove after 3 seconds
    setTimeout(() => {
      set(state => ({
        notifications: state.notifications.slice(1)
      }));
    }, 3000);
  },

  canAfford: (cost) => {
    return get().player.cash >= cost;
  },

  addCash: (amount) => {
    set(state => ({
      player: {
        ...state.player,
        cash: state.player.cash + amount,
        totalEarnings: state.player.totalEarnings + amount
      }
    }));
  },

  spendCash: (amount) => {
    set(state => ({
      player: {
        ...state.player,
        cash: state.player.cash - amount,
        totalSpent: state.player.totalSpent + amount
      }
    }));
  },

  addExperience: (amount) => {
    const state = get();
    const newXP = state.player.experience + amount;
    const xpForNextLevel = state.player.level * 100;

    if (newXP >= xpForNextLevel) {
      set(state => ({
        player: {
          ...state.player,
          level: state.player.level + 1,
          experience: newXP - xpForNextLevel
        }
      }));
      playSoundEffect('levelup');
      get().addNotification(`🎉 Level up! Now level ${state.player.level + 1}!`);
    } else {
      set(state => ({
        player: {
          ...state.player,
          experience: newXP
        }
      }));
    }
  },

  saveGame: () => {
    const state = get();
    const saveData = {
      tiles: state.tiles,
      crops: state.crops,
      animals: state.animals,
      workers: state.workers,
      buildings: state.buildings,
      player: state.player,
      currentTime: state.currentTime
    };

    try {
      localStorage.setItem('echo-bloom-farm-save', JSON.stringify(saveData));
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  },

  loadGame: () => {
    try {
      const saved = localStorage.getItem('echo-bloom-farm-save');
      if (saved) {
        const saveData = JSON.parse(saved);
        set(saveData);
      }
    } catch (e) {
      console.error('Failed to load game:', e);
    }
  }
}));

// Auto-tick every second
if (typeof window !== 'undefined') {
  setInterval(() => {
    useFarmStore.getState().tick();
  }, 1000);
}
