import React, { useEffect, useRef, useState } from 'react';
import { Shield, Sparkles, Sword, Heart, Lock, RotateCcw } from 'lucide-react';
import { hannaAudio } from '../audio/hannaAudio';
import {
  CharacterSprite,
  ForestBattleBackdrop,
  MonsterSprite,
  PixelStarIcon,
} from '../components/HannaPixelArt';
import { useHanna } from '../context/HannaContext';
import { MONSTERS } from '../data/hannaData';
import { MonsterData } from '../types/hanna';

interface FloatingHit {
  id: number;
  side: 'player' | 'enemy';
  text: string;
  color: string;
}

export const MonsterBattleScreen: React.FC = () => {
  const { selectedCharacter, progress, recordBattleWin, navigate } = useHanna();

  const [monsterIdx, setMonsterIdx] = useState(0);
  const currentMonster: MonsterData = MONSTERS[monsterIdx];

  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(currentMonster.maxHp);
  const [specialCooldown, setSpecialCooldown] = useState(0);
  const [healCharges, setHealCharges] = useState(3);
  const [defending, setDefending] = useState(false);
  const [turnBusy, setTurnBusy] = useState(false);
  const [battleState, setBattleState] = useState<'FIGHTING' | 'VICTORY' | 'DEFEAT'>('FIGHTING');
  const [dialogue, setDialogue] = useState(
    `A wild ${currentMonster.name} blocks the forest trail!`
  );
  const [typedDialogue, setTypedDialogue] = useState('');
  const [playerAnim, setPlayerAnim] = useState<'idle' | 'lunge' | 'hurt'>('idle');
  const [enemyAnim, setEnemyAnim] = useState<'idle' | 'lunge' | 'hurt'>('idle');
  const [floatingHits, setFloatingHits] = useState<FloatingHit[]>([]);

  const hitIdRef = useRef(1);
  const enemyTurnTimeoutRef = useRef<number | null>(null);

  // Typewriter effect for retro dialogue box
  useEffect(() => {
    let idx = 0;
    setTypedDialogue('');
    const timer = window.setInterval(() => {
      idx += 2;
      setTypedDialogue(dialogue.slice(0, idx));
      if (idx >= dialogue.length) {
        window.clearInterval(timer);
      }
    }, 18);
    return () => window.clearInterval(timer);
  }, [dialogue]);

  useEffect(() => {
    return () => {
      if (enemyTurnTimeoutRef.current !== null) {
        window.clearTimeout(enemyTurnTimeoutRef.current);
      }
    };
  }, []);

  const spawnFloating = (side: 'player' | 'enemy', text: string, color: string) => {
    const id = hitIdRef.current++;
    setFloatingHits((prev) => [...prev, { id, side, text, color }]);
    window.setTimeout(() => {
      setFloatingHits((prev) => prev.filter((item) => item.id !== id));
    }, 850);
  };

  const isMonsterUnlocked = (idx: number): boolean => {
    if (idx === 0) return true;
    const prevMonster = MONSTERS[idx - 1];
    return progress.defeatedMonsterIds.includes(prevMonster.id);
  };

  const startBattleWithMonster = (idx: number) => {
    if (!isMonsterUnlocked(idx)) return;
    if (enemyTurnTimeoutRef.current !== null) {
      window.clearTimeout(enemyTurnTimeoutRef.current);
      enemyTurnTimeoutRef.current = null;
    }
    hannaAudio.unlockFromUserGesture();
    hannaAudio.playClick();
    const target = MONSTERS[idx];
    setMonsterIdx(idx);
    setPlayerHp(100);
    setEnemyHp(target.maxHp);
    setSpecialCooldown(0);
    setHealCharges(3);
    setDefending(false);
    setTurnBusy(false);
    setBattleState('FIGHTING');
    setPlayerAnim('idle');
    setEnemyAnim('idle');
    setFloatingHits([]);
    setDialogue(`A wild ${target.name} appears! (${target.title})`);
  };

  const triggerEnemyTurn = (isDefending: boolean, currentPlayerHp: number) => {
    enemyTurnTimeoutRef.current = window.setTimeout(() => {
      const baseDmg =
        currentMonster.attackMin +
        Math.floor(
          Math.random() * (currentMonster.attackMax - currentMonster.attackMin + 1)
        );
      const isSpecialStrike = Math.random() < 0.25;
      const rawDmg = isSpecialStrike ? baseDmg + 5 : baseDmg;
      const finalDmg = isDefending ? Math.max(2, Math.floor(rawDmg * 0.4)) : rawDmg;

      hannaAudio.playMonsterHit();
      setEnemyAnim('lunge');
      setPlayerAnim('hurt');
      spawnFloating('player', `-${finalDmg} HP`, '#FF9B38');

      const nextHp = Math.max(0, currentPlayerHp - finalDmg);
      setPlayerHp(nextHp);
      setDefending(false);

      if (isSpecialStrike) {
        setDialogue(
          `${currentMonster.name} uses ${currentMonster.specialAbility}! Deals ${finalDmg} damage${
            isDefending ? ' (Blocked!)' : '!'
          }`
        );
      } else {
        setDialogue(
          `${currentMonster.name} attacks! ${selectedCharacter.name} takes ${finalDmg} damage${
            isDefending ? ' (Guarded!)' : '!'
          }`
        );
      }

      window.setTimeout(() => {
        setEnemyAnim('idle');
        setPlayerAnim('idle');
        if (nextHp <= 0) {
          setBattleState('DEFEAT');
          setDialogue(`${selectedCharacter.name} ran out of HP... Try again!`);
        }
        setTurnBusy(false);
      }, 320);
    }, 680);
  };

  const handleAction = (action: 'attack' | 'special' | 'defend' | 'heal') => {
    if (turnBusy || battleState !== 'FIGHTING') return;
    hannaAudio.unlockFromUserGesture();

    if (action === 'special' && specialCooldown > 0) return;
    if (action === 'heal' && healCharges <= 0) return;

    setTurnBusy(true);

    if (action === 'attack' || action === 'special') {
      const base =
        action === 'special'
          ? 24 + Math.floor(Math.random() * 11)
          : 13 + Math.floor(Math.random() * 9);
      const dmg = Math.max(6, base - currentMonster.defense);

      if (action === 'special') {
        hannaAudio.playSpecial();
        setSpecialCooldown(2);
      } else {
        hannaAudio.playAttack();
        setSpecialCooldown((cd) => Math.max(0, cd - 1));
      }

      setPlayerAnim('lunge');
      setEnemyAnim('hurt');
      spawnFloating(
        'enemy',
        action === 'special' ? `★ -${dmg}` : `-${dmg}`,
        action === 'special' ? '#8CE5E8' : '#F5A6C8'
      );

      const nextEnemyHp = Math.max(0, enemyHp - dmg);
      setEnemyHp(nextEnemyHp);
      setDialogue(
        action === 'special'
          ? `${selectedCharacter.name} unleashes ${selectedCharacter.specialSkill}! Dealt ${dmg} damage!`
          : `${selectedCharacter.name} strikes ${currentMonster.name} for ${dmg} damage!`
      );

      window.setTimeout(() => {
        setPlayerAnim('idle');
        setEnemyAnim('idle');

        if (nextEnemyHp <= 0) {
          hannaAudio.playVictory();
          setBattleState('VICTORY');
          setTurnBusy(false);
          recordBattleWin(currentMonster.id, currentMonster.xpReward);
          setDialogue(
            `YOU WIN! ${currentMonster.name} defeated! Earned +${currentMonster.xpReward} XP!`
          );
        } else {
          triggerEnemyTurn(false, playerHp);
        }
      }, 340);
      return;
    }

    if (action === 'defend') {
      hannaAudio.playDefend();
      setDefending(true);
      setSpecialCooldown((cd) => Math.max(0, cd - 1));
      setDialogue(`${selectedCharacter.name} raises guard! Incoming damage reduced.`);
      triggerEnemyTurn(true, playerHp);
      return;
    }

    // heal
    const healAmt = 24 + Math.floor(Math.random() * 9);
    const healedHp = Math.min(100, playerHp + healAmt);
    hannaAudio.playHeal();
    setHealCharges((c) => c - 1);
    setSpecialCooldown((cd) => Math.max(0, cd - 1));
    setPlayerHp(healedHp);
    spawnFloating('player', `+${healAmt} HP`, '#8CE5E8');
    setDialogue(`${selectedCharacter.name} drinks a Pixel Berry Potion (+${healAmt} HP)!`);
    triggerEnemyTurn(false, healedHp);
  };

  const nextUnlockedIdx = monsterIdx + 1;
  const hasNextMonster = nextUnlockedIdx < MONSTERS.length;

  return (
    <main className="min-h-[calc(100vh-3.5rem)] w-full spooky-pixel-bg py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Top Monster Battle Header + Monster Selector */}
        <section className="pixel-frame-purple p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="font-pixel text-xs sm:text-base text-[#FF9B38]">
              MONSTER BATTLE!
            </h1>
            <p className="font-vt text-xl text-[#FFF0D5]">
              Defeat forest guardians to earn XP, cards, and unlock the Secret Room!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {MONSTERS.map((m, idx) => {
              const unlocked = isMonsterUnlocked(idx);
              const defeated = progress.defeatedMonsterIds.includes(m.id);
              const active = idx === monsterIdx;
              return (
                <button
                  key={m.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => startBattleWithMonster(idx)}
                  className={`px-3 py-1.5 border-2 border-[#211A2B] font-pixel text-[8px] inline-flex items-center gap-1 cursor-pointer ${
                    !unlocked
                      ? 'bg-[#6B1D47] text-[#FFF0D5]/55 cursor-not-allowed'
                      : active
                      ? 'bg-[#FF9B38] text-[#211A2B]'
                      : defeated
                      ? 'bg-[#8CE5E8] text-[#211A2B]'
                      : 'bg-[#B83B77] text-[#FFF0D5] hover:bg-[#D14D8D]'
                  }`}
                >
                  {!unlocked && <Lock className="w-2.5 h-2.5" />}
                  <span>
                    {idx + 1}. {m.name} {defeated ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Battle Arena Window */}
        <section className="pixel-frame-navy p-3 sm:p-4 space-y-4">
          {/* Fighter HP HUDs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 tabular-nums">
            {/* Player HP Box */}
            <div className="bg-[#C24280] border-3 border-[#211A2B] p-3 space-y-1.5">
              <div className="flex items-center justify-between font-pixel text-[9px]">
                <span className="text-[#8CE5E8]">
                  {selectedCharacter.name} {defending ? '(GUARD)' : ''}
                </span>
                <span className="text-[#FFF0D5]">{playerHp} / 100 HP</span>
              </div>
              <div className="w-full h-4 bg-[#6B1D47] border-2 border-[#211A2B] p-0.5">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${playerHp}%`,
                    backgroundColor: playerHp > 35 ? '#8CE5E8' : '#FF9B38',
                  }}
                />
              </div>
            </div>

            {/* Enemy HP Box */}
            <div className="bg-[#C24280] border-3 border-[#211A2B] p-3 space-y-1.5">
              <div className="flex items-center justify-between font-pixel text-[9px]">
                <span className="text-[#FFE4F2]">{currentMonster.name}</span>
                <span className="text-[#FFF0D5]">
                  {enemyHp} / {currentMonster.maxHp} HP
                </span>
              </div>
              <div className="w-full h-4 bg-[#6B1D47] border-2 border-[#211A2B] p-0.5">
                <div
                  className="h-full bg-[#F5A6C8] transition-all duration-300"
                  style={{
                    width: `${Math.round((enemyHp / currentMonster.maxHp) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Forest Battlefield Stage */}
          <div className="relative w-full h-64 sm:h-72 border-4 border-[#211A2B] overflow-hidden">
            <ForestBattleBackdrop />

            {/* Combatants Positioned Left & Right */}
            <div className="relative z-10 h-full flex items-end justify-between px-6 sm:px-16 pb-6">
              {/* Player Side */}
              <div className="relative flex flex-col items-center">
                {floatingHits
                  .filter((h) => h.side === 'player')
                  .map((h) => (
                    <span
                      key={h.id}
                      style={{ color: h.color }}
                      className="absolute -top-6 left-1/2 font-pixel text-xs drop-shadow-[2px_2px_0_#211A2B] animate-damage-float whitespace-nowrap"
                    >
                      {h.text}
                    </span>
                  ))}
                <div
                  className={
                    playerAnim === 'lunge'
                      ? 'animate-lunge-right'
                      : playerAnim === 'hurt'
                      ? 'animate-battle-shake'
                      : ''
                  }
                >
                  <CharacterSprite id={selectedCharacter.id} size={108} />
                </div>
              </div>

              {/* Enemy Side */}
              <div className="relative flex flex-col items-center">
                {floatingHits
                  .filter((h) => h.side === 'enemy')
                  .map((h) => (
                    <span
                      key={h.id}
                      style={{ color: h.color }}
                      className="absolute -top-6 left-1/2 font-pixel text-xs drop-shadow-[2px_2px_0_#211A2B] animate-damage-float whitespace-nowrap"
                    >
                      {h.text}
                    </span>
                  ))}
                <div
                  className={
                    enemyAnim === 'lunge'
                      ? 'animate-lunge-left'
                      : enemyAnim === 'hurt'
                      ? 'animate-battle-shake'
                      : ''
                  }
                >
                  {battleState === 'VICTORY' ? (
                    <div className="text-center space-y-1 animate-pixel-bob">
                      <PixelStarIcon size={48} color="#FF9B38" />
                      <p className="font-pixel text-[8px] text-[#FF9B38]">DEFEATED!</p>
                    </div>
                  ) : (
                    <MonsterSprite id={currentMonster.id} size={114} />
                  )}
                </div>
              </div>
            </div>

            {/* Victory / Defeat Overlay */}
            {battleState !== 'FIGHTING' && (
              <div className="absolute inset-0 z-20 bg-[#6B1D47]/85 flex flex-col items-center justify-center p-4 text-center gap-3">
                <h2
                  className={`font-pixel text-lg sm:text-2xl drop-shadow-[3px_3px_0_#211A2B] ${
                    battleState === 'VICTORY' ? 'text-[#FF9B38]' : 'text-[#F5A6C8]'
                  }`}
                >
                  {battleState === 'VICTORY' ? 'YOU WIN!' : 'GAME OVER'}
                </h2>
                <p className="font-vt text-xl text-[#FFF0D5] max-w-md">
                  {battleState === 'VICTORY'
                    ? `Reward: +${currentMonster.xpReward} XP & Mystery Creature Card unlocked!`
                    : 'Your adventurer needs a quick rest. Jump back into battle!'}
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => startBattleWithMonster(monsterIdx)}
                    className="pixel-btn px-4 py-2.5 bg-[#8CE5E8] text-[#211A2B] font-pixel text-[9px] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{battleState === 'VICTORY' ? 'REMATCH' : 'RETRY'}</span>
                  </button>

                  {battleState === 'VICTORY' && hasNextMonster && (
                    <button
                      type="button"
                      onClick={() => startBattleWithMonster(nextUnlockedIdx)}
                      className="pixel-btn px-4 py-2.5 bg-[#FF9B38] text-[#211A2B] font-pixel text-[9px] cursor-pointer"
                    >
                      NEXT MONSTER ▶
                    </button>
                  )}

                  {battleState === 'VICTORY' && (
                    <button
                      type="button"
                      onClick={() => navigate('COLLECTION')}
                      className="pixel-btn px-4 py-2.5 bg-[#F5A6C8] text-[#211A2B] font-pixel text-[9px] cursor-pointer"
                    >
                      VIEW CARDS
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Retro Battle Dialogue Box */}
          <div className="bg-[#FFF0D5] border-4 border-[#211A2B] p-3.5 text-[#211A2B] min-h-[68px] flex items-center">
            <p className="font-vt text-xl sm:text-2xl leading-tight">
              ▶ {typedDialogue}
            </p>
          </div>

          {/* Four Battle Action Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              disabled={turnBusy || battleState !== 'FIGHTING'}
              onClick={() => handleAction('attack')}
              className="pixel-btn py-3 px-3 bg-[#FF9B38] disabled:opacity-50 text-[#211A2B] font-pixel text-[9px] sm:text-[10px] inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sword className="w-4 h-4 shrink-0" />
              <span>ATTACK</span>
            </button>

            <button
              type="button"
              disabled={turnBusy || battleState !== 'FIGHTING' || specialCooldown > 0}
              onClick={() => handleAction('special')}
              className="pixel-btn py-3 px-3 bg-[#8CE5E8] disabled:opacity-50 text-[#211A2B] font-pixel text-[9px] sm:text-[10px] inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                {specialCooldown > 0 ? `WAIT (${specialCooldown})` : 'SPECIAL SKILL'}
              </span>
            </button>

            <button
              type="button"
              disabled={turnBusy || battleState !== 'FIGHTING'}
              onClick={() => handleAction('defend')}
              className="pixel-btn py-3 px-3 bg-[#FFB78C] disabled:opacity-50 text-[#211A2B] font-pixel text-[9px] sm:text-[10px] inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>DEFEND</span>
            </button>

            <button
              type="button"
              disabled={turnBusy || battleState !== 'FIGHTING' || healCharges <= 0}
              onClick={() => handleAction('heal')}
              className="pixel-btn py-3 px-3 bg-[#F5A6C8] disabled:opacity-50 text-[#211A2B] font-pixel text-[9px] sm:text-[10px] inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-4 h-4 shrink-0" />
              <span>HEAL ({healCharges})</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
