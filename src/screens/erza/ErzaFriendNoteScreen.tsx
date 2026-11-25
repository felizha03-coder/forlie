import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { erzaAudio } from '../../audio/erzaAudio';
import { PixelCloud, PixelSmiley, PixelStar } from '../../components/ErzaPixelArt';
import { ERZA_FRIEND_NOTE } from '../../data/erzaData';
import { ThemeMode } from '../../types/erza';

interface ErzaFriendNoteScreenProps {
  themeMode: ThemeMode;
  savedNote: boolean;
  onSaveNote: () => void;
  onBack: () => void;
  confirmTrigger: number;
}

export const ErzaFriendNoteScreen: React.FC<ErzaFriendNoteScreenProps> = ({
  themeMode,
  savedNote,
  onSaveNote,
  onBack,
  confirmTrigger,
}) => {
  const [opened, setOpened] = useState(false);
  const [typedCount, setTypedCount] = useState(0);
  const [justSavedBanner, setJustSavedBanner] = useState(false);

  const paperRef = useRef<HTMLDivElement | null>(null);
  const isNight = themeMode === 'NIGHT';
  const typingDone = typedCount >= ERZA_FRIEND_NOTE.length;

  useEffect(() => {
    if (confirmTrigger === 0) return;
    if (!opened) {
      handleOpenEnvelope();
    } else if (!typingDone) {
      setTypedCount(ERZA_FRIEND_NOTE.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmTrigger]);

  useEffect(() => {
    if (!opened || !paperRef.current) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      gsap.fromTo(
        paperRef.current,
        { y: 24, scaleY: 0.72, opacity: 0 },
        { y: 0, scaleY: 1, opacity: 1, duration: 0.48, ease: 'power3.out' }
      );
    }
  }, [opened]);

  useEffect(() => {
    if (!opened || typingDone) return;
    const timer = window.setInterval(() => {
      setTypedCount((prev) => {
        const next = prev + 4;
        if (next >= ERZA_FRIEND_NOTE.length) {
          window.clearInterval(timer);
          return ERZA_FRIEND_NOTE.length;
        }
        return next;
      });
    }, 24);
    return () => window.clearInterval(timer);
  }, [opened, typingDone]);

  const handleOpenEnvelope = () => {
    erzaAudio.playEnvelopeOpen();
    setOpened(true);
  };

  const handleSave = () => {
    erzaAudio.playConfirm();
    onSaveNote();
    setJustSavedBanner(true);
    window.setTimeout(() => setJustSavedBanner(false), 4000);
  };

  return (
    <div className="h-full flex flex-col p-3 relative overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-2 shrink-0 gap-2">
        <button
          type="button"
          onClick={onBack}
          className={`px-2 py-1 rounded-md font-pixel text-[7.5px] border cursor-pointer shrink-0 ${
            isNight
              ? 'bg-[#190D13]/90 border-[#B76E79]/55 text-[#F5E9E6] hover:bg-[#800F2F]'
              : 'bg-[#F5E9E6] border-[#800F2F]/65 text-[#4A101F] hover:bg-[#D8C4C1]/60'
          }`}
        >
          ◀ MENU
        </button>
        <div className="flex items-center gap-1.5 min-w-0">
          <PixelStar size={14} color="#D9A0A9" />
          <span
            className={`font-pixel text-[7.5px] sm:text-[8px] truncate ${
              isNight ? 'text-[#F5E9E6]' : 'text-[#4A101F]'
            }`}
          >
            A NOTE FOR MY FRIEND
          </span>
        </div>
      </div>

      {!opened ? (
        /* Deep Burgundy Retro Envelope */
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <PixelCloud
            size={28}
            color="#F5E9E6"
            className="absolute top-2 left-3 animate-float-gentle"
          />
          <PixelStar
            size={18}
            color="#D9A0A9"
            className="absolute top-4 right-5 animate-float-gentle"
          />
          <PixelSmiley
            size={18}
            color="#D8C4C1"
            className="absolute bottom-4 left-6 animate-float-gentle"
          />
          <PixelStar
            size={15}
            color="#B76E79"
            className="absolute bottom-5 right-7 animate-float-gentle"
          />

          <button
            type="button"
            onClick={handleOpenEnvelope}
            className="group relative w-full max-w-[290px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A0A9] rounded-2xl transition-transform hover:scale-[1.03] active:scale-95"
          >
            <div className="relative rounded-2xl bg-gradient-to-b from-[#800F2F] via-[#641C32] to-[#4A101F] border-2 border-[#D8C4C1] p-5 shadow-[0_7px_0_#190D13]">
              <div
                aria-hidden="true"
                className="mx-auto w-0 h-0 border-l-[116px] border-l-transparent border-r-[116px] border-r-transparent border-t-[46px] border-t-[#922B45]/90 -mt-5 mb-2"
              />
              {/* Friendship Sticker Seal */}
              <div className="mx-auto -mt-8 mb-3 w-11 h-11 rounded-xl bg-[#D8C4C1] border-2 border-[#F5E9E6] shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                <PixelSmiley size={22} color="#F5E9E6" />
              </div>

              <p className="font-pixel text-[8.5px] leading-relaxed text-[#F5E9E6] text-center">
                &ldquo;A LITTLE NOTE FOR YOU, AUCLAIR&rdquo;
              </p>

              <div className="mt-3 inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#190D13] border border-[#D8C4C1]/60 text-[#F5E9E6] font-silk text-[9px]">
                CLICK / PRESS A TO OPEN
              </div>
            </div>
          </button>
        </div>
      ) : (
        /* Unfolding Paper + Typewriter Friendship Note */
        <div ref={paperRef} className="flex-1 min-h-0 flex flex-col origin-top">
          <div
            onClick={() => {
              if (!typingDone) setTypedCount(ERZA_FRIEND_NOTE.length);
            }}
            className="flex-1 min-h-0 overflow-y-auto lcd-scroll note-paper rounded-xl border-2 border-[#800F2F] p-3 shadow-[inset_0_2px_8px_rgba(25,13,19,0.14)] text-[#4A101F] relative cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5 border-b border-[#800F2F]/25 pb-1">
              <div className="flex items-center gap-1.5">
                <PixelStar size={14} color="#800F2F" />
                <span className="font-pixel text-[8px] text-[#800F2F]">
                  A NOTE FOR MY FRIEND
                </span>
              </div>
              <div className="flex items-center gap-1">
                <PixelSmiley size={14} color="#D9A0A9" />
                {!typingDone && (
                  <span className="font-silk text-[8px] text-[#800F2F]">
                    TAP TO SKIP
                  </span>
                )}
              </div>
            </div>

            <div className="whitespace-pre-line font-vt text-[17px] sm:text-[18px] leading-[1.28] text-[#4A101F]">
              {ERZA_FRIEND_NOTE.slice(0, typedCount)}
              {!typingDone && (
                <span className="inline-block w-2 h-4 bg-[#800F2F] ml-0.5 align-middle" />
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2 px-3 rounded-xl bg-[#800F2F] hover:brightness-110 border-2 border-[#D8C4C1] text-[#F5E9E6] font-pixel text-[8px] shadow-[0_3px_0_#190D13] active:translate-y-0.5 cursor-pointer transition-all"
            >
              {savedNote ? '✓ NOTE SAVED' : '[ SAVE NOTE ]'}
            </button>
          </div>
        </div>
      )}

      {/* Save Confirmation Banner */}
      {justSavedBanner && (
        <div className="absolute bottom-12 left-3 right-3 rounded-xl bg-[#190D13] border-2 border-[#D9A0A9] px-3 py-2 text-center shadow-xl z-20">
          <div className="font-pixel text-[8px] text-[#F5E9E6]">
            NOTE SAVED SUCCESSFULLY!
          </div>
          <p className="mt-1 font-vt text-[15px] text-[#D9A0A9] leading-tight">
            ONE MORE MEMORY ADDED TO YOUR COLLECTION.
          </p>
        </div>
      )}
    </div>
  );
};
