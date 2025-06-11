import type { SmithingInput } from './types';

const STORAGE_KEY = 'toram-smith-calculator-data';

export interface SavedData {
  input: SmithingInput;
  savedAt: string;
  name: string;
}

/**
 * ローカルストレージにデータを保存
 */
export function saveToLocalStorage(input: SmithingInput, name: string): void {
  try {
    const savedData: SavedData = {
      input,
      savedAt: new Date().toISOString(),
      name,
    };
    
    const existingData = getAllSavedData();
    const newData = [...existingData, savedData];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
  }
}

/**
 * ローカルストレージから全てのデータを取得
 */
export function getAllSavedData(): SavedData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
    return [];
  }
}

/**
 * ローカルストレージからデータを削除
 */
export function deleteFromLocalStorage(index: number): void {
  try {
    const existingData = getAllSavedData();
    const newData = existingData.filter((_, i) => i !== index);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  } catch (error) {
    console.error('Failed to delete data from localStorage:', error);
  }
}

/**
 * ローカルストレージの全データをクリア
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}