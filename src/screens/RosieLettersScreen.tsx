import React, { useState } from 'react';
import { ArrowLeft, Check, Edit3, MailOpen, Sparkles, X } from 'lucide-react';
import { DelonielSprite, EnergyOrb, PixelHeart, RosieSprite } from '../components/RosieSprites';
import { useRosie } from '../context/RosieContext';
import { FEATURED_PERSONAL_NOTE, ROSIE_LETTERS } from '../data/rosieData';
import { RosieLetterItem } from '../types/rosie';

export const RosieLettersScreen: React.FC = () => {
  const { navigate, progress, markLetterOpened, saveCustomLetter } = useRosie();
  const [selected, setSelected] = useState<RosieLetterItem | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState('');

  const handleOpenLetter = (item: RosieLetterItem) => {
    markLetterOpened(item.id, item.rewardLp);
    setSelected(item);
    setEditing(false);
    setDraftText(progress.customLetters[item.id] ?? item.body);
  };

  const featuredText =
    progress.customLetters[FEATURED_PERSONAL_NOTE.id] ?? FEATURED_PERSONAL_NOTE.body;
  const featuredRead = progress.openedLetters.includes(FEATURED_PERSONAL_NOTE.id);

  const activeText = selected
    ? progress.customLetters[selected.id] ?? selected.body
    : '';

  const envelopeLetters = ROSIE_LETTERS.filter(
    (l) => l.id !== FEATURED_PERSONAL_NOTE.id
  );

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full pink-pixel-grid py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Card-Styled Header */}
        <div className="yellow-card-shell rounded-2xl p-1.5">
          <div className="card-magenta-texture rounded-xl border-2 border-[#382033] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="basic-silver-tag px-2.5 py-0.5 font-body font-extrabold italic text-[10px] text-[#181016]">
                  NOTES
                </span>
                <h1 className="font-body font-extrabold text-lg sm:text-xl text-[#181016]">
                  SPECIAL MESSAGES FOR ROSIE
                </h1>
              </div>
              <p className="font-body font-bold text-xs sm:text-sm text-[#181016]/85">
                Warm little notes written by Deloniel for Hannalle Dewyrose ♡
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('WORLD')}
              className="pixel-button px-4 py-2 bg-[#FCE24F] font-pixel text-[9px] text-[#181016] inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO WORLD</span>
            </button>
          </div>
        </div>

        {/* Dedicated Personal Message Section — "A LITTLE NOTE FOR YOU" */}
        <section className="yellow-card-shell rounded-[24px] p-2">
          <div className="card-vip-texture rounded-[16px] border-2 border-[#382033] p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 silver-bevel rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <PixelHeart size={18} color="#EC4899" className="animate-heartbeat" />
                <h2 className="font-pixel text-xs sm:text-sm text-[#181016]">
                  A LITTLE NOTE FOR YOU
                </h2>
              </div>

              <button
                type="button"
                onClick={() => markLetterOpened(FEATURED_PERSONAL_NOTE.id, FEATURED_PERSONAL_NOTE.rewardLp)}
                className="pixel-button px-3 py-1.5 bg-[#FCE24F] font-pixel text-[8px] text-[#181016] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#C92778]" />
                <span>{featuredRead ? 'SAVED TO MEMORY ✓' : `COLLECT +${FEATURED_PERSONAL_NOTE.rewardLp} LP`}</span>
              </button>
            </div>

            <div className="bg-[#FFF9FC] border-2 border-[#382033] rounded-2xl p-5 sm:p-6 whitespace-pre-wrap font-body font-semibold text-sm sm:text-base text-[#181016] leading-relaxed">
              {featuredText}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <RosieSprite pose="smiling" size={44} />
                <DelonielSprite pose="sending-hearts" size={44} />
                <span className="font-body italic font-bold text-xs text-[#181016]">
                  Written for Hannalle Dewyrose (Rosie) ♡
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenLetter(FEATURED_PERSONAL_NOTE)}
                className="silver-bevel px-3.5 py-2 rounded-lg font-pixel text-[8px] text-[#181016] inline-flex items-center gap-1.5 cursor-pointer hover:brightness-105"
              >
                <Edit3 className="w-3 h-3 text-[#C92778]" />
                <span>READ IN FULLSCREEN / CUSTOMIZE</span>
              </button>
            </div>
          </div>
        </section>

        {/* Open-When Envelopes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {envelopeLetters.map((letter) => {
            const isRead = progress.openedLetters.includes(letter.id);
            return (
              <button
                key={letter.id}
                type="button"
                onClick={() => handleOpenLetter(letter)}
                className="group text-left yellow-card-shell rounded-[20px] p-1.5 transition-transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="silver-bevel rounded-[14px] border-2 border-[#382033] p-4 flex flex-col justify-between gap-3 h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-11 h-9 bg-[#EC4899] border-2 border-[#382033] rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MailOpen className="w-5 h-5 text-white" />
                    </div>
                    <span className="inline-flex items-center gap-1 font-body font-extrabold text-xs text-[#181016]">
                      <EnergyOrb variant="pink" size={14} />
                      <span>{isRead ? 'Read ✓' : `+${letter.rewardLp} LP`}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h2 className="font-body font-extrabold text-sm text-[#181016] leading-snug">
                      {letter.label}
                    </h2>
                    <p className="font-body font-semibold text-xs text-[#181016]/80">
                      {letter.title} · Tap to open
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Opened Letter Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-[#6B2D5C]/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <article
            className="relative w-full max-w-xl yellow-card-shell rounded-[24px] p-2.5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-magenta-texture rounded-2xl border-2 border-[#382033] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between silver-bevel rounded-lg px-3.5 py-2 gap-3">
                <div className="flex items-center gap-2">
                  <PixelHeart size={18} color="#EC4899" className="animate-heartbeat" />
                  <h2 className="font-body font-extrabold text-xs sm:text-sm text-[#181016]">
                    {selected.label}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close letter"
                  className="p-1 bg-[#FCE24F] border border-[#382033] rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!editing ? (
                <div className="bg-[#FFF5E8] border-2 border-[#382033] rounded-xl p-5 whitespace-pre-wrap font-body text-sm sm:text-base text-[#181016] leading-relaxed">
                  {activeText}
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={8}
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    className="w-full p-4 bg-white border-2 border-[#382033] rounded-xl font-body text-sm text-[#181016]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="silver-bevel px-3 py-1.5 rounded font-pixel text-[9px] cursor-pointer"
                    >
                      CANCEL
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        saveCustomLetter(selected.id, draftText);
                        setEditing(false);
                      }}
                      className="pixel-button px-4 py-1.5 bg-[#FCE24F] text-[#181016] font-pixel text-[9px] inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>SAVE NOTE</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <DelonielSprite pose="sending-hearts" size={48} />
                  <span className="font-body italic font-bold text-xs text-[#181016]">
                    From Deloniel ♡
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDraftText(activeText);
                      setEditing((e) => !e);
                    }}
                    className="silver-bevel px-3 py-2 rounded-lg font-pixel text-[8px] text-[#181016] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>CUSTOMIZE</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="pixel-button px-4 py-2 bg-[#FCE24F] text-[#181016] font-pixel text-[9px] cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      )}
    </main>
  );
};
