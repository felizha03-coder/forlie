import { AudioPrefs, MiniGameId } from '../types/lie';

const PREFS_KEY = 'lie_gb_audio_prefs_v1';
const SCORES_KEY = 'lie_gb_highscores_v1';
const DRAWN_REMINDERS_KEY = 'lie_gb_drawn_reminders_v1';

export function getAudioPrefs(): AudioPrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { volume: 0.75, muted: false, sfxEnabled: true };
    const parsed = JSON.parse(raw) as Partial<AudioPrefs>;
    return {
      volume: typeof parsed.volume === 'number' ? Math.max(0, Math.min(1, parsed.volume)) : 0.75,
      muted: Boolean(parsed.muted),
      sfxEnabled: typeof parsed.sfxEnabled === 'boolean' ? parsed.sfxEnabled : true,
    };
  } catch {
    return { volume: 0.75, muted: false, sfxEnabled: true };
  }
}

export function saveAudioPrefs(prefs: AudioPrefs): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage restriction
  }
}

export function getHighScores(): Record<MiniGameId, number> {
  try {
    const raw = localStorage.getItem(SCORES_KEY);
    if (!raw) return { SNAKE: 0, STARS: 0, MEMORY: 0 };
    const parsed = JSON.parse(raw) as Partial<Record<MiniGameId, number>>;
    return {
      SNAKE: typeof parsed.SNAKE === 'number' ? parsed.SNAKE : 0,
      STARS: typeof parsed.STARS === 'number' ? parsed.STARS : 0,
      MEMORY: typeof parsed.MEMORY === 'number' ? parsed.MEMORY : 0,
    };
  } catch {
    return { SNAKE: 0, STARS: 0, MEMORY: 0 };
  }
}

export function updateHighScore(game: MiniGameId, score: number, lowerIsBetter = false): Record<MiniGameId, number> {
  const current = getHighScores();
  const prev = current[game];
  const isNewBest = lowerIsBetter ? prev === 0 || score < prev : score > prev;
  if (isNewBest) {
    current[game] = score;
    try {
      localStorage.setItem(SCORES_KEY, JSON.stringify(current));
    } catch {
      // Ignore storage restriction
    }
  }
  return current;
}

export function getDrawnReminderIds(): number[] {
  try {
    const raw = localStorage.getItem(DRAWN_REMINDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'number') : [];
  } catch {
    return [];
  }
}

export function saveDrawnReminderIds(ids: number[]): void {
  try {
    localStorage.setItem(DRAWN_REMINDERS_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage restriction
  }
}
