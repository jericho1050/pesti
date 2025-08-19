import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { getRecent, HistoryRecord } from "../storage/history";
import { useNavigation } from "@react-navigation/native";

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    const load = () => getRecent().then(setItems).catch(() => setItems([]));
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: HistoryRecord }) => (
    <TouchableOpacity onPress={() => navigation.navigate("HistoryDetail" as never, { record: item } as never)}>
      <View style={{ flexDirection: "row", margin: 8 }}>
        <Image source={{ uri: item.imageUri }} style={{ width: 64, height: 64 }} />
        <View style={{ marginLeft: 8 }}>
          <Text>{item.label}</Text>
          <Text>{(item.confidence * 100).toFixed(1)}%</Text>
          <Text>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return <FlatList data={items} keyExtractor={(i) => String(i.id)} renderItem={renderItem} />;
}

