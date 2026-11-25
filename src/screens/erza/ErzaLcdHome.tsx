import React from 'react';
import {
  PixelCloud,
  PixelGamepadIcon,
  PixelMusicIcon,
  PixelNoteEnvelope,
  PixelSmiley,
  PixelStar,
  PixelTrophyBadge,
} from '../../components/ErzaPixelArt';
import { ConsoleAppScreen, ThemeMode } from '../../types/erza';

interface ErzaLcdHomeProps {
  selectedIndex: number;
  onHoverIndex: (idx: number) => void;
  onSelectScreen: (screen: ConsoleAppScreen) => void;
  themeMode: ThemeMode;
  savedNote: boolean;
  discoveredCount: number;
  certifiedFriendBadge: boolean;
  welcomeBanner?: string | null;
}

export const MENU_CARTRIDGES: {
  id: ConsoleAppScreen;
  num: string;
  label: string;
  sub: string;
}[] = [
  {
    id: 'NOTE',
    num: '01.',
    label: 'A NOTE FOR MY FRIEND',
    sub: 'A little friendship letter',
  },
  {
    id: 'REMINDERS',
    num: '02.',
    label: 'LITTLE REMINDERS',
    sub: '50 pixel sunshine cards',
  },
  {
    id: 'SOUNDTRACK',
    num: '03.',
    label: 'OUR SOUNDTRACK',
    sub: '4EVER - Chris Brown',
  },
  {
    id: 'GAMES',
    num: '04.',
    label: 'MINI GAMES',
    sub: '3 playable retro games',
  },
];

export const ErzaLcdHome: React.FC<ErzaLcdHomeProps> = ({
  selectedIndex,
  onHoverIndex,
  onSelectScreen,
  themeMode,
  savedNote,
  discoveredCount,
  certifiedFriendBadge,
  welcomeBanner,
}) => {
  const isNight = themeMode === 'NIGHT';

  const renderIcon = (id: ConsoleAppScreen) => {
    switch (id) {
      case 'NOTE':
        return <PixelNoteEnvelope size={24} />;
      case 'REMINDERS':
        return <PixelCloud size={24} color="#D9A0A9" />;
      case 'SOUNDTRACK':
        return <PixelMusicIcon size={24} />;
      case 'GAMES':
        return <PixelGamepadIcon size={24} />;
      default:
        return <PixelStar size={22} />;
    }
  };

  return (
    <div className="h-full flex flex-col justify-between p-3 sm:p-3.5 select-none">
      {/* Main Screen Header */}
      <div
        className={`rounded-xl px-3 py-2 border-2 ${
          isNight
            ? 'bg-[#190D13]/90 border-[#B76E79]/55 text-[#F5E9E6]'
            : 'bg-[#F5E9E6]/95 border-[#800F2F]/55 text-[#4A101F]'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <PixelSmiley size={16} color="#D8C4C1" />
            <h2 className="font-pixel text-[8.5px] sm:text-[9.5px] tracking-wide truncate">
              AUCLAIR&apos;S LITTLE WORLD
            </h2>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 font-silk text-[9px]">
            <PixelStar size={12} color="#B76E79" />
            <span>{discoveredCount}/50</span>
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span
            className={`font-pixel text-[7px] ${
              isNight ? 'text-[#D9A0A9]' : 'text-[#800F2F]'
            }`}
          >
            SELECT YOUR GAME
          </span>
          {welcomeBanner && (
            <span className="font-silk text-[8px] text-[#F5E9E6] bg-[#800F2F] px-1.5 py-0.5 rounded truncate">
              {welcomeBanner}
            </span>
          )}
        </div>
      </div>

      {/* 4 Required Menu Options */}
      <div className="my-2 flex-1 flex flex-col justify-center gap-1.5 min-h-0">
        {MENU_CARTRIDGES.map((item, idx) => {
          const isSelected = selectedIndex === idx;
          const badgeNote =
            item.id === 'NOTE' && savedNote
              ? 'SAVED MEMORY ★'
              : item.id === 'REMINDERS'
              ? `${discoveredCount}/50 DISCOVERED`
              : item.sub;

          return (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => onHoverIndex(idx)}
              onClick={() => onSelectScreen(item.id)}
              className={`w-full text-left rounded-xl px-2.5 py-2 border-2 transition-all duration-150 flex items-center justify-between gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#922B45] ${
                isSelected
                  ? 'bg-[#800F2F] border-[#F5E9E6] text-[#F5E9E6] shadow-[0_3px_0_#190D13] -translate-y-0.5'
                  : isNight
                  ? 'bg-[#4A101F]/80 border-[#922B45]/60 text-[#F5E9E6] hover:border-[#D9A0A9]'
                  : 'bg-[#F5E9E6]/95 border-[#B76E79] text-[#4A101F] hover:bg-[#D8C4C1]/45'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-pixel text-[8px] shrink-0 w-4">
                  {isSelected ? '▶' : item.num}
                </span>
                <div
                  className={`p-1 rounded-lg border shrink-0 ${
                    isSelected
                      ? 'bg-[#4A101F]/55 border-[#D8C4C1]/50'
                      : isNight
                      ? 'bg-[#190D13]/75 border-[#B76E79]/35'
                      : 'bg-[#D8C4C1]/40 border-[#B76E79]/55'
                  }`}
                >
                  {renderIcon(item.id)}
                </div>
                <div className="min-w-0">
                  <div className="font-pixel text-[8px] sm:text-[8.5px] leading-tight truncate">
                    {item.id === 'NOTE' ? '01. A NOTE FOR MY FRIEND' : `${item.num} ${item.label}`}
                  </div>
                  <div
                    className={`font-vt text-[15px] leading-none mt-0.5 truncate ${
                      isSelected
                        ? 'text-[#D8C4C1]'
                        : isNight
                        ? 'text-[#D9A0A9]'
                        : 'text-[#800F2F]'
                    }`}
                  >
                    {badgeNote}
                  </div>
                </div>
              </div>
              <PixelStar
                size={13}
                color={isSelected ? '#F5E9E6' : '#B76E79'}
                className="shrink-0 opacity-85"
              />
            </button>
          );
        })}
      </div>

      {/* Bottom Utility Strip Inside LCD: Badge / Sound / Finish Screen */}
      <div className="flex items-center justify-between gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onSelectScreen('ACHIEVEMENT')}
          className={`flex-1 py-1.5 px-2 rounded-lg border font-pixel text-[6.5px] flex items-center justify-center gap-1 cursor-pointer ${
            isNight
              ? 'bg-[#190D13]/90 border-[#B76E79]/55 text-[#F5E9E6] hover:bg-[#800F2F]'
              : 'bg-[#F5E9E6] border-[#800F2F]/60 text-[#4A101F] hover:bg-[#D8C4C1]/60'
          }`}
        >
          <PixelTrophyBadge size={12} />
          <span className="truncate">
            {certifiedFriendBadge ? 'BADGE ★' : 'BADGE'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectScreen('SETTINGS')}
          className={`flex-1 py-1.5 px-2 rounded-lg border font-pixel text-[6.5px] cursor-pointer truncate ${
            isNight
              ? 'bg-[#190D13]/90 border-[#B76E79]/55 text-[#F5E9E6] hover:bg-[#800F2F]'
              : 'bg-[#F5E9E6] border-[#800F2F]/60 text-[#4A101F] hover:bg-[#D8C4C1]/60'
          }`}
        >
          SOUND SFX
        </button>

        <button
          type="button"
          onClick={() => onSelectScreen('FINALE')}
          className="flex-1 py-1.5 px-2 rounded-lg border border-[#D8C4C1] bg-[#800F2F] text-[#F5E9E6] font-pixel text-[6.5px] cursor-pointer hover:brightness-110 truncate"
        >
          CREDITS ▶
        </button>
      </div>
    </div>
  );
};
