'use client';

import { useState, useEffect } from 'react';
import { calculateSmithing } from '../lib/calculations';
import type { SmithingInput, EquipmentType } from '../lib/types';
import { saveCurrentData, loadCurrentData } from '../lib/localStorage';

const equipmentTypes: EquipmentType[] = [
  '片手剣',
  '両手剣', 
  '弓',
  '自動弓',
  '杖',
  '魔道具',
  '手甲',
  '旋風槍',
  '抜刀剣',
  '体防具'
];

const defaultInput: SmithingInput = {
  characterStats: {
    str: 1,
    dex: 1,
    vit: 1,
    agi: 1,
    int: 1,
    tec: 1,
  },
  equipment: {
    main: { dex: undefined, dexPercent: undefined, str: undefined, strPercent: undefined },
    sub: { dex: undefined, dexPercent: undefined, str: undefined, strPercent: undefined },
    body: { dex: undefined, dexPercent: undefined, str: undefined, strPercent: undefined },
    additional: { dex: undefined, dexPercent: undefined, str: undefined, strPercent: undefined },
    special: { dex: undefined, dexPercent: undefined, str: undefined, strPercent: undefined },
    fashion: { dex: undefined, dexPercent: undefined, str: undefined, strPercent: undefined },
  },
  food: {
    str: undefined,
    dex: undefined,
  },
  skills: {
    equipmentCrafting: 10,
    carefulCrafting: 10,
    masterCrafting: 10,
  },
  smithProficiency: undefined,
  equipmentType: '片手剣',
  difficulty: undefined,
  basePotential: undefined,
};

export default function SmithCalculator() {
  const [input, setInput] = useState<SmithingInput>(defaultInput);
  const [isLoaded, setIsLoaded] = useState(false);

  const result = calculateSmithing(input);

  const updateCharacterStat = (stat: keyof typeof input.characterStats, value: number) => {
    setInput(prev => ({
      ...prev,
      characterStats: {
        ...prev.characterStats,
        [stat]: Math.max(1, Math.min(999, value)),
      },
    }));
  };

  const updateEquipmentStat = (
    slot: keyof typeof input.equipment,
    stat: string,
    value: number | undefined
  ) => {
    setInput(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [slot]: {
          ...prev.equipment[slot],
          [stat]: value === undefined || value === 0 ? undefined : Math.max(0, value),
        },
      },
    }));
  };

  const updateFood = (stat: keyof typeof input.food, value: number) => {
    setInput(prev => ({
      ...prev,
      food: {
        ...prev.food,
        [stat]: Math.max(0, value),
      },
    }));
  };

  useEffect(() => {
    const savedData = loadCurrentData();
    if (savedData) {
      setInput(savedData);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveCurrentData(input);
    }
  }, [input, isLoaded]);

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 space-y-6 lg:space-y-8">
      <h1 className="text-xl lg:text-3xl font-bold text-center mb-4 lg:mb-6 text-blue-600">
        トーラム スミス成功率計算
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1fr_2fr] gap-6 lg:gap-8">
        {/* 左カラム: キャラクターステータス */}
        <div className="space-y-4 lg:space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">ステータス</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(input.characterStats).map(([stat, value]) => (
                <div key={stat}>
                  <label className="block text-sm font-medium mb-1">
                    {stat.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={value}
                    onChange={(e) => updateCharacterStat(stat as keyof typeof input.characterStats, parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>


          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">スキル・熟練度</h2>
            <div className="space-y-3">
              {/* 1行目: スミス熟練度, 装備製作 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">スミス熟練度</label>
                  <input
                    type="number"
                    min="0"
                    value={input.smithProficiency ?? ''}
                    onChange={(e) => setInput(prev => ({
                      ...prev,
                      smithProficiency: e.target.value === '' ? undefined : Math.max(0, parseInt(e.target.value) || 0)
                    }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">装備製作</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={input.skills.equipmentCrafting}
                    onChange={(e) => setInput(prev => ({
                      ...prev,
                      skills: { ...prev.skills, equipmentCrafting: Math.max(0, Math.min(10, parseInt(e.target.value) || 0)) }
                    }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                  />
                </div>
              </div>
              
              {/* 2行目: 丁寧な制作, 匠の製作技術 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">丁寧な制作</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={input.skills.carefulCrafting}
                    onChange={(e) => setInput(prev => ({
                      ...prev,
                      skills: { ...prev.skills, carefulCrafting: Math.max(0, Math.min(10, parseInt(e.target.value) || 0)) }
                    }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">匠の製作技術</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={input.skills.masterCrafting}
                    onChange={(e) => setInput(prev => ({
                      ...prev,
                      skills: { ...prev.skills, masterCrafting: Math.max(0, Math.min(10, parseInt(e.target.value) || 0)) }
                    }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">料理</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">STR</label>
                <input
                  type="number"
                  min="0"
                  value={input.food.str ?? ''}
                  onChange={(e) => updateFood('str', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">DEX</label>
                <input
                  type="number"
                  min="0"
                  value={input.food.dex ?? ''}
                  onChange={(e) => updateFood('dex', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                  className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 製作対象 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">製作対象</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">装備種別</label>
                <select
                  value={input.equipmentType}
                  onChange={(e) => setInput(prev => ({
                    ...prev,
                    equipmentType: e.target.value as EquipmentType
                  }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                >
                  {equipmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">難易度</label>
                <input
                  type="number"
                  value={input.difficulty ?? ''}
                  onChange={(e) => setInput(prev => ({
                    ...prev,
                    difficulty: e.target.value === '' ? undefined : parseInt(e.target.value) || 0
                  }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">基礎潜在値</label>
                <input
                  type="number"
                  value={input.basePotential ?? ''}
                  onChange={(e) => setInput(prev => ({
                    ...prev,
                    basePotential: e.target.value === '' ? undefined : parseInt(e.target.value) || 0
                  }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 中央カラム: 装備品プロパティ */}
        <div className="space-y-4 lg:space-y-6 lg:col-span-2 xl:col-span-1">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">装備品プロパティ</h2>
            <div className="space-y-4">
              {/* 1行目: メイン武器, サブ武器 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{key: 'main', name: 'メイン武器'}, {key: 'sub', name: 'サブ武器'}].map(({key, name}) => {
                  const stats = input.equipment[key as keyof typeof input.equipment];
                  return (
                    <div key={key} className="border border-gray-200 rounded-lg p-3">
                      <h3 className="text-sm font-medium mb-2">{name}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">DEX</label>
                          <input
                            type="number"
                            min="0"
                            value={stats.dex ?? ''}
                            onChange={(e) => updateEquipmentStat(key as keyof typeof input.equipment, 'dex', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">STR</label>
                          <input
                            type="number"
                            min="0"
                            value={stats.str ?? ''}
                            onChange={(e) => updateEquipmentStat(key as keyof typeof input.equipment, 'str', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">DEX%</label>
                          <input
                            type="number"
                            min="0"
                            value={stats.dexPercent ?? ''}
                            onChange={(e) => updateEquipmentStat(key as keyof typeof input.equipment, 'dexPercent', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">STR%</label>
                          <input
                            type="number"
                            min="0"
                            value={stats.strPercent ?? ''}
                            onChange={(e) => updateEquipmentStat(key as keyof typeof input.equipment, 'strPercent', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* 2行目: 体装備, 追加装備 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{key: 'body', name: '体装備'}, {key: 'additional', name: '追加装備'}].map(({key, name}) => {
                  const stats = input.equipment[key as keyof typeof input.equipment];
                  return (
                    <div key={key} className="border border-gray-200 rounded-lg p-3">
                      <h3 className="text-sm font-medium mb-2">{name}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">DEX</label>
                          <input
                            type="number"
                            min="0"
                            value={stats.dex ?? ''}
                            onChange={(e) => updateEquipmentStat(key as keyof typeof input.equipment, 'dex', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">STR</label>
                          <input
                            type="number"
                            min="0"
                            value={stats.str ?? ''}
                            onChange={(e) => updateEquipmentStat(key as keyof typeof input.equipment, 'str', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">DEX%</label>
                          <input
                            type="number"
                            min="0"
                            value={stats.dexPercent ?? ''}
                            onChange={(e) => updateEquipmentStat(key as keyof typeof input.equipment, 'dexPercent', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">STR%</label>
                          <input
                            type="number"
                            min="0"
                            value={stats.strPercent ?? ''}
                            onChange={(e) => updateEquipmentStat(key as keyof typeof input.equipment, 'strPercent', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* 3行目: 特殊装備, オシャレ装備 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{key: 'special', name: '特殊装備'}, {key: 'fashion', name: 'オシャレ装備'}].map(({key, name}) => {
                  const stats = input.equipment[key as keyof typeof input.equipment];
                  return (
                    <div key={key} className="border border-gray-200 rounded-lg p-3">
                      <h3 className="text-sm font-medium mb-2">{name}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium mb-1">DEX</label>
                          <input
                            type="number"
                            min="0"
                            value={stats.dex ?? ''}
                            onChange={(e) => updateEquipmentStat(key as keyof typeof input.equipment, 'dex', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">STR</label>
                          <input
                            type="number"
                            min="0"
                            value={stats.str ?? ''}
                            onChange={(e) => updateEquipmentStat(key as keyof typeof input.equipment, 'str', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">DEX%</label>
                          <input
                            type="number"
                            min="0"
                            value={stats.dexPercent ?? ''}
                            onChange={(e) => updateEquipmentStat(key as keyof typeof input.equipment, 'dexPercent', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">STR%</label>
                          <input
                            type="number"
                            min="0"
                            value={stats.strPercent ?? ''}
                            onChange={(e) => updateEquipmentStat(key as keyof typeof input.equipment, 'strPercent', e.target.value === '' ? undefined : parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-gray-300 rounded outline-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        {/* 計算結果と保存機能 */}
        <div className="space-y-4 lg:space-y-6 lg:col-span-2 xl:col-span-1">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">計算結果</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {result.successRate.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600">成功率</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {result.potentialIncrease.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">潜在値上昇量</div>
              </div>
              
              <div className="bg-white p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {result.finalPotential.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">最終潜在値</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-lg font-bold text-red-600">
                    {result.totalStr}
                  </div>
                  <div className="text-xs text-gray-600">総STR</div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600">
                    {result.totalDex}
                  </div>
                  <div className="text-xs text-gray-600">総DEX</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        </div>
      </div>
    </div>
  );
}