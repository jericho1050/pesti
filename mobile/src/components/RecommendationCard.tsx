import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { PesticideRecommendation } from "@rice-pest-ai/shared";

export function RecommendationCard({ recommendation }: { recommendation: PesticideRecommendation }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recommendation</Text>
      <Text>Chemical: {recommendation.chemical}</Text>
      <Text>Dosage: {recommendation.dosage}</Text>
      <Text>Timing: {recommendation.timing}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderWidth: 1, borderRadius: 8, marginTop: 16 },
  title: { fontWeight: "bold", marginBottom: 8 },
});

