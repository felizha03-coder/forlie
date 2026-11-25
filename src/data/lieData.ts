import { ReminderItem, TrackItem } from '../types/lie';

/**
 * Editable Letter Content for Lie
 * Update any paragraph below whenever you want to personalize the letter further.
 */
export const LIE_LOVE_LETTER = {
  heading: 'A LETTER FOR LIE',
  subtitle: 'Something I wanted you to have.',
  salutation: 'Hey Lie,',
  paragraphs: [
    'If you are reading this, it means the memory card booted up right on cue. I built this tiny pitch-black Game Boy world specially for you—because sometimes a small, thoughtful gift hits way harder than an ordinary message.',
    'Thank you for being one of those rare friends who makes even the simplest conversations feel effortless, and whose presence steadies chaotic days without you even trying. You never realize how much calmer everything feels just because you are around.',
    'I know life does not always move in a straight line. There are exhausting weeks, nights when your mind runs in ten directions at once, and days when you just want to hit mute on the whole world for a minute. Anytime you need a breather, boot this console back up.',
    'Whatever you are chasing next, please do not rush yourself or shrink your own light. Take your time, celebrate every small win, drink enough water, and remember that you always have someone genuinely rooting for you in your corner.',
  ],
  closing: 'Always glad to call you my best friend,',
  signature: 'Jerymoth // Player 02',
};

/**
 * 36 Handwritten English Reminders for Lie
 */
export const LIE_REMINDERS: ReminderItem[] = [
  // When you're tired
  {
    id: 1,
    category: 'TIRED',
    categoryLabel: "WHEN YOU'RE TIRED",
    text: 'Feeling exhausted does not mean you are weak, Lie. Just pause, drop your shoulders, and give yourself permission to rest tonight.',
  },
  {
    id: 2,
    category: 'TIRED',
    categoryLabel: "WHEN YOU'RE TIRED",
    text: 'You do not have to win every single hour. Even the strongest game character needs a save point to recharge HP.',
  },
  {
    id: 3,
    category: 'TIRED',
    categoryLabel: "WHEN YOU'RE TIRED",
    text: 'Drink a glass of water, step away from screens for a bit, and close your eyes for ten minutes. The world will still be there tomorrow.',
  },
  {
    id: 4,
    category: 'TIRED',
    categoryLabel: "WHEN YOU'RE TIRED",
    text: 'If today only gave you 20% battery and you still showed up, that counts as 100% effort in my book.',
  },
  {
    id: 5,
    category: 'TIRED',
    categoryLabel: "WHEN YOU'RE TIRED",
    text: 'Getting real sleep is never a waste of time, Lie. You deserve rest without having to earn it through burnout first.',
  },
  {
    id: 6,
    category: 'TIRED',
    categoryLabel: "WHEN YOU'RE TIRED",
    text: 'Breathe in slowly for four seconds, hold for a beat, and let it go. You made it through today—and that is more than enough.',
  },

  // When you're overthinking
  {
    id: 7,
    category: 'OVERTHINKING',
    categoryLabel: "WHEN YOU'RE OVERTHINKING",
    text: 'Most of the worst-case scenarios spinning in your head will never happen. Come back to what is real right now.',
  },
  {
    id: 8,
    category: 'OVERTHINKING',
    categoryLabel: "WHEN YOU'RE OVERTHINKING",
    text: 'You do not owe anyone all the answers tonight, Lie. Some chapters only make sense after you have lived through them.',
  },
  {
    id: 9,
    category: 'OVERTHINKING',
    categoryLabel: "WHEN YOU'RE OVERTHINKING",
    text: 'Stop replaying one awkward two-minute moment like a scratched disc. Nobody remembers it nearly as harshly as your brain does.',
  },
  {
    id: 10,
    category: 'OVERTHINKING',
    categoryLabel: "WHEN YOU'RE OVERTHINKING",
    text: 'Your brain is playing the "What If?" track way too loud tonight. Hit skip and ask: what can I actually control right now?',
  },
  {
    id: 11,
    category: 'OVERTHINKING',
    categoryLabel: "WHEN YOU'RE OVERTHINKING",
    text: 'Do not trust every dark thought that shows up past midnight. Everything always sounds heavier at 2 AM.',
  },
  {
    id: 12,
    category: 'OVERTHINKING',
    categoryLabel: "WHEN YOU'RE OVERTHINKING",
    text: 'Not every quiet pause means someone is upset with you. Sometimes people are just tired and dealing with their own noise.',
  },

  // When you feel unmotivated
  {
    id: 13,
    category: 'UNMOTIVATED',
    categoryLabel: 'WHEN YOU FEEL UNMOTIVATED',
    text: 'You do not have to leap ten steps at once. Just finish the tiniest five-minute quest first—momentum will follow.',
  },
  {
    id: 14,
    category: 'UNMOTIVATED',
    categoryLabel: 'WHEN YOU FEEL UNMOTIVATED',
    text: 'Slow progress is still progress, Lie. One paragraph, one email, or even tidying your desk already counts.',
  },
  {
    id: 15,
    category: 'UNMOTIVATED',
    categoryLabel: 'WHEN YOU FEEL UNMOTIVATED',
    text: 'Put on one comfort song, sit down with zero pressure, and tell yourself you only have to try for ten minutes.',
  },
  {
    id: 16,
    category: 'UNMOTIVATED',
    categoryLabel: 'WHEN YOU FEEL UNMOTIVATED',
    text: 'You are not lazy—you are just temporarily low on spark. Take it slow; nobody is holding a stopwatch over your life.',
  },
  {
    id: 17,
    category: 'UNMOTIVATED',
    categoryLabel: 'WHEN YOU FEEL UNMOTIVATED',
    text: 'Done and imperfect will always beat a perfect plan that never gets started.',
  },
  {
    id: 18,
    category: 'UNMOTIVATED',
    categoryLabel: 'WHEN YOU FEEL UNMOTIVATED',
    text: 'Remember how many things looked impossible a year ago that you handle effortlessly today.',
  },

  // When you need a little laugh
  {
    id: 19,
    category: 'LAUGH',
    categoryLabel: 'WHEN YOU NEED A LITTLE LAUGH',
    text: 'Important PSA: never make serious life decisions while hungry or before having iced coffee.',
  },
  {
    id: 20,
    category: 'LAUGH',
    categoryLabel: 'WHEN YOU NEED A LITTLE LAUGH',
    text: 'If today feels chaotic, just treat it like a weird filler episode that turns into a funny story next month.',
  },
  {
    id: 21,
    category: 'LAUGH',
    categoryLabel: 'WHEN YOU NEED A LITTLE LAUGH',
    text: 'Fun fact: you have officially survived 100% of the strangest, most random days of your life so far.',
  },
  {
    id: 22,
    category: 'LAUGH',
    categoryLabel: 'WHEN YOU NEED A LITTLE LAUGH',
    text: 'Friendly posture check: straighten your back right now. Do not sit like a shrimp while reading pixel notes.',
  },
  {
    id: 23,
    category: 'LAUGH',
    categoryLabel: 'WHEN YOU NEED A LITTLE LAUGH',
    text: 'If today feels like a glitchy boss level, blame bad Wi-Fi or cosmic lag—definitely not yourself.',
  },
  {
    id: 24,
    category: 'LAUGH',
    categoryLabel: 'WHEN YOU NEED A LITTLE LAUGH',
    text: 'You deserve a really good snack today solely for staying polite when you wanted to say "huh?" to everyone.',
  },

  // When life gets difficult
  {
    id: 25,
    category: 'DIFFICULT',
    categoryLabel: 'WHEN LIFE GETS DIFFICULT',
    text: 'Even the heaviest storm eventually runs out of rain, Lie. You do not have to pretend to be unbreakable all the time.',
  },
  {
    id: 26,
    category: 'DIFFICULT',
    categoryLabel: 'WHEN LIFE GETS DIFFICULT',
    text: 'Whenever everything feels like too much at once, shrink your horizon to just getting through this afternoon.',
  },
  {
    id: 27,
    category: 'DIFFICULT',
    categoryLabel: 'WHEN LIFE GETS DIFFICULT',
    text: 'When days get heavy, you never have to carry them alone. Text me anytime—even if it is just to vent.',
  },
  {
    id: 28,
    category: 'DIFFICULT',
    categoryLabel: 'WHEN LIFE GETS DIFFICULT',
    text: 'Bad weeks do not erase good futures. This is just one tricky level, not the ending of your story.',
  },
  {
    id: 29,
    category: 'DIFFICULT',
    categoryLabel: 'WHEN LIFE GETS DIFFICULT',
    text: 'Be gentle with yourself while figuring things out. Nobody was handed an instruction manual for growing up.',
  },
  {
    id: 30,
    category: 'DIFFICULT',
    categoryLabel: 'WHEN LIFE GETS DIFFICULT',
    text: 'Sometimes doors slam shut not because you failed, but because the room behind them grew too small for you.',
  },

  // When you need to remember how amazing you are
  {
    id: 31,
    category: 'AMAZING',
    categoryLabel: 'YOU ARE PRETTY AMAZING',
    text: 'Honestly, the way you still treat people with kindness even after exhausting days is ridiculously rare, Lie.',
  },
  {
    id: 32,
    category: 'AMAZING',
    categoryLabel: 'YOU ARE PRETTY AMAZING',
    text: 'You bring a quiet warmth into every room without even trying. People are genuinely lucky to have you in their lives.',
  },
  {
    id: 33,
    category: 'AMAZING',
    categoryLabel: 'YOU ARE PRETTY AMAZING',
    text: 'Never underestimate your sense of humor, your resilience, or the quiet ways you always show up for your friends.',
  },
  {
    id: 34,
    category: 'AMAZING',
    categoryLabel: 'YOU ARE PRETTY AMAZING',
    text: 'Even on days when you doubt yourself, everyone who truly knows you sees someone brilliant and worth cheering for.',
  },
  {
    id: 35,
    category: 'AMAZING',
    categoryLabel: 'YOU ARE PRETTY AMAZING',
    text: 'No matter how busy life gets or how schedules shift, having a best friend like you is something I will always be grateful for.',
  },
  {
    id: 36,
    category: 'AMAZING',
    categoryLabel: 'YOU ARE PRETTY AMAZING',
    text: 'You are not behind, not too late, and never too much. You are growing at your own pace—and it suits you.',
  },
];

/**
 * Soundtrack Configuration for Lie
 */
export const LIE_SOUNDTRACK: TrackItem[] = [
  {
    id: 'futile-devices',
    title: 'Futile Devices (Doveman Remix)',
    artist: 'Sufjan Stevens',
    note: 'Quiet midnight thoughts & soft acoustic stillness.',
    defaultPath:
      '/assets/aistudio/Futile_Devices__Doveman_Remix__Call_Me_By_Your_Name__Original_Motion_Picture_Soundtrack__1e7ed47f.mp3',
  },
  {
    id: 'all-night',
    title: 'All Night',
    artist: 'Beyoncé',
    note: 'Late drives, endless talks, and staying up too late.',
    defaultPath: '/assets/aistudio/Beyonc__-_All_Night__Lyrics__c5859bef.mp3',
  },
  {
    id: 'hannah-montana',
    title: 'Hannah Montana',
    artist: 'Rex Orange County',
    note: 'Pure throwback nostalgia and effortless laughs.',
    defaultPath:
      '/assets/aistudio/Rex_Orange_County_-_Hannah_Montana__Official_Video__1dbba031.mp3',
  },
  {
    id: 'the-cure',
    title: 'the cure',
    artist: 'Olivia Rodrigo',
    note: 'A steady track for days when you need comfort.',
    defaultPath: '/assets/aistudio/Olivia_Rodrigo___the_cure__Lyrics__8ecf2302.mp3',
  },
  {
    id: 'hometown-glory',
    title: 'Hometown Glory',
    artist: 'Adele',
    note: 'Big city lights & remembering where we started.',
    defaultPath:
      '/assets/aistudio/Hometown_Glory_-_Adele__Lyrics____00f63658.mp3',
  },
  {
    id: 'aku-tenang',
    title: 'Aku Tenang',
    artist: 'Fourtwnty',
    note: 'Breathe slow. Everything will settle in its own time.',
    defaultPath: '/assets/aistudio/Aku_Tenang_-_Fourtwnty_Lirik_Lagu_b722fc75.mp3',
  },
];
