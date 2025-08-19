# Mobile App

This Expo bare React Native app provides offline rice pest detection.

## Model

Place the TorchScript Lite model at `assets/models/model_rice_pest.ptl`. It expects a 224×224 RGB image and outputs softmax scores for these labels:

```
brown-planthopper
green-leafhopper
rice-leaf-folder
rice-bug
stem-borer
whorl-maggot
```

Predictions are shown only when confidence ≥ 0.70. Lower scores display *"Low confidence — retake photo"*.

## Development

```sh
pnpm install
npx expo prebuild --platform android,ios
pnpm --filter mobile android
pnpm --filter mobile ios
```

After native edits (Gradle/Pods), avoid `expo prebuild --clean`; reapply changes if regenerated.

