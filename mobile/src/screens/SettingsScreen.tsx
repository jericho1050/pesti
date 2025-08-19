import React, { useEffect, useState } from "react";
import { View, Button, Text, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import { clear } from "../storage/history";

const MAP_PATH = `${FileSystem.documentDirectory}pesticideMap.json`;
const TS_PATH = `${FileSystem.documentDirectory}pesticideMap.timestamp`;

export default function SettingsScreen() {
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    FileSystem.readAsStringAsync(TS_PATH)
      .then((str) => setLastUpdated(Number(str)))
      .catch(() => undefined);
  }, []);

  const refresh = async () => {
    try {
      const res = await fetch("http://localhost:8000/pesticides");
      const json = await res.json();
      if (json && typeof json === "object") {
        await FileSystem.writeAsStringAsync(MAP_PATH, JSON.stringify(json));
        const now = Date.now();
        setLastUpdated(now);
        await FileSystem.writeAsStringAsync(TS_PATH, String(now));
        Alert.alert("Recommendations updated");
      }
    } catch (e) {
      Alert.alert("Failed to refresh");
    }
  };

  const handleClear = async () => {
    await clear();
    Alert.alert("History cleared");
  };

  return (
    <View style={{ padding: 16 }}>
      <Button title="Refresh Recommendations" onPress={refresh} />
      <View style={{ height: 16 }} />
      <Button title="Clear History" onPress={handleClear} />
      {lastUpdated && (
        <Text style={{ marginTop: 16 }}>
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </Text>
      )}
    </View>
  );
}

