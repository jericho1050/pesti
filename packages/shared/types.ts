export type PestLabel =
  | "brown-planthopper"
  | "green-leafhopper"
  | "rice-leaf-folder"
  | "rice-bug"
  | "stem-borer"
  | "whorl-maggot";

export interface PestPrediction {
  label: PestLabel;
  confidence: number; // 0..1
}

export interface PesticideRecommendation {
  chemical: string;
  dosage: string;
  timing: string;
}

