import { RosieProgress, RosieSettings } from '../types/rosie';

const SETTINGS_KEY = 'rosie_exe_settings_v1';
const PROGRESS_KEY = 'rosie_exe_progress_v1';

export const DEFAULT_ROSIE_SETTINGS: RosieSettings = {
  soundEnabled: true,
  bgmVolume: 0.45,
  sfxVolume: 0.65,
  animationsEnabled: true,
};

export const DEFAULT_ROSIE_PROGRESS: RosieProgress = {
  lovePoints: 0,
  hearts: 0,
  selectedCharacter: 'rosie',
  idCardFlipped: false,
  openedLetters: [],
  flippedCards: [],
  hiddenDiscoveries: [],
  completedGames: [],
  ticTacToeScores: {
    rosie: 0,
    deloniel: 0,
    ties: 0,
  },
  secretRoomUnlocked: false,
  keptForever: false,
  customLetters: {},
};

export function loadRosieSettings(): RosieSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_ROSIE_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<RosieSettings>;
    return {
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      bgmVolume:
        typeof parsed.bgmVolume === 'number' ? Math.max(0, Math.min(1, parsed.bgmVolume)) : 0.45,
      sfxVolume:
        typeof parsed.sfxVolume === 'number' ? Math.max(0, Math.min(1, parsed.sfxVolume)) : 0.65,
      animationsEnabled:
        typeof parsed.animationsEnabled === 'boolean' ? parsed.animationsEnabled : true,
    };
  } catch {
    return DEFAULT_ROSIE_SETTINGS;
  }
}

export function saveRosieSettings(settings: RosieSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadRosieProgress(): RosieProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_ROSIE_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<RosieProgress>;
    return {
      lovePoints: typeof parsed.lovePoints === 'number' ? parsed.lovePoints : 0,
      hearts: typeof parsed.hearts === 'number' ? parsed.hearts : 0,
      selectedCharacter: parsed.selectedCharacter === 'deloniel' ? 'deloniel' : 'rosie',
      idCardFlipped: Boolean(parsed.idCardFlipped),
      openedLetters: Array.isArray(parsed.openedLetters) ? parsed.openedLetters : [],
      flippedCards: Array.isArray(parsed.flippedCards) ? parsed.flippedCards : [],
      hiddenDiscoveries: Array.isArray(parsed.hiddenDiscoveries) ? parsed.hiddenDiscoveries : [],
      completedGames: Array.isArray(parsed.completedGames) ? parsed.completedGames : [],
      ticTacToeScores:
        parsed.ticTacToeScores && typeof parsed.ticTacToeScores === 'object'
          ? {
              rosie: Number(parsed.ticTacToeScores.rosie) || 0,
              deloniel: Number(parsed.ticTacToeScores.deloniel) || 0,
              ties: Number(parsed.ticTacToeScores.ties) || 0,
            }
          : { rosie: 0, deloniel: 0, ties: 0 },
      secretRoomUnlocked: Boolean(parsed.secretRoomUnlocked),
      keptForever: Boolean(parsed.keptForever),
      customLetters:
        parsed.customLetters && typeof parsed.customLetters === 'object'
          ? parsed.customLetters
          : {},
    };
  } catch {
    return DEFAULT_ROSIE_PROGRESS;
  }
}

export function saveRosieProgress(progress: RosieProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors
  }
}

export function resetRosieProgress(): RosieProgress {
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    // Ignore
  }
  return {
    ...DEFAULT_ROSIE_PROGRESS,
    ticTacToeScores: { rosie: 0, deloniel: 0, ties: 0 },
  };
}
