import { NativeModules } from 'react-native';
const { PestClassifier } = NativeModules;

export async function classify(imageUri: string): Promise<{ label: string; confidence: number }> {
  if (!PestClassifier?.classify) {
    // Stub (when model is missing) to keep UI flow testable
    return { label: 'brown-planthopper', confidence: 0.91 };
  }
  return PestClassifier.classify(imageUri);
}
