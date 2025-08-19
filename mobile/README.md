# Mobile App

Offline rice pest detection using Expo Bare and PyTorch Mobile Lite.

## Model

Place the TorchScript Lite model at `assets/models/model_rice_pest.ptl` (224×224 RGB input).

## Development

```sh
pnpm install
pnpm --filter mobile prebuild:android   # or :ios
pnpm --filter mobile android            # build and run android dev client
pnpm --filter mobile ios                # build and run ios dev client
```

After manual native edits (Gradle/Pods) avoid `expo prebuild --clean`. Re-run `prebuild` only if needed and re-apply native changes.

## Behaviour

* Tabs: **Scan**, **History**, **Settings**.
* A prediction must have softmax ≥ **0.70** or the UI shows `Low confidence — retake photo`.
* Class labels (fixed order):
  - brown-planthopper
  - green-leafhopper
  - rice-leaf-folder
  - rice-bug
  - stem-borer
  - whorl-maggot

History keeps the last **20** results in SQLite. Recommendations are loaded from `@rice-pest-ai/shared/pesticideMap.json` and can be refreshed in Settings.
