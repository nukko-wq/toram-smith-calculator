'use client';

import { useState, useEffect } from 'react';
import { saveToLocalStorage, getAllSavedData, deleteFromLocalStorage, clearLocalStorage, type SavedData } from '../lib/localStorage';
import type { SmithingInput } from '../lib/types';

interface SaveLoadPanelProps {
  currentInput: SmithingInput;
  onLoad: (input: SmithingInput) => void;
}

export default function SaveLoadPanel({ currentInput, onLoad }: SaveLoadPanelProps) {
  const [savedData, setSavedData] = useState<SavedData[]>([]);
  const [saveName, setSaveName] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadSavedData();
  }, []);

  const loadSavedData = () => {
    if (typeof window !== 'undefined') {
      setSavedData(getAllSavedData());
    }
  };

  const handleSave = () => {
    if (!saveName.trim()) {
      alert('保存名を入力してください');
      return;
    }
    
    saveToLocalStorage(currentInput, saveName.trim());
    setSaveName('');
    loadSavedData();
    alert('保存しました');
  };

  const handleLoad = (data: SavedData) => {
    onLoad(data.input);
    alert(`「${data.name}」を読み込みました`);
  };

  const handleDelete = (index: number, name: string) => {
    if (confirm(`「${name}」を削除しますか？`)) {
      deleteFromLocalStorage(index);
      loadSavedData();
    }
  };

  const handleClearAll = () => {
    if (confirm('保存されたデータを全て削除しますか？')) {
      clearLocalStorage();
      loadSavedData();
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">データの保存・読み込み</h2>
      
      {/* 保存セクション */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">保存</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="保存名を入力"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            保存
          </button>
        </div>
      </div>

      {/* 読み込みセクション */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">保存済みデータ</h3>
          {savedData.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              全削除
            </button>
          )}
        </div>
        
        {savedData.length === 0 ? (
          <p className="text-gray-500 text-sm">保存されたデータはありません</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {savedData.map((data, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded border"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{data.name}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(data.savedAt).toLocaleString('ja-JP')}
                  </div>
                  <div className="text-xs text-gray-400">
                    {data.input.equipmentType} | 難易度: {data.input.difficulty}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoad(data)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    読込
                  </button>
                  <button
                    onClick={() => handleDelete(index, data.name)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}