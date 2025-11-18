// Core Game Types

export type ResourceType =
  | 'cleanWater'
  | 'biogas'
  | 'food'
  | 'grayWater'
  | 'socialWaste'
  | 'rawBiomass'
  | 'metal'
  | 'tools'
  | 'researchCredits'
  | 'morale';

export type MicroCultureType = 'hydroponicGuild' | 'bioEngineers' | 'archiveKeepers';

export type BuildingType =
  | 'hydroponicFarm'
  | 'algaeCultivator'
  | 'waterPurifier'
  | 'biogasGenerator'
  | 'workshopStation'
  | 'recyclingCenter'
  | 'researchLab'
  | 'culturalHub'
  | 'compostingBed';

export type PowerUpType = 'flowPeek' | 'rewindCycle' | 'systemAuditor';

export interface ResourceAmount {
  type: ResourceType;
  amount: number;
}

export interface Building {
  id: string;
  type: BuildingType;
  culture: MicroCultureType;
  level: number;
  position: { x: number; y: number };
  inputs: ResourceAmount[];
  outputs: ResourceAmount[];
  efficiency: number;
  energyCost: number;
  history: EfficiencyHistoryEntry[];
}

export interface EfficiencyHistoryEntry {
  cycle: number;
  efficiency: number;
  energyUsed: number;
  wasteGenerated: number;
}

export interface MicroCulture {
  type: MicroCultureType;
  name: string;
  description: string;
  population: number;
  morale: number;
  buildings: Building[];
  primaryInputs: ResourceType[];
  primaryOutputs: ResourceType[];
  color: string;
}

export interface ProductionCycle {
  cycleNumber: number;
  resources: Map<ResourceType, number>;
  systemicLoad: number;
  isActive: boolean;
  timestamp: number;
}

export interface GameState {
  currentCycle: number;
  resources: Record<ResourceType, number>;
  systemicLoad: number;
  systemicLoadHistory: number[];
  microCultures: MicroCulture[];
  buildings: Building[];
  powerUps: PowerUpUsage;
  isPaused: boolean;
  isGameOver: boolean;
  gameOverReason?: string;
  cycleHistory: ProductionCycle[];
  maxCyclesAtFullLoad: number;
  consecutiveCyclesAtFullLoad: number;
  tutorialCompleted: boolean;
  tutorialStep: number;
}

export interface PowerUpUsage {
  flowPeek: {
    available: number;
    isActive: boolean;
    predictions?: ResourcePrediction[];
  };
  rewindCycle: {
    available: number;
    canRewind: boolean;
  };
  systemAuditor: {
    available: number;
    isActive: boolean;
    selectedBuildingId?: string;
  };
}

export interface ResourcePrediction {
  cycle: number;
  resources: Record<ResourceType, number>;
  systemicLoad: number;
  warnings: string[];
}

export interface ResourceFlow {
  from: string; // building ID or 'reserve'
  to: string; // building ID or 'waste'
  resource: ResourceType;
  amount: number;
  isComplete: boolean;
}

export interface BuildingBlueprint {
  type: BuildingType;
  name: string;
  description: string;
  culture: MicroCultureType;
  baseCost: ResourceAmount[];
  baseInputs: ResourceAmount[];
  baseOutputs: ResourceAmount[];
  baseEfficiency: number;
  baseEnergyCost: number;
  icon: string;
}

export const RESOURCE_NAMES: Record<ResourceType, string> = {
  cleanWater: 'Clean Water',
  biogas: 'Biogas',
  food: 'Food',
  grayWater: 'Gray Water',
  socialWaste: 'Social Waste',
  rawBiomass: 'Raw Biomass',
  metal: 'Metal',
  tools: 'Tools',
  researchCredits: 'Research Credits',
  morale: 'Morale'
};

export const RESOURCE_COLORS: Record<ResourceType, string> = {
  cleanWater: '#3b82f6',
  biogas: '#f59e0b',
  food: '#10b981',
  grayWater: '#64748b',
  socialWaste: '#ef4444',
  rawBiomass: '#a78bfa',
  metal: '#6b7280',
  tools: '#8b5cf6',
  researchCredits: '#06b6d4',
  morale: '#ec4899'
};
