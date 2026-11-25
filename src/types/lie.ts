export type ExperienceStage = 'ARCADE' | 'GAMEBOY';

export type GameBoyScreenId =
  | 'BOOT'
  | 'UNLOCKED'
  | 'MENU'
  | 'LETTER'
  | 'REMINDERS'
  | 'MUSIC'
  | 'GAMES'
  | 'FINALE';

export type MiniGameId = 'SNAKE' | 'STARS' | 'MEMORY';

export type ConsoleButtonId =
  | 'UP'
  | 'DOWN'
  | 'LEFT'
  | 'RIGHT'
  | 'A'
  | 'B'
  | 'SELECT'
  | 'START';

export type ReminderCategory =
  | 'TIRED'
  | 'OVERTHINKING'
  | 'UNMOTIVATED'
  | 'LAUGH'
  | 'DIFFICULT'
  | 'AMAZING';

export interface ReminderItem {
  id: number;
  category: ReminderCategory;
  categoryLabel: string;
  text: string;
}

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  note: string;
  defaultPath: string;
  uploadedUrl?: string;
  uploadedFileName?: string;
  durationLabel?: string;
}

export interface AudioPrefs {
  volume: number;
  muted: boolean;
  sfxEnabled: boolean;
}
