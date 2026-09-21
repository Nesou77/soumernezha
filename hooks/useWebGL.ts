"use client";

import { useSyncExternalStore } from "react";

function detect(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

let cached: boolean | null = null;
const getSnapshot = () => (cached ??= detect());

/**
 * WebGL availability. Returns `null` during SSR / hydration (unknown), then
 * `true` or `false` on the client, so callers can avoid a fallback flash.
 */
export function useWebGL(): boolean | null {
  return useSyncExternalStore(
    () => () => {},
    getSnapshot,
    () => null,
  );
}
