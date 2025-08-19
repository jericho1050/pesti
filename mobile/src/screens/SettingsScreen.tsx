import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { clear } from '../storage/history';
import { refreshRecommendations, getLastUpdated } from '../recommendations';

export default function SettingsScreen() {
  const [updated, setUpdated] = useState<number | null>(null);

  useEffect(() => {
    getLastUpdated().then(setUpdated);
  }, []);

  const refresh = async () => {
    await refreshRecommendations();
    const ts = await getLastUpdated();
    setUpdated(ts);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Refresh Recommendations" onPress={refresh} />
      {updated && (
        <Text style={{ marginVertical: 8 }}>Last updated: {new Date(updated).toLocaleString()}</Text>
      )}
      <Button title="Clear history" onPress={() => clear()} />
    </View>
  );
}
