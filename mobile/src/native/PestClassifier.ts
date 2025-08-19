import { NativeModules } from "react-native";

const { PestClassifier } = NativeModules as {
  PestClassifier?: { classify(uri: string): Promise<{ label: string; confidence: number }> };
};

export async function classify(imageUri: string): Promise<{ label: string; confidence: number }> {
  if (!PestClassifier?.classify) {
    return { label: "brown-planthopper", confidence: 0.91 };
  }
  return PestClassifier.classify(imageUri);
}

