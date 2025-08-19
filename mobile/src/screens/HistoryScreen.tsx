import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HistoryItem, getRecent } from '../storage/history';
import { getRecommendation } from '../recommendations';

const Stack = createNativeStackNavigator();

function HistoryList({ navigation }: any) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => {
    const load = async () => {
      const res = await getRecent();
      setItems(res);
    };
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation]);

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Detail', { item })} style={{ flexDirection: 'row', padding: 8 }}>
          <Image source={{ uri: item.imageUri }} style={{ width: 64, height: 64, marginRight: 8 }} />
          <View>
            <Text>{item.label}</Text>
            <Text>{item.confidence.toFixed(2)}</Text>
            <Text>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

function HistoryDetail({ route }: any) {
  const { item } = route.params as { item: HistoryItem };
  const rec = getRecommendation(item.label as any);
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Image source={{ uri: item.imageUri }} style={{ flex: 1, marginBottom: 12 }} />
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.label} ({item.confidence.toFixed(2)})</Text>
      <Text>Chemical: {rec.chemical}</Text>
      <Text>Dosage: {rec.dosage}</Text>
      <Text>Timing: {rec.timing}</Text>
    </View>
  );
}

export default function HistoryScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="List" component={HistoryList} options={{ title: 'History' }} />
      <Stack.Screen name="Detail" component={HistoryDetail} options={{ title: 'Detail' }} />
    </Stack.Navigator>
  );
}
