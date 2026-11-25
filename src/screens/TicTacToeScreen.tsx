import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { hannaAudio } from '../audio/hannaAudio';
import { PixelOSymbol, PixelXSymbol } from '../components/HannaPixelArt';
import { useHanna } from '../context/HannaContext';

type Cell = 'X' | 'O' | null;
type GameMode = 'CPU' | 'PVP';

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

function evaluateBoard(board: Cell[]): {
  winner: 'X' | 'O' | 'DRAW' | null;
  line: number[];
} {
  for (const combo of WIN_LINES) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: combo };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: 'DRAW', line: [] };
  }
  return { winner: null, line: [] };
}

function chooseBestCpuMove(board: Cell[]): number {
  const empty = board
    .map((v, i) => (v === null ? i : -1))
    .filter((i) => i !== -1);
  if (empty.length === 0) return -1;

  // 1. Win immediately as O
  for (const idx of empty) {
    const copy = [...board];
    copy[idx] = 'O';
    if (evaluateBoard(copy).winner === 'O') return idx;
  }

  // 2. Block X from winning next
  for (const idx of empty) {
    const copy = [...board];
    copy[idx] = 'X';
    if (evaluateBoard(copy).winner === 'X') return idx;
  }

  // 3. Take center if free
  if (board[4] === null && Math.random() < 0.78) return 4;

  // 4. Take a corner or random spot
  const corners = [0, 2, 6, 8].filter((c) => board[c] === null);
  if (corners.length > 0 && Math.random() < 0.75) {
    return corners[Math.floor(Math.random() * corners.length)];
  }
  return empty[Math.floor(Math.random() * empty.length)];
}

export const TicTacToeScreen: React.FC = () => {
  const { recordTicTacToeResult, navigate } = useHanna();
  const [mode, setMode] = useState<GameMode>('CPU');
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<'X' | 'O'>('X');
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });
  const [cpuThinking, setCpuThinking] = useState(false);

  const { winner, line } = evaluateBoard(board);

  const handleTurnResolution = (nextBoard: Cell[]) => {
    const result = evaluateBoard(nextBoard);
    if (result.winner === 'X') {
      hannaAudio.playVictory();
      setScores((s) => ({ ...s, x: s.x + 1 }));
      recordTicTacToeResult('win');
    } else if (result.winner === 'O') {
      hannaAudio.playMonsterHit();
      setScores((s) => ({ ...s, o: s.o + 1 }));
      if (mode === 'CPU') recordTicTacToeResult('loss');
    } else if (result.winner === 'DRAW') {
      hannaAudio.playClick();
      setScores((s) => ({ ...s, draw: s.draw + 1 }));
      recordTicTacToeResult('draw');
    }
  };

  useEffect(() => {
    if (mode !== 'CPU' || turn !== 'O' || winner !== null) return;
    setCpuThinking(true);
    const timer = window.setTimeout(() => {
      const move = chooseBestCpuMove(board);
      if (move !== -1) {
        const nextBoard = [...board];
        nextBoard[move] = 'O';
        hannaAudio.playClick();
        setBoard(nextBoard);
        setTurn('X');
        handleTurnResolution(nextBoard);
      }
      setCpuThinking(false);
    }, 420);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, turn, winner]);

  const handleCellClick = (index: number) => {
    if (board[index] !== null || winner !== null || cpuThinking) return;
    hannaAudio.unlockFromUserGesture();
    hannaAudio.playClick();

    const nextBoard = [...board];
    nextBoard[index] = turn;
    setBoard(nextBoard);
    const result = evaluateBoard(nextBoard);
    handleTurnResolution(nextBoard);
    if (!result.winner) {
      setTurn(turn === 'X' ? 'O' : 'X');
    }
  };

  const startNewRound = () => {
    hannaAudio.unlockFromUserGesture();
    hannaAudio.playClick();
    setBoard(Array(9).fill(null));
    setTurn('X');
    setCpuThinking(false);
  };

  const resetScoreboard = () => {
    hannaAudio.unlockFromUserGesture();
    hannaAudio.playClick();
    setScores({ x: 0, o: 0, draw: 0 });
    setBoard(Array(9).fill(null));
    setTurn('X');
    setCpuThinking(false);
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full spooky-pixel-bg py-6 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-3xl w-full pixel-frame-purple p-4 sm:p-6 space-y-5">
        {/* Header & Mode Switcher */}
        <div className="bg-[#8C265A] border-4 border-[#211A2B] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-pixel text-xs sm:text-base text-[#FF9B38]">
            PIXEL TIC TAC TOE
          </h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('CPU');
                startNewRound();
              }}
              className={`px-3 py-1.5 border-2 border-[#211A2B] font-pixel text-[8px] cursor-pointer ${
                mode === 'CPU'
                  ? 'bg-[#8CE5E8] text-[#211A2B]'
                  : 'bg-[#B83B77] text-[#FFF0D5]'
              }`}
            >
              PLAYER VS COMPUTER
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('PVP');
                startNewRound();
              }}
              className={`px-3 py-1.5 border-2 border-[#211A2B] font-pixel text-[8px] cursor-pointer ${
                mode === 'PVP'
                  ? 'bg-[#F5A6C8] text-[#211A2B]'
                  : 'bg-[#B83B77] text-[#FFF0D5]'
              }`}
            >
              PLAYER VS PLAYER
            </button>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-3 text-center tabular-nums">
          <div className="bg-[#8C265A] border-3 border-[#211A2B] p-2.5">
            <p className="font-pixel text-[8px] text-[#FF9B38]">PLAYER X</p>
            <p className="font-pixel text-base text-[#FFF0D5] mt-1">{scores.x}</p>
          </div>
          <div className="bg-[#8C265A] border-3 border-[#211A2B] p-2.5">
            <p className="font-pixel text-[8px] text-[#FFB78C]">DRAWS</p>
            <p className="font-pixel text-base text-[#FFF0D5] mt-1">{scores.draw}</p>
          </div>
          <div className="bg-[#8C265A] border-3 border-[#211A2B] p-2.5">
            <p className="font-pixel text-[8px] text-[#8CE5E8]">
              {mode === 'CPU' ? 'COMPUTER O' : 'PLAYER O'}
            </p>
            <p className="font-pixel text-base text-[#FFF0D5] mt-1">{scores.o}</p>
          </div>
        </div>

        {/* 3x3 Pixel Board */}
        <div className="relative bg-[#F5A6C8] border-4 border-[#211A2B] p-5 flex flex-col items-center justify-center overflow-hidden">
          {/* Pixel Confetti on Player Win */}
          {winner === 'X' && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-32 flex justify-around"
            >
              {['#FF9B38', '#F5A6C8', '#8CE5E8', '#FFF0D5', '#FFB78C', '#FF9B38'].map(
                (col, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: col,
                      animationDelay: `${i * 0.16}s`,
                    }}
                    className="w-2.5 h-2.5 border border-[#211A2B] animate-confetti"
                  />
                )
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 w-full max-w-[320px]">
            {board.map((cell, idx) => {
              const isWinCell = line.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleCellClick(idx)}
                  aria-label={`Square ${idx + 1}`}
                  className={`aspect-square border-4 border-[#211A2B] flex items-center justify-center cursor-pointer transition-transform ${
                    isWinCell
                      ? 'bg-[#FF9B38] scale-105'
                      : cell
                      ? 'bg-[#8C265A]'
                      : 'bg-[#B83B77] hover:bg-[#D14D8D]'
                  }`}
                >
                  {cell === 'X' && <PixelXSymbol size={48} />}
                  {cell === 'O' && <PixelOSymbol size={48} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Dialogue + Controls */}
        <div className="bg-[#FFF0D5] border-4 border-[#211A2B] p-4 text-[#211A2B] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-vt text-xl sm:text-2xl leading-tight">
            {winner === 'X'
              ? '★ "YOU DID IT! WHAT A SMART MOVE!"'
              : winner === 'O'
              ? mode === 'CPU'
                ? 'COMPUTER O TAKES THIS ROUND! TRY AGAIN!'
                : 'PLAYER O WINS THIS ROUND!'
              : winner === 'DRAW'
              ? 'DRAW GAME! EVENLY MATCHED!'
              : cpuThinking
              ? 'COMPUTER IS THINKING...'
              : `NEXT TURN: ${turn === 'X' ? 'PLAYER X' : mode === 'CPU' ? 'COMPUTER O' : 'PLAYER O'}`}
          </p>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={startNewRound}
              className="pixel-btn px-4 py-2 bg-[#FF9B38] text-[#211A2B] font-pixel text-[9px] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>NEW ROUND</span>
            </button>
            <button
              type="button"
              onClick={resetScoreboard}
              className="pixel-btn px-4 py-2 bg-[#F5A6C8] text-[#211A2B] font-pixel text-[9px] cursor-pointer"
            >
              RESET SCORE
            </button>
            {winner === 'X' && (
              <button
                type="button"
                onClick={() => navigate('SECRET_ROOM')}
                className="pixel-btn px-4 py-2 bg-[#8CE5E8] text-[#211A2B] font-pixel text-[9px] cursor-pointer"
              >
                SECRET ROOM ▶
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
