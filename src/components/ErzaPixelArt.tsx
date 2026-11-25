import React from 'react';

interface PixelProps {
  size?: number;
  className?: string;
  color?: string;
}

export const PixelStar: React.FC<PixelProps> = ({
  size = 22,
  className = '',
  color = '#D9A0A9',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    shapeRendering="crispEdges"
    className={`pixelated shrink-0 ${className}`}
    aria-hidden="true"
  >
    <path
      d="M6 0h2v3h2v2h4v2h-3v2h1v3h-2v-1H8v1H6v-1H4v1H2V9h1V7H0V5h4V3h2V0z"
      fill="#190D13"
    />
    <path
      d="M6 1h2v3h2v2h3v1h-3v2h1v2H9v-1H5v1H3V9h1V7H1V6h3V4h2V1z"
      fill={color}
    />
    <rect x="6" y="4" width="2" height="2" fill="#F5E9E6" />
  </svg>
);

export const PixelCloud: React.FC<PixelProps> = ({
  size = 28,
  className = '',
  color = '#F5E9E6',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 12"
    fill="none"
    shapeRendering="crispEdges"
    className={`pixelated shrink-0 ${className}`}
    aria-hidden="true"
  >
    <path d="M5 2h5v1h2v2h3v4H1V5h2V3h2V2z" fill="#190D13" />
    <path d="M5 3h5v1h2v2h2v2H2V6h2V4h1V3z" fill={color} />
    <rect x="5" y="4" width="4" height="1" fill="#F5E9E6" />
  </svg>
);

export const PixelSmiley: React.FC<PixelProps> = ({
  size = 24,
  className = '',
  color = '#D8C4C1',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    shapeRendering="crispEdges"
    className={`pixelated shrink-0 ${className}`}
    aria-hidden="true"
  >
    <rect x="3" y="1" width="8" height="12" fill="#190D13" />
    <rect x="1" y="3" width="12" height="8" fill="#190D13" />
    <rect x="3" y="2" width="8" height="10" fill={color} />
    <rect x="2" y="3" width="10" height="8" fill={color} />
    <rect x="3" y="3" width="2" height="1" fill="#F5E9E6" />
    <rect x="4" y="4" width="2" height="2" fill="#190D13" />
    <rect x="8" y="4" width="2" height="2" fill="#190D13" />
    <rect x="4" y="8" width="1" height="1" fill="#190D13" />
    <rect x="5" y="9" width="4" height="1" fill="#190D13" />
    <rect x="9" y="8" width="1" height="1" fill="#190D13" />
  </svg>
);

export const PixelFlowerIcon: React.FC<PixelProps> = ({ size = 26, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    shapeRendering="crispEdges"
    className={`pixelated shrink-0 ${className}`}
    aria-hidden="true"
  >
    <rect x="6" y="2" width="4" height="2" fill="#D9A0A9" />
    <rect x="4" y="4" width="8" height="4" fill="#B76E79" />
    <rect x="6" y="8" width="4" height="2" fill="#D9A0A9" />
    <rect x="6" y="5" width="4" height="2" fill="#F5E9E6" />
    <rect x="7" y="10" width="2" height="5" fill="#800F2F" />
    <rect x="5" y="12" width="2" height="2" fill="#922B45" />
    <rect x="9" y="11" width="2" height="2" fill="#922B45" />
  </svg>
);

export const PixelNoteEnvelope: React.FC<PixelProps> = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 14"
    fill="none"
    shapeRendering="crispEdges"
    className={`pixelated shrink-0 ${className}`}
    aria-hidden="true"
  >
    <rect x="1" y="2" width="14" height="10" fill="#190D13" />
    <rect x="2" y="3" width="12" height="8" fill="#F5E9E6" />
    <path d="M2 3h12v2h-2v1h-2v1H6V6H4V5H2V3z" fill="#922B45" />
    <rect x="7" y="6" width="2" height="2" fill="#800F2F" />
    <rect x="6" y="5" width="4" height="1" fill="#190D13" />
  </svg>
);

export const PixelMusicIcon: React.FC<PixelProps> = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    shapeRendering="crispEdges"
    className={`pixelated shrink-0 ${className}`}
    aria-hidden="true"
  >
    <rect x="5" y="2" width="8" height="2" fill="#190D13" />
    <rect x="6" y="3" width="6" height="2" fill="#D9A0A9" />
    <rect x="5" y="4" width="2" height="8" fill="#922B45" />
    <rect x="11" y="4" width="2" height="7" fill="#922B45" />
    <rect x="2" y="10" width="5" height="4" fill="#190D13" />
    <rect x="3" y="11" width="3" height="2" fill="#F5E9E6" />
    <rect x="8" y="9" width="5" height="4" fill="#190D13" />
    <rect x="9" y="10" width="3" height="2" fill="#F5E9E6" />
  </svg>
);

export const PixelGamepadIcon: React.FC<PixelProps> = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 14"
    fill="none"
    shapeRendering="crispEdges"
    className={`pixelated shrink-0 ${className}`}
    aria-hidden="true"
  >
    <rect x="2" y="3" width="12" height="8" fill="#190D13" />
    <rect x="3" y="4" width="10" height="6" fill="#800F2F" />
    <rect x="4" y="6" width="3" height="1" fill="#F5E9E6" />
    <rect x="5" y="5" width="1" height="3" fill="#F5E9E6" />
    <rect x="10" y="5" width="1" height="1" fill="#D8C4C1" />
    <rect x="11" y="7" width="1" height="1" fill="#D9A0A9" />
  </svg>
);

export const PixelTrophyBadge: React.FC<PixelProps> = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    shapeRendering="crispEdges"
    className={`pixelated shrink-0 ${className}`}
    aria-hidden="true"
  >
    <rect x="4" y="2" width="8" height="2" fill="#190D13" />
    <rect x="2" y="3" width="2" height="4" fill="#922B45" />
    <rect x="12" y="3" width="2" height="4" fill="#922B45" />
    <rect x="4" y="3" width="8" height="6" fill="#D8C4C1" />
    <rect x="5" y="4" width="2" height="3" fill="#F5E9E6" />
    <rect x="6" y="9" width="4" height="3" fill="#922B45" />
    <rect x="4" y="12" width="8" height="2" fill="#190D13" />
  </svg>
);

export const PixelHeroSprite: React.FC<PixelProps> = ({ size = 26, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    shapeRendering="crispEdges"
    className={`pixelated shrink-0 ${className}`}
    aria-hidden="true"
  >
    {/* Cute Maroon-Cap Pixel Player 1 Buddy */}
    <rect x="5" y="1" width="6" height="2" fill="#641C32" />
    <rect x="4" y="3" width="9" height="2" fill="#922B45" />
    <rect x="5" y="5" width="6" height="4" fill="#F5E9E6" />
    <rect x="6" y="6" width="1" height="2" fill="#190D13" />
    <rect x="9" y="6" width="1" height="2" fill="#190D13" />
    <rect x="4" y="9" width="8" height="4" fill="#800F2F" />
    <rect x="5" y="13" width="2" height="2" fill="#190D13" />
    <rect x="9" y="13" width="2" height="2" fill="#190D13" />
  </svg>
);
