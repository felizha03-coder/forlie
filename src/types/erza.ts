export type ConsoleLockState = 'LOCKED' | 'INSERTING' | 'LOADING' | 'READY_FLASH' | 'UNLOCKED';

export type ConsoleAppScreen =
  | 'HOME'
  | 'NOTE'
  | 'REMINDERS'
  | 'SOUNDTRACK'
  | 'GAMES'
  | 'SECRET'
  | 'FINALE'
  | 'ACHIEVEMENT'
  | 'SETTINGS';

export type MiniGameId = 'MENU' | 'CATCH_CLOUDS' | 'MEMORY_MATCH' | 'PIXEL_ADVENTURE';

export type ThemeMode = 'DAY' | 'NIGHT';

export type DirectionInput = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type ConsoleButton = DirectionInput | 'A' | 'B' | 'START' | 'SELECT';

export interface SoundtrackItem {
  id: string;
  title: string;
  artist: string;
  durationSec: number;
  audioSrc: string;
  coverAccent: string;
  caption: string;
  personalNote: string;
  spotifyUrl: string;
  youtubeUrl: string;
  isUserUpload?: boolean;
}

export interface PersistedErzaState {
  sdInserted: boolean;
  savedNote: boolean;
  discoveredReminders: number[];
  bestCatchScore: number;
  bestAdventureScore: number;
  bestMemoryMoves: number | null;
  secretFound: boolean;
  certifiedFriendBadge: boolean;
  themeMode: ThemeMode;
  masterVolume: number;
  muted: boolean;
  buttonSfxEnabled: boolean;
  gameSfxEnabled: boolean;
}
