import React, { useState } from 'react';
import { IdCard, Lock, Sparkles, Unlock, Users } from 'lucide-react';
import {
  DelonielSprite,
  DreamyMeadowScene,
  EnergyOrb,
  PixelCloud,
  PixelFlower,
  PixelHeart,
  RosieSprite,
} from '../components/RosieSprites';
import { useRosie } from '../context/RosieContext';
import { GARDEN_DIALOGUES, ROSIE_CARDS, ROSIE_LETTERS } from '../data/rosieData';
import { SECRET_ROOM_UNLOCK_LP } from '../types/rosie';

export const RosieWorldHubScreen: React.FC = () => {
  const { navigate, progress, recordDiscovery, collectHearts } = useRosie();

  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [gardenMessage, setGardenMessage] = useState<string | null>(null);
  const [mailboxOpen, setMailboxOpen] = useState(false);

  const canUnlockSecret =
    progress.secretRoomUnlocked || progress.lovePoints >= SECRET_ROOM_UNLOCK_LP;

  const activeDialogue = GARDEN_DIALOGUES[dialogueIdx % GARDEN_DIALOGUES.length];

  const cycleDialogue = () => {
    setDialogueIdx((i) => (i + 1) % GARDEN_DIALOGUES.length);
    recordDiscovery('garden-chat', 10, 'Playful Chat ♡');
  };

  const handleFlowerClick = () => {
    const first = recordDiscovery('flower-garden', 20, 'Found Hidden Bloom ♡');
    setGardenMessage(
      first
        ? 'Surprise! You found a rare pink blossom Deloniel hid for Hannalle (+20 LP)!'
        : 'The pastel flowers shimmer gently whenever Rosie strolls past (+1 Heart ♡)'
    );
  };

  const handlePondClick = () => {
    const first = recordDiscovery('pond-wish', 20, 'Made a Pond Wish ♡');
    collectHearts(2, 0);
    setGardenMessage(
      first
        ? 'You tossed a wishing pebble! Deloniel’s tiny wish: "Hope Rosie smiles at least once today." (+20 LP)'
        : 'Ripples sparkle across the pond (+2 Hearts ♡)'
    );
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full pink-pixel-grid relative overflow-hidden py-6 px-4 sm:px-6 flex flex-col items-center gap-6">
      {/* Floating Pixel Clouds */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-3 flex justify-between px-6 opacity-90"
      >
        <div className="animate-cloud-drift">
          <PixelCloud size={82} />
        </div>
        <div className="hidden sm:block animate-cloud-drift-reverse mt-4">
          <PixelCloud size={68} />
        </div>
        <div className="animate-cloud-drift mt-1" style={{ animationDelay: '2.2s' }}>
          <PixelCloud size={88} />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl space-y-5">
        {/* Giant Collectible World Card Frame */}
        <section className="yellow-card-shell rounded-[26px] p-3">
          <div className="card-magenta-texture rounded-[18px] border-2 border-[#6B2D5C]/80 p-4 sm:p-5 space-y-4 text-[#2E1028]">
            {/* World Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="basic-silver-tag px-2.5 py-0.5 font-body font-extrabold italic text-[10px]">
                  WORLD
                </span>
                <span className="text-sm">☆</span>
                <h1 className="font-body font-extrabold text-lg sm:text-xl">
                  ROSIE&apos;S LITTLE WORLD
                </h1>
              </div>

              <div className="flex items-center gap-2 tabular-nums">
                <span className="font-body font-extrabold text-xs">
                  SECRET DOOR {Math.min(progress.lovePoints, SECRET_ROOM_UNLOCK_LP)} /{' '}
                  {SECRET_ROOM_UNLOCK_LP} LP
                </span>
                <EnergyOrb variant="psychic" size={18} />
              </div>
            </div>

            {/* Metallic Silver Interactive Pixel Boardwalk Header Window */}
            <div className="silver-bevel rounded-lg p-1.5">
              <DreamyMeadowScene
                bubbleText={activeDialogue[0]?.line}
                heightClass="h-44 sm:h-48"
                onMascotClick={() => {
                  const first = recordDiscovery('ribbon-cat-egg', 15, 'Found Ribbon Cat Secret ♡');
                  setGardenMessage(
                    first
                      ? 'Meow! The tiny ribbon cat whispered: "Deloniel thinks Hannalle is pretty cool." (+15 LP)'
                      : 'Meow! The tiny ribbon cat purrs happily (+1 Heart ♡)'
                  );
                }}
              >
                <button
                  type="button"
                  onClick={cycleDialogue}
                  className="flex items-end gap-2 cursor-pointer hover:scale-105 transition-transform"
                  aria-label="Talk with Rosie and Deloniel"
                >
                  <RosieSprite pose="smiling" size={76} />
                  <div className="mb-11 animate-heartbeat">
                    <PixelHeart size={16} color="#EC4899" />
                  </div>
                  <DelonielSprite pose="blushing" size={76} />
                </button>
              </DreamyMeadowScene>
              <div className="pt-1 flex items-center justify-between px-2 font-body font-bold text-[11px] text-[#475569]">
                <span>rosie-001 · sunset boardwalk park</span>
                <button
                  type="button"
                  onClick={() => collectHearts(1, 5, '+5 LP · Sky Heart ♡')}
                  className="inline-flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <PixelHeart size={13} color="#EC4899" />
                  <span>grab sky heart</span>
                </button>
              </div>
            </div>

            {/* Quick Access Strip: Personal ID Card & Functional Character Select */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate('ID_CARD')}
                className="silver-bevel rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer hover:brightness-105 text-left transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FCE24F] border-2 border-[#6B2D5C] flex items-center justify-center shrink-0">
                    <IdCard className="w-5 h-5 text-[#6B2D5C]" />
                  </div>
                  <div>
                    <p className="font-body font-extrabold text-sm text-[#181016]">
                      Rosie&apos;s ID Card (ROSIE-001)
                    </p>
                    <p className="font-body font-bold text-[11px] text-[#C92778]">
                      {progress.idCardFlipped
                        ? 'Inspected ✓ · Tap to view & flip 3D'
                        : 'Tap to inspect & flip 3D (+15 LP)'}
                    </p>
                  </div>
                </div>
                <EnergyOrb variant="pink" size={18} />
              </button>

              <button
                type="button"
                onClick={() => navigate('CHARACTER_SELECT')}
                className="silver-bevel rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer hover:brightness-105 text-left transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFD4E7] border-2 border-[#6B2D5C] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <p className="font-body font-extrabold text-sm text-[#181016]">
                      Character Select
                    </p>
                    <p className="font-body font-bold text-[11px] text-[#7C3AED]">
                      Active Player:{' '}
                      {progress.selectedCharacter === 'rosie' ? 'Rosie ♡' : 'Deloniel ★'} · Switch
                    </p>
                  </div>
                </div>
                <EnergyOrb variant="psychic" size={18} />
              </button>
            </div>

            {/* 8 Interactive World Landmarks Grid (Matching KAINO.EXE Layout) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* 1. PINK HOUSE -> Personal Message & Envelopes */}
              <button
                type="button"
                onClick={() => navigate('LETTERS')}
                className="group silver-bevel rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer text-center hover:brightness-105 transition-transform hover:-translate-y-0.5"
              >
                <svg
                  width="52"
                  height="48"
                  viewBox="0 0 18 16"
                  shapeRendering="crispEdges"
                  className="pixelated"
                >
                  <rect x="2" y="5" width="14" height="10" fill="#382033" />
                  <rect x="3" y="6" width="12" height="8" fill="#FFD4E7" />
                  <path d="M1 6h16v1H1zM2 4h14v2H2zM4 2h10v2H4zM6 1h6v1H6z" fill="#EC4899" />
                  <rect x="7" y="9" width="4" height="5" fill="#C7B6F3" />
                  <rect x="4" y="8" width="2" height="2" fill="#FFF5E8" />
                  <rect x="12" y="8" width="2" height="2" fill="#FFF5E8" />
                  <rect x="8" y="3" width="2" height="2" fill="#FCE24F" />
                </svg>
                <div>
                  <p className="font-body font-extrabold text-xs sm:text-sm text-[#181016]">
                    Pink House
                  </p>
                  <p className="font-body font-bold text-[11px] text-[#C92778]">
                    Little Notes ({progress.openedLetters.length}/{ROSIE_LETTERS.length})
                  </p>
                </div>
              </button>

              {/* 2. HEART TREE -> Collectible Cards */}
              <button
                type="button"
                onClick={() => navigate('CARDS')}
                className="group silver-bevel rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer text-center hover:brightness-105 transition-transform hover:-translate-y-0.5"
              >
                <svg
                  width="52"
                  height="48"
                  viewBox="0 0 18 16"
                  shapeRendering="crispEdges"
                  className="pixelated"
                >
                  <rect x="7" y="10" width="4" height="5" fill="#78350F" />
                  <path d="M3 3h4v1h4V3h4v4h-1v2h-2v2H6V9H4V7H3V3z" fill="#EC4899" />
                  <rect x="5" y="4" width="2" height="2" fill="#FFD4E7" />
                  <rect x="11" y="5" width="2" height="2" fill="#FFF5E8" />
                </svg>
                <div>
                  <p className="font-body font-extrabold text-xs sm:text-sm text-[#181016]">
                    Heart Tree
                  </p>
                  <p className="font-body font-bold text-[11px] text-[#7C3AED]">
                    Cards ({progress.flippedCards.length}/{ROSIE_CARDS.length})
                  </p>
                </div>
              </button>

              {/* 3. ARCADE CABINET -> 4 Mini-Games */}
              <button
                type="button"
                onClick={() => navigate('ARCADE')}
                className="group silver-bevel rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer text-center hover:brightness-105 transition-transform hover:-translate-y-0.5"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 16 16"
                  shapeRendering="crispEdges"
                  className="pixelated"
                >
                  <rect x="3" y="1" width="10" height="14" fill="#382033" />
                  <rect x="4" y="2" width="8" height="2" fill="#EC4899" />
                  <rect x="4" y="4" width="8" height="5" fill="#1E1B4B" />
                  <rect x="5" y="5" width="6" height="3" fill="#C7B6F3" />
                  <rect x="4" y="10" width="8" height="4" fill="#C92778" />
                  <rect x="6" y="9" width="1" height="1" fill="#FCE24F" />
                  <rect x="10" y="9" width="2" height="1" fill="#FFF5E8" />
                </svg>
                <div>
                  <p className="font-body font-extrabold text-xs sm:text-sm text-[#181016]">
                    Arcade Cabinet
                  </p>
                  <p className="font-body font-bold text-[11px] text-[#C92778]">
                    4 Mini-Games
                  </p>
                </div>
              </button>

              {/* 4. SECRET DOOR -> Secret Room */}
              <button
                type="button"
                onClick={() => navigate('SECRET_ROOM')}
                className="group silver-bevel rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer text-center hover:brightness-105 transition-transform hover:-translate-y-0.5"
              >
                <div className="h-[48px] flex items-center justify-center">
                  <div
                    className={`w-10 h-12 border-2 border-[#382033] rounded-t-full flex items-center justify-center ${
                      canUnlockSecret ? 'bg-[#EC4899]' : 'bg-[#C7B6F3]'
                    }`}
                  >
                    {canUnlockSecret ? (
                      <Unlock className="w-4 h-4 text-[#FFF5E8]" />
                    ) : (
                      <Lock className="w-4 h-4 text-[#382033]" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-body font-extrabold text-xs sm:text-sm text-[#181016]">
                    Secret Door
                  </p>
                  <p className="font-body font-bold text-[11px] text-[#7C3AED]">
                    {canUnlockSecret ? 'Ready to Open ♡' : `Needs ${SECRET_ROOM_UNLOCK_LP} LP`}
                  </p>
                </div>
              </button>

              {/* 5. FLOWER GARDEN -> Hidden Surprises */}
              <button
                type="button"
                onClick={handleFlowerClick}
                className="group silver-bevel rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer text-center hover:brightness-105 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-end gap-1 h-[48px]">
                  <PixelFlower size={22} petalColor="#EC4899" />
                  <PixelFlower size={28} petalColor="#C7B6F3" />
                  <PixelFlower size={22} petalColor="#FFD4E7" />
                </div>
                <div>
                  <p className="font-body font-extrabold text-xs sm:text-sm text-[#181016]">
                    Flower Garden
                  </p>
                  <p className="font-body font-bold text-[11px] text-[#15803D]">
                    Hidden Surprises
                  </p>
                </div>
              </button>

              {/* 6. POND -> Wishing Pebble */}
              <button
                type="button"
                onClick={handlePondClick}
                className="group silver-bevel rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer text-center hover:brightness-105 transition-transform hover:-translate-y-0.5"
              >
                <div className="h-[48px] flex items-center justify-center">
                  <div className="w-14 h-9 rounded-full bg-sky-300 border-2 border-[#382033] flex items-center justify-center">
                    <div className="w-7 h-2.5 rounded-full border-2 border-white/80" />
                  </div>
                </div>
                <div>
                  <p className="font-body font-extrabold text-xs sm:text-sm text-[#181016]">
                    Wishing Pond
                  </p>
                  <p className="font-body font-bold text-[11px] text-sky-700">
                    Toss a Pebble (+♡)
                  </p>
                </div>
              </button>

              {/* 7. MAILBOX -> Notes & Postcards */}
              <button
                type="button"
                onClick={() => {
                  setMailboxOpen(true);
                  recordDiscovery('mailbox-note', 10, 'Checked Mailbox ♡');
                }}
                className="group silver-bevel rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer text-center hover:brightness-105 transition-transform hover:-translate-y-0.5"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 16 16"
                  shapeRendering="crispEdges"
                  className="pixelated"
                >
                  <rect x="7" y="9" width="2" height="6" fill="#78350F" />
                  <rect x="3" y="4" width="10" height="6" fill="#382033" />
                  <rect x="4" y="5" width="8" height="4" fill="#EC4899" />
                  <rect x="12" y="2" width="1" height="4" fill="#FCE24F" />
                  <rect x="13" y="2" width="2" height="2" fill="#FCE24F" />
                  <rect x="6" y="6" width="4" height="2" fill="#FFF5E8" />
                </svg>
                <div>
                  <p className="font-body font-extrabold text-xs sm:text-sm text-[#181016]">
                    Mailbox
                  </p>
                  <p className="font-body font-bold text-[11px] text-[#C92778]">
                    Postcards &amp; Notes
                  </p>
                </div>
              </button>

              {/* 8. ROSIE & DELONIEL -> Playful Dialogue */}
              <button
                type="button"
                onClick={cycleDialogue}
                className="group silver-bevel rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer text-center hover:brightness-105 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-end gap-1 h-[48px]">
                  <RosieSprite pose="smiling" size={38} />
                  <DelonielSprite pose="blushing" size={38} />
                </div>
                <div>
                  <p className="font-body font-extrabold text-xs sm:text-sm text-[#181016]">
                    Rosie &amp; Deloniel
                  </p>
                  <p className="font-body font-bold text-[11px] text-[#C92778]">
                    Tap to Talk ♡
                  </p>
                </div>
              </button>
            </div>

            {/* Active Garden Conversation Directly Inside Card Footer Section */}
            <div className="pt-1 space-y-2.5 border-t border-[#181016]/20">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <EnergyOrb variant="pink" size={16} />
                  <span className="font-body font-extrabold text-sm text-[#181016]">
                    Garden Conversation
                  </span>
                </div>
                <button
                  type="button"
                  onClick={cycleDialogue}
                  className="pixel-button px-3 py-1 bg-[#FCE24F] font-pixel text-[8px] text-[#181016] cursor-pointer"
                >
                  NEXT CHAT ▶
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeDialogue.map((item, i) => (
                  <div
                    key={i}
                    className="silver-bevel rounded-xl p-3 flex items-center gap-3"
                  >
                    {item.speaker === 'Rosie' ? (
                      <RosieSprite pose="smiling" size={48} />
                    ) : (
                      <DelonielSprite pose="blushing" size={48} />
                    )}
                    <div>
                      <p className="font-body font-extrabold text-xs text-[#C92778]">
                        {item.speaker}
                      </p>
                      <p className="font-body font-bold text-sm text-[#181016]">
                        &ldquo;{item.line}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Garden / Pond / Easter Egg Discovery Banner */}
        {gardenMessage && (
          <div className="silver-bevel rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#C92778] shrink-0" />
              <p className="font-body font-bold text-sm text-[#181016]">{gardenMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setGardenMessage(null)}
              className="font-pixel text-[9px] text-[#C92778] cursor-pointer shrink-0"
            >
              OK
            </button>
          </div>
        )}
      </div>

      {/* MAILBOX QUICK POPUP */}
      {mailboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#6B2D5C]/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setMailboxOpen(false)}
        >
          <div
            className="w-full max-w-md yellow-card-shell rounded-[24px] p-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-magenta-texture rounded-2xl border-2 border-[#382033] p-5 space-y-4">
              <div className="flex items-center justify-between silver-bevel rounded-lg px-3 py-2">
                <h2 className="font-body font-extrabold text-sm text-[#181016]">
                  Postcards for Rosie
                </h2>
                <button
                  type="button"
                  onClick={() => setMailboxOpen(false)}
                  className="font-pixel text-xs cursor-pointer"
                >
                  X
                </button>
              </div>
              <div className="space-y-2.5 font-body text-sm">
                <div className="p-3 bg-[#FFF5E8] border-2 border-[#382033] rounded-xl">
                  <strong>Postcard #1:</strong> &ldquo;Drink water, take breaks when tired, and never forget you&apos;re pretty awesome, Hannalle ♡&rdquo;
                </div>
                <div className="p-3 bg-[#FFD4E7] border-2 border-[#382033] rounded-xl">
                  <strong>Postcard #2:</strong> &ldquo;You are special in your own little way—no big title needed.&rdquo;
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMailboxOpen(false);
                    navigate('LETTERS');
                  }}
                  className="pixel-button px-4 py-2 bg-[#FCE24F] text-[#181016] font-pixel text-[9px] cursor-pointer"
                >
                  READ &ldquo;A LITTLE NOTE FOR YOU&rdquo; ♡
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
