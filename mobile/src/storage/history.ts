import * as SQLite from "expo-sqlite";
import type { PestLabel } from "@rice-pest-ai/shared";

export interface HistoryRecord {
  id: number;
  imageUri: string;
  label: PestLabel;
  confidence: number;
  createdAt: number;
}

const db = SQLite.openDatabase("history.db");

export function init(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS scans (id INTEGER PRIMARY KEY AUTOINCREMENT, imageUri TEXT, label TEXT, confidence REAL, createdAt INTEGER);",
        [],
        () => resolve(),
        (_, err) => {
          reject(err);
          return false;
        }
      );
    });
  });
}

export function insertScan(record: Omit<HistoryRecord, "id">): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO scans (imageUri, label, confidence, createdAt) VALUES (?, ?, ?, ?);",
        [record.imageUri, record.label, record.confidence, record.createdAt],
        () => {
          tx.executeSql(
            "DELETE FROM scans WHERE id NOT IN (SELECT id FROM scans ORDER BY createdAt DESC LIMIT 20);"
          );
          resolve();
        },
        (_, err) => {
          reject(err);
          return false;
        }
      );
    });
  });
}

export function getRecent(limit = 20): Promise<HistoryRecord[]> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM scans ORDER BY createdAt DESC LIMIT ?;`,
        [limit],
        (_, { rows }) => {
          resolve(rows._array as HistoryRecord[]);
        },
        (_, err) => {
          reject(err);
          return false;
        }
      );
    });
  });
}

export function clear(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM scans;",
        [],
        () => resolve(),
        (_, err) => {
          reject(err);
          return false;
        }
      );
    });
  });
}

