export * from "./types";
// Re-export JSON with a typed default (TS consumers)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pesticideMap from "./pesticideMap.json";
export { pesticideMap };
