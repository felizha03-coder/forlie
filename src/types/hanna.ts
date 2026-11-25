export type HannaScreenId =
  | 'HOME'
  | 'CHARACTER'
  | 'ID_CARD'
  | 'COLLECTION'
  | 'BATTLE'
  | 'TICTACTOE'
  | 'SECRET_ROOM'
  | 'CREDITS';

export type PlayableCharacterId =
  | 'hanna'
  | 'pixel-cat'
  | 'mystery-girl'
  | 'little-ghost';

export type MonsterId = 'slime-king' | 'shadow-bat' | 'chaos-ghost';

export type CardRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface CharacterProfile {
  id: PlayableCharacterId;
  name: string;
  roleTitle: string;
  description: string;
  infoNote: string;
  hp: number;
  speed: number;
  luck: number;
  specialSkill: string;
  specialDesc: string;
  accentColor: string;
}

export interface CollectibleCardData {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  rarity: CardRarity;
  hp: number;
  specialAbility: string;
  description: string;
  backLore: string;
  frameColor: string;
  bgColor: string;
  illustrationKey:
    | 'hanna'
    | 'explorer'
    | 'pixel-cat'
    | 'slime-king'
    | 'lucky-star'
    | 'legendary-friend';
  unlockCondition?: 'battle-win' | 'ttt-win' | 'secret-chest';
  unlockHint?: string;
}

export interface MonsterData {
  id: MonsterId;
  name: string;
  title: string;
  maxHp: number;
  attackMin: number;
  attackMax: number;
  defense: number;
  specialAbility: string;
  xpReward: number;
  flavor: string;
}

export interface HannaProgressState {
  selectedCharacterId: PlayableCharacterId;
  xp: number;
  level: number;
  discoveredCardIds: string[];
  unlockedCardIds: string[];
  defeatedMonsterIds: MonsterId[];
  tttWins: number;
  tttDraws: number;
  tttLosses: number;
  chestOpened: boolean;
  musicEnabled: boolean;
  sfxEnabled: boolean;
}
