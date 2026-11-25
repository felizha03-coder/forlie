import {
  CharacterProfile,
  CollectibleCardData,
  MonsterData,
} from '../types/hanna';

export const PLAYABLE_CHARACTERS: CharacterProfile[] = [
  {
    id: 'hanna',
    name: 'HANNA',
    roleTitle: 'The Main Explorer',
    description:
      'Cheerful, brave, and always ready for a new quest. Turns every gloomy corner of the Pixel Kingdom into a bright story.',
    infoNote:
      'STARTER HERO · Balanced stats with bright explorer spirit and extra heart energy.',
    hp: 95,
    speed: 82,
    luck: 98,
    specialSkill: 'STARLIGHT DASH',
    specialDesc: 'A sparkling burst of courage that deals heavy star damage.',
    accentColor: '#F5A6C8',
  },
  {
    id: 'pixel-cat',
    name: 'PIXEL CAT',
    roleTitle: 'The Cute Companion',
    description:
      'Tiny paws, huge curiosity, and maximum purr power. Can spot shiny treasure chests from three maps away.',
    infoNote:
      'COMPANION CLASS · Super nimble dodger with ultra-sharp whiskers and meow-fu.',
    hp: 80,
    speed: 96,
    luck: 92,
    specialSkill: 'PAW FRENZY',
    specialDesc: 'Rapid flurry of playful paw taps that surprises any monster.',
    accentColor: '#FFB78C',
  },
  {
    id: 'mystery-girl',
    name: 'MYSTERY GIRL',
    roleTitle: 'The Adventurer',
    description:
      'A lantern-bearing traveler of the purple woods who knows ancient riddles and hidden arcade shortcuts.',
    infoNote:
      'MYSTIC CLASS · Channels glowing cyan lantern magic from the Haunted Mansion.',
    hp: 88,
    speed: 86,
    luck: 88,
    specialSkill: 'CYAN LANTERN',
    specialDesc: 'Summons bright cyan pixel beams across the dark forest.',
    accentColor: '#8CE5E8',
  },
  {
    id: 'little-ghost',
    name: 'LITTLE GHOST',
    roleTitle: 'The Funny Sidekick',
    description:
      'Tries very hard to look spooky, fails immediately because of its tiny bowtie and goofy grin.',
    infoNote:
      'SPOOKY SIDEKICK · Floats through walls and cracks terrible jokes mid-battle.',
    hp: 84,
    speed: 90,
    luck: 95,
    specialSkill: 'BOO SURPRISE',
    specialDesc: 'Pops out with confetti and startles opponents for big damage.',
    accentColor: '#FFF0D5',
  },
];

export const COLLECTIBLE_CARDS: CollectibleCardData[] = [
  {
    id: 'card-hanna',
    number: '001/006',
    name: 'HANNA',
    subtitle: 'The Main Character',
    rarity: 'LEGENDARY',
    hp: 100,
    specialAbility: 'MAKING THE WORLD MORE FUN',
    description:
      'Official protagonist of this little pixel universe. Guaranteed to bring good vibes to every stage.',
    backLore:
      'Card #HANNA-001 · Equipped with endless curiosity, bright energy, and a rare gift for turning ordinary days into memorable quests.',
    frameColor: '#FF9B38',
    bgColor: '#F5A6C8',
    illustrationKey: 'hanna',
  },
  {
    id: 'card-explorer',
    number: '002/006',
    name: 'THE HAPPY EXPLORER',
    subtitle: 'Pathfinder of Pink Woods',
    rarity: 'COMMON',
    hp: 85,
    specialAbility: 'SUNNY FOOTSTEPS',
    description:
      'Follows glowing lanterns along the haunted mansion trail without ever losing cheer.',
    backLore:
      'No puzzle too tricky, no boss too spooky. Always packs extra pixel snacks before stepping into new pixel worlds.',
    frameColor: '#8CE5E8',
    bgColor: '#C24280',
    illustrationKey: 'explorer',
  },
  {
    id: 'card-companion',
    number: '003/006',
    name: 'PIXEL COMPANION',
    subtitle: 'Royal Bell Guardian',
    rarity: 'RARE',
    hp: 80,
    specialAbility: 'LUCKY PURR CHARM',
    description:
      'A tiny loyal sidekick who patrols the arcade screens and cheers loudly after every victory.',
    backLore:
      'Rumored to guard the Golden Key Fragment inside the old mansion tower—mostly while taking cozy naps.',
    frameColor: '#FFB78C',
    bgColor: '#A82C6A',
    illustrationKey: 'pixel-cat',
  },
  {
    id: 'card-mystery',
    number: '004/006',
    name: 'MYSTERY CREATURE',
    subtitle: 'Jiggly Dungeon Rival',
    rarity: 'RARE',
    hp: 90,
    specialAbility: 'BOUNCY ROYAL CROWN',
    description:
      'Once guarded the misty crossroads as Slime King—actually just wanted to join the card binder.',
    backLore:
      'Unlocked after winning in Monster Battle! Even spiky-crowned monsters respect a true adventurer.',
    frameColor: '#8CE5E8',
    bgColor: '#C24280',
    illustrationKey: 'slime-king',
    unlockCondition: 'battle-win',
    unlockHint: 'Defeat a monster in MONSTER BATTLE! to unlock',
  },
  {
    id: 'card-lucky',
    number: '005/006',
    name: 'LUCKY STAR',
    subtitle: 'Strategy Master Emblem',
    rarity: 'EPIC',
    hp: 95,
    specialAbility: 'THREE IN A ROW',
    description:
      'Shines bright cyan whenever an adventurer outsmarts the 3x3 Arcade Board.',
    backLore:
      'Unlocked by winning a round of PIXEL TIC TAC TOE! Smart moves always earn cosmic pixel rewards.',
    frameColor: '#FF9B38',
    bgColor: '#B83B77',
    illustrationKey: 'lucky-star',
    unlockCondition: 'ttt-win',
    unlockHint: 'Win a round in PIXEL TIC TAC TOE to unlock',
  },
  {
    id: 'card-legendary',
    number: '006/006',
    name: 'THE LEGENDARY FRIEND',
    subtitle: 'Treasure Room Exclusive',
    rarity: 'LEGENDARY',
    hp: 999,
    specialAbility: 'ONE OF A KIND',
    description:
      'Sealed inside the glowing chest at the end of the quest—crafted especially for Hannalle Dewyrose.',
    backLore:
      'Every great adventure is better with an awesome friend like you. Thanks for exploring this little world from start to finish!',
    frameColor: '#FF9B38',
    bgColor: '#F5A6C8',
    illustrationKey: 'legendary-friend',
    unlockCondition: 'secret-chest',
    unlockHint: 'Open the Treasure Chest in the SECRET ROOM to unlock',
  },
];

export const MONSTERS: MonsterData[] = [
  {
    id: 'slime-king',
    name: 'SLIME KING',
    title: 'Lv.1 Bouncy Monarch',
    maxHp: 75,
    attackMin: 8,
    attackMax: 13,
    defense: 2,
    specialAbility: 'JELLY BOUNCE',
    xpReward: 45,
    flavor: 'Wears a tiny oversized crown and bounces loudly through the forest.',
  },
  {
    id: 'shadow-bat',
    name: 'SHADOW BAT',
    title: 'Lv.2 Mansion Flyer',
    maxHp: 95,
    attackMin: 11,
    attackMax: 16,
    defense: 4,
    specialAbility: 'NIGHT WING GUST',
    xpReward: 65,
    flavor: 'Flutters down from the haunted bell tower with glowing orange eyes.',
  },
  {
    id: 'chaos-ghost',
    name: 'CHAOS GHOST',
    title: 'Lv.3 Boss Phantom',
    maxHp: 120,
    attackMin: 13,
    attackMax: 19,
    defense: 5,
    specialAbility: 'PIXEL SPOOK WAVE',
    xpReward: 100,
    flavor: 'Final guardian of the forest gate—dramatic, bouncy, and weirdly dramatic.',
  },
];

export const INITIAL_STARTER_CARDS = ['card-hanna', 'card-explorer', 'card-companion'];
