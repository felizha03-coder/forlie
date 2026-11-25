import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { rosieAudio } from '../audio/rosieAudio';
import {
  DelonielSprite,
  EnergyOrb,
  PixelFlower,
  PixelHeart,
  PixelStar,
  RosieSprite,
} from '../components/RosieSprites';
import { useRosie } from '../context/RosieContext';
import { QUIZ_QUESTIONS } from '../data/rosieData';

type ArcadeGameTab = 'tictactoe' | 'catch' | 'memory' | 'quiz';

// ---------------------------------------------------------------------------
// GAME 01 — TIC TAC TOE (Rosie vs Deloniel, X/O Selection, Smart AI & 2P)
// ---------------------------------------------------------------------------
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function evaluateTicTacToe(b: (null | 'X' | 'O')[]) {
  for (const [a, c, d] of WIN_LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) {
      return { winner: b[a], line: [a, c, d] };
    }
  }
  if (b.every(Boolean)) return { winner: 'DRAW' as const, line: [] as number[] };
  return null;
}

function chooseBotMove(b: (null | 'X' | 'O')[], botMark: 'X' | 'O', humanMark: 'X' | 'O'): number {
  const empty = b.map((v, i) => (v === null ? i : -1)).filter((i) => i >= 0);
  if (empty.length === 0) return -1;

  // 1. Win if possible
  for (const idx of empty) {
    const copy = [...b];
    copy[idx] = botMark;
    if (evaluateTicTacToe(copy)?.winner === botMark) return idx;
  }
  // 2. Block player win
  for (const idx of empty) {
    const copy = [...b];
    copy[idx] = humanMark;
    if (evaluateTicTacToe(copy)?.winner === humanMark) return idx;
  }
  // 3. Center or corners
  if (b[4] === null) return 4;
  const corners = [0, 2, 6, 8].filter((i) => b[i] === null);
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
  return empty[Math.floor(Math.random() * empty.length)];
}

const TicTacToeGame: React.FC = () => {
  const {
    progress,
    recordGameComplete,
    recordTicTacToeOutcome,
    resetTicTacToeScores,
  } = useRosie();

  const [board, setBoard] = useState<(null | 'X' | 'O')[]>(Array(9).fill(null));
  const [rosieMark, setRosieMark] = useState<'X' | 'O'>('X');
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [vsBot, setVsBot] = useState(true);

  const delonielMark: 'X' | 'O' = rosieMark === 'X' ? 'O' : 'X';
  const result = evaluateTicTacToe(board);

  const makeMove = useCallback(
    (idx: number) => {
      if (board[idx] || evaluateTicTacToe(board)) return;
      rosieAudio.unlockFromUserGesture();
      rosieAudio.playClick();

      const next = [...board];
      next[idx] = turn;
      setBoard(next);

      const res = evaluateTicTacToe(next);
      if (res) {
        if (res.winner === 'DRAW') {
          recordTicTacToeOutcome('ties');
          recordGameComplete('tictactoe', 20, 'Draw Game ♡');
        } else if (res.winner === rosieMark) {
          recordTicTacToeOutcome('rosie');
          recordGameComplete('tictactoe', 25, 'Rosie Wins Tic Tac Toe ♡');
        } else {
          recordTicTacToeOutcome('deloniel');
          recordGameComplete('tictactoe', 20, 'Deloniel Wins Round ★');
        }
      } else {
        setTurn(turn === 'X' ? 'O' : 'X');
      }
    },
    [board, turn, rosieMark, recordTicTacToeOutcome, recordGameComplete]
  );

  // Bot turn when in VS DELONIEL mode
  useEffect(() => {
    if (!vsBot || turn !== delonielMark || result) return;
    const timer = window.setTimeout(() => {
      const pick = chooseBotMove(board, delonielMark, rosieMark);
      if (pick >= 0) makeMove(pick);
    }, 460);
    return () => window.clearTimeout(timer);
  }, [vsBot, turn, delonielMark, rosieMark, result, board, makeMove]);

  const restartRound = (nextStartingTurn: 'X' | 'O' = 'X') => {
    rosieAudio.playClick();
    setBoard(Array(9).fill(null));
    setTurn(nextStartingTurn);
  };

  const handleToggleSymbol = (mark: 'X' | 'O') => {
    if (mark === rosieMark) return;
    rosieAudio.playClick();
    setRosieMark(mark);
    setBoard(Array(9).fill(null));
    setTurn('X');
  };

  const isRosieTurn = turn === rosieMark;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-body font-extrabold text-base text-[#181016]">
            Tic Tac Toe — Rosie vs Deloniel
          </h2>
          <p className="font-body text-xs text-[#382033]">
            Rosie ({rosieMark}) vs Deloniel ({delonielMark}) · X always moves first
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="silver-bevel rounded-md p-0.5 inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleToggleSymbol('X')}
              className={`px-2.5 py-1 rounded font-pixel text-[8px] cursor-pointer ${
                rosieMark === 'X'
                  ? 'bg-[#EC4899] text-white'
                  : 'text-[#181016] hover:bg-white/60'
              }`}
            >
              ROSIE = X
            </button>
            <button
              type="button"
              onClick={() => handleToggleSymbol('O')}
              className={`px-2.5 py-1 rounded font-pixel text-[8px] cursor-pointer ${
                rosieMark === 'O'
                  ? 'bg-[#EC4899] text-white'
                  : 'text-[#181016] hover:bg-white/60'
              }`}
            >
              ROSIE = O
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              rosieAudio.playClick();
              setVsBot((v) => !v);
              restartRound('X');
            }}
            className="silver-bevel px-3 py-1.5 rounded-md font-pixel text-[8px] text-[#181016] cursor-pointer"
          >
            MODE: {vsBot ? 'VS DELONIEL' : '2 PLAYERS'}
          </button>
        </div>
      </div>

      {/* Persistent Scoreboard */}
      <div className="grid grid-cols-3 gap-2 font-pixel text-[9px] text-center tabular-nums">
        <div className="bg-[#FFD4E7] border-2 border-[#382033] rounded-xl p-2.5">
          <p className="text-[#C92778]">ROSIE ({rosieMark}) ♡</p>
          <p className="text-sm pt-1">{progress.ticTacToeScores.rosie}</p>
        </div>
        <div className="silver-bevel rounded-xl p-2.5">
          <p className="text-[#382033]/75">TIES</p>
          <p className="text-sm pt-1">{progress.ticTacToeScores.ties}</p>
        </div>
        <div className="bg-[#C7B6F3]/55 border-2 border-[#382033] rounded-xl p-2.5">
          <p className="text-[#7C3AED]">DELONIEL ({delonielMark}) ★</p>
          <p className="text-sm pt-1">{progress.ticTacToeScores.deloniel}</p>
        </div>
      </div>

      {/* Winning Pixel Celebration Strip */}
      {result && result.winner !== 'DRAW' && (
        <div className="bg-[#FEF08A] border-2 border-[#382033] rounded-xl px-4 py-2 flex items-center justify-center gap-2 animate-select-pop">
          <Sparkles className="w-4 h-4 text-[#C92778]" />
          <span className="font-pixel text-[9px] text-[#181016]">
            {result.winner === rosieMark
              ? 'ROSIE TAKES THE WIN! ♡'
              : 'DELONIEL TAKES THIS ROUND! ★'}
          </span>
          <Sparkles className="w-4 h-4 text-[#C92778]" />
        </div>
      )}

      {/* 3x3 Interactive Pixel Grid */}
      <div className="max-w-[270px] mx-auto grid grid-cols-3 gap-2.5">
        {board.map((cell, i) => {
          const isWinCell = result?.line.includes(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => makeMove(i)}
              aria-label={`Square ${i + 1}${cell ? `: ${cell}` : ''}`}
              className={`h-20 rounded-xl border-2 border-[#382033] flex flex-col items-center justify-center cursor-pointer transition-transform ${
                isWinCell
                  ? 'bg-[#FCE24F] animate-heartbeat scale-105'
                  : 'bg-[#FFF5E8] hover:bg-[#FFD4E7]'
              }`}
            >
              {cell === 'X' && (
                <div className="flex flex-col items-center">
                  <PixelHeart size={30} color="#EC4899" />
                  <span className="font-pixel text-[7px] text-[#C92778] mt-0.5">X</span>
                </div>
              )}
              {cell === 'O' && (
                <div className="flex flex-col items-center">
                  <PixelStar size={30} color="#A78BFA" />
                  <span className="font-pixel text-[7px] text-[#7C3AED] mt-0.5">O</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Status & Controls */}
      <div className="silver-bevel rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <p className="font-body font-bold text-sm text-[#181016]">
          {result
            ? result.winner === 'DRAW'
              ? "It's a tie! Evenly matched."
              : result.winner === rosieMark
              ? 'Okay, genius. Rosie wins this round!'
              : 'Deloniel steals this round! Rematch?'
            : `Turn: ${isRosieTurn ? `Rosie (${rosieMark})` : `Deloniel (${delonielMark})`}`}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetTicTacToeScores}
            className="silver-bevel px-3 py-2 rounded-lg font-pixel text-[8px] text-[#6B2D5C] cursor-pointer"
          >
            RESET SCORE
          </button>

          <button
            type="button"
            onClick={() => restartRound('X')}
            className="pixel-button px-4 py-2 bg-[#FCE24F] text-[#181016] font-pixel text-[9px] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESTART</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// GAME 02 — CATCH MY HEART (Uses Selected Hero Rosie / Deloniel)
// ---------------------------------------------------------------------------
interface FallingDrop {
  id: number;
  x: number;
  y: number;
  speed: number;
  kind: 'pink' | 'yellow' | 'broken';
}

const CatchMyHeartGame: React.FC = () => {
  const { progress, collectHearts, recordGameComplete } = useRosie();
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(50);
  const [avatar, setAvatar] = useState<'rosie' | 'deloniel'>(progress.selectedCharacter);
  const [drops, setDrops] = useState<FallingDrop[]>([]);

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const playerXRef = useRef(50);
  const moveDirRef = useRef(0);
  const scoreRef = useRef(0);
  const timeLeftRef = useRef(30);
  const dropsRef = useRef<FallingDrop[]>([]);
  const spawnAccRef = useRef(0);
  const dropIdRef = useRef(1);
  const keysRef = useRef<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });

  const endRound = useCallback(() => {
    setPlaying(false);
    setFinished(true);
    moveDirRef.current = 0;
    keysRef.current = { left: false, right: false };
    const earnedHearts = Math.max(1, Math.floor(scoreRef.current / 10));
    collectHearts(earnedHearts, 0);
    recordGameComplete('catch-heart', 20, `Caught ${earnedHearts} Hearts ♡`);
  }, [collectHearts, recordGameComplete]);

  const endRoundRef = useRef(endRound);
  endRoundRef.current = endRound;

  const startRound = () => {
    rosieAudio.unlockFromUserGesture();
    rosieAudio.playClick();
    playerXRef.current = 50;
    scoreRef.current = 0;
    timeLeftRef.current = 30;
    spawnAccRef.current = 0;
    moveDirRef.current = 0;
    keysRef.current = { left: false, right: false };
    const initialDrop: FallingDrop = {
      id: dropIdRef.current++,
      x: 50,
      y: 8,
      speed: 34,
      kind: 'pink',
    };
    dropsRef.current = [initialDrop];
    setPlayerX(50);
    setScore(0);
    setTimeLeft(30);
    setDrops([initialDrop]);
    setFinished(false);
    setPlaying(true);
  };

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        if (playing) e.preventDefault();
        keysRef.current.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        if (playing) e.preventDefault();
        keysRef.current.right = true;
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keysRef.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keysRef.current.right = false;
    };
    const onBlur = () => {
      keysRef.current = { left: false, right: false };
      moveDirRef.current = 0;
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      const nextTime = timeLeftRef.current - 1;
      timeLeftRef.current = nextTime;
      setTimeLeft(nextTime);
      if (nextTime <= 0) {
        window.clearInterval(timer);
        endRoundRef.current();
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const dir =
        (keysRef.current.left ? -1 : 0) +
        (keysRef.current.right ? 1 : 0) +
        moveDirRef.current;

      if (dir !== 0) {
        playerXRef.current = Math.max(8, Math.min(92, playerXRef.current + dir * 74 * dt));
        setPlayerX(playerXRef.current);
      }

      const elapsedFactor = Math.max(0, (30 - timeLeftRef.current) / 30);
      const spawnInterval = Math.max(0.36, 0.72 - elapsedFactor * 0.28);
      spawnAccRef.current += dt;

      const nextList: FallingDrop[] = [];
      let scoreChanged = false;

      for (const d of dropsRef.current) {
        const ny = d.y + d.speed * dt;
        if (ny >= 74 && ny <= 94 && Math.abs(d.x - playerXRef.current) < 14) {
          if (d.kind === 'broken') {
            scoreRef.current = Math.max(0, scoreRef.current - 15);
            rosieAudio.playHurt();
          } else {
            const pts = d.kind === 'yellow' ? 25 : 10;
            scoreRef.current += pts;
            rosieAudio.playHeartCollect();
          }
          scoreChanged = true;
          continue;
        }
        if (ny < 103) {
          nextList.push({ ...d, y: ny });
        }
      }

      if (spawnAccRef.current >= spawnInterval) {
        spawnAccRef.current = 0;
        const r = Math.random();
        const kind: FallingDrop['kind'] =
          r < 0.22 ? 'broken' : r < 0.44 ? 'yellow' : 'pink';
        nextList.push({
          id: dropIdRef.current++,
          x: 10 + Math.random() * 80,
          y: -4,
          speed: 32 + elapsedFactor * 20 + Math.random() * 14,
          kind,
        });
      }

      dropsRef.current = nextList;
      setDrops(nextList);
      if (scoreChanged) {
        setScore(scoreRef.current);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [playing]);

  const movePlayerFromPointer = (clientX: number) => {
    if (!playing || !arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(8, Math.min(92, pct));
    playerXRef.current = clamped;
    setPlayerX(clamped);
  };

  const stepPlayer = (delta: number) => {
    if (!playing) return;
    const clamped = Math.max(8, Math.min(92, playerXRef.current + delta));
    playerXRef.current = clamped;
    setPlayerX(clamped);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-body font-extrabold text-base text-[#181016]">
            Catch My Heart
          </h2>
          <p className="font-body text-xs text-[#481D3F]">
            Move mouse/finger inside the arena, use A / D / Arrow Keys, or tap LEFT / RIGHT.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            rosieAudio.playClick();
            setAvatar((a) => (a === 'rosie' ? 'deloniel' : 'rosie'));
          }}
          className="silver-bevel px-3 py-1.5 rounded-md font-pixel text-[8px] cursor-pointer"
        >
          HERO: {avatar.toUpperCase()}
        </button>
      </div>

      <div className="flex items-center justify-between bg-[#EC4899] border-2 border-[#6B2D5C] text-white px-4 py-2 rounded-xl font-pixel text-[10px] tabular-nums">
        <span>SCORE: {score}</span>
        <span className="text-[#FEF08A]">TIME: {timeLeft}s</span>
      </div>

      <div
        ref={arenaRef}
        onPointerMove={(e) => movePlayerFromPointer(e.clientX)}
        onPointerDown={(e) => movePlayerFromPointer(e.clientX)}
        onTouchMove={(e) => {
          if (e.touches[0]) movePlayerFromPointer(e.touches[0].clientX);
        }}
        className="relative w-full h-72 bg-gradient-to-b from-[#FEF08A] via-[#FEF9C3] to-[#86EFAC] border-3 border-[#6B2D5C] rounded-2xl overflow-hidden select-none touch-none cursor-crosshair"
      >
        {drops.map((d) => (
          <div
            key={d.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
          >
            {d.kind === 'broken' ? (
              <span className="inline-block px-1.5 py-0.5 bg-[#6B2D5C] text-white font-pixel text-[10px] rounded border border-rose-300">
                💔
              </span>
            ) : (
              <PixelHeart
                size={26}
                color={d.kind === 'yellow' ? '#FDE047' : '#EC4899'}
              />
            )}
          </div>
        ))}

        <div
          className="absolute bottom-2 -translate-x-1/2 pointer-events-none"
          style={{ left: `${playerX}%` }}
        >
          {avatar === 'rosie' ? (
            <RosieSprite pose="waving" size={54} />
          ) : (
            <DelonielSprite pose="waving" size={54} />
          )}
        </div>

        {!playing && (
          <div className="absolute inset-0 bg-[#FF8DC7]/88 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center gap-3 text-[#481D3F] cursor-default">
            {finished ? (
              <>
                <h3 className="font-pixel text-sm text-[#FEF08A] drop-shadow-[1px_1px_0_#6B2D5C]">
                  TIME&apos;S UP!
                </h3>
                <p className="font-pixel text-xs text-white drop-shadow-[1px_1px_0_#6B2D5C]">
                  FINAL SCORE: {score}
                </p>
              </>
            ) : (
              <p className="font-body font-extrabold text-sm max-w-xs bg-[#FFF9FC]/95 border-2 border-[#6B2D5C] rounded-xl px-4 py-2.5">
                Catch as many pink &amp; yellow hearts as you can in 30 seconds!
              </p>
            )}
            <button
              type="button"
              onClick={startRound}
              className="pixel-button px-5 py-2.5 bg-[#FDE047] hover:bg-[#FFF9FC] text-[#481D3F] font-pixel text-[10px] cursor-pointer"
            >
              {finished ? 'PLAY AGAIN ♡' : 'START CATCHING ♡'}
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          onPointerDown={() => {
            moveDirRef.current = -1;
          }}
          onPointerUp={() => {
            moveDirRef.current = 0;
          }}
          onPointerCancel={() => {
            moveDirRef.current = 0;
          }}
          onPointerLeave={() => {
            moveDirRef.current = 0;
          }}
          onClick={() => stepPlayer(-9)}
          className="silver-bevel flex-1 max-w-[140px] py-2.5 rounded-xl font-pixel text-xs flex items-center justify-center gap-1 cursor-pointer select-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>LEFT</span>
        </button>

        <button
          type="button"
          onPointerDown={() => {
            moveDirRef.current = 1;
          }}
          onPointerUp={() => {
            moveDirRef.current = 0;
          }}
          onPointerCancel={() => {
            moveDirRef.current = 0;
          }}
          onPointerLeave={() => {
            moveDirRef.current = 0;
          }}
          onClick={() => stepPlayer(9)}
          className="silver-bevel flex-1 max-w-[140px] py-2.5 rounded-xl font-pixel text-xs flex items-center justify-center gap-1 cursor-pointer select-none"
        >
          <span>RIGHT</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// GAME 03 — MEMORY MATCH (4x4)
// ---------------------------------------------------------------------------
interface MemoryTile {
  uid: number;
  pairId: string;
  matched: boolean;
}

const MEMORY_SYMBOLS = [
  'heart',
  'flower',
  'star',
  'rosie',
  'deloniel',
  'yellowHeart',
  'lavFlower',
  'spark',
] as const;

function buildShuffledMemoryDeck(): MemoryTile[] {
  const doubled = [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS];
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled.map((pairId, uid) => ({ uid, pairId, matched: false }));
}

const MemoryMatchGame: React.FC = () => {
  const { recordGameComplete } = useRosie();
  const [tiles, setTiles] = useState<MemoryTile[]>(() => buildShuffledMemoryDeck());
  const [openIndices, setOpenIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (won) return;
    const t = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [won]);

  const restart = () => {
    rosieAudio.playClick();
    setTiles(buildShuffledMemoryDeck());
    setOpenIndices([]);
    setMoves(0);
    setElapsed(0);
    setWon(false);
  };

  const flipTile = (idx: number) => {
    if (won || openIndices.length >= 2 || openIndices.includes(idx) || tiles[idx].matched) {
      return;
    }
    rosieAudio.playCardFlip();
    const nextOpen = [...openIndices, idx];
    setOpenIndices(nextOpen);

    if (nextOpen.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextOpen;
      if (tiles[a].pairId === tiles[b].pairId) {
        window.setTimeout(() => {
          rosieAudio.playHeartCollect();
          setTiles((prev) => {
            const updated = prev.map((tile, i) =>
              i === a || i === b ? { ...tile, matched: true } : tile
            );
            if (updated.every((t) => t.matched)) {
              setWon(true);
              recordGameComplete('memory-match', 30, 'Completed Memory Match ♡');
            }
            return updated;
          });
          setOpenIndices([]);
        }, 320);
      } else {
        window.setTimeout(() => {
          setOpenIndices([]);
        }, 720);
      }
    }
  };

  const renderTileIcon = (pairId: string) => {
    switch (pairId) {
      case 'heart':
        return <PixelHeart size={28} color="#EC4899" />;
      case 'yellowHeart':
        return <PixelHeart size={28} color="#FDE047" />;
      case 'flower':
        return <PixelFlower size={28} petalColor="#EC4899" />;
      case 'lavFlower':
        return <PixelFlower size={28} petalColor="#C7B6F3" />;
      case 'star':
        return <PixelStar size={28} color="#C7B6F3" />;
      case 'rosie':
        return <RosieSprite pose="smiling" size={34} />;
      case 'deloniel':
        return <DelonielSprite pose="smiling" size={34} />;
      default:
        return <PixelHeart size={28} color="#C92778" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-body font-extrabold text-base text-[#181016]">
            Memory Match (4×4)
          </h2>
          <p className="font-body text-xs text-[#382033]">
            Match hearts, flowers, stars, Rosie &amp; Deloniel!
          </p>
        </div>

        <div className="flex items-center gap-3 font-pixel text-[9px] tabular-nums">
          <span>MOVES: {moves}</span>
          <span>TIME: {elapsed}s</span>
        </div>
      </div>

      <div className="max-w-sm mx-auto grid grid-cols-4 gap-2.5">
        {tiles.map((tile, idx) => {
          const revealed = tile.matched || openIndices.includes(idx);
          return (
            <button
              key={tile.uid}
              type="button"
              onClick={() => flipTile(idx)}
              className={`h-16 sm:h-20 rounded-xl border-2 border-[#382033] flex items-center justify-center cursor-pointer transition-transform ${
                tile.matched
                  ? 'bg-[#C7B6F3]/65'
                  : revealed
                  ? 'bg-[#FFF5E8]'
                  : 'bg-[#EC4899] hover:bg-[#C92778]'
              }`}
            >
              {revealed ? (
                renderTileIcon(tile.pairId)
              ) : (
                <span className="font-pixel text-xs text-white">♡</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="silver-bevel flex items-center justify-between rounded-xl p-3">
        <p className="font-body font-bold text-sm text-[#181016]">
          {won
            ? `You matched all 8 pairs in ${moves} moves (${elapsed}s)! ♡`
            : 'Flip two tiles to find matching pairs.'}
        </p>
        <button
          type="button"
          onClick={restart}
          className="pixel-button px-4 py-2 bg-[#FCE24F] text-[#181016] font-pixel text-[9px] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESTART</span>
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// GAME 04 — LITTLE DUO QUIZ
// ---------------------------------------------------------------------------
const KnowMeQuizGame: React.FC = () => {
  const { recordGameComplete } = useRosie();
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answersCount, setAnswersCount] = useState(0);
  const [done, setDone] = useState(false);

  const current = QUIZ_QUESTIONS[step];

  const choose = (opt: string) => {
    rosieAudio.playClick();
    setPicked(opt);
    setAnswersCount((c) => c + 1);
  };

  const nextQuestion = () => {
    rosieAudio.playClick();
    if (step + 1 < QUIZ_QUESTIONS.length) {
      setStep((s) => s + 1);
      setPicked(null);
    } else {
      setDone(true);
      recordGameComplete('know-me-quiz', 30, 'Completed Quiz ♡');
    }
  };

  const restart = () => {
    rosieAudio.playClick();
    setStep(0);
    setPicked(null);
    setAnswersCount(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className="silver-bevel rounded-2xl p-6 text-center space-y-4">
        <div className="flex justify-center gap-4">
          <RosieSprite pose="blushing" size={68} />
          <DelonielSprite pose="blushing" size={68} />
        </div>
        <h3 className="font-body font-extrabold text-base text-[#C92778]">
          GOOD VIBES CERTIFIED: 100% ♡
        </h3>
        <p className="font-body text-sm text-[#181016] max-w-md mx-auto">
          You answered all {answersCount} questions! Thanks for exploring this little corner of the internet, Rosie.
        </p>
        <button
          type="button"
          onClick={restart}
          className="pixel-button px-5 py-2.5 bg-[#FCE24F] text-[#181016] font-pixel text-[10px] cursor-pointer"
        >
          PLAY QUIZ AGAIN ♡
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-body font-extrabold text-base text-[#181016]">
          Little Trivia Quiz
        </h2>
        <span className="font-pixel text-[9px] text-[#382033]">
          {step + 1} / {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="bg-[#FFD4E7] border-2 border-[#382033] rounded-2xl p-5 space-y-4">
        <p className="font-body font-extrabold text-base text-[#181016]">
          {current.prompt}
        </p>

        <div className="space-y-2.5">
          {current.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => choose(opt)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 border-[#382033] font-body font-bold text-sm cursor-pointer transition-colors ${
                picked === opt
                  ? 'bg-[#EC4899] text-white'
                  : 'bg-[#FFF5E8] hover:bg-white text-[#181016]'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {picked && (
          <div className="silver-bevel rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-body text-xs sm:text-sm text-[#181016]">
              {current.reaction}
            </p>
            <button
              type="button"
              onClick={nextQuestion}
              className="pixel-button px-4 py-2 bg-[#FCE24F] font-pixel text-[9px] text-[#181016] cursor-pointer"
            >
              {step + 1 < QUIZ_QUESTIONS.length ? 'NEXT ▶' : 'SEE RESULT ♡'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ARCADE CONTAINER SCREEN
// ---------------------------------------------------------------------------
export const RosieArcadeScreen: React.FC = () => {
  const { navigate } = useRosie();
  const [activeTab, setActiveTab] = useState<ArcadeGameTab>('tictactoe');

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full pink-pixel-grid py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="yellow-card-shell rounded-2xl p-1.5">
          <div className="card-magenta-texture rounded-xl border-2 border-[#382033] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="basic-silver-tag px-2.5 py-0.5 font-body font-extrabold italic text-[10px]">
                  ARCADE
                </span>
                <h1 className="font-body font-extrabold text-lg sm:text-xl text-[#181016]">
                  ROSIE&apos;S MINI-GAME ARCADE
                </h1>
              </div>
              <p className="font-body font-bold text-xs sm:text-sm text-[#181016]/85">
                LET&apos;S PLAY SOMETHING, ROSIE!
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

        <section className="yellow-card-shell rounded-[26px] p-2.5">
          <div className="card-magenta-texture rounded-[18px] border-2 border-[#382033] p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'tictactoe', label: '01. Tic Tac Toe' },
                  { id: 'catch', label: '02. Catch Heart' },
                  { id: 'memory', label: '03. Memory' },
                  { id: 'quiz', label: '04. Quiz' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    rosieAudio.playClick();
                    setActiveTab(tab.id);
                  }}
                  className={`py-2 px-3 rounded-lg font-body font-extrabold text-xs sm:text-sm cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-[#FCE24F] border-2 border-[#382033] text-[#181016] shadow-[0_2px_0_#382033]'
                      : 'silver-bevel text-[#181016] hover:brightness-105'
                  }`}
                >
                  <EnergyOrb variant="pink" size={14} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="silver-bevel rounded-xl p-2">
              <div className="bg-[#FFF5E8] border-2 border-[#382033] rounded-lg p-4 sm:p-5">
                {activeTab === 'tictactoe' && <TicTacToeGame />}
                {activeTab === 'catch' && <CatchMyHeartGame />}
                {activeTab === 'memory' && <MemoryMatchGame />}
                {activeTab === 'quiz' && <KnowMeQuizGame />}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
