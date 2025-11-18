import { create } from 'zustand';
import {
  GameState,
  Building,
  BuildingType,
  ResourceType,
  ProductionCycle,
  ResourcePrediction,
  MicroCulture
} from '../types';
import { BUILDING_BLUEPRINTS, MICRO_CULTURE_DESCRIPTIONS } from '../data/buildings';

const INITIAL_RESOURCES: Record<ResourceType, number> = {
  cleanWater: 100,
  biogas: 50,
  food: 80,
  grayWater: 20,
  socialWaste: 10,
  rawBiomass: 30,
  metal: 50,
  tools: 10,
  researchCredits: 0,
  morale: 100
};

const createInitialMicroCultures = (): MicroCulture[] => {
  return Object.entries(MICRO_CULTURE_DESCRIPTIONS).map(([key, desc]) => ({
    type: key as any,
    name: desc.name,
    description: desc.description,
    population: 10,
    morale: 100,
    buildings: [],
    primaryInputs: [...desc.primaryInputs],
    primaryOutputs: [...desc.primaryOutputs],
    color: desc.color
  }));
};

const INITIAL_STATE: GameState = {
  currentCycle: 0,
  resources: { ...INITIAL_RESOURCES },
  systemicLoad: 0,
  systemicLoadHistory: [0],
  microCultures: createInitialMicroCultures(),
  buildings: [],
  powerUps: {
    flowPeek: { available: 3, isActive: false },
    rewindCycle: { available: 2, canRewind: false },
    systemAuditor: { available: 3, isActive: false }
  },
  isPaused: false,
  isGameOver: false,
  cycleHistory: [],
  maxCyclesAtFullLoad: 5,
  consecutiveCyclesAtFullLoad: 0,
  tutorialCompleted: false,
  tutorialStep: 0
};

interface GameStore extends GameState {
  // Actions
  addBuilding: (type: BuildingType, position: { x: number; y: number }) => void;
  removeBuilding: (id: string) => void;
  upgradeBuilding: (id: string) => void;
  runProductionCycle: () => void;
  togglePause: () => void;
  resetGame: () => void;

  // Power-ups
  activateFlowPeek: () => void;
  deactivateFlowPeek: () => void;
  useRewindCycle: () => void;
  activateSystemAuditor: (buildingId: string) => void;
  deactivateSystemAuditor: () => void;

  // Tutorial
  completeTutorialStep: () => void;

  // Helper methods
  calculateSystemicLoad: () => number;
  predictNextCycles: (count: number) => ResourcePrediction[];
  canAffordBuilding: (type: BuildingType) => boolean;
  saveGame: () => void;
  loadGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  addBuilding: (type, position) => {
    const blueprint = BUILDING_BLUEPRINTS[type];
    const state = get();

    // Check if can afford
    let canAfford = true;
    blueprint.baseCost.forEach(cost => {
      if (state.resources[cost.type] < cost.amount) {
        canAfford = false;
      }
    });

    if (!canAfford) return;

    // Deduct costs
    const newResources = { ...state.resources };
    blueprint.baseCost.forEach(cost => {
      newResources[cost.type] -= cost.amount;
    });

    // Create building
    const newBuilding: Building = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      culture: blueprint.culture,
      level: 1,
      position,
      inputs: blueprint.baseInputs.map(i => ({ ...i })),
      outputs: blueprint.baseOutputs.map(o => ({ ...o })),
      efficiency: blueprint.baseEfficiency,
      energyCost: blueprint.baseEnergyCost,
      history: []
    };

    // Update micro-culture
    const newMicroCultures = state.microCultures.map(mc => {
      if (mc.type === blueprint.culture) {
        return {
          ...mc,
          buildings: [...mc.buildings, newBuilding]
        };
      }
      return mc;
    });

    set({
      buildings: [...state.buildings, newBuilding],
      resources: newResources,
      microCultures: newMicroCultures
    });

    // Auto-save after building
    setTimeout(() => get().saveGame(), 100);
  },

  removeBuilding: (id) => {
    const state = get();
    const building = state.buildings.find(b => b.id === id);
    if (!building) return;

    const newBuildings = state.buildings.filter(b => b.id !== id);
    const newMicroCultures = state.microCultures.map(mc => ({
      ...mc,
      buildings: mc.buildings.filter(b => b.id !== id)
    }));

    set({
      buildings: newBuildings,
      microCultures: newMicroCultures
    });

    setTimeout(() => get().saveGame(), 100);
  },

  upgradeBuilding: (id) => {
    const state = get();
    const building = state.buildings.find(b => b.id === id);
    if (!building) return;

    // Cost to upgrade: 50% of base cost
    const blueprint = BUILDING_BLUEPRINTS[building.type];
    const upgradeCost = blueprint.baseCost.map(c => ({
      ...c,
      amount: Math.floor(c.amount * 0.5)
    }));

    let canAfford = true;
    upgradeCost.forEach(cost => {
      if (state.resources[cost.type] < cost.amount) {
        canAfford = false;
      }
    });

    if (!canAfford) return;

    // Deduct costs
    const newResources = { ...state.resources };
    upgradeCost.forEach(cost => {
      newResources[cost.type] -= cost.amount;
    });

    // Upgrade building (10% improvement per level)
    const newBuildings = state.buildings.map(b => {
      if (b.id === id) {
        const multiplier = 1.1;
        return {
          ...b,
          level: b.level + 1,
          outputs: b.outputs.map(o => ({
            ...o,
            amount: Math.floor(o.amount * multiplier)
          })),
          efficiency: Math.min(1.5, b.efficiency + 0.05)
        };
      }
      return b;
    });

    const newMicroCultures = state.microCultures.map(mc => ({
      ...mc,
      buildings: mc.buildings.map(b => {
        const upgraded = newBuildings.find(nb => nb.id === b.id);
        return upgraded || b;
      })
    }));

    set({
      buildings: newBuildings,
      resources: newResources,
      microCultures: newMicroCultures
    });

    setTimeout(() => get().saveGame(), 100);
  },

  runProductionCycle: () => {
    const state = get();
    if (state.isPaused || state.isGameOver) return;

    let newResources = { ...state.resources };
    let totalWaste = 0;
    let totalDeficit = 0;

    // Process each building
    const newBuildings = state.buildings.map(building => {
      let canProduce = true;
      let currentEfficiency = building.efficiency;

      // Check if we have enough inputs
      building.inputs.forEach(input => {
        const needed = Math.floor(input.amount * currentEfficiency);
        if (newResources[input.type] < needed) {
          canProduce = false;
          totalDeficit += needed - newResources[input.type];
          currentEfficiency = Math.max(0.5, currentEfficiency - 0.1);
        }
      });

      if (canProduce) {
        // Consume inputs
        building.inputs.forEach(input => {
          const needed = Math.floor(input.amount * currentEfficiency);
          newResources[input.type] -= needed;
        });

        // Produce outputs
        building.outputs.forEach(output => {
          const produced = Math.floor(output.amount * currentEfficiency);
          newResources[output.type] += produced;
        });
      } else {
        // Partial production at reduced efficiency
        building.inputs.forEach(input => {
          const available = newResources[input.type];
          newResources[input.type] = Math.max(0, available - Math.floor(available * 0.5));
        });

        building.outputs.forEach(output => {
          const reduced = Math.floor(output.amount * currentEfficiency * 0.5);
          newResources[output.type] += reduced;
        });
      }

      // Update building history
      const historyEntry = {
        cycle: state.currentCycle + 1,
        efficiency: currentEfficiency,
        energyUsed: building.energyCost,
        wasteGenerated: canProduce ? 0 : 5
      };

      if (!canProduce) {
        totalWaste += 5;
      }

      return {
        ...building,
        efficiency: currentEfficiency,
        history: [...building.history.slice(-9), historyEntry]
      };
    });

    // Calculate unused resources (surplus = potential waste)
    Object.entries(newResources).forEach(([key, value]) => {
      const resourceType = key as ResourceType;
      if (['grayWater', 'socialWaste', 'rawBiomass'].includes(resourceType)) {
        // These should be processed, excess counts as waste
        if (value > 50) {
          totalWaste += (value - 50) * 0.1;
        }
      }
    });

    // Ensure resources don't go negative
    Object.keys(newResources).forEach(key => {
      const resourceType = key as ResourceType;
      if (newResources[resourceType] < 0) {
        totalDeficit += Math.abs(newResources[resourceType]);
        newResources[resourceType] = 0;
      }
    });

    // Calculate systemic load (0-100)
    const wasteComponent = Math.min(40, totalWaste * 2);
    const deficitComponent = Math.min(40, totalDeficit);
    const moraleComponent = Math.max(0, 20 - (newResources.morale / 5));

    let newSystemicLoad = wasteComponent + deficitComponent + moraleComponent;
    newSystemicLoad = Math.max(0, Math.min(100, newSystemicLoad));

    // Check for consecutive cycles at full load
    let consecutiveFull = state.consecutiveCyclesAtFullLoad;
    if (newSystemicLoad >= 100) {
      consecutiveFull += 1;
    } else {
      consecutiveFull = 0;
    }

    // Check for game over
    let isGameOver = false;
    let gameOverReason = '';
    if (consecutiveFull >= state.maxCyclesAtFullLoad) {
      isGameOver = true;
      gameOverReason = `System overload! The Systemic Load remained at 100% for ${state.maxCyclesAtFullLoad} consecutive cycles, causing total community collapse.`;
    }

    // Apply degradation if at full load
    if (newSystemicLoad >= 100) {
      newBuildings.forEach(building => {
        building.efficiency = Math.max(0.3, building.efficiency - 0.1);
      });
    }

    // Create production cycle record
    const cycleRecord: ProductionCycle = {
      cycleNumber: state.currentCycle + 1,
      resources: new Map(Object.entries(newResources)) as Map<ResourceType, number>,
      systemicLoad: newSystemicLoad,
      isActive: true,
      timestamp: Date.now()
    };

    // Update micro-cultures
    const newMicroCultures = state.microCultures.map(mc => ({
      ...mc,
      buildings: newBuildings.filter(b => b.culture === mc.type),
      morale: newResources.morale
    }));

    set({
      currentCycle: state.currentCycle + 1,
      resources: newResources,
      systemicLoad: newSystemicLoad,
      systemicLoadHistory: [...state.systemicLoadHistory, newSystemicLoad],
      buildings: newBuildings,
      microCultures: newMicroCultures,
      cycleHistory: [...state.cycleHistory.slice(-19), cycleRecord],
      consecutiveCyclesAtFullLoad: consecutiveFull,
      isGameOver,
      gameOverReason,
      powerUps: {
        ...state.powerUps,
        rewindCycle: {
          ...state.powerUps.rewindCycle,
          canRewind: state.cycleHistory.length > 0
        }
      }
    });

    setTimeout(() => get().saveGame(), 100);
  },

  togglePause: () => {
    set(state => ({ isPaused: !state.isPaused }));
  },

  resetGame: () => {
    set({ ...INITIAL_STATE, microCultures: createInitialMicroCultures() });
    localStorage.removeItem('echo-bloom-save');
  },

  activateFlowPeek: () => {
    const state = get();
    if (state.powerUps.flowPeek.available <= 0) return;

    const predictions = get().predictNextCycles(3);

    set({
      powerUps: {
        ...state.powerUps,
        flowPeek: {
          available: state.powerUps.flowPeek.available - 1,
          isActive: true,
          predictions
        }
      }
    });
  },

  deactivateFlowPeek: () => {
    set(state => ({
      powerUps: {
        ...state.powerUps,
        flowPeek: {
          ...state.powerUps.flowPeek,
          isActive: false,
          predictions: undefined
        }
      }
    }));
  },

  useRewindCycle: () => {
    const state = get();
    if (state.powerUps.rewindCycle.available <= 0 || !state.powerUps.rewindCycle.canRewind) return;
    if (state.cycleHistory.length === 0) return;

    const previousCycle = state.cycleHistory[state.cycleHistory.length - 1];
    const previousResources: Record<ResourceType, number> = {} as any;

    previousCycle.resources.forEach((value, key) => {
      previousResources[key] = value;
    });

    set({
      currentCycle: Math.max(0, state.currentCycle - 1),
      resources: previousResources,
      systemicLoad: previousCycle.systemicLoad,
      cycleHistory: state.cycleHistory.slice(0, -1),
      consecutiveCyclesAtFullLoad: Math.max(0, state.consecutiveCyclesAtFullLoad - 1),
      powerUps: {
        ...state.powerUps,
        rewindCycle: {
          available: state.powerUps.rewindCycle.available - 1,
          canRewind: state.cycleHistory.length > 1
        }
      }
    });

    setTimeout(() => get().saveGame(), 100);
  },

  activateSystemAuditor: (buildingId) => {
    const state = get();
    if (state.powerUps.systemAuditor.available <= 0) return;

    set({
      powerUps: {
        ...state.powerUps,
        systemAuditor: {
          available: state.powerUps.systemAuditor.available - 1,
          isActive: true,
          selectedBuildingId: buildingId
        }
      }
    });
  },

  deactivateSystemAuditor: () => {
    set(state => ({
      powerUps: {
        ...state.powerUps,
        systemAuditor: {
          ...state.powerUps.systemAuditor,
          isActive: false,
          selectedBuildingId: undefined
        }
      }
    }));
  },

  completeTutorialStep: () => {
    set(state => ({
      tutorialStep: state.tutorialStep + 1,
      tutorialCompleted: state.tutorialStep >= 5
    }));
  },

  calculateSystemicLoad: () => {
    return get().systemicLoad;
  },

  predictNextCycles: (count) => {
    // Simplified prediction - in reality would simulate cycles
    const state = get();
    const predictions: ResourcePrediction[] = [];

    for (let i = 1; i <= count; i++) {
      const prediction: ResourcePrediction = {
        cycle: state.currentCycle + i,
        resources: { ...state.resources },
        systemicLoad: state.systemicLoad,
        warnings: []
      };

      // Simple heuristic-based prediction
      if (state.systemicLoad > 80) {
        prediction.warnings.push('Critical: Systemic load approaching maximum');
      }
      if (state.resources.cleanWater < 30) {
        prediction.warnings.push('Warning: Clean water running low');
      }
      if (state.resources.food < 40) {
        prediction.warnings.push('Warning: Food reserves depleting');
      }

      predictions.push(prediction);
    }

    return predictions;
  },

  canAffordBuilding: (type) => {
    const blueprint = BUILDING_BLUEPRINTS[type];
    const state = get();

    return blueprint.baseCost.every(cost =>
      state.resources[cost.type] >= cost.amount
    );
  },

  saveGame: () => {
    const state = get();
    const saveData = {
      currentCycle: state.currentCycle,
      resources: state.resources,
      systemicLoad: state.systemicLoad,
      systemicLoadHistory: state.systemicLoadHistory,
      buildings: state.buildings,
      powerUps: state.powerUps,
      cycleHistory: state.cycleHistory,
      consecutiveCyclesAtFullLoad: state.consecutiveCyclesAtFullLoad,
      tutorialCompleted: state.tutorialCompleted,
      tutorialStep: state.tutorialStep
    };

    try {
      localStorage.setItem('echo-bloom-save', JSON.stringify(saveData));
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  },

  loadGame: () => {
    try {
      const saved = localStorage.getItem('echo-bloom-save');
      if (saved) {
        const saveData = JSON.parse(saved);

        // Reconstruct cycle history with Map
        const cycleHistory = (saveData.cycleHistory || []).map((cycle: any) => ({
          ...cycle,
          resources: new Map(Object.entries(cycle.resources || {}))
        }));

        // Reconstruct micro-cultures with buildings
        const microCultures = createInitialMicroCultures().map(mc => ({
          ...mc,
          buildings: (saveData.buildings || []).filter((b: Building) => b.culture === mc.type)
        }));

        set({
          ...saveData,
          cycleHistory,
          microCultures,
          isPaused: false,
          isGameOver: false
        });
      }
    } catch (e) {
      console.error('Failed to load game:', e);
    }
  }
}));
