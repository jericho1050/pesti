import * as SQLite from 'expo-sqlite';

export interface HistoryItem {
  id: number;
  imageUri: string;
  label: string;
  confidence: number;
  createdAt: number;
}

const db = SQLite.openDatabase('history.db');

export function init() {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, imageUri TEXT, label TEXT, confidence REAL, createdAt INTEGER)'
    );
  });
}

export function insertScan(item: Omit<HistoryItem, 'id'>): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO history (imageUri, label, confidence, createdAt) VALUES (?, ?, ?, ?)',
        [item.imageUri, item.label, item.confidence, item.createdAt],
        () => {
          tx.executeSql(
            'DELETE FROM history WHERE id NOT IN (SELECT id FROM history ORDER BY createdAt DESC LIMIT 20)'
          );
          resolve();
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function getRecent(limit = 20): Promise<HistoryItem[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM history ORDER BY createdAt DESC LIMIT ?',
        [limit],
        (_, { rows }) => resolve(rows._array as HistoryItem[]),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

export function clear(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM history', [], () => resolve(), (_, error) => {
        reject(error);
        return false;
      });
    });
  });
}
