import React from 'react';
import { MonsterId, PlayableCharacterId } from '../types/hanna';

export const PixelHeartIcon: React.FC<{
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 18, color = '#F5A6C8', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 11 10"
    shapeRendering="crispEdges"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <path
      d="M2 1h2v1h1v1h1V2h1V1h2v1h1v3H9v1H8v1H7v1H6v1H5V8H4V7H3V6H2V5H1V2h1V1z"
      fill="#211A2B"
    />
    <path
      d="M2 2h2v1h1v1h1V3h1V2h2v3H8v1H7v1H6v1H5V7H4V6H3V5H2V2z"
      fill={color}
    />
    <rect x="3" y="3" width="1" height="1" fill="#FFF0D5" />
  </svg>
);

export const PixelStarIcon: React.FC<{
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 18, color = '#FF9B38', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 11 11"
    shapeRendering="crispEdges"
    className={`pixelated ${className}`}
    aria-hidden="true"
  >
    <rect x="5" y="0" width="1" height="11" fill="#211A2B" />
    <rect x="0" y="5" width="11" height="1" fill="#211A2B" />
    <rect x="4" y="1" width="3" height="9" fill="#211A2B" />
    <rect x="1" y="4" width="9" height="3" fill="#211A2B" />
    <rect x="4" y="2" width="3" height="7" fill={color} />
    <rect x="2" y="4" width="7" height="3" fill={color} />
    <rect x="3" y="3" width="5" height="5" fill={color} />
    <rect x="4" y="4" width="1" height="1" fill="#FFF0D5" />
  </svg>
);

export const PixelXSymbol: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    shapeRendering="crispEdges"
    className="pixelated"
    aria-hidden="true"
  >
    <path
      d="M1 1h3v2h1v1h2V3h1V1h3v3H9v1H8v2h1v1h2v3H8V9H7V8H5v1H4v2H1V8h2V7h1V5H3V4H1V1z"
      fill="#211A2B"
    />
    <path
      d="M2 2h1v2h2v1h2V4h2V2h1v1H8v2H7v2h1v2h2v1H9V8H7V7H5v1H3v2H2V9h2V7h1V5H4V3H2V2z"
      fill="#FF9B38"
    />
  </svg>
);

export const PixelOSymbol: React.FC<{ size?: number }> = ({ size = 44 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    shapeRendering="crispEdges"
    className="pixelated"
    aria-hidden="true"
  >
    <path
      d="M3 1h6v1h1v1h1v6h-1v1H9v1H3v-1H2V9H1V3h1V2h1V1z"
      fill="#211A2B"
    />
    <path
      d="M3 2h6v1h1v6H9v1H3V9H2V3h1V2z"
      fill="#8CE5E8"
    />
    <rect x="4" y="4" width="4" height="4" fill="#8C265A" />
    <rect x="3" y="3" width="1" height="1" fill="#FFF0D5" />
  </svg>
);

export const CharacterSprite: React.FC<{
  id: PlayableCharacterId;
  size?: number;
  animateIdle?: boolean;
  className?: string;
}> = ({ id, size = 96, animateIdle = true, className = '' }) => {
  const animClass = animateIdle ? 'animate-pixel-bob' : '';

  if (id === 'hanna') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 22"
        shapeRendering="crispEdges"
        className={`pixelated ${animClass} ${className}`}
        aria-label="Hanna Pixel Sprite"
      >
        {/* Explorer Hat */}
        <rect x="5" y="1" width="10" height="2" fill="#211A2B" />
        <rect x="6" y="2" width="8" height="2" fill="#FF9B38" />
        <rect x="3" y="4" width="14" height="2" fill="#211A2B" />
        <rect x="4" y="4" width="12" height="1" fill="#FFB78C" />
        <rect x="9" y="3" width="2" height="1" fill="#8CE5E8" />
        {/* Hair & Head Outline */}
        <rect x="4" y="5" width="12" height="8" fill="#211A2B" />
        <rect x="5" y="5" width="10" height="2" fill="#5A334E" />
        <rect x="4" y="6" width="2" height="6" fill="#5A334E" />
        <rect x="14" y="6" width="2" height="6" fill="#5A334E" />
        {/* Rose Hair Ribbon */}
        <rect x="15" y="6" width="2" height="2" fill="#F5A6C8" />
        {/* Face */}
        <rect x="6" y="7" width="8" height="5" fill="#FFF0D5" />
        {/* Eyes & Rosy Cheeks */}
        <rect x="7" y="8" width="2" height="2" fill="#211A2B" />
        <rect x="11" y="8" width="2" height="2" fill="#211A2B" />
        <rect x="7" y="8" width="1" height="1" fill="#8CE5E8" />
        <rect x="11" y="8" width="1" height="1" fill="#8CE5E8" />
        <rect x="6" y="10" width="2" height="1" fill="#F5A6C8" />
        <rect x="12" y="10" width="2" height="1" fill="#F5A6C8" />
        {/* Scarf & Adventure Jacket */}
        <rect x="5" y="12" width="10" height="6" fill="#211A2B" />
        <rect x="6" y="12" width="8" height="2" fill="#FF9B38" />
        <rect x="6" y="14" width="8" height="4" fill="#F5A6C8" />
        {/* Satchel Strap */}
        <rect x="8" y="14" width="1" height="4" fill="#26163B" />
        <rect x="11" y="14" width="2" height="2" fill="#8CE5E8" />
        {/* Arms */}
        <rect x="4" y="13" width="2" height="4" fill="#211A2B" />
        <rect x="4" y="14" width="1" height="2" fill="#FFF0D5" />
        <rect x="14" y="13" width="2" height="4" fill="#211A2B" />
        <rect x="15" y="14" width="1" height="2" fill="#FFF0D5" />
        {/* Boots */}
        <rect x="6" y="18" width="3" height="3" fill="#211A2B" />
        <rect x="11" y="18" width="3" height="3" fill="#211A2B" />
        <rect x="6" y="19" width="3" height="1" fill="#FFB78C" />
        <rect x="11" y="19" width="3" height="1" fill="#FFB78C" />
      </svg>
    );
  }

  if (id === 'pixel-cat') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 22"
        shapeRendering="crispEdges"
        className={`pixelated ${animClass} ${className}`}
        aria-label="Pixel Cat Sprite"
      >
        {/* Pointed Ears */}
        <rect x="4" y="2" width="3" height="4" fill="#211A2B" />
        <rect x="13" y="2" width="3" height="4" fill="#211A2B" />
        <rect x="5" y="3" width="1" height="2" fill="#F5A6C8" />
        <rect x="14" y="3" width="1" height="2" fill="#F5A6C8" />
        {/* Head */}
        <rect x="4" y="5" width="12" height="8" fill="#211A2B" />
        <rect x="5" y="6" width="10" height="6" fill="#FFF0D5" />
        {/* Calico Peach Patch */}
        <rect x="5" y="6" width="4" height="3" fill="#FFB78C" />
        <rect x="12" y="6" width="3" height="2" fill="#FF9B38" />
        {/* Eyes & Cute Nose */}
        <rect x="7" y="8" width="2" height="2" fill="#211A2B" />
        <rect x="11" y="8" width="2" height="2" fill="#211A2B" />
        <rect x="7" y="8" width="1" height="1" fill="#FFF0D5" />
        <rect x="11" y="8" width="1" height="1" fill="#FFF0D5" />
        <rect x="9" y="10" width="2" height="1" fill="#F5A6C8" />
        {/* Whiskers */}
        <rect x="2" y="9" width="2" height="1" fill="#211A2B" />
        <rect x="16" y="9" width="2" height="1" fill="#211A2B" />
        {/* Collar & Cyan Bell */}
        <rect x="5" y="12" width="10" height="2" fill="#211A2B" />
        <rect x="6" y="12" width="8" height="1" fill="#F5A6C8" />
        <rect x="9" y="13" width="2" height="2" fill="#8CE5E8" />
        {/* Body & Tail */}
        <rect x="5" y="14" width="10" height="5" fill="#211A2B" />
        <rect x="6" y="14" width="8" height="4" fill="#FFF0D5" />
        <rect x="8" y="15" width="4" height="3" fill="#FFB78C" />
        <rect x="15" y="13" width="3" height="4" fill="#211A2B" />
        <rect x="16" y="12" width="2" height="3" fill="#FF9B38" />
        {/* Paws */}
        <rect x="6" y="19" width="3" height="2" fill="#211A2B" />
        <rect x="11" y="19" width="3" height="2" fill="#211A2B" />
      </svg>
    );
  }

  if (id === 'mystery-girl') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 22"
        shapeRendering="crispEdges"
        className={`pixelated ${animClass} ${className}`}
        aria-label="Mystery Girl Sprite"
      >
        {/* Starry Hood */}
        <rect x="5" y="2" width="10" height="3" fill="#211A2B" />
        <rect x="6" y="3" width="8" height="2" fill="#3F2463" />
        <rect x="9" y="2" width="2" height="1" fill="#FF9B38" />
        {/* Hood & Face Shadow */}
        <rect x="4" y="5" width="12" height="8" fill="#211A2B" />
        <rect x="5" y="6" width="10" height="6" fill="#26163B" />
        <rect x="6" y="8" width="8" height="4" fill="#17172F" />
        {/* Glowing Cyan Eyes */}
        <rect x="7" y="9" width="2" height="2" fill="#8CE5E8" />
        <rect x="11" y="9" width="2" height="2" fill="#8CE5E8" />
        {/* Purple Star Cloak */}
        <rect x="4" y="13" width="12" height="6" fill="#211A2B" />
        <rect x="5" y="13" width="10" height="5" fill="#3F2463" />
        <rect x="7" y="14" width="6" height="4" fill="#26163B" />
        <rect x="9" y="15" width="2" height="2" fill="#8CE5E8" />
        {/* Held Arcade-Orange Lantern */}
        <rect x="15" y="12" width="3" height="5" fill="#211A2B" />
        <rect x="16" y="13" width="1" height="3" fill="#FF9B38" />
        <rect x="16" y="14" width="1" height="1" fill="#FFF0D5" />
        {/* Boots */}
        <rect x="6" y="19" width="3" height="2" fill="#211A2B" />
        <rect x="11" y="19" width="3" height="2" fill="#211A2B" />
      </svg>
    );
  }

  // little-ghost
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 22"
      shapeRendering="crispEdges"
      className={`pixelated ${animClass} ${className}`}
      aria-label="Little Ghost Sprite"
    >
      {/* Tiny Spooky Top Hat */}
      <rect x="7" y="1" width="6" height="3" fill="#211A2B" />
      <rect x="8" y="2" width="4" height="2" fill="#26163B" />
      <rect x="5" y="4" width="10" height="1" fill="#211A2B" />
      <rect x="8" y="3" width="4" height="1" fill="#FF9B38" />
      {/* Ghost Sheet Outline & Cream Body */}
      <rect x="5" y="5" width="10" height="13" fill="#211A2B" />
      <rect x="4" y="7" width="12" height="11" fill="#211A2B" />
      <rect x="5" y="6" width="10" height="11" fill="#FFF0D5" />
      {/* Bottom Wavy Hem */}
      <rect x="4" y="17" width="3" height="2" fill="#211A2B" />
      <rect x="9" y="17" width="2" height="2" fill="#211A2B" />
      <rect x="13" y="17" width="3" height="2" fill="#211A2B" />
      <rect x="5" y="17" width="2" height="1" fill="#FFF0D5" />
      <rect x="13" y="17" width="2" height="1" fill="#FFF0D5" />
      {/* Goofy Eyes, Blush & Bowtie */}
      <rect x="7" y="9" width="2" height="2" fill="#211A2B" />
      <rect x="11" y="9" width="2" height="2" fill="#211A2B" />
      <rect x="6" y="11" width="2" height="1" fill="#F5A6C8" />
      <rect x="12" y="11" width="2" height="1" fill="#F5A6C8" />
      <rect x="8" y="12" width="4" height="1" fill="#211A2B" />
      {/* Mini Arms */}
      <rect x="2" y="11" width="2" height="3" fill="#211A2B" />
      <rect x="3" y="12" width="1" height="1" fill="#FFF0D5" />
      <rect x="16" y="11" width="2" height="3" fill="#211A2B" />
      <rect x="16" y="12" width="1" height="1" fill="#FFF0D5" />
    </svg>
  );
};

export const MonsterSprite: React.FC<{
  id: MonsterId;
  size?: number;
  className?: string;
}> = ({ id, size = 104, className = '' }) => {
  if (id === 'slime-king') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 22 22"
        shapeRendering="crispEdges"
        className={`pixelated animate-pixel-bob ${className}`}
        aria-label="Slime King Sprite"
      >
        {/* Jagged Arcade-Orange Crown */}
        <rect x="6" y="2" width="2" height="3" fill="#211A2B" />
        <rect x="10" y="1" width="2" height="4" fill="#211A2B" />
        <rect x="14" y="2" width="2" height="3" fill="#211A2B" />
        <rect x="6" y="4" width="10" height="3" fill="#211A2B" />
        <rect x="7" y="3" width="1" height="3" fill="#FF9B38" />
        <rect x="10" y="2" width="2" height="4" fill="#FF9B38" />
        <rect x="14" y="3" width="1" height="3" fill="#FF9B38" />
        <rect x="7" y="5" width="8" height="1" fill="#FFB78C" />
        {/* Giant Cyan Slime Blob */}
        <rect x="4" y="7" width="14" height="12" fill="#211A2B" />
        <rect x="2" y="10" width="18" height="9" fill="#211A2B" />
        <rect x="5" y="8" width="12" height="10" fill="#8CE5E8" />
        <rect x="3" y="11" width="16" height="7" fill="#8CE5E8" />
        {/* Shine & Shading */}
        <rect x="5" y="9" width="3" height="2" fill="#FFF0D5" />
        <rect x="4" y="16" width="14" height="2" fill="#4DB8C4" />
        {/* Eyes & Cheeky Smile */}
        <rect x="7" y="11" width="2" height="3" fill="#211A2B" />
        <rect x="13" y="11" width="2" height="3" fill="#211A2B" />
        <rect x="9" y="14" width="4" height="1" fill="#211A2B" />
        <rect x="6" y="13" width="1" height="1" fill="#F5A6C8" />
        <rect x="15" y="13" width="1" height="1" fill="#F5A6C8" />
      </svg>
    );
  }

  if (id === 'shadow-bat') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 20"
        shapeRendering="crispEdges"
        className={`pixelated animate-pixel-bob ${className}`}
        aria-label="Shadow Bat Sprite"
      >
        {/* Wings */}
        <rect x="1" y="5" width="6" height="7" fill="#211A2B" />
        <rect x="17" y="5" width="6" height="7" fill="#211A2B" />
        <rect x="2" y="6" width="5" height="5" fill="#3F2463" />
        <rect x="17" y="6" width="5" height="5" fill="#3F2463" />
        <rect x="3" y="11" width="2" height="2" fill="#26163B" />
        <rect x="19" y="11" width="2" height="2" fill="#26163B" />
        {/* Ears */}
        <rect x="8" y="2" width="2" height="4" fill="#211A2B" />
        <rect x="14" y="2" width="2" height="4" fill="#211A2B" />
        <rect x="9" y="3" width="1" height="2" fill="#F5A6C8" />
        <rect x="14" y="3" width="1" height="2" fill="#F5A6C8" />
        {/* Body */}
        <rect x="7" y="5" width="10" height="10" fill="#211A2B" />
        <rect x="8" y="6" width="8" height="8" fill="#26163B" />
        {/* Glowing Eyes & Fangs */}
        <rect x="9" y="8" width="2" height="2" fill="#FF9B38" />
        <rect x="13" y="8" width="2" height="2" fill="#FF9B38" />
        <rect x="9" y="11" width="6" height="2" fill="#211A2B" />
        <rect x="10" y="12" width="1" height="1" fill="#FFF0D5" />
        <rect x="13" y="12" width="1" height="1" fill="#FFF0D5" />
      </svg>
    );
  }

  // chaos-ghost
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      shapeRendering="crispEdges"
      className={`pixelated animate-pixel-bob ${className}`}
      aria-label="Chaos Ghost Sprite"
    >
      {/* Floating Pink Chaos Crown / Horns */}
      <rect x="6" y="2" width="2" height="3" fill="#F5A6C8" />
      <rect x="14" y="2" width="2" height="3" fill="#F5A6C8" />
      {/* Body */}
      <rect x="5" y="4" width="12" height="14" fill="#211A2B" />
      <rect x="4" y="7" width="14" height="11" fill="#211A2B" />
      <rect x="6" y="5" width="10" height="12" fill="#52337A" />
      <rect x="5" y="8" width="12" height="8" fill="#3F2463" />
      {/* Glowing Cyan & Orange Eyes */}
      <rect x="7" y="8" width="3" height="2" fill="#8CE5E8" />
      <rect x="12" y="8" width="3" height="2" fill="#FF9B38" />
      <rect x="8" y="12" width="6" height="2" fill="#211A2B" />
      <rect x="9" y="12" width="4" height="1" fill="#F5A6C8" />
      {/* Wisps */}
      <rect x="5" y="17" width="3" height="3" fill="#211A2B" />
      <rect x="10" y="17" width="2" height="3" fill="#211A2B" />
      <rect x="14" y="17" width="3" height="3" fill="#211A2B" />
      <rect x="2" y="6" width="2" height="2" fill="#8CE5E8" />
      <rect x="18" y="5" width="2" height="2" fill="#F5A6C8" />
    </svg>
  );
};

export const TreasureChestSprite: React.FC<{
  opened: boolean;
  size?: number;
}> = ({ opened, size = 128 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 22"
    shapeRendering="crispEdges"
    className="pixelated"
    aria-hidden="true"
  >
    {/* Glow Aura when open */}
    {opened && (
      <>
        <rect x="5" y="1" width="2" height="2" fill="#8CE5E8" />
        <rect x="11" y="0" width="2" height="3" fill="#FF9B38" />
        <rect x="17" y="1" width="2" height="2" fill="#F5A6C8" />
      </>
    )}
    {/* Chest Lid */}
    <rect
      x="3"
      y={opened ? 3 : 7}
      width="18"
      height="5"
      fill="#211A2B"
    />
    <rect
      x="4"
      y={opened ? 4 : 8}
      width="16"
      height="3"
      fill="#FF9B38"
    />
    <rect
      x="5"
      y={opened ? 4 : 8}
      width="14"
      height="1"
      fill="#FFB78C"
    />
    {/* Open Gold-Peach Interior */}
    {opened && (
      <>
        <rect x="4" y="8" width="16" height="4" fill="#211A2B" />
        <rect x="5" y="9" width="14" height="3" fill="#FFF0D5" />
        <rect x="7" y="8" width="3" height="3" fill="#F5A6C8" />
        <rect x="11" y="7" width="3" height="4" fill="#8CE5E8" />
        <rect x="15" y="8" width="3" height="3" fill="#FF9B38" />
      </>
    )}
    {/* Chest Base */}
    <rect x="3" y="11" width="18" height="9" fill="#211A2B" />
    <rect x="4" y="12" width="16" height="7" fill="#A65526" />
    {/* Metal Bands & Lock */}
    <rect x="6" y="12" width="2" height="7" fill="#FFB78C" />
    <rect x="16" y="12" width="2" height="7" fill="#FFB78C" />
    <rect x="10" y="11" width="4" height="4" fill="#211A2B" />
    <rect x="11" y="12" width="2" height="2" fill={opened ? '#8CE5E8' : '#FF9B38'} />
  </svg>
);

export const HauntedMansionBackdrop: React.FC = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-b from-[#9E2B6B] via-[#E06FA5] to-[#FBCFE8]"
  >
    {/* Twinkling Pixel Stars */}
    {[
      { top: '8%', left: '10%', color: '#FFF0D5', delay: '0s' },
      { top: '14%', left: '24%', color: '#8CE5E8', delay: '0.4s' },
      { top: '10%', left: '62%', color: '#FFF0D5', delay: '0.7s' },
      { top: '18%', left: '78%', color: '#FFE4F2', delay: '0.2s' },
      { top: '26%', left: '14%', color: '#FFB78C', delay: '0.9s' },
      { top: '22%', left: '89%', color: '#8CE5E8', delay: '0.5s' },
      { top: '34%', left: '70%', color: '#FFF0D5', delay: '0.3s' },
    ].map((star, idx) => (
      <span
        key={idx}
        style={{ top: star.top, left: star.left, backgroundColor: star.color, animationDelay: star.delay }}
        className="absolute w-1.5 h-1.5 animate-pixel-blink"
      />
    ))}

    {/* Pixel Moon */}
    <div className="absolute right-8 sm:right-16 top-10 w-16 h-16 bg-[#FFF0D5] border-4 border-[#211A2B] shadow-[4px_4px_0_#6B1D47]">
      <div className="w-4 h-4 bg-[#FFB78C] m-2" />
      <div className="w-2 h-2 bg-[#FFB78C] ml-9" />
    </div>

    {/* Drifting Pixel Clouds */}
    <svg
      width="110"
      height="42"
      viewBox="0 0 22 9"
      shapeRendering="crispEdges"
      className="pixelated absolute left-6 top-14 opacity-85 animate-pixel-cloud"
    >
      <rect x="4" y="2" width="12" height="4" fill="#FBCFE8" />
      <rect x="1" y="4" width="19" height="4" fill="#FFE4F2" />
      <rect x="7" y="1" width="6" height="3" fill="#FFF0F6" />
    </svg>

    <svg
      width="96"
      height="38"
      viewBox="0 0 20 8"
      shapeRendering="crispEdges"
      className="pixelated absolute right-24 top-20 opacity-80 animate-pixel-cloud"
      style={{ animationDelay: '3s' }}
    >
      <rect x="3" y="2" width="12" height="4" fill="#FBCFE8" />
      <rect x="1" y="4" width="18" height="3" fill="#FFE4F2" />
    </svg>

    {/* Full-bleed Pink Dusk Haunted Mansion & Silhouettes SVG */}
    <svg
      viewBox="0 0 400 220"
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      className="pixelated absolute inset-x-0 bottom-0 w-full h-full"
    >
      {/* Far Berry-Rose Hills */}
      <rect x="0" y="154" width="400" height="66" fill="#A6346F" />
      <polygon points="0,162 85,138 175,162" fill="#942960" />
      <polygon points="235,162 325,134 400,158 400,165" fill="#942960" />

      {/* Haunted Mansion Silhouette (Berry Rose) */}
      <rect x="135" y="96" width="130" height="84" fill="#6E1E49" />
      {/* Center Turret */}
      <rect x="176" y="64" width="48" height="40" fill="#6E1E49" />
      <polygon points="172,64 200,34 228,64" fill="#59153A" />
      <rect x="198" y="24" width="4" height="12" fill="#211A2B" />
      {/* Left & Right Wings */}
      <polygon points="130,96 154,68 176,96" fill="#59153A" />
      <polygon points="224,96 246,68 270,96" fill="#59153A" />
      {/* Glowing Mansion Windows */}
      <rect x="194" y="74" width="12" height="16" fill="#FF9B38" />
      <rect x="199" y="74" width="2" height="16" fill="#211A2B" />
      <rect x="194" y="81" width="12" height="2" fill="#211A2B" />
      <rect x="148" y="108" width="12" height="16" fill="#FFB78C" />
      <rect x="240" y="108" width="12" height="16" fill="#FF9B38" />
      <rect x="188" y="128" width="24" height="36" fill="#8C265A" />
      {/* Little Peeking Cyan Eyes in Mansion Window */}
      <rect x="151" y="114" width="2" height="2" fill="#211A2B" />
      <rect x="155" y="114" width="2" height="2" fill="#211A2B" />

      {/* Crooked Berry Pine Trees */}
      <polygon points="12,174 34,92 56,174" fill="#59153A" />
      <polygon points="50,176 68,118 86,176" fill="#731F4C" />
      <polygon points="318,176 340,108 362,176" fill="#731F4C" />
      <polygon points="354,174 378,90 400,174" fill="#59153A" />

      {/* Hidden Glowing Creature Eyes in Bushes */}
      <rect x="92" y="168" width="2" height="2" fill="#8CE5E8" />
      <rect x="97" y="168" width="2" height="2" fill="#8CE5E8" />
      <rect x="296" y="166" width="2" height="2" fill="#FFE4F2" />
      <rect x="301" y="166" width="2" height="2" fill="#FFE4F2" />

      {/* Pink Adventure Trail Ground */}
      <rect x="0" y="176" width="400" height="44" fill="#B83B77" />
      <rect x="0" y="176" width="400" height="3" fill="#F9A8D4" />
      <rect x="0" y="184" width="400" height="36" fill="#8C265A" />
    </svg>
  </div>
);

export const ForestBattleBackdrop: React.FC = () => (
  <svg
    viewBox="0 0 360 160"
    preserveAspectRatio="xMidYMax slice"
    shapeRendering="crispEdges"
    aria-hidden="true"
    className="pixelated pointer-events-none absolute inset-0 w-full h-full"
  >
    {/* Pink Blossom Twilight Sky */}
    <rect x="0" y="0" width="360" height="106" fill="#9E2B6B" />
    {/* Stars */}
    <rect x="34" y="18" width="2" height="2" fill="#FFF0D5" />
    <rect x="94" y="12" width="2" height="2" fill="#8CE5E8" />
    <rect x="220" y="20" width="2" height="2" fill="#FFE4F2" />
    <rect x="304" y="14" width="2" height="2" fill="#FFF0D5" />
    {/* Pixel Moon */}
    <rect x="164" y="12" width="24" height="24" fill="#FFF0D5" />
    <rect x="176" y="16" width="6" height="6" fill="#FFB78C" />
    {/* Distant Rose Forest Canopy Silhouettes */}
    <polygon points="0,110 26,48 54,110" fill="#6E1E49" />
    <polygon points="44,110 74,56 104,110" fill="#822456" />
    <polygon points="256,110 286,52 316,110" fill="#822456" />
    <polygon points="304,110 334,42 360,110" fill="#6E1E49" />
    {/* Misty Pink Clearing Band */}
    <rect x="0" y="96" width="360" height="14" fill="#D45795" />
    {/* Rose Forest Battlefield Turf */}
    <rect x="0" y="106" width="360" height="54" fill="#8C265A" />
    <rect x="0" y="106" width="360" height="4" fill="#F9A8D4" opacity="0.65" />
    {/* Grass Tufts */}
    <rect x="24" y="114" width="6" height="4" fill="#F5A6C8" />
    <rect x="128" y="122" width="8" height="4" fill="#F5A6C8" />
    <rect x="246" y="118" width="6" height="4" fill="#F5A6C8" />
    <rect x="320" y="128" width="8" height="4" fill="#F5A6C8" />
  </svg>
);
