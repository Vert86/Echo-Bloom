import { BuildingBlueprint, BuildingType } from '../types';

export const BUILDING_BLUEPRINTS: Record<BuildingType, BuildingBlueprint> = {
  hydroponicFarm: {
    type: 'hydroponicFarm',
    name: 'Hydroponic Farm',
    description: 'Grows vegetables and greens using nutrient-rich water',
    culture: 'hydroponicGuild',
    baseCost: [
      { type: 'metal', amount: 10 },
      { type: 'tools', amount: 2 }
    ],
    baseInputs: [
      { type: 'cleanWater', amount: 30 },
      { type: 'biogas', amount: 10 }
    ],
    baseOutputs: [
      { type: 'food', amount: 50 },
      { type: 'grayWater', amount: 20 }
    ],
    baseEfficiency: 1.0,
    baseEnergyCost: 10,
    icon: '🌱'
  },
  algaeCultivator: {
    type: 'algaeCultivator',
    name: 'Algae Cultivator',
    description: 'Produces protein-rich algae paste',
    culture: 'hydroponicGuild',
    baseCost: [
      { type: 'metal', amount: 15 },
      { type: 'tools', amount: 3 }
    ],
    baseInputs: [
      { type: 'cleanWater', amount: 40 },
      { type: 'biogas', amount: 15 }
    ],
    baseOutputs: [
      { type: 'food', amount: 70 },
      { type: 'rawBiomass', amount: 10 }
    ],
    baseEfficiency: 1.0,
    baseEnergyCost: 15,
    icon: '🦠'
  },
  waterPurifier: {
    type: 'waterPurifier',
    name: 'Water Purifier',
    description: 'Converts gray water back to clean water',
    culture: 'bioEngineers',
    baseCost: [
      { type: 'metal', amount: 20 },
      { type: 'tools', amount: 5 }
    ],
    baseInputs: [
      { type: 'grayWater', amount: 30 },
      { type: 'biogas', amount: 5 }
    ],
    baseOutputs: [
      { type: 'cleanWater', amount: 25 },
      { type: 'rawBiomass', amount: 5 }
    ],
    baseEfficiency: 1.0,
    baseEnergyCost: 8,
    icon: '💧'
  },
  biogasGenerator: {
    type: 'biogasGenerator',
    name: 'Biogas Generator',
    description: 'Produces biogas energy from organic waste',
    culture: 'bioEngineers',
    baseCost: [
      { type: 'metal', amount: 25 },
      { type: 'tools', amount: 4 }
    ],
    baseInputs: [
      { type: 'rawBiomass', amount: 20 }
    ],
    baseOutputs: [
      { type: 'biogas', amount: 30 }
    ],
    baseEfficiency: 1.0,
    baseEnergyCost: 2,
    icon: '⚡'
  },
  workshopStation: {
    type: 'workshopStation',
    name: 'Workshop Station',
    description: 'Manufactures tools and components',
    culture: 'bioEngineers',
    baseCost: [
      { type: 'metal', amount: 30 },
      { type: 'tools', amount: 2 }
    ],
    baseInputs: [
      { type: 'metal', amount: 15 },
      { type: 'biogas', amount: 10 }
    ],
    baseOutputs: [
      { type: 'tools', amount: 5 }
    ],
    baseEfficiency: 1.0,
    baseEnergyCost: 12,
    icon: '🔧'
  },
  recyclingCenter: {
    type: 'recyclingCenter',
    name: 'Recycling Center',
    description: 'Recovers metal from waste materials',
    culture: 'bioEngineers',
    baseCost: [
      { type: 'metal', amount: 20 },
      { type: 'tools', amount: 6 }
    ],
    baseInputs: [
      { type: 'rawBiomass', amount: 25 },
      { type: 'biogas', amount: 8 }
    ],
    baseOutputs: [
      { type: 'metal', amount: 12 }
    ],
    baseEfficiency: 1.0,
    baseEnergyCost: 10,
    icon: '♻️'
  },
  researchLab: {
    type: 'researchLab',
    name: 'Research Lab',
    description: 'Generates research credits for optimization',
    culture: 'archiveKeepers',
    baseCost: [
      { type: 'metal', amount: 25 },
      { type: 'tools', amount: 8 }
    ],
    baseInputs: [
      { type: 'food', amount: 30 },
      { type: 'biogas', amount: 15 }
    ],
    baseOutputs: [
      { type: 'researchCredits', amount: 10 },
      { type: 'grayWater', amount: 15 }
    ],
    baseEfficiency: 1.0,
    baseEnergyCost: 18,
    icon: '🔬'
  },
  culturalHub: {
    type: 'culturalHub',
    name: 'Cultural Hub',
    description: 'Boosts morale and community cohesion',
    culture: 'archiveKeepers',
    baseCost: [
      { type: 'metal', amount: 15 },
      { type: 'tools', amount: 5 }
    ],
    baseInputs: [
      { type: 'food', amount: 20 }
    ],
    baseOutputs: [
      { type: 'morale', amount: 25 },
      { type: 'socialWaste', amount: 10 }
    ],
    baseEfficiency: 1.0,
    baseEnergyCost: 5,
    icon: '🎭'
  },
  compostingBed: {
    type: 'compostingBed',
    name: 'Composting Bed',
    description: 'Converts social waste to raw biomass',
    culture: 'archiveKeepers',
    baseCost: [
      { type: 'metal', amount: 10 },
      { type: 'tools', amount: 3 }
    ],
    baseInputs: [
      { type: 'socialWaste', amount: 20 }
    ],
    baseOutputs: [
      { type: 'rawBiomass', amount: 18 }
    ],
    baseEfficiency: 1.0,
    baseEnergyCost: 3,
    icon: '🍂'
  }
};

export const MICRO_CULTURE_DESCRIPTIONS = {
  hydroponicGuild: {
    name: 'Hydroponic Guild',
    description: 'Masters of sustainable food production through advanced water-based agriculture',
    color: '#10b981',
    icon: '🌿',
    primaryInputs: ['cleanWater', 'biogas'] as const,
    primaryOutputs: ['food', 'grayWater'] as const
  },
  bioEngineers: {
    name: 'Bio-Engineers',
    description: 'Innovators who transform waste into resources and maintain critical systems',
    color: '#8b5cf6',
    icon: '⚙️',
    primaryInputs: ['rawBiomass', 'metal'] as const,
    primaryOutputs: ['tools', 'cleanWater', 'biogas'] as const
  },
  archiveKeepers: {
    name: 'Archive Keepers',
    description: 'Scholars who preserve knowledge and maintain social harmony',
    color: '#06b6d4',
    icon: '📚',
    primaryInputs: ['food'] as const,
    primaryOutputs: ['researchCredits', 'morale', 'socialWaste'] as const
  }
} as const;
