import type { SmithingInput, SmithingResult, EquipmentType, CharacterStats } from './types';

/**
 * INT関数の実装（小数点以下を元の数値より小さい整数に切り捨て）
 */
function intFloor(value: number): number {
  return Math.floor(value);
}

/**
 * 総STRを計算
 */
function calculateTotalStr(input: SmithingInput): number {
  const { characterStats, equipment, food } = input;
  
  // STR固定値の合計
  const strFixed = 
    equipment.main.str +
    equipment.sub.str +
    equipment.body.str +
    equipment.additional.str +
    equipment.special.str +
    equipment.fashion.str +
    food.str;
  
  // STR%の合計
  const strPercent = 
    equipment.main.strPercent +
    equipment.sub.strPercent +
    equipment.body.strPercent +
    equipment.additional.strPercent +
    equipment.special.strPercent +
    equipment.fashion.strPercent;
  
  // 総STR = INT(基礎STR × (1 + STR%/100)) + STR固定値
  return intFloor(characterStats.str * (1 + strPercent / 100)) + strFixed;
}

/**
 * 総DEXを計算
 */
function calculateTotalDex(input: SmithingInput): number {
  const { characterStats, equipment, food } = input;
  
  // DEX固定値の合計
  const dexFixed = 
    equipment.main.dex +
    equipment.sub.dex +
    equipment.body.dex +
    equipment.additional.dex +
    equipment.special.dex +
    equipment.fashion.dex +
    food.dex;
  
  // DEX%の合計
  const dexPercent = 
    equipment.main.dexPercent +
    equipment.sub.dexPercent +
    equipment.body.dexPercent +
    equipment.additional.dexPercent +
    equipment.special.dexPercent +
    equipment.fashion.dexPercent;
  
  // 総DEX = INT(基礎DEX × (1 + DEX%/100)) + DEX固定値
  return intFloor(characterStats.dex * (1 + dexPercent / 100)) + dexFixed;
}

/**
 * 成功率を計算
 */
function calculateSuccessRate(input: SmithingInput, totalStr: number, totalDex: number): number {
  const { characterStats, smithProficiency, difficulty } = input;
  
  // 成功率 = 10 + スミス熟練度 + TEC/2 + 総DEX/6 - 難易度 + 総STR/10
  const successRate = 
    10 + 
    smithProficiency + 
    characterStats.tec / 2 + 
    totalDex / 6 - 
    difficulty + 
    totalStr / 10;
  
  // 0-100%の範囲に制限
  return Math.max(0, Math.min(100, successRate));
}

/**
 * 装備種別ごとのキャラステータスによる潜在値上昇量を計算
 */
function calculateBasePotentialIncrease(equipmentType: EquipmentType, stats: CharacterStats): number {
  switch (equipmentType) {
    case '片手剣':
      return (stats.str + stats.dex) / 20;
    case '両手剣':
      return stats.str / 10;
    case '弓':
      return (stats.str + stats.dex) / 20;
    case '自動弓':
      return stats.dex / 10;
    case '杖':
      return stats.int / 10;
    case '魔道具':
      return (stats.int + stats.agi) / 20;
    case '手甲':
      return stats.agi / 10;
    case '旋風槍':
      return (stats.str + stats.agi) / 20;
    case '抜刀剣':
      return (stats.dex + stats.agi) / 20;
    case '体防具':
      return stats.vit / 10;
    default:
      return 0;
  }
}

/**
 * 潜在値上昇量を計算
 */
function calculatePotentialIncrease(input: SmithingInput): number {
  const { characterStats, skills } = input;
  
  // キャラステータスによる潜在値上昇量
  const basePotentialIncrease = calculateBasePotentialIncrease(input.equipmentType, characterStats);
  
  // 丁寧な制作補正
  const carefulCraftingBonus = basePotentialIncrease * (skills.carefulCrafting / 100);
  
  // 匠の製作技術補正
  const masterCraftingBonus = basePotentialIncrease * (skills.masterCrafting * 2 / 100);
  
  // 総潜在値上昇量
  return basePotentialIncrease + carefulCraftingBonus + masterCraftingBonus;
}

/**
 * スミス計算のメイン関数
 */
export function calculateSmithing(input: SmithingInput): SmithingResult {
  const totalStr = calculateTotalStr(input);
  const totalDex = calculateTotalDex(input);
  const successRate = calculateSuccessRate(input, totalStr, totalDex);
  const potentialIncrease = calculatePotentialIncrease(input);
  const finalPotential = input.basePotential + potentialIncrease;
  
  return {
    successRate,
    potentialIncrease,
    finalPotential,
    totalStr,
    totalDex,
  };
}