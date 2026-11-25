import React, { useEffect, useRef, useState } from 'react';
import { erzaAudio } from '../../audio/erzaAudio';
import {
  PixelCloud,
  PixelFlowerIcon,
  PixelGamepadIcon,
  PixelHeroSprite,
  PixelSmiley,
  PixelStar,
  PixelTrophyBadge,
} from '../../components/ErzaPixelArt';
import { DirectionInput, MiniGameId, ThemeMode } from '../../types/erza';

interface ErzaMiniGamesScreenProps {
  themeMode: ThemeMode;
  bestCatchScore: number;
  bestAdventureScore: number;
  bestMemoryMoves: number | null;
  onUpdateScores: (patch: {
    bestCatchScore?: number;
    bestAdventureScore?: number;
    bestMemoryMoves?: number;
  }) => void;
  onBackHome: () => void;
  heldDirectionRef: React.MutableRefObject<DirectionInput | null>;
  navSignal: { dir: DirectionInput; tick: number } | null;
  confirmTrigger: number;
  activeGameId: MiniGameId;
  onChangeGameId: (id: MiniGameId) => void;
}

/* ---------------- GAME 01: CATCH THE CLOUDS ---------------- */
type FallingKind = 'STAR' | 'CLOUD' | 'GOLD_STAR';
interface FallingObj {
  id: number;
  kind: FallingKind;
  x: number;
  y: number;
  speed: number;
  points: number;
}

const CatchCloudsGame: React.FC<{
  bestScore: number;
  onSaveScore: (score: number) => void;
  heldDirectionRef: React.MutableRefObject<DirectionInput | null>;
  confirmTrigger: number;
  onExit: () => void;
}> = ({ bestScore, onSaveScore, heldDirectionRef, confirmTrigger, onExit }) => {
  const [phase, setPhase] = useState<'PLAYING' | 'OVER'>('PLAYING');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playerX, setPlayerX] = useState(50);
  const [items, setItems] = useState<FallingObj[]>([]);

  const playerRef = useRef(50);
  const scoreRef = useRef(0);
  const itemIdRef = useRef(1);
  const arenaRef = useRef<HTMLDivElement | null>(null);

  const resetGame = () => {
    erzaAudio.playConfirm();
    playerRef.current = 50;
    scoreRef.current = 0;
    setPlayerX(50);
    setScore(0);
    setTimeLeft(30);
    setItems([]);
    setPhase('PLAYING');
  };

  useEffect(() => {
    if (confirmTrigger === 0) return;
    if (phase === 'OVER') resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmTrigger]);

  useEffect(() => {
    if (phase !== 'PLAYING') return;
    const t = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase('OVER');
          onSaveScore(scoreRef.current);
          erzaAudio.playGameWin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [phase, onSaveScore]);

  useEffect(() => {
    if (phase !== 'PLAYING') return;
    let spawnAcc = 0;
    let elapsed = 0;
    let last = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.06);
      last = now;
      elapsed += dt;

      const dir = heldDirectionRef.current;
      if (dir === 'LEFT') {
        playerRef.current = Math.max(9, playerRef.current - 98 * dt);
        setPlayerX(playerRef.current);
      } else if (dir === 'RIGHT') {
        playerRef.current = Math.min(91, playerRef.current + 98 * dt);
        setPlayerX(playerRef.current);
      }

      const difficulty = 1 + elapsed * 0.032;
      const interval = Math.max(0.32, 0.62 - elapsed * 0.01);
      spawnAcc += dt;
      const shouldSpawn = spawnAcc >= interval;
      if (shouldSpawn) spawnAcc = 0;

      setItems((prev) => {
        const next: FallingObj[] = [];
        for (const obj of prev) {
          const ny = obj.y + obj.speed * dt;
          const caught =
            ny >= 76 && ny <= 92 && Math.abs(obj.x - playerRef.current) <= 12.5;
          if (caught) {
            scoreRef.current += obj.points;
            setScore(scoreRef.current);
            erzaAudio.playCatchPoint();
          } else if (ny < 103) {
            next.push({ ...obj, y: ny });
          }
        }
        if (shouldSpawn) {
          const roll = Math.random();
          const kind: FallingKind =
            roll < 0.55 ? 'STAR' : roll < 0.85 ? 'CLOUD' : 'GOLD_STAR';
          const points = kind === 'STAR' ? 10 : kind === 'CLOUD' ? 15 : 25;
          next.push({
            id: itemIdRef.current++,
            kind,
            x: 10 + Math.random() * 80,
            y: -6,
            speed: (36 + Math.random() * 22) * difficulty,
            points,
          });
        }
        return next;
      });

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [phase, heldDirectionRef]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== 'PLAYING' || !arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const pct = Math.max(9, Math.min(91, ((e.clientX - rect.left) / rect.width) * 100));
    playerRef.current = pct;
    setPlayerX(pct);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between text-[8px] font-pixel px-1 mb-1.5 shrink-0 text-[#F5E9E6] bg-[#4A101F] rounded-md py-1">
        <span>SCORE: {score}</span>
        <span>TIME: {timeLeft}s</span>
        <span>BEST: {bestScore}</span>
      </div>

      <div
        ref={arenaRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerMove}
        className="flex-1 relative rounded-xl bg-gradient-to-b from-[#4A101F] via-[#800F2F] to-[#D9A0A9] border-2 border-[#190D13] overflow-hidden touch-none select-none cursor-ew-resize"
      >
        {items.map((obj) => (
          <div
            key={obj.id}
            style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            {obj.kind === 'STAR' && <PixelStar size={19} color="#F5E9E6" />}
            {obj.kind === 'GOLD_STAR' && <PixelStar size={22} color="#D8C4C1" />}
            {obj.kind === 'CLOUD' && <PixelCloud size={26} color="#F5E9E6" />}
          </div>
        ))}

        {/* Pixel Character Catcher */}
        <div
          style={{ left: `${playerX}%`, bottom: '6%' }}
          className="absolute -translate-x-1/2 pointer-events-none flex flex-col items-center"
        >
          <PixelHeroSprite size={28} />
        </div>

        {phase === 'OVER' && (
          <div className="absolute inset-0 bg-[#190D13]/92 flex flex-col items-center justify-center p-4 text-center">
            <PixelTrophyBadge size={30} className="mb-2" />
            <h3 className="font-pixel text-[9px] text-[#F5E9E6]">
              AMAZING JOB, PLAYER 1!
            </h3>
            <p className="mt-2 font-vt text-[20px] text-[#D8C4C1]">
              FINAL SCORE: {score} PTS
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={resetGame}
                className="px-3 py-1.5 rounded-lg bg-[#800F2F] border border-[#F5E9E6] text-[#F5E9E6] font-pixel text-[7.5px] cursor-pointer hover:brightness-110"
              >
                PLAY AGAIN
              </button>
              <button
                type="button"
                onClick={onExit}
                className="px-3 py-1.5 rounded-lg bg-[#4A101F] border border-[#D9A0A9] text-[#F5E9E6] font-pixel text-[7.5px] cursor-pointer"
              >
                GAMES
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between text-[8px] font-silk text-[#D8C4C1] shrink-0">
        <span>◀ ▶ MOVE PLAYER</span>
        <span>STAR +10 · CLOUD +15 · CHAMPAGNE +25</span>
      </div>
    </div>
  );
};

/* ---------------- GAME 02: MEMORY MATCH ---------------- */
type SymbolKind = 'STAR' | 'CLOUD' | 'SMILEY' | 'FLOWER' | 'CONTROLLER' | 'TROPHY';
interface MemCard {
  uid: number;
  kind: SymbolKind;
  flipped: boolean;
  matched: boolean;
}

function createShuffledDeck(): MemCard[] {
  const kinds: SymbolKind[] = ['STAR', 'CLOUD', 'SMILEY', 'FLOWER', 'CONTROLLER', 'TROPHY'];
  const doubled = [...kinds, ...kinds];
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled.map((kind, uid) => ({
    uid,
    kind,
    flipped: false,
    matched: false,
  }));
}

const MemoryMatchGame: React.FC<{
  bestMoves: number | null;
  onSaveMoves: (moves: number) => void;
  navSignal: { dir: DirectionInput; tick: number } | null;
  confirmTrigger: number;
  onExit: () => void;
}> = ({ bestMoves, onSaveMoves, navSignal, confirmTrigger, onExit }) => {
  const [cards, setCards] = useState<MemCard[]>(() => createShuffledDeck());
  const [cursor, setCursor] = useState(0);
  const [moves, setMoves] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [openIndices, setOpenIndices] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);

  const allMatched = cards.every((c) => c.matched);

  useEffect(() => {
    if (allMatched) return;
    const t = window.setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(t);
  }, [allMatched]);

  const restart = () => {
    erzaAudio.playConfirm();
    setCards(createShuffledDeck());
    setCursor(0);
    setMoves(0);
    setElapsedSec(0);
    setOpenIndices([]);
    setLocked(false);
  };

  useEffect(() => {
    if (!navSignal) return;
    erzaAudio.playNav();
    setCursor((prev) => {
      if (navSignal.dir === 'RIGHT') return (prev + 1) % 12;
      if (navSignal.dir === 'LEFT') return (prev + 11) % 12;
      if (navSignal.dir === 'DOWN') return (prev + 4) % 12;
      return (prev + 8) % 12;
    });
  }, [navSignal]);

  useEffect(() => {
    if (confirmTrigger === 0) return;
    if (allMatched) restart();
    else handleFlip(cursor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmTrigger]);

  const handleFlip = (idx: number) => {
    if (locked || allMatched) return;
    const target = cards[idx];
    if (!target || target.flipped || target.matched) return;

    erzaAudio.playClick();
    const updated = cards.map((c, i) => (i === idx ? { ...c, flipped: true } : c));
    setCards(updated);

    const nextOpen = [...openIndices, idx];
    setOpenIndices(nextOpen);

    if (nextOpen.length === 2) {
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      const [firstIdx, secondIdx] = nextOpen;
      if (updated[firstIdx].kind === updated[secondIdx].kind) {
        erzaAudio.playCatchPoint();
        const matchedDeck = updated.map((c, i) =>
          i === firstIdx || i === secondIdx ? { ...c, matched: true } : c
        );
        setCards(matchedDeck);
        setOpenIndices([]);
        if (matchedDeck.every((c) => c.matched)) {
          erzaAudio.playGameWin();
          onSaveMoves(nextMoves);
        }
      } else {
        setLocked(true);
        window.setTimeout(() => {
          setCards((curr) =>
            curr.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, flipped: false } : c
            )
          );
          setOpenIndices([]);
          setLocked(false);
        }, 600);
      }
    }
  };

  const renderSymbol = (kind: SymbolKind) => {
    switch (kind) {
      case 'STAR':
        return <PixelStar size={22} color="#800F2F" />;
      case 'CLOUD':
        return <PixelCloud size={24} color="#B76E79" />;
      case 'SMILEY':
        return <PixelSmiley size={22} color="#D8C4C1" />;
      case 'FLOWER':
        return <PixelFlowerIcon size={22} />;
      case 'CONTROLLER':
        return <PixelGamepadIcon size={24} />;
      case 'TROPHY':
        return <PixelTrophyBadge size={22} />;
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex items-center justify-between text-[7.5px] font-pixel px-2 mb-1.5 text-[#F5E9E6] bg-[#4A101F] rounded-md py-1 shrink-0">
        <span>MOVES: {moves}</span>
        <span>TIME: {elapsedSec}s</span>
        <span>BEST: {bestMoves !== null ? `${bestMoves}` : '-'}</span>
      </div>

      <div className="flex-1 grid grid-cols-4 grid-rows-3 gap-1.5">
        {cards.map((card, idx) => {
          const shown = card.flipped || card.matched;
          const isCursor = cursor === idx;
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => {
                setCursor(idx);
                handleFlip(idx);
              }}
              className={`card-perspective cursor-pointer rounded-lg focus:outline-none ${
                isCursor ? 'ring-2 ring-[#F5E9E6]' : ''
              }`}
            >
              <div className={`card-inner-3d ${shown ? 'is-flipped' : ''}`}>
                <div className="card-face rounded-lg bg-[#4A101F] border-2 border-[#D9A0A9] flex items-center justify-center shadow-sm">
                  <span className="font-pixel text-[9px] text-[#D8C4C1]">?</span>
                </div>
                <div
                  className={`card-face card-face-back rounded-lg border-2 flex items-center justify-center ${
                    card.matched
                      ? 'bg-[#D8C4C1] border-[#800F2F]'
                      : 'bg-[#F5E9E6] border-[#800F2F]'
                  }`}
                >
                  {renderSymbol(card.kind)}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {allMatched && (
        <div className="absolute inset-0 bg-[#190D13]/92 rounded-xl flex flex-col items-center justify-center p-4 text-center z-10">
          <PixelStar size={26} color="#D8C4C1" className="mb-2" />
          <h3 className="font-pixel text-[8.5px] text-[#F5E9E6] leading-relaxed">
            PERFECT MATCH! WELL PLAYED!
          </h3>
          <p className="mt-1.5 font-vt text-[19px] text-[#D9A0A9]">
            {moves} MOVES IN {elapsedSec}s!
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={restart}
              className="px-3 py-1.5 rounded-lg bg-[#800F2F] border border-[#F5E9E6] text-[#F5E9E6] font-pixel text-[7.5px] cursor-pointer"
            >
              PLAY AGAIN
            </button>
            <button
              type="button"
              onClick={onExit}
              className="px-3 py-1.5 rounded-lg bg-[#4A101F] border border-[#D9A0A9] text-[#F5E9E6] font-pixel text-[7.5px] cursor-pointer"
            >
              GAMES
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- GAME 03: PIXEL ADVENTURE ---------------- */
interface AdvEntity {
  id: number;
  kind: 'STAR' | 'STORM_CLOUD' | 'SPIKE';
  x: number; // % from left
  y: number; // % from bottom (ground is 14)
  speed: number;
}

const PixelAdventureGame: React.FC<{
  bestScore: number;
  onSaveScore: (score: number) => void;
  heldDirectionRef: React.MutableRefObject<DirectionInput | null>;
  navSignal: { dir: DirectionInput; tick: number } | null;
  confirmTrigger: number;
  onExit: () => void;
}> = ({ bestScore, onSaveScore, heldDirectionRef, navSignal, confirmTrigger, onExit }) => {
  const [phase, setPhase] = useState<'PLAYING' | 'WIN' | 'OVER'>('PLAYING');
  const [playerX, setPlayerX] = useState(20);
  const [playerY, setPlayerY] = useState(14);
  const [score, setScore] = useState(0);
  const [entities, setEntities] = useState<AdvEntity[]>([]);

  const pxRef = useRef(20);
  const pyRef = useRef(14);
  const vyRef = useRef(0);
  const scoreRef = useRef(0);
  const idRef = useRef(1);

  const WIN_GOAL = 150;

  const triggerJump = () => {
    if (phase !== 'PLAYING') return;
    if (pyRef.current <= 15.5) {
      vyRef.current = 128;
      erzaAudio.playJump();
    }
  };

  const restart = () => {
    erzaAudio.playConfirm();
    pxRef.current = 20;
    pyRef.current = 14;
    vyRef.current = 0;
    scoreRef.current = 0;
    setPlayerX(20);
    setPlayerY(14);
    setScore(0);
    setEntities([]);
    setPhase('PLAYING');
  };

  useEffect(() => {
    if (navSignal?.dir === 'UP') {
      triggerJump();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navSignal]);

  useEffect(() => {
    if (confirmTrigger === 0) return;
    if (phase !== 'PLAYING') restart();
    else triggerJump();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmTrigger]);

  useEffect(() => {
    if (phase !== 'PLAYING') return;
    let spawnAcc = 0;
    let surviveAcc = 0;
    let totalElapsed = 0;
    let last = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.055);
      last = now;
      totalElapsed += dt;

      // Left / right exploration
      const dir = heldDirectionRef.current;
      if (dir === 'LEFT') {
        pxRef.current = Math.max(8, pxRef.current - 58 * dt);
        setPlayerX(pxRef.current);
      } else if (dir === 'RIGHT') {
        pxRef.current = Math.min(82, pxRef.current + 58 * dt);
        setPlayerX(pxRef.current);
      } else if (dir === 'UP') {
        if (pyRef.current <= 15.5) {
          vyRef.current = 128;
          erzaAudio.playJump();
        }
      }

      // Gravity jump physics
      if (pyRef.current > 14 || vyRef.current > 0) {
        vyRef.current -= 310 * dt;
        pyRef.current += vyRef.current * dt;
        if (pyRef.current <= 14) {
          pyRef.current = 14;
          vyRef.current = 0;
        }
        setPlayerY(pyRef.current);
      }

      surviveAcc += dt * 4;
      if (surviveAcc >= 1) {
        const pt = Math.floor(surviveAcc);
        surviveAcc -= pt;
        scoreRef.current += pt;
        setScore(scoreRef.current);
      }

      if (scoreRef.current >= WIN_GOAL) {
        onSaveScore(scoreRef.current);
        erzaAudio.playGameWin();
        setPhase('WIN');
        return;
      }

      const speedMult = 1 + Math.min(1.1, totalElapsed * 0.03);
      const spawnInterval = Math.max(0.68, 1.15 - totalElapsed * 0.015);
      spawnAcc += dt;
      const shouldSpawn = spawnAcc >= spawnInterval;
      if (shouldSpawn) spawnAcc = 0;

      let crashed = false;
      setEntities((prev) => {
        const next: AdvEntity[] = [];
        for (const ent of prev) {
          const nx = ent.x - ent.speed * dt;
          const dx = Math.abs(nx - pxRef.current);
          const dy = Math.abs(ent.y - pyRef.current);
          const hit = dx <= 8 && dy <= 11;
          if (hit) {
            if (ent.kind === 'STAR') {
              scoreRef.current += 15;
              setScore(scoreRef.current);
              erzaAudio.playCatchPoint();
              continue;
            } else {
              crashed = true;
            }
          }
          if (nx > -10) {
            next.push({ ...ent, x: nx });
          }
        }
        if (shouldSpawn) {
          const r = Math.random();
          if (r < 0.48) {
            next.push({
              id: idRef.current++,
              kind: 'STAR',
              x: 106,
              y: Math.random() < 0.5 ? 24 : 44,
              speed: 38 * speedMult,
            });
          } else if (r < 0.78) {
            next.push({
              id: idRef.current++,
              kind: 'SPIKE',
              x: 106,
              y: 14,
              speed: 42 * speedMult,
            });
          } else {
            next.push({
              id: idRef.current++,
              kind: 'STORM_CLOUD',
              x: 106,
              y: 38,
              speed: 44 * speedMult,
            });
          }
        }
        return next;
      });

      if (crashed) {
        erzaAudio.playGameFail();
        onSaveScore(scoreRef.current);
        setPhase('OVER');
        return;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [phase, heldDirectionRef, onSaveScore]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between text-[7.5px] font-pixel px-2 mb-1.5 text-[#F5E9E6] bg-[#4A101F] rounded-md py-1 shrink-0">
        <span>
          SCORE: {score}/{WIN_GOAL}
        </span>
        <span>BEST: {bestScore}</span>
      </div>

      {/* Dreamy Burgundy Side-Scrolling Arena */}
      <div
        onPointerDown={triggerJump}
        className="flex-1 relative rounded-xl bg-gradient-to-b from-[#4A101F] via-[#800F2F] to-[#D9A0A9] border-2 border-[#190D13] overflow-hidden touch-none select-none cursor-pointer"
      >
        {/* Ground platform */}
        <div className="absolute bottom-0 inset-x-0 h-[14%] bg-[#641C32] border-t-2 border-[#190D13]" />

        {/* Obstacles & Stars */}
        {entities.map((ent) => (
          <div
            key={ent.id}
            style={{ left: `${ent.x}%`, bottom: `${ent.y}%` }}
            className="absolute -translate-x-1/2 pointer-events-none"
          >
            {ent.kind === 'STAR' && <PixelStar size={19} color="#D8C4C1" />}
            {ent.kind === 'STORM_CLOUD' && <PixelCloud size={26} color="#190D13" />}
            {ent.kind === 'SPIKE' && (
              <div className="w-5 h-5 bg-[#190D13] border-2 border-[#F5E9E6] rotate-45 translate-y-2" />
            )}
          </div>
        ))}

        {/* Player Character */}
        <div
          style={{ left: `${playerX}%`, bottom: `${playerY}%` }}
          className="absolute -translate-x-1/2 pointer-events-none"
        >
          <PixelHeroSprite size={26} />
        </div>

        {(phase === 'OVER' || phase === 'WIN') && (
          <div className="absolute inset-0 bg-[#190D13]/92 flex flex-col items-center justify-center p-4 text-center">
            {phase === 'WIN' ? (
              <PixelTrophyBadge size={30} className="mb-2" />
            ) : (
              <PixelCloud size={28} color="#D9A0A9" className="mb-2" />
            )}
            <h3 className="font-pixel text-[9px] text-[#F5E9E6]">
              {phase === 'WIN' ? 'LEVEL COMPLETED!' : 'GAME OVER!'}
            </h3>
            <p className="mt-1.5 font-vt text-[20px] text-[#D8C4C1]">
              SCORE: {score} PTS
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  restart();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#800F2F] border border-[#F5E9E6] text-[#F5E9E6] font-pixel text-[7.5px] cursor-pointer"
              >
                PLAY AGAIN
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExit();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#4A101F] border border-[#D9A0A9] text-[#F5E9E6] font-pixel text-[7.5px] cursor-pointer"
              >
                GAMES
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between text-[8px] font-silk text-[#D8C4C1] shrink-0">
        <span>◀ ▶ MOVE · TAP / ▲ / A = JUMP</span>
        <span>GOAL: {WIN_GOAL} PTS</span>
      </div>
    </div>
  );
};

/* ---------------- MINI GAMES HUB ---------------- */
export const ErzaMiniGamesScreen: React.FC<ErzaMiniGamesScreenProps> = ({
  themeMode,
  bestCatchScore,
  bestAdventureScore,
  bestMemoryMoves,
  onUpdateScores,
  onBackHome,
  heldDirectionRef,
  navSignal,
  confirmTrigger,
  activeGameId,
  onChangeGameId,
}) => {
  const [menuCursor, setMenuCursor] = useState(0);
  const isNight = themeMode === 'NIGHT';

  const games: { id: MiniGameId; title: string; desc: string; best: string }[] = [
    {
      id: 'CATCH_CLOUDS',
      title: '01. CATCH THE CLOUDS',
      desc: 'Catch falling stars & clouds in 30s!',
      best: `BEST: ${bestCatchScore}`,
    },
    {
      id: 'MEMORY_MATCH',
      title: '02. MEMORY MATCH',
      desc: 'Match 12 cards across 6 retro pairs.',
      best: bestMemoryMoves !== null ? `BEST: ${bestMemoryMoves}` : 'NEW',
    },
    {
      id: 'PIXEL_ADVENTURE',
      title: '03. PIXEL ADVENTURE',
      desc: 'Jump over obstacles & collect stars!',
      best: `BEST: ${bestAdventureScore}`,
    },
  ];

  useEffect(() => {
    if (activeGameId !== 'MENU' || !navSignal) return;
    if (navSignal.dir === 'DOWN') {
      erzaAudio.playNav();
      setMenuCursor((prev) => (prev + 1) % games.length);
    } else if (navSignal.dir === 'UP') {
      erzaAudio.playNav();
      setMenuCursor((prev) => (prev + games.length - 1) % games.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navSignal, activeGameId]);

  useEffect(() => {
    if (activeGameId !== 'MENU' || confirmTrigger === 0) return;
    erzaAudio.playConfirm();
    onChangeGameId(games[menuCursor].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmTrigger, activeGameId]);

  return (
    <div className="h-full flex flex-col p-3 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-2 shrink-0 gap-2">
        <button
          type="button"
          onClick={() => {
            erzaAudio.playBack();
            if (activeGameId === 'MENU') onBackHome();
            else onChangeGameId('MENU');
          }}
          className={`px-2 py-1 rounded-md font-pixel text-[7.5px] border cursor-pointer shrink-0 ${
            isNight
              ? 'bg-[#190D13]/85 border-[#D9A0A9]/55 text-[#F5E9E6] hover:bg-[#800F2F]'
              : 'bg-[#F5E9E6] border-[#800F2F]/65 text-[#4A101F] hover:bg-[#D8C4C1]'
          }`}
        >
          {activeGameId === 'MENU' ? '◀ MENU' : '◀ GAMES'}
        </button>

        <div className="flex items-center gap-1.5 min-w-0">
          <PixelGamepadIcon size={16} />
          <span
            className={`font-pixel text-[7.5px] truncate ${
              isNight ? 'text-[#F5E9E6]' : 'text-[#4A101F]'
            }`}
          >
            {activeGameId === 'MENU'
              ? "LET'S PLAY, AUCLAIR!"
              : games.find((g) => g.id === activeGameId)?.title}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0">
        {activeGameId === 'MENU' && (
          <div className="h-full flex flex-col justify-center gap-2.5">
            {games.map((g, idx) => {
              const selected = menuCursor === idx;
              return (
                <button
                  key={g.id}
                  type="button"
                  onMouseEnter={() => setMenuCursor(idx)}
                  onClick={() => {
                    erzaAudio.playConfirm();
                    onChangeGameId(g.id);
                  }}
                  className={`w-full text-left rounded-xl p-2.5 border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    selected
                      ? 'bg-[#800F2F] border-[#F5E9E6] text-[#F5E9E6] shadow-[0_3px_0_#190D13]'
                      : isNight
                      ? 'bg-[#4A101F]/90 border-[#922B45]/60 text-[#F5E9E6] hover:border-[#D9A0A9]'
                      : 'bg-[#F5E9E6]/95 border-[#B76E79] text-[#4A101F] hover:bg-[#D8C4C1]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-pixel text-[8px] truncate">{g.title}</div>
                    <div
                      className={`mt-1 font-vt text-[16px] leading-none truncate ${
                        selected
                          ? 'text-[#F5E9E6]'
                          : isNight
                          ? 'text-[#D8C4C1]'
                          : 'text-[#641C32]'
                      }`}
                    >
                      {g.desc}
                    </div>
                  </div>
                  <span
                    className={`font-pixel text-[7px] shrink-0 px-2 py-1 rounded ${
                      selected
                        ? 'bg-[#190D13]/45 text-[#F5E9E6]'
                        : isNight
                        ? 'bg-[#190D13]/70 text-[#D9A0A9]'
                        : 'bg-[#D8C4C1] text-[#4A101F]'
                    }`}
                  >
                    {g.best}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {activeGameId === 'CATCH_CLOUDS' && (
          <CatchCloudsGame
            bestScore={bestCatchScore}
            onSaveScore={(s) => {
              if (s > bestCatchScore) onUpdateScores({ bestCatchScore: s });
            }}
            heldDirectionRef={heldDirectionRef}
            confirmTrigger={confirmTrigger}
            onExit={() => onChangeGameId('MENU')}
          />
        )}

        {activeGameId === 'MEMORY_MATCH' && (
          <MemoryMatchGame
            bestMoves={bestMemoryMoves}
            onSaveMoves={(m) => {
              if (bestMemoryMoves === null || m < bestMemoryMoves) {
                onUpdateScores({ bestMemoryMoves: m });
              }
            }}
            navSignal={navSignal}
            confirmTrigger={confirmTrigger}
            onExit={() => onChangeGameId('MENU')}
          />
        )}

        {activeGameId === 'PIXEL_ADVENTURE' && (
          <PixelAdventureGame
            bestScore={bestAdventureScore}
            onSaveScore={(s) => {
              if (s > bestAdventureScore) onUpdateScores({ bestAdventureScore: s });
            }}
            heldDirectionRef={heldDirectionRef}
            navSignal={navSignal}
            confirmTrigger={confirmTrigger}
            onExit={() => onChangeGameId('MENU')}
          />
        )}
      </div>
    </div>
  );
};
