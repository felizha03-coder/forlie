import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Gamepad2, Grid, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { ConsoleButtonId, MiniGameId } from '../../types/lie';
import { lieAudio } from '../../audio/lieAudio';
import { getHighScores, updateHighScore } from '../../utils/lieStorage';

interface MiniGamesProps {
  onBack: () => void;
  navSignal: { seq: number; btn: ConsoleButtonId } | null;
}

type SnakeDir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_W = 16;
const GRID_H = 12;

interface FallingObj {
  id: number;
  x: number;
  y: number;
  kind: 'STAR' | 'HAZARD';
  speed: number;
}

interface MemoryTile {
  uid: number;
  pairId: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

const SYMBOLS = ['✦', '◆', '▲', '●', '★', '◈'];

function createShuffledDeck(): MemoryTile[] {
  const deck = [...SYMBOLS, ...SYMBOLS].map((symbol, i) => ({
    uid: i,
    pairId: i % SYMBOLS.length,
    symbol,
    flipped: false,
    matched: false,
  }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export const MiniGames: React.FC<MiniGamesProps> = ({ onBack, navSignal }) => {
  const [activeGame, setActiveGame] = useState<MiniGameId | null>(null);
  const [menuIdx, setMenuIdx] = useState(0);
  const [highScores, setHighScores] = useState(() => getHighScores());
  const lastSeqRef = useRef<number>(navSignal?.seq ?? 0);

  /* -------- 01. PIXEL SNAKE STATE -------- */
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 6, y: 6 },
    { x: 5, y: 6 },
    { x: 4, y: 6 },
  ]);
  const snakeDirRef = useRef<SnakeDir>('RIGHT');
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 11, y: 6 });
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeOver, setSnakeOver] = useState(false);

  const resetSnake = useCallback(() => {
    setSnake([
      { x: 6, y: 6 },
      { x: 5, y: 6 },
      { x: 4, y: 6 },
    ]);
    snakeDirRef.current = 'RIGHT';
    setFood({ x: 11, y: 6 });
    setSnakeScore(0);
    setSnakeOver(false);
  }, []);

  /* -------- 02. CATCH THE STARS STATE -------- */
  const [catcherX, setCatcherX] = useState(50);
  const catcherXRef = useRef(50);
  const [fallingItems, setFallingItems] = useState<FallingObj[]>([]);
  const [starsScore, setStarsScore] = useState(0);
  const [starsLives, setStarsLives] = useState(3);
  const [starsOver, setStarsOver] = useState(false);
  const objIdRef = useRef(1);

  const resetStars = useCallback(() => {
    catcherXRef.current = 50;
    setCatcherX(50);
    setFallingItems([]);
    setStarsScore(0);
    setStarsLives(3);
    setStarsOver(false);
  }, []);

  /* -------- 03. MEMORY MATCH STATE -------- */
  const [tiles, setTiles] = useState<MemoryTile[]>(() => createShuffledDeck());
  const [memCursor, setMemCursor] = useState(0);
  const [memMoves, setMemMoves] = useState(0);
  const [selectedPair, setSelectedPair] = useState<number[]>([]);
  const [memLocked, setMemLocked] = useState(false);
  const [memWon, setMemWon] = useState(false);

  const resetMemory = useCallback(() => {
    setTiles(createShuffledDeck());
    setMemCursor(0);
    setMemMoves(0);
    setSelectedPair([]);
    setMemLocked(false);
    setMemWon(false);
  }, []);

  const flipMemoryTile = useCallback(
    (index: number) => {
      if (memLocked || memWon) return;
      const target = tiles[index];
      if (!target || target.flipped || target.matched) return;

      lieAudio.playNav();
      const nextTiles = tiles.map((t, idx) => (idx === index ? { ...t, flipped: true } : t));
      setTiles(nextTiles);

      const nextSelected = [...selectedPair, index];
      setSelectedPair(nextSelected);

      if (nextSelected.length === 2) {
        const [firstIdx, secondIdx] = nextSelected;
        const nextMoves = memMoves + 1;
        setMemMoves(nextMoves);
        setMemLocked(true);

        if (nextTiles[firstIdx].pairId === nextTiles[secondIdx].pairId) {
          lieAudio.playPoint();
          window.setTimeout(() => {
            setTiles((prev) => {
              const updated = prev.map((t, idx) =>
                idx === firstIdx || idx === secondIdx ? { ...t, matched: true } : t
              );
              if (updated.every((t) => t.matched)) {
                setMemWon(true);
                lieAudio.playVictory();
                setHighScores(updateHighScore('MEMORY', nextMoves, true));
              }
              return updated;
            });
            setSelectedPair([]);
            setMemLocked(false);
          }, 260);
        } else {
          window.setTimeout(() => {
            setTiles((prev) =>
              prev.map((t, idx) =>
                idx === firstIdx || idx === secondIdx ? { ...t, flipped: false } : t
              )
            );
            setSelectedPair([]);
            setMemLocked(false);
          }, 580);
        }
      }
    },
    [memLocked, memWon, tiles, selectedPair, memMoves]
  );

  /* -------- SNAKE GAME LOOP -------- */
  useEffect(() => {
    if (activeGame !== 'SNAKE' || snakeOver) return;
    const speedMs = Math.max(95, 195 - Math.floor(snakeScore / 30) * 14);
    const id = window.setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const dir = snakeDirRef.current;
        const nextHead = {
          x: head.x + (dir === 'RIGHT' ? 1 : dir === 'LEFT' ? -1 : 0),
          y: head.y + (dir === 'DOWN' ? 1 : dir === 'UP' ? -1 : 0),
        };

        const hitWall =
          nextHead.x < 0 || nextHead.x >= GRID_W || nextHead.y < 0 || nextHead.y >= GRID_H;
        const hitSelf = prev.some((seg) => seg.x === nextHead.x && seg.y === nextHead.y);
        if (hitWall || hitSelf) {
          setSnakeOver(true);
          lieAudio.playGameOver();
          setHighScores(updateHighScore('SNAKE', snakeScore));
          return prev;
        }

        const ate = nextHead.x === food.x && nextHead.y === food.y;
        const grown = [nextHead, ...prev];
        if (!ate) {
          grown.pop();
        } else {
          lieAudio.playPoint();
          setSnakeScore((s) => {
            const ns = s + 10;
            setHighScores(updateHighScore('SNAKE', ns));
            return ns;
          });
          // Spawn non-overlapping food
          let fx = Math.floor(Math.random() * GRID_W);
          let fy = Math.floor(Math.random() * GRID_H);
          let guard = 0;
          while (grown.some((seg) => seg.x === fx && seg.y === fy) && guard < 40) {
            fx = Math.floor(Math.random() * GRID_W);
            fy = Math.floor(Math.random() * GRID_H);
            guard++;
          }
          setFood({ x: fx, y: fy });
        }
        return grown;
      });
    }, speedMs);
    return () => window.clearInterval(id);
  }, [activeGame, snakeOver, food, snakeScore]);

  /* -------- CATCH THE STARS LOOP -------- */
  useEffect(() => {
    if (activeGame !== 'STARS' || starsOver) return;
    let tickCounter = 0;
    const id = window.setInterval(() => {
      tickCounter++;
      const difficultyBoost = Math.min(2.6, starsScore * 0.015);
      setFallingItems((prev) => {
        const moved: FallingObj[] = [];
        for (const item of prev) {
          const ny = item.y + item.speed;
          const inBasketY = ny >= 80 && ny <= 94;
          const inBasketX = Math.abs(item.x - catcherXRef.current) <= 13;

          if (inBasketY && inBasketX) {
            if (item.kind === 'STAR') {
              lieAudio.playPoint();
              setStarsScore((s) => {
                const ns = s + 10;
                setHighScores(updateHighScore('STARS', ns));
                return ns;
              });
            } else {
              lieAudio.playGameOver();
              setStarsLives((l) => {
                const nl = l - 1;
                if (nl <= 0) {
                  setStarsOver(true);
                }
                return Math.max(0, nl);
              });
            }
            continue;
          }

          if (ny < 102) {
            moved.push({ ...item, y: ny });
          }
        }

        if (tickCounter % 9 === 0) {
          const isHazard = Math.random() < 0.28;
          moved.push({
            id: objIdRef.current++,
            x: 10 + Math.random() * 80,
            y: -4,
            kind: isHazard ? 'HAZARD' : 'STAR',
            speed: (isHazard ? 3.2 : 2.8) + difficultyBoost + Math.random() * 1.1,
          });
        }
        return moved;
      });
    }, 65);
    return () => window.clearInterval(id);
  }, [activeGame, starsOver, starsScore]);

  /* -------- HARDWARE CONSOLE BUTTON HANDLER -------- */
  useEffect(() => {
    if (!navSignal || navSignal.seq <= lastSeqRef.current) return;
    lastSeqRef.current = navSignal.seq;
    const { btn } = navSignal;

    if (!activeGame) {
      if (btn === 'B') {
        lieAudio.playBack();
        onBack();
      } else if (btn === 'UP' || btn === 'LEFT') {
        setMenuIdx((p) => (p - 1 + 3) % 3);
      } else if (btn === 'DOWN' || btn === 'RIGHT') {
        setMenuIdx((p) => (p + 1) % 3);
      } else if (btn === 'A' || btn === 'START') {
        lieAudio.playConfirm();
        const chosen: MiniGameId =
          menuIdx === 0 ? 'SNAKE' : menuIdx === 1 ? 'STARS' : 'MEMORY';
        if (chosen === 'SNAKE') resetSnake();
        if (chosen === 'STARS') resetStars();
        if (chosen === 'MEMORY') resetMemory();
        setActiveGame(chosen);
      }
      return;
    }

    if (btn === 'B') {
      lieAudio.playBack();
      setActiveGame(null);
      return;
    }

    if (activeGame === 'SNAKE') {
      if (snakeOver && (btn === 'A' || btn === 'START')) {
        lieAudio.playConfirm();
        resetSnake();
        return;
      }
      const cur = snakeDirRef.current;
      if (btn === 'UP' && cur !== 'DOWN') snakeDirRef.current = 'UP';
      if (btn === 'DOWN' && cur !== 'UP') snakeDirRef.current = 'DOWN';
      if (btn === 'LEFT' && cur !== 'RIGHT') snakeDirRef.current = 'LEFT';
      if (btn === 'RIGHT' && cur !== 'LEFT') snakeDirRef.current = 'RIGHT';
    } else if (activeGame === 'STARS') {
      if (starsOver && (btn === 'A' || btn === 'START')) {
        lieAudio.playConfirm();
        resetStars();
        return;
      }
      if (btn === 'LEFT') {
        const next = Math.max(10, catcherXRef.current - 12);
        catcherXRef.current = next;
        setCatcherX(next);
      } else if (btn === 'RIGHT') {
        const next = Math.min(90, catcherXRef.current + 12);
        catcherXRef.current = next;
        setCatcherX(next);
      }
    } else if (activeGame === 'MEMORY') {
      if (memWon && (btn === 'A' || btn === 'START')) {
        lieAudio.playConfirm();
        resetMemory();
        return;
      }
      if (btn === 'LEFT') setMemCursor((c) => (c % 4 === 0 ? c + 3 : c - 1));
      if (btn === 'RIGHT') setMemCursor((c) => (c % 4 === 3 ? c - 3 : c + 1));
      if (btn === 'UP') setMemCursor((c) => (c - 4 + 12) % 12);
      if (btn === 'DOWN') setMemCursor((c) => (c + 4) % 12);
      if (btn === 'A' || btn === 'START') flipMemoryTile(memCursor);
    }
  }, [
    navSignal,
    activeGame,
    menuIdx,
    snakeOver,
    starsOver,
    memWon,
    memCursor,
    onBack,
    resetSnake,
    resetStars,
    resetMemory,
    flipMemoryTile,
  ]);

  /* -------- MINI GAMES LOBBY -------- */
  if (!activeGame) {
    const gamesList: {
      id: MiniGameId;
      num: string;
      name: string;
      sub: string;
      best: string;
      icon: React.ReactNode;
    }[] = [
      {
        id: 'SNAKE',
        num: '01',
        name: 'PIXEL SNAKE',
        sub: 'Classic dot-matrix snake survival',
        best: `BEST ${highScores.SNAKE}`,
        icon: <Gamepad2 className="w-3.5 h-3.5 text-[#34D399]" />,
      },
      {
        id: 'STARS',
        num: '02',
        name: 'CATCH THE STARS',
        sub: 'Collect emerald stars, dodge hazards',
        best: `BEST ${highScores.STARS}`,
        icon: <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />,
      },
      {
        id: 'MEMORY',
        num: '03',
        name: 'MEMORY MATCH',
        sub: 'Match all 6 hidden pixel pairs',
        best: highScores.MEMORY > 0 ? `MIN ${highScores.MEMORY} MV` : 'NO RECORD',
        icon: <Grid className="w-3.5 h-3.5 text-[#CBD5E1]" />,
      },
    ];

    return (
      <div className="h-full w-full flex flex-col justify-between p-3 sm:p-3.5 select-none">
        <div className="flex items-center justify-between border-b border-[#10B981]/30 pb-1.5 mb-2">
          <div>
            <h2 className="font-pixel text-[9px] text-[#34D399]">MINI GAMES</h2>
            <p className="font-silk text-[8px] text-[#94A3B8]">SELECT CARTRIDGE ROM</p>
          </div>
          <button
            type="button"
            onClick={() => {
              lieAudio.playBack();
              onBack();
            }}
            className="px-2 py-1 rounded border border-[#334155] bg-[#0B100E] hover:border-[#34D399] font-silk text-[8px] text-[#CBD5E1] flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-2.5 h-2.5" /> MENU
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-2">
          {gamesList.map((g, idx) => {
            const active = idx === menuIdx;
            return (
              <button
                key={g.id}
                type="button"
                onMouseEnter={() => setMenuIdx(idx)}
                onClick={() => {
                  setMenuIdx(idx);
                  lieAudio.playConfirm();
                  if (g.id === 'SNAKE') resetSnake();
                  if (g.id === 'STARS') resetStars();
                  if (g.id === 'MEMORY') resetMemory();
                  setActiveGame(g.id);
                }}
                className={`w-full text-left p-2.5 rounded-lg border flex items-center gap-2.5 cursor-pointer transition-colors ${
                  active
                    ? 'bg-[#10B981]/20 border-[#34D399] shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : 'bg-[#0A0E0C] border-[#1E293B] hover:border-[#34D399]/50'
                }`}
              >
                <span className="font-pixel text-[9px] text-[#A3E635]">
                  {active ? '►' : ' '}
                </span>
                <div className="w-7 h-7 rounded bg-[#050807] border border-[#334155]/70 flex items-center justify-center shrink-0">
                  {g.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-pixel text-[8px] text-[#E2E8F0]">
                      {g.num}. {g.name}
                    </span>
                    <span className="font-silk text-[7px] text-[#34D399]">{g.best}</span>
                  </div>
                  <p className="font-vt text-[15px] leading-none text-[#94A3B8] mt-1">
                    {g.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <p className="font-silk text-[8px] text-center text-[#94A3B8] pt-1 border-t border-[#10B981]/20">
          PLAY WITH D-PAD / KEYBOARD ARROWS OR TOUCH
        </p>
      </div>
    );
  }

  /* -------- GAME 1: PIXEL SNAKE -------- */
  if (activeGame === 'SNAKE') {
    return (
      <div className="h-full w-full flex flex-col justify-between p-2.5 select-none">
        <div className="flex items-center justify-between border-b border-[#10B981]/30 pb-1">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[8px] text-[#34D399]">SNAKE</span>
            <span className="font-silk text-[9px] text-[#E2E8F0]">PTS: {snakeScore}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              lieAudio.playBack();
              setActiveGame(null);
            }}
            className="px-2 py-0.5 rounded border border-[#334155] font-silk text-[8px] text-[#CBD5E1] cursor-pointer"
          >
            EXIT (B)
          </button>
        </div>

        <div className="relative flex-1 my-1.5 rounded border border-[#34D399]/50 bg-[#040706] p-1 grid grid-cols-[repeat(16,minmax(0,1fr))] grid-rows-[repeat(12,minmax(0,1fr))] gap-[1px]">
          {Array.from({ length: GRID_W * GRID_H }).map((_, cellIdx) => {
            const cx = cellIdx % GRID_W;
            const cy = Math.floor(cellIdx / GRID_W);
            const isHead = snake[0].x === cx && snake[0].y === cy;
            const isBody = snake.slice(1).some((s) => s.x === cx && s.y === cy);
            const isFood = food.x === cx && food.y === cy;
            return (
              <div
                key={cellIdx}
                className={`rounded-[1px] ${
                  isHead
                    ? 'bg-[#A3E635]'
                    : isBody
                      ? 'bg-[#10B981]'
                      : isFood
                        ? 'bg-[#F8FAFC] animate-pulse'
                        : 'bg-[#0B120F]'
                }`}
              />
            );
          })}

          {snakeOver && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center gap-2 text-center p-3">
              <p className="font-pixel text-[11px] text-[#34D399]">GAME OVER</p>
              <p className="font-vt text-[19px] text-[#E2E8F0]">SCORE: {snakeScore}</p>
              <button
                type="button"
                onClick={resetSnake}
                className="px-3 py-1.5 rounded bg-[#10B981] text-[#050608] font-pixel text-[8px] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> RESTART (A)
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="font-silk text-[8px] text-[#94A3B8]">D-PAD / ARROWS / TAP:</span>
          <div className="flex items-center gap-1">
            {(['LEFT', 'UP', 'DOWN', 'RIGHT'] as SnakeDir[]).map((dir) => (
              <button
                key={dir}
                type="button"
                aria-label={`Steer ${dir.toLowerCase()}`}
                onClick={() => {
                  const cur = snakeDirRef.current;
                  if (dir === 'UP' && cur !== 'DOWN') snakeDirRef.current = 'UP';
                  if (dir === 'DOWN' && cur !== 'UP') snakeDirRef.current = 'DOWN';
                  if (dir === 'LEFT' && cur !== 'RIGHT') snakeDirRef.current = 'LEFT';
                  if (dir === 'RIGHT' && cur !== 'LEFT') snakeDirRef.current = 'RIGHT';
                }}
                className="px-2 py-0.5 rounded border border-[#334155] bg-[#0B120F] hover:border-[#34D399] font-silk text-[9px] text-[#34D399] cursor-pointer"
              >
                {dir === 'LEFT' ? '◀' : dir === 'UP' ? '▲' : dir === 'DOWN' ? '▼' : '▶'}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* -------- GAME 2: CATCH THE STARS -------- */
  if (activeGame === 'STARS') {
    return (
      <div className="h-full w-full flex flex-col justify-between p-2.5 select-none">
        <div className="flex items-center justify-between border-b border-[#10B981]/30 pb-1">
          <div className="flex items-center gap-2.5">
            <span className="font-pixel text-[8px] text-[#34D399]">STARS: {starsScore}</span>
            <span className="font-silk text-[9px] text-[#A3E635]">
              HP: {'★'.repeat(starsLives)}{'☆'.repeat(Math.max(0, 3 - starsLives))}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              lieAudio.playBack();
              setActiveGame(null);
            }}
            className="px-2 py-0.5 rounded border border-[#334155] font-silk text-[8px] text-[#CBD5E1] cursor-pointer"
          >
            EXIT (B)
          </button>
        </div>

        <div
          onPointerMove={(e) => {
            if (starsOver) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = ((e.clientX - rect.left) / rect.width) * 100;
            const clamped = Math.max(10, Math.min(90, pct));
            catcherXRef.current = clamped;
            setCatcherX(clamped);
          }}
          className="relative flex-1 my-1.5 rounded border border-[#34D399]/50 bg-[#040706] overflow-hidden touch-none"
        >
          {fallingItems.map((obj) => (
            <div
              key={obj.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 font-pixel text-[11px] ${
                obj.kind === 'STAR'
                  ? 'text-[#34D399] drop-shadow-[0_0_6px_#10B981]'
                  : 'text-rose-400'
              }`}
              style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
            >
              {obj.kind === 'STAR' ? '✦' : '✖'}
            </div>
          ))}

          {/* Pixel Catcher Paddle */}
          <div
            className="absolute bottom-3 -translate-x-1/2 w-12 h-3 rounded-sm bg-gradient-to-r from-[#10B981] via-[#A3E635] to-[#10B981] border border-[#E2E8F0]/70 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
            style={{ left: `${catcherX}%` }}
          />

          {starsOver && (
            <div className="absolute inset-0 bg-black/88 flex flex-col items-center justify-center gap-2 text-center p-3">
              <p className="font-pixel text-[11px] text-[#34D399]">RUN COMPLETE</p>
              <p className="font-vt text-[19px] text-[#E2E8F0]">FINAL SCORE: {starsScore}</p>
              <button
                type="button"
                onClick={resetStars}
                className="px-3 py-1.5 rounded bg-[#10B981] text-[#050608] font-pixel text-[8px] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> PLAY AGAIN (A)
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="font-silk text-[8px] text-[#94A3B8]">MOVE CURSOR OR TAP:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Move catcher left"
              onClick={() => {
                if (starsOver) return;
                const next = Math.max(10, catcherXRef.current - 12);
                catcherXRef.current = next;
                setCatcherX(next);
              }}
              className="px-2.5 py-0.5 rounded border border-[#334155] bg-[#0B120F] hover:border-[#34D399] font-silk text-[9px] text-[#34D399] cursor-pointer"
            >
              ◀
            </button>
            <button
              type="button"
              aria-label="Move catcher right"
              onClick={() => {
                if (starsOver) return;
                const next = Math.min(90, catcherXRef.current + 12);
                catcherXRef.current = next;
                setCatcherX(next);
              }}
              className="px-2.5 py-0.5 rounded border border-[#334155] bg-[#0B120F] hover:border-[#34D399] font-silk text-[9px] text-[#34D399] cursor-pointer"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------- GAME 3: MEMORY MATCH -------- */
  return (
    <div className="h-full w-full flex flex-col justify-between p-2.5 select-none">
      <div className="flex items-center justify-between border-b border-[#10B981]/30 pb-1">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[8px] text-[#34D399]">MEMORY</span>
          <span className="font-silk text-[9px] text-[#E2E8F0]">MOVES: {memMoves}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            lieAudio.playBack();
            setActiveGame(null);
          }}
          className="px-2 py-0.5 rounded border border-[#334155] font-silk text-[8px] text-[#CBD5E1] cursor-pointer"
        >
          EXIT (B)
        </button>
      </div>

      <div className="relative flex-1 my-1.5 grid grid-cols-4 grid-rows-3 gap-1.5">
        {tiles.map((tile, idx) => {
          const isCursor = idx === memCursor;
          const revealed = tile.flipped || tile.matched;
          return (
            <button
              key={tile.uid}
              type="button"
              onClick={() => {
                setMemCursor(idx);
                flipMemoryTile(idx);
              }}
              className={`rounded-md border flex items-center justify-center font-pixel text-[14px] transition-all cursor-pointer ${
                tile.matched
                  ? 'border-[#A3E635] bg-[#10B981]/25 text-[#A3E635]'
                  : revealed
                    ? 'border-[#34D399] bg-[#0D1E17] text-[#E2E8F0]'
                    : isCursor
                      ? 'border-[#34D399] bg-[#121A17] text-[#34D399]/50 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                      : 'border-[#1E293B] bg-[#090C0F] text-[#334155]'
              }`}
            >
              {revealed ? tile.symbol : '?'}
            </button>
          );
        })}

        {memWon && (
          <div className="absolute inset-0 bg-black/88 rounded-md flex flex-col items-center justify-center gap-2 text-center p-3">
            <Trophy className="w-6 h-6 text-[#A3E635]" />
            <p className="font-pixel text-[10px] text-[#34D399]">ALL PAIRS MATCHED!</p>
            <p className="font-vt text-[18px] text-[#E2E8F0]">CLEARED IN {memMoves} MOVES</p>
            <button
              type="button"
              onClick={resetMemory}
              className="px-3 py-1.5 rounded bg-[#10B981] text-[#050608] font-pixel text-[8px] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> PLAY AGAIN (A)
            </button>
          </div>
        )}
      </div>

      <p className="font-silk text-[8px] text-center text-[#94A3B8]">
        TAP TILE OR USE D-PAD + A TO FLIP
      </p>
    </div>
  );
};
