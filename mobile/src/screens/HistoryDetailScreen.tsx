import React from "react";
import { View, Image, Text } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RecommendationCard } from "../components/RecommendationCard";
import { pesticideMap } from "@rice-pest-ai/shared";
import type { HistoryRecord } from "../storage/history";

export default function HistoryDetailScreen() {
  const route = useRoute<RouteProp<{ params: { record: HistoryRecord } }, "params">>();
  const record = route.params.record;
  const rec = pesticideMap[record.label];
  return (
    <View style={{ padding: 16 }}>
      <Image source={{ uri: record.imageUri }} style={{ width: "100%", height: 300 }} />
      <Text style={{ fontWeight: "bold", marginTop: 8 }}>
        {record.label} ({(record.confidence * 100).toFixed(1)}%)
      </Text>
      <RecommendationCard recommendation={rec} />
    </View>
  );
}

