import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import type { BackTapSensitivity, PracticeMode } from '../types/practice';

export interface PocketTapUpdateEvent {
  sessionId: string;
  remainingCount: number;
  isPaused: boolean;
  isActive: boolean;
  completed: boolean;
}

export interface PocketStoredState {
  sessionId: string;
  mode: PracticeMode;
  remainingCount: number;
  isPaused: boolean;
  isActive: boolean;
}

interface NativePocketJapaModule {
  startPocketMode(
    sessionId: string,
    mode: string,
    label: string,
    targetCount: number,
    remainingCount: number,
    sensitivity: string
  ): void;
  pausePocketMode(): void;
  resumePocketMode(): void;
  syncRemainingCount(remainingCount: number): void;
  stopPocketMode(): void;
  getPocketState(): Promise<PocketStoredState | null>;
}

const nativeModule: NativePocketJapaModule | undefined =
  Platform.OS === 'android' ? NativeModules.PocketJapaModule : undefined;

const emitter = nativeModule
  ? new NativeEventEmitter(NativeModules.PocketJapaModule)
  : null;

export const isPocketModeSupported = Boolean(nativeModule);

export function startNativePocketMode(params: {
  sessionId: string;
  mode: PracticeMode;
  label: string;
  targetCount: number;
  remainingCount: number;
  sensitivity: BackTapSensitivity;
}): void {
  nativeModule?.startPocketMode(
    params.sessionId,
    params.mode,
    params.label,
    params.targetCount,
    params.remainingCount,
    params.sensitivity
  );
}

export function pauseNativePocketMode(): void {
  nativeModule?.pausePocketMode();
}

export function resumeNativePocketMode(): void {
  nativeModule?.resumePocketMode();
}

export function syncNativePocketCount(remainingCount: number): void {
  nativeModule?.syncRemainingCount(remainingCount);
}

export function stopNativePocketMode(): void {
  nativeModule?.stopPocketMode();
}

export async function getNativePocketState(): Promise<PocketStoredState | null> {
  if (!nativeModule) {
    return null;
  }
  try {
    return await nativeModule.getPocketState();
  } catch {
    return null;
  }
}

export function subscribePocketTapUpdates(
  listener: (event: PocketTapUpdateEvent) => void
): () => void {
  if (!emitter) {
    return () => {};
  }
  const sub = emitter.addListener('PocketTapUpdate', (raw: unknown) => {
    listener(raw as PocketTapUpdateEvent);
  });
  return () => sub.remove();
}
