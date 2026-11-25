import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import {
  DelonielSprite,
  DreamyMeadowScene,
  EnergyOrb,
  RosieSprite,
} from '../components/RosieSprites';
import { useRosie } from '../context/RosieContext';
import { ROSIE_CHARACTERS } from '../data/rosieData';
import { CharacterId } from '../types/rosie';

export const RosieCharacterSelectScreen: React.FC = () => {
  const { navigate, progress, settings, selectCharacter } = useRosie();
  const [hoveredId, setHoveredId] = useState<CharacterId | null>(null);
  const [popId, setPopId] = useState<CharacterId | null>(null);

  const handleSelect = (id: CharacterId) => {
    selectCharacter(id);
    setPopId(id);
    window.setTimeout(() => setPopId(null), 460);
  };

  const activeChar =
    ROSIE_CHARACTERS.find((c) => c.id === progress.selectedCharacter) ?? ROSIE_CHARACTERS[0];

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full pink-pixel-grid py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="yellow-card-shell rounded-2xl p-1.5">
          <div className="card-magenta-texture rounded-xl border-2 border-[#6B2D5C] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="basic-silver-tag px-2.5 py-0.5 font-body font-extrabold italic text-[10px] text-[#181016]">
                  PLAYER
                </span>
                <h1 className="font-body font-extrabold text-lg sm:text-xl text-[#181016]">
                  CHOOSE YOUR CHARACTER
                </h1>
              </div>
              <p className="font-body font-bold text-xs sm:text-sm text-[#181016]/90">
                Pick who explores Rosie&apos;s World &amp; stars in Arcade mini-games! Active:{' '}
                <strong>{activeChar.name}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('WORLD')}
              className="pixel-button px-4 py-2 bg-[#FEF08A] hover:bg-[#FFF9FC] font-pixel text-[9px] text-[#181016] inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>BACK TO WORLD</span>
            </button>
          </div>
        </div>

        {/* Playable Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ROSIE_CHARACTERS.map((char) => {
            const isSelected = progress.selectedCharacter === char.id;
            const isHovered = hoveredId === char.id;
            const isPopping = popId === char.id;

            return (
              <section
                key={char.id}
                onMouseEnter={() => setHoveredId(char.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`yellow-card-shell rounded-[26px] p-2.5 transition-transform duration-200 ${
                  isSelected ? '-translate-y-1' : 'hover:-translate-y-1'
                } ${isPopping ? 'animate-select-pop' : ''}`}
              >
                <div
                  className={`rounded-[18px] border-2 border-[#6B2D5C] p-4 sm:p-5 space-y-4 text-[#2E1028] ${
                    isSelected ? 'card-vip-texture' : 'card-magenta-texture'
                  }`}
                >
                  {/* Card Top Bar */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="basic-silver-tag px-2.5 py-0.5 font-body font-extrabold italic text-[10px]">
                        {isSelected ? 'ACTIVE' : 'SELECT'}
                      </span>
                      <h2 className="font-body font-extrabold text-xl text-[#181016]">
                        {char.name}
                      </h2>
                    </div>
                    <EnergyOrb variant={char.id === 'rosie' ? 'pink' : 'psychic'} size={20} />
                  </div>

                  {/* Interactive Character Meadow Preview */}
                  <div className="silver-bevel rounded-lg p-1.5">
                    <DreamyMeadowScene
                      bubbleText={isSelected ? 'ready to play! ♡' : isHovered ? char.quote : undefined}
                      heightClass="h-44"
                      showCompanions={isSelected}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelect(char.id)}
                        className={`cursor-pointer transition-transform duration-200 ${
                          settings.animationsEnabled ? 'animate-float-slow' : ''
                        } ${isHovered ? 'scale-110' : ''} ${isSelected ? 'scale-105' : ''}`}
                        aria-label={`Select ${char.name}`}
                      >
                        {char.id === 'rosie' ? (
                          <RosieSprite
                            pose={isSelected ? 'sending-hearts' : isHovered ? 'waving' : 'smiling'}
                            size={86}
                          />
                        ) : (
                          <DelonielSprite
                            pose={isSelected ? 'sending-hearts' : isHovered ? 'waving' : 'smiling'}
                            size={86}
                          />
                        )}
                      </button>
                    </DreamyMeadowScene>
                    <div className="pt-1 text-center font-body font-bold text-[11px] text-[#475569]">
                      {char.title}
                    </div>
                  </div>

                  {/* Description & Trait */}
                  <div className="silver-bevel rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-body font-extrabold text-[#C92778]">
                      <span>{char.nickname}</span>
                      <span>★ {char.specialTrait}</span>
                    </div>
                    <p className="font-body font-semibold text-xs sm:text-sm text-[#181016] leading-relaxed">
                      {char.description}
                    </p>
                  </div>

                  {/* Stats Bars */}
                  <div className="space-y-1.5 font-pixel text-[8px] tabular-nums bg-[#FFF9FC]/90 border-2 border-[#6B2D5C] rounded-xl p-3">
                    {Object.entries(char.stats).map(([key, val]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between uppercase">
                          <span className="text-[#6B2D5C]">{key}</span>
                          <span className="text-[#DB2777]">{val}</span>
                        </div>
                        <div className="w-full h-2 bg-[#FFD4E7] border border-[#6B2D5C]/50 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              char.id === 'rosie' ? 'bg-[#EC4899]' : 'bg-[#A78BFA]'
                            }`}
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => handleSelect(char.id)}
                    className={`w-full pixel-button py-3 rounded-xl font-pixel text-[10px] inline-flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#FCE24F] text-[#181016]'
                        : 'bg-white hover:bg-[#FFF5E8] text-[#181016]'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#C92778]" />
                        <span>SELECTED AS {char.name} ♡</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                        <span>CHOOSE {char.name}</span>
                      </>
                    )}
                  </button>
                </div>
              </section>
            );
          })}
        </div>

        {/* Continue Action */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('ARCADE')}
            className="pixel-button px-5 py-3 bg-[#FCE24F] hover:bg-white text-[#181016] font-pixel text-[10px] cursor-pointer"
          >
            PLAY ARCADE AS {activeChar.name} ▶
          </button>
          <button
            type="button"
            onClick={() => navigate('WORLD')}
            className="silver-bevel px-5 py-3 rounded-xl font-pixel text-[10px] text-[#181016] cursor-pointer hover:brightness-105"
          >
            EXPLORE WORLD
          </button>
        </div>
      </div>
    </main>
  );
};
