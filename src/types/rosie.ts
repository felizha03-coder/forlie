export type RosieScreen =
  | 'BOOT'
  | 'TITLE'
  | 'WORLD'
  | 'CHARACTER_SELECT'
  | 'ID_CARD'
  | 'LETTERS'
  | 'CARDS'
  | 'ARCADE'
  | 'SECRET_ROOM'
  | 'FINAL_LOVE';

export type CharacterId = 'rosie' | 'deloniel';

export type CharacterPose =
  | 'smiling'
  | 'blushing'
  | 'waving'
  | 'looking'
  | 'sending-hearts';

export type DuoPose =
  | 'standing'
  | 'holding-hands'
  | 'sitting'
  | 'hugging';

export interface RosieLetterItem {
  id: string;
  label: string;
  title: string;
  body: string;
  isSpecial?: boolean;
  rewardLp: number;
}

export type CardRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'VIP';

export interface RosieCardData {
  id: string;
  number: string;
  name: string;
  type: string;
  hp: string;
  ability: string;
  specialMove: string;
  rarity: CardRarity;
  stats: {
    warmth: number;
    charm: number;
    chaos: number;
    luck: number;
  };
  backTitle?: string;
  backNote: string;
  backSignature?: string;
  unlockRequirementLp: number;
}

export interface RosieCharacterOption {
  id: CharacterId;
  name: string;
  nickname: string;
  title: string;
  description: string;
  specialTrait: string;
  quote: string;
  stats: {
    energy: number;
    wit: number;
    luck: number;
  };
}

export interface RosieSettings {
  soundEnabled: boolean;
  bgmVolume: number; // 0 to 1
  sfxVolume: number; // 0 to 1
  animationsEnabled: boolean;
}

export interface TicTacToeScores {
  rosie: number;
  deloniel: number;
  ties: number;
}

export interface RosieProgress {
  lovePoints: number;
  hearts: number;
  selectedCharacter: CharacterId;
  idCardFlipped: boolean;
  openedLetters: string[];
  flippedCards: string[];
  hiddenDiscoveries: string[];
  completedGames: string[];
  ticTacToeScores: TicTacToeScores;
  secretRoomUnlocked: boolean;
  keptForever: boolean;
  customLetters: Record<string, string>;
}

export const SECRET_ROOM_UNLOCK_LP = 120;
export const LEGENDARY_CARD_UNLOCK_LP = 80;
