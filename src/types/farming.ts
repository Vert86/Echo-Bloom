// Farming Simulation Types

export type CropType =
  | 'wheat'
  | 'corn'
  | 'tomato'
  | 'carrot'
  | 'lettuce'
  | 'potato'
  | 'apple'
  | 'orange';

export type AnimalType =
  | 'chicken'
  | 'cow'
  | 'pig'
  | 'sheep'
  | 'goat'
  | 'horse';

export type FarmBuildingType =
  | 'barn'
  | 'coop'
  | 'silo'
  | 'windmill'
  | 'greenhouse'
  | 'farmhouse'
  | 'workshop'
  | 'market';

export type TileType =
  | 'empty'
  | 'soil'
  | 'watered'
  | 'planted'
  | 'growing'
  | 'harvestable'
  | 'building'
  | 'pasture'
  | 'path';

export type GrowthStage = 'seed' | 'sprout' | 'growing' | 'mature' | 'harvestable';

export interface Crop {
  id: string;
  type: CropType;
  position: { x: number; y: number };
  growthStage: GrowthStage;
  growthProgress: number; // 0-100
  isWatered: boolean;
  lastWatered: number;
  plantedAt: number;
  harvestValue: number;
  needsWater: boolean;
}

export interface Animal {
  id: string;
  type: AnimalType;
  name: string;
  position: { x: number; y: number };
  age: number;
  hunger: number; // 0-100
  happiness: number; // 0-100
  lastFed: number;
  canBreed: boolean;
  isPregnant: boolean;
  pregnancyProgress: number;
  sellValue: number;
  productionType?: 'milk' | 'eggs' | 'wool';
  productionProgress: number;
}

export interface Worker {
  id: string;
  name: string;
  type: 'farmer' | 'rancher' | 'builder' | 'merchant';
  level: number;
  experience: number;
  position: { x: number; y: number };
  currentTask?: WorkerTask;
  efficiency: number; // 0.5 - 2.0
  wages: number; // per day
  isWorking: boolean;
}

export interface WorkerTask {
  type: 'watering' | 'harvesting' | 'feeding' | 'building' | 'selling';
  targetId: string;
  progress: number;
  duration: number;
}

export interface FarmBuilding {
  id: string;
  type: FarmBuildingType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  level: number;
  constructionProgress: number; // 0-100
  isConstructed: boolean;
  capacity?: number;
  storedItems?: number;
  upgradeCost: number;
}

export interface FarmTile {
  x: number;
  y: number;
  type: TileType;
  cropId?: string;
  animalId?: string;
  buildingId?: string;
  isAccessible: boolean;
}

export interface PlayerStats {
  level: number;
  experience: number;
  cash: number;
  totalEarnings: number;
  totalSpent: number;
  cropsHarvested: number;
  animalsSold: number;
  buildingsConstructed: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'crop' | 'animal' | 'building' | 'tool' | 'worker';
  itemType: string;
  price: number;
  levelRequired: number;
  icon: string;
  category: string;
}

export interface DialogueOption {
  id: string;
  text: string;
  nextDialogueId?: string;
  action?: () => void;
}

export interface Dialogue {
  id: string;
  npcName: string;
  npcIcon: string;
  text: string;
  options: DialogueOption[];
}

export const CROP_DATA: Record<CropType, {
  name: string;
  icon: string;
  growthTime: number; // in seconds
  sellPrice: number;
  buyPrice: number;
  waterNeeded: number; // times during growth
  stages: { icon: string; name: string }[];
}> = {
  wheat: {
    name: 'Wheat',
    icon: '🌾',
    growthTime: 60,
    sellPrice: 20,
    buyPrice: 5,
    waterNeeded: 2,
    stages: [
      { icon: '🟫', name: 'Seed' },
      { icon: '🌱', name: 'Sprout' },
      { icon: '🌿', name: 'Growing' },
      { icon: '🌾', name: 'Mature' },
      { icon: '🌾✨', name: 'Harvestable' }
    ]
  },
  corn: {
    name: 'Corn',
    icon: '🌽',
    growthTime: 90,
    sellPrice: 35,
    buyPrice: 10,
    waterNeeded: 3,
    stages: [
      { icon: '🟫', name: 'Seed' },
      { icon: '🌱', name: 'Sprout' },
      { icon: '🌿', name: 'Growing' },
      { icon: '🌽', name: 'Mature' },
      { icon: '🌽✨', name: 'Harvestable' }
    ]
  },
  tomato: {
    name: 'Tomato',
    icon: '🍅',
    growthTime: 75,
    sellPrice: 30,
    buyPrice: 8,
    waterNeeded: 3,
    stages: [
      { icon: '🟫', name: 'Seed' },
      { icon: '🌱', name: 'Sprout' },
      { icon: '🌿', name: 'Growing' },
      { icon: '🍅', name: 'Mature' },
      { icon: '🍅✨', name: 'Harvestable' }
    ]
  },
  carrot: {
    name: 'Carrot',
    icon: '🥕',
    growthTime: 50,
    sellPrice: 15,
    buyPrice: 4,
    waterNeeded: 2,
    stages: [
      { icon: '🟫', name: 'Seed' },
      { icon: '🌱', name: 'Sprout' },
      { icon: '🌿', name: 'Growing' },
      { icon: '🥕', name: 'Mature' },
      { icon: '🥕✨', name: 'Harvestable' }
    ]
  },
  lettuce: {
    name: 'Lettuce',
    icon: '🥬',
    growthTime: 40,
    sellPrice: 12,
    buyPrice: 3,
    waterNeeded: 2,
    stages: [
      { icon: '🟫', name: 'Seed' },
      { icon: '🌱', name: 'Sprout' },
      { icon: '🥬', name: 'Growing' },
      { icon: '🥬', name: 'Mature' },
      { icon: '🥬✨', name: 'Harvestable' }
    ]
  },
  potato: {
    name: 'Potato',
    icon: '🥔',
    growthTime: 70,
    sellPrice: 25,
    buyPrice: 6,
    waterNeeded: 2,
    stages: [
      { icon: '🟫', name: 'Seed' },
      { icon: '🌱', name: 'Sprout' },
      { icon: '🌿', name: 'Growing' },
      { icon: '🥔', name: 'Mature' },
      { icon: '🥔✨', name: 'Harvestable' }
    ]
  },
  apple: {
    name: 'Apple Tree',
    icon: '🍎',
    growthTime: 120,
    sellPrice: 50,
    buyPrice: 20,
    waterNeeded: 4,
    stages: [
      { icon: '🟫', name: 'Seed' },
      { icon: '🌱', name: 'Sapling' },
      { icon: '🌳', name: 'Growing' },
      { icon: '🌳', name: 'Mature' },
      { icon: '🍎', name: 'Fruit Ready' }
    ]
  },
  orange: {
    name: 'Orange Tree',
    icon: '🍊',
    growthTime: 120,
    sellPrice: 55,
    buyPrice: 22,
    waterNeeded: 4,
    stages: [
      { icon: '🟫', name: 'Seed' },
      { icon: '🌱', name: 'Sapling' },
      { icon: '🌳', name: 'Growing' },
      { icon: '🌳', name: 'Mature' },
      { icon: '🍊', name: 'Fruit Ready' }
    ]
  }
};

export const ANIMAL_DATA: Record<AnimalType, {
  name: string;
  icon: string;
  buyPrice: number;
  sellPrice: number;
  feedCost: number;
  breedingTime: number; // seconds
  productionType?: 'milk' | 'eggs' | 'wool';
  productionTime?: number; // seconds
  productionValue?: number;
}> = {
  chicken: {
    name: 'Chicken',
    icon: '🐔',
    buyPrice: 50,
    sellPrice: 80,
    feedCost: 5,
    breedingTime: 120,
    productionType: 'eggs',
    productionTime: 60,
    productionValue: 15
  },
  cow: {
    name: 'Cow',
    icon: '🐄',
    buyPrice: 300,
    sellPrice: 500,
    feedCost: 20,
    breedingTime: 300,
    productionType: 'milk',
    productionTime: 90,
    productionValue: 40
  },
  pig: {
    name: 'Pig',
    icon: '🐷',
    buyPrice: 150,
    sellPrice: 250,
    feedCost: 15,
    breedingTime: 180,
  },
  sheep: {
    name: 'Sheep',
    icon: '🐑',
    buyPrice: 200,
    sellPrice: 320,
    feedCost: 12,
    breedingTime: 200,
    productionType: 'wool',
    productionTime: 120,
    productionValue: 50
  },
  goat: {
    name: 'Goat',
    icon: '🐐',
    buyPrice: 180,
    sellPrice: 280,
    feedCost: 10,
    breedingTime: 150,
    productionType: 'milk',
    productionTime: 80,
    productionValue: 30
  },
  horse: {
    name: 'Horse',
    icon: '🐴',
    buyPrice: 500,
    sellPrice: 800,
    feedCost: 25,
    breedingTime: 360,
  }
};

export const BUILDING_DATA: Record<FarmBuildingType, {
  name: string;
  icon: string;
  buildCost: number;
  upgradeCost: number;
  buildTime: number; // seconds
  size: { width: number; height: number };
  capacity?: number;
  description: string;
}> = {
  barn: {
    name: 'Barn',
    icon: '🏚️',
    buildCost: 500,
    upgradeCost: 300,
    buildTime: 30,
    size: { width: 3, height: 3 },
    capacity: 10,
    description: 'Houses animals and stores hay'
  },
  coop: {
    name: 'Chicken Coop',
    icon: '🏠',
    buildCost: 200,
    upgradeCost: 150,
    buildTime: 20,
    size: { width: 2, height: 2 },
    capacity: 8,
    description: 'Perfect home for chickens'
  },
  silo: {
    name: 'Silo',
    icon: '🗼',
    buildCost: 400,
    upgradeCost: 250,
    buildTime: 25,
    size: { width: 2, height: 2 },
    capacity: 100,
    description: 'Stores crops and feed'
  },
  windmill: {
    name: 'Windmill',
    icon: '🌀',
    buildCost: 600,
    upgradeCost: 400,
    buildTime: 40,
    size: { width: 2, height: 3 },
    description: 'Processes wheat into flour'
  },
  greenhouse: {
    name: 'Greenhouse',
    icon: '🏡',
    buildCost: 800,
    upgradeCost: 500,
    buildTime: 35,
    size: { width: 4, height: 3 },
    description: 'Grows crops 50% faster'
  },
  farmhouse: {
    name: 'Farmhouse',
    icon: '🏡',
    buildCost: 1000,
    upgradeCost: 700,
    buildTime: 50,
    size: { width: 4, height: 4 },
    description: 'Your home and worker housing'
  },
  workshop: {
    name: 'Workshop',
    icon: '🔨',
    buildCost: 350,
    upgradeCost: 200,
    buildTime: 20,
    size: { width: 2, height: 2 },
    description: 'Craft tools and upgrades'
  },
  market: {
    name: 'Market Stand',
    icon: '🏪',
    buildCost: 450,
    upgradeCost: 300,
    buildTime: 25,
    size: { width: 3, height: 2 },
    description: 'Sell products for better prices'
  }
};

export const WORKER_NAMES = [
  'John', 'Mary', 'Tom', 'Sarah', 'Jake', 'Emma',
  'Mike', 'Lisa', 'Ben', 'Anna', 'Sam', 'Kate',
  'Dave', 'Lucy', 'Tim', 'Rose', 'Jim', 'Amy'
];

export const DIALOGUE_TEMPLATES: Record<string, Dialogue[]> = {
  farmer: [
    {
      id: 'farmer-greeting',
      npcName: 'Farmer Joe',
      npcIcon: '👨‍🌾',
      text: "Howdy there! Beautiful day for farmin', ain't it?",
      options: [
        { id: '1', text: 'Sure is! How are your crops doing?', nextDialogueId: 'farmer-crops' },
        { id: '2', text: 'Any tips for a new farmer?', nextDialogueId: 'farmer-tips' },
        { id: '3', text: 'See you later!', nextDialogueId: undefined }
      ]
    },
    {
      id: 'farmer-crops',
      npcName: 'Farmer Joe',
      npcIcon: '👨‍🌾',
      text: "My crops are growin' great! Remember to water 'em daily, and they'll reward ya handsomely!",
      options: [
        { id: '1', text: 'Thanks for the advice!', nextDialogueId: undefined }
      ]
    },
    {
      id: 'farmer-tips',
      npcName: 'Farmer Joe',
      npcIcon: '👨‍🌾',
      text: "Start small with quick crops like lettuce and carrots. As ya earn cash, invest in animals - they're a steady income!",
      options: [
        { id: '1', text: 'Great advice, thanks!', nextDialogueId: undefined }
      ]
    }
  ],
  merchant: [
    {
      id: 'merchant-greeting',
      npcName: 'Trader Smith',
      npcIcon: '🧙‍♂️',
      text: "Welcome to my shop! Looking to buy or sell something today?",
      options: [
        { id: '1', text: "I'd like to see your wares", nextDialogueId: 'merchant-shop' },
        { id: '2', text: 'What are the best deals today?', nextDialogueId: 'merchant-deals' },
        { id: '3', text: 'Just browsing', nextDialogueId: undefined }
      ]
    }
  ]
};
