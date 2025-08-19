import React, { useEffect, useRef, useState } from "react";
import { View, Text, Button, Image, StyleSheet } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import * as FileSystem from "expo-file-system";
import { classify } from "../native/PestClassifier";
import { pesticideMap, PestLabel } from "@rice-pest-ai/shared";
import { insertScan } from "../storage/history";
import { RecommendationCard } from "../components/RecommendationCard";

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const camera = useRef<Camera>(null);
  const [result, setResult] = useState<{ label: PestLabel; confidence: number } | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    Camera.requestCameraPermission().then((status) => {
      setHasPermission(status === "authorized");
    });
  }, []);

  const takePhoto = async () => {
    if (!camera.current) return;
    const photo = await camera.current.takePhoto({ quality: 90 });
    const fileUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
    await FileSystem.moveAsync({ from: photo.path, to: fileUri });
    const prediction = await classify(fileUri);
    if (prediction.confidence >= 0.7) {
      setResult(prediction as { label: PestLabel; confidence: number });
      setImageUri(fileUri);
      await insertScan({
        imageUri: fileUri,
        label: prediction.label as PestLabel,
        confidence: prediction.confidence,
        createdAt: Date.now(),
      });
    } else {
      setResult(null);
      setImageUri(fileUri);
    }
  };

  if (hasPermission === false) return <Text>No camera permission</Text>;
  if (!device) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1 }}>
      {imageUri ? (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: imageUri }} style={{ flex: 1 }} />
          {result ? (
            <>
              <Text style={styles.result}>
                {result.label} ({(result.confidence * 100).toFixed(1)}%)
              </Text>
              <RecommendationCard recommendation={pesticideMap[result.label]} />
            </>
          ) : (
            <Text style={styles.result}>Low confidence — retake photo</Text>
          )}
          <Button title="Retake" onPress={() => { setImageUri(null); setResult(null); }} />
        </View>
      ) : (
        <Camera ref={camera} style={{ flex: 1 }} device={device} isActive={true} />
      )}
      {!imageUri && <Button title="Capture" onPress={takePhoto} />}
    </View>
  );
}

const styles = StyleSheet.create({
  result: { textAlign: "center", marginTop: 8, fontSize: 16 },
});

