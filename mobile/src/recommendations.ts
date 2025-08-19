import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  pesticideMap as defaultMap,
  PesticideRecommendation,
  PestLabel,
} from '@rice-pest-ai/shared';

const FILE_PATH = `${FileSystem.documentDirectory}pesticideMap.json`;
const TS_KEY = 'pesticideMap:lastUpdated';

let cache: Record<PestLabel, PesticideRecommendation> = defaultMap;

export async function loadRecommendations() {
  try {
    const contents = await FileSystem.readAsStringAsync(FILE_PATH);
    cache = JSON.parse(contents);
  } catch {
    cache = defaultMap;
  }
  return cache;
}

export function getRecommendation(label: PestLabel) {
  return cache[label];
}

export async function refreshRecommendations(): Promise<void> {
  try {
    const res = await fetch('http://localhost:8000/pesticides');
    if (!res.ok) throw new Error('Network error');
    const json = await res.json();
    await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(json));
    cache = json;
    await AsyncStorage.setItem(TS_KEY, String(Date.now()));
  } catch {
    // ignore offline errors
  }
}

export async function getLastUpdated(): Promise<number | null> {
  const ts = await AsyncStorage.getItem(TS_KEY);
  return ts ? Number(ts) : null;
}
