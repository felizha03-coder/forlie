import { PersistedErzaState } from '../types/erza';

const STORAGE_KEY = 'auclair_little_gameboy_v1';

export const DEFAULT_ERZA_STATE: PersistedErzaState = {
  sdInserted: false,
  savedNote: false,
  discoveredReminders: [],
  bestCatchScore: 0,
  bestAdventureScore: 0,
  bestMemoryMoves: null,
  secretFound: false,
  certifiedFriendBadge: false,
  themeMode: 'NIGHT',
  masterVolume: 0.7,
  muted: false,
  buttonSfxEnabled: true,
  gameSfxEnabled: true,
};

export function loadErzaState(): PersistedErzaState {
  if (typeof window === 'undefined') return { ...DEFAULT_ERZA_STATE };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_ERZA_STATE };
    const parsed = JSON.parse(raw) as Partial<PersistedErzaState>;
    return {
      sdInserted: Boolean(parsed.sdInserted),
      savedNote: Boolean(parsed.savedNote),
      discoveredReminders: Array.isArray(parsed.discoveredReminders)
        ? parsed.discoveredReminders.filter((n) => typeof n === 'number' && n >= 0 && n < 50)
        : [],
      bestCatchScore: typeof parsed.bestCatchScore === 'number' ? parsed.bestCatchScore : 0,
      bestAdventureScore:
        typeof parsed.bestAdventureScore === 'number' ? parsed.bestAdventureScore : 0,
      bestMemoryMoves: typeof parsed.bestMemoryMoves === 'number' ? parsed.bestMemoryMoves : null,
      secretFound: Boolean(parsed.secretFound),
      certifiedFriendBadge: Boolean(parsed.certifiedFriendBadge),
      themeMode: 'NIGHT',
      masterVolume:
        typeof parsed.masterVolume === 'number'
          ? Math.max(0, Math.min(1, parsed.masterVolume))
          : 0.7,
      muted: Boolean(parsed.muted),
      buttonSfxEnabled:
        typeof parsed.buttonSfxEnabled === 'boolean' ? parsed.buttonSfxEnabled : true,
      gameSfxEnabled: typeof parsed.gameSfxEnabled === 'boolean' ? parsed.gameSfxEnabled : true,
    };
  } catch {
    return { ...DEFAULT_ERZA_STATE };
  }
}

export function saveErzaState(state: PersistedErzaState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota issues gracefully
  }
}
