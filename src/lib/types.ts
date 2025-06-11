export type EquipmentType = 
  | '片手剣'
  | '両手剣'
  | '弓'
  | '自動弓'
  | '杖'
  | '魔道具'
  | '手甲'
  | '旋風槍'
  | '抜刀剣'
  | '体防具';

export interface CharacterStats {
  str: number;
  dex: number;
  vit: number;
  agi: number;
  int: number;
  tec: number;
}

export interface EquipmentStats {
  dex: number;
  dexPercent: number;
  str: number;
  strPercent: number;
}

export interface EquipmentSet {
  main: EquipmentStats;
  sub: EquipmentStats;
  body: EquipmentStats;
  additional: EquipmentStats;
  special: EquipmentStats;
  fashion: EquipmentStats;
}

export interface FoodBonus {
  str: number;
  dex: number;
}

export interface Skills {
  equipmentCrafting: number;
  carefulCrafting: number;
  masterCrafting: number;
}

export interface SmithingInput {
  characterStats: CharacterStats;
  equipment: EquipmentSet;
  food: FoodBonus;
  skills: Skills;
  smithProficiency: number;
  equipmentType: EquipmentType;
  difficulty: number;
  basePotential: number;
}

export interface SmithingResult {
  successRate: number;
  potentialIncrease: number;
  finalPotential: number;
  totalStr: number;
  totalDex: number;
}