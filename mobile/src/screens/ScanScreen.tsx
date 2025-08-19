import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { Camera, PhotoFile, useCameraDevices } from 'react-native-vision-camera';
import * as FileSystem from 'expo-file-system';
import { classify } from '../native/PestClassifier';
import { getRecommendation, loadRecommendations } from '../recommendations';
import { insertScan } from '../storage/history';
import { PestLabel } from '@rice-pest-ai/shared';

export default function ScanScreen() {
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{ label: PestLabel; confidence: number } | null>(null);
  const [recommendation, setRecommendation] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
      await loadRecommendations();
    })();
  }, []);

  const takePhoto = async () => {
    if (!camera.current) return;
    const photo: PhotoFile = await camera.current.takePhoto({ skipMetadata: true });
    const dest = `${FileSystem.documentDirectory}scan-${Date.now()}.jpg`;
    await FileSystem.copyAsync({ from: photo.path, to: dest });
    setPhotoUri(dest);

    const prediction = await classify(dest);
    if (prediction.confidence < 0.7) {
      setMessage('Low confidence — retake photo');
      setResult(null);
      return;
    }
    const rec = getRecommendation(prediction.label as PestLabel);
    setRecommendation(rec);
    setResult(prediction as { label: PestLabel; confidence: number });
    setMessage(null);
    await insertScan({
      imageUri: dest,
      label: prediction.label,
      confidence: prediction.confidence,
      createdAt: Date.now(),
    });
  };

  if (hasPermission === null) return <Text>Requesting permission...</Text>;
  if (!hasPermission) return <Text>No camera permission</Text>;
  if (!device) return <Text>No camera device</Text>;

  return (
    <View style={{ flex: 1 }}>
      {photoUri ? (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: photoUri }} style={{ flex: 1 }} />
          {message && <Text style={styles.message}>{message}</Text>}
          {result && recommendation && (
            <View style={styles.card}>
              <Text style={styles.label}>
                {result.label} ({result.confidence.toFixed(2)})
              </Text>
              <Text>Chemical: {recommendation.chemical}</Text>
              <Text>Dosage: {recommendation.dosage}</Text>
              <Text>Timing: {recommendation.timing}</Text>
            </View>
          )}
          <Button title="Retake" onPress={() => {
            setPhotoUri(null);
            setResult(null);
            setMessage(null);
          }} />
        </View>
      ) : (
        <Camera style={{ flex: 1 }} ref={camera} photo device={device} isActive={!photoUri} />
      )}
      {!photoUri && <Button title="Capture" onPress={takePhoto} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, backgroundColor: '#eee' },
  label: { fontSize: 18, fontWeight: 'bold' },
  message: { color: 'red', textAlign: 'center', margin: 8 },
});
