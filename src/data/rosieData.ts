import {
  RosieCardData,
  RosieCharacterOption,
  RosieLetterItem,
} from '../types/rosie';

export const ROSIE_ID_CARD = {
  name: 'Hannalle Dewyrose',
  nickname: 'Rosie',
  id: 'ROSIE-001',
  specialStatus: 'ONE OF A KIND',
  createdBy: 'Deloniel',
  type: 'LIMITED EDITION HUMAN',
  mood: 'UNPREDICTABLE BUT ADORABLE',
  backMessage:
    "Some people don't need a particular title to be special. They simply become someone worth appreciating. And you're one of those people, Rosie.",
};

export const FEATURED_PERSONAL_NOTE: RosieLetterItem = {
  id: 'little-note-for-you',
  label: 'A LITTLE NOTE FOR YOU',
  title: 'A LITTLE NOTE FOR YOU',
  isSpecial: true,
  rewardLp: 25,
  body: `Hi, Rosie!

I don't really know how to explain this, but I just wanted to make something special for you.

This isn't a confession, an anniversary gift, or anything that needs a particular label.

I just think some people deserve to be appreciated, and you're one of them.

So here's a tiny world on the internet, made especially for you. Explore everything, play the games, flip the cards, and hopefully find a reason to smile.

You are special in your own little way.

— Deloniel ♡`,
};

export const ROSIE_LETTERS: RosieLetterItem[] = [
  FEATURED_PERSONAL_NOTE,
  {
    id: 'quiet-days',
    label: 'OPEN WHEN THINGS FEEL TOO QUIET.',
    title: 'Whenever Conversations Feel Quiet',
    rewardLp: 15,
    body: `Hey Rosie ♡

If you opened this because the day feels a little too quiet right now, send over whatever random thought is bouncing around in your head.

It doesn't need to be profound. Tell me what snack you're craving, something mildly absurd you saw today, or drop an unprompted update—I'm always glad to hear from you.`,
  },
  {
    id: 'heavy-day',
    label: "OPEN WHEN YOU'VE HAD A LONG DAY.",
    title: 'Gentle Reminder for Heavy Days',
    rewardLp: 15,
    body: `Hey Hannalle,

Whatever made today feel exhausting, I hope things soften up for you soon. You deserve unhurried evenings, good rest, and people who genuinely appreciate you even on low-battery days.

Take things one step at a time—and if you want a distraction or bad pixel jokes, you know where to find me.`,
  },
  {
    id: 'need-smile',
    label: 'OPEN WHEN YOU NEED A SMILE.',
    title: 'Tiny Mood Booster',
    rewardLp: 15,
    body: `Friendly reminder: your energy has an unfair talent for turning ordinary conversations into the highlight of the day.

Also yes, Deloniel definitely spent way too long adjusting tiny pink pixels just to build a corner of the internet that might make you grin for five seconds. Worth it ♡`,
  },
  {
    id: 'cant-sleep',
    label: "OPEN WHEN YOU CAN'T SLEEP.",
    title: 'Late Night Sign-Off',
    rewardLp: 15,
    body: `Still wide awake late at night?

Put your screen away soon, get cozy, and let your brain clock out for tonight. Whatever is waiting on tomorrow's schedule can wait until morning.

Rest well, Rosie ♡`,
  },
  {
    id: 'bored',
    label: "OPEN WHEN YOU'RE BORED.",
    title: 'Anti-Boredom Pass',
    rewardLp: 15,
    body: `Officially bored?

Try winning a round against Deloniel in Tic Tac Toe, beat your Catch My Heart record in the Arcade, or hunt down every hidden sparkle in the garden. And if that fails, send a random message for instant chaos.`,
  },
  {
    id: 'just-because',
    label: 'JUST A RANDOM NOTE.',
    title: 'No Special Occasion Needed',
    rewardLp: 15,
    body: `There's no big milestone behind this one.

Some people just make existing around them feel lighter, funnier, and a bit warmer without even trying. Thank you for being genuinely you, Hannalle.`,
  },
];

export const ROSIE_CHARACTERS: RosieCharacterOption[] = [
  {
    id: 'rosie',
    name: 'ROSIE',
    nickname: 'Hannalle Dewyrose',
    title: 'PLAYER 01 · ONE OF A KIND',
    description:
      'Unpredictable, effortlessly charming, and secretly undefeated at turning ordinary moments into good memories.',
    specialTrait: 'BRIGHTENS EVERY SCREEN',
    quote: 'Wait—did you hide another surprise in here?!',
    stats: {
      energy: 95,
      wit: 98,
      luck: 100,
    },
  },
  {
    id: 'deloniel',
    name: 'DELONIEL',
    nickname: 'The Creator',
    title: 'PLAYER 02 · WORLD BUILDER',
    description:
      'Clean-shaven pixel architect who insists this whole website is "just a small thing" after spending hours perfecting every pixel.',
    specialTrait: 'QUIET THOUGHTFULNESS',
    quote: 'No big occasion. Just wanted to make you smile ♡',
    stats: {
      energy: 90,
      wit: 94,
      luck: 92,
    },
  },
];

export const ROSIE_CARDS: RosieCardData[] = [
  {
    id: 'card-rosie',
    number: 'CARD 001',
    name: 'ROSIE',
    type: 'LIMITED EDITION HUMAN',
    hp: '999',
    ability: 'ONE OF A KIND',
    specialMove: 'EFFORTLESS CHARM',
    rarity: 'EPIC',
    stats: {
      warmth: 100,
      charm: 100,
      chaos: 88,
      luck: 97,
    },
    backTitle: 'Player Profile · Hannalle Dewyrose',
    backNote:
      'Unpredictable but adorable. Somehow turns ordinary days into stories worth remembering.',
    backSignature: '— Deloniel ♡',
    unlockRequirementLp: 0,
  },
  {
    id: 'card-deloniel',
    number: 'CARD 002',
    name: 'DELONIEL',
    type: 'TINY WORLD ARCHITECT',
    hp: '999',
    ability: 'QUIET ATTENTION',
    specialMove: 'PIXEL SURPRISE',
    rarity: 'EPIC',
    stats: {
      warmth: 96,
      charm: 94,
      chaos: 92,
      luck: 95,
    },
    backTitle: 'Creator Profile · Deloniel',
    backNote:
      'Claims it is "nothing big", yet hides easter eggs, custom chiptune music, and kind notes in every corner.',
    backSignature: '— Built for Rosie ♡',
    unlockRequirementLp: 0,
  },
  {
    id: 'card-rosie-vip',
    number: 'CARD 003',
    name: 'ROSIE · VIP',
    type: 'VIP HUMAN PASS',
    hp: 'MAX',
    ability: 'ALL-ACCESS SMILE',
    specialMove: 'PRIORITY APPRECIATION',
    rarity: 'VIP',
    stats: {
      warmth: 100,
      charm: 100,
      chaos: 95,
      luck: 100,
    },
    backTitle: 'OFFICIAL ROSIE-001 VIP PASS ★',
    backNote:
      "Dear Hannalle (Rosie),\n\nWelcome to your very own corner of the internet! You hold permanent VIP status here—meaning good vibes only, zero expiry date, and unlimited replays whenever you need a small smile.\n\nNo pressure, no labels, just genuine appreciation.",
    backSignature: 'Signed, Deloniel ♡',
    unlockRequirementLp: 0,
  },
  {
    id: 'card-duo',
    number: 'CARD 004',
    name: 'ROSIE & DELONIEL',
    type: 'SPECIAL CONNECTION',
    hp: '999',
    ability: 'ALWAYS GLAD IT HAPPENED',
    specialMove: 'DOUBLE LAUGH COMBO',
    rarity: 'LEGENDARY',
    stats: {
      warmth: 100,
      charm: 100,
      chaos: 98,
      luck: 100,
    },
    backTitle: 'Secret Collection Note',
    backNote:
      'Some people become quietly important simply by being who they are. Thanks for being in my corner of the world, Rosie.',
    backSignature: '— Deloniel ♡',
    unlockRequirementLp: 80,
  },
];

export const GARDEN_DIALOGUES: { speaker: 'Rosie' | 'Deloniel'; line: string }[][] = [
  [
    { speaker: 'Rosie', line: 'Wait, did you really build a whole pink world just for fun?' },
    { speaker: 'Deloniel', line: 'Not just for fun. Mostly because you deserve something nice ♡' },
  ],
  [
    { speaker: 'Deloniel', line: 'Careful around the arcade cabinet—I am definitely keeping score.' },
    { speaker: 'Rosie', line: 'Oh please, prepare to lose in Tic Tac Toe.' },
  ],
  [
    { speaker: 'Rosie', line: 'I love that the tiny cat on the speech bubble is judging us.' },
    { speaker: 'Deloniel', line: 'Try clicking the cat or the cherry blossoms. Just saying.' },
  ],
  [
    { speaker: 'Rosie', line: 'So what is hiding behind that locked pink door?' },
    { speaker: 'Deloniel', line: 'Collect 120 LP exploring notes and mini-games and see!' },
  ],
];

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    prompt: 'Who brings the best unexpected energy to a random conversation?',
    options: [
      'Rosie (effortlessly iconic)',
      'Deloniel (already overthinking a joke)',
      'Both bouncing chaos back and forth',
    ],
    reaction: 'Honestly, the banter makes even quiet days way better.',
  },
  {
    id: 'q2',
    prompt: 'Who is more likely to hide secret notes inside a retro website?',
    options: [
      'Rosie',
      'Deloniel (guilty as charged)',
      'The tiny pixel cat mascot',
    ],
    reaction: '100% Deloniel behavior—and there are more easter eggs around the park!',
  },
  {
    id: 'q3',
    prompt: "What is Rosie's official mood according to ID ROSIE-001?",
    options: [
      'Serious & predictable',
      'Unpredictable but adorable',
      '100% sleepy',
    ],
    reaction: 'Correct! Limited Edition Human status confirmed.',
  },
  {
    id: 'q4',
    prompt: 'Why was ROSIE.EXE created?',
    options: [
      'For a big formal anniversary',
      'Just because Rosie deserves to feel appreciated',
      'Because the pixel cat demanded a mansion',
    ],
    reaction: 'No big occasion needed. Some people simply deserve nice things ♡',
  },
  {
    id: 'q5',
    prompt: 'Who wins more rounds in Tic Tac Toe?',
    options: [
      'Rosie (tactical genius)',
      'Deloniel (lucky guesses)',
      'Endless dramatic draws',
    ],
    reaction: 'Check the scoreboard in Tab 01 to settle it once and for all!',
  },
];
