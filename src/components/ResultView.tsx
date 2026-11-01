import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { HouseId, HOUSES } from '../data/houses';
import { AudioController } from './AudioController';
import { ThreeHatScene } from './ThreeHatScene';
import {
  Sparkles,
  Download,
  RotateCcw,
  Share2,
  Check,
  Shield,
  Heart,
  BookOpen,
  Crown,
  Wand2
} from 'lucide-react';

interface ResultViewProps {
  houseId: HouseId;
  studentName: string;
  scores: Record<HouseId, number>;
  onRetake: () => void;
  onOpenDiploma: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  houseId,
  studentName,
  scores,
  onRetake,
  onOpenDiploma
}) => {
  const house = HOUSES[houseId];
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Shouting the house name in deep neural Spanish voice!
    AudioController.playHatAudio(houseId);
    AudioController.playFanfare();

    // 2. Confetti explosions matching movie house colors
    const houseColorsMap: Record<HouseId, string[]> = {
      gryffindor: ['#740001', '#d3a625', '#eeba30'],
      ravenclaw: ['#0e1a40', '#946b2d', '#222f5b'],
      hufflepuff: ['#ecb939', '#121212', '#f0c75e'],
      slytherin: ['#1a472a', '#aaaaaa', '#2a623d']
    };
    const colors = houseColorsMap[houseId];

    const end = Date.now() + 3.5 * 1000;
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [houseId]);

  const handleShare = async () => {
    const text = `🎩 ¡El Sombrero Seleccionador me ha asignado a ${house.name.toUpperCase()} en la Feria del Instituto Obras! 🦁🦅🦡🐍`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi Casa en el Instituto Obras',
          text: text,
          url: window.location.href
        });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text + ' ' + window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const totalScore = Math.max(1, Object.values(scores).reduce((a, b) => a + b, 0));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 animate-fade-in relative">
      {/* Top Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/30 border border-amber-600/40 text-amber-200 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Instituto Obras · Gran Salón de Selección</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-amber-100 font-cinzel">
          ¡El Sombrero Seleccionador ha hablado!
        </h2>
      </div>

      {/* Hero House Reveal Card - Harry Potter Movie Gothic Aesthetic */}
      <div
        className="rounded-3xl p-6 sm:p-10 border-2 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-center mb-8"
        style={{
          borderColor: house.secondaryColor,
          background: `radial-gradient(circle at top, ${house.primaryColor}66, #0e0d0c 85%)`,
          boxShadow: `0 0 50px rgba(0, 0, 0, 0.9), inset 0 0 60px ${house.accentGlow}`
        }}
      >
        {/* Floating 3D Hat Header */}
        <div className="w-full h-44 sm:h-56 -mt-4 sm:-mt-6 relative flex items-center justify-center">
          <ThreeHatScene mode="reveal" activeHouse={houseId} themeColor={house.secondaryColor} />
        </div>

        {/* House Crest */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto -mt-6 sm:-mt-8 mb-4 relative z-10 animate-float">
          <img
            src={house.crest}
            alt={house.name}
            className="w-full h-full object-contain filter drop-shadow-[0_12px_25px_rgba(0,0,0,0.9)]"
          />
        </div>

        {/* Big House Name in Movie Typography */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-black font-cinzel tracking-wider uppercase mb-2"
          style={{
            color: house.secondaryColor,
            textShadow: `0 2px 10px rgba(0,0,0,0.9), 0 0 25px ${house.accentGlow}`
          }}
        >
          {house.name}
        </h1>

        {/* Student greeting */}
        <p className="text-lg sm:text-2xl font-bold text-amber-100 mb-4 font-cinzel">
          ¡Felicitaciones, <span className="text-amber-400">{studentName || 'Joven Mago'}</span>!
        </p>

        {/* Traits Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {house.traits.map(t => (
            <span
              key={t}
              className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold bg-black/60 border border-amber-600/30 text-amber-200 backdrop-blur-md"
            >
              ★ {t}
            </span>
          ))}
        </div>

        {/* Kid Lore Description */}
        <div className="max-w-2xl mx-auto bg-black/50 rounded-2xl p-5 sm:p-6 border border-amber-500/20 mb-6 text-left">
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-3">
            {house.kidDescription}
          </p>
          <div className="flex items-start gap-2.5 pt-3 border-t border-amber-500/20 text-xs sm:text-sm text-amber-300 font-medium">
            <span className="text-lg">🏀</span>
            <span>
              <strong className="text-amber-400">Tu espíritu en el Instituto Obras:</strong>{' '}
              {house.obrasConnection}
            </span>
          </div>
        </div>

        {/* The 3 Most Important Characters of the House (Requested Feature!) */}
        <div className="max-w-2xl mx-auto mb-6 text-left">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <Wand2 className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm sm:text-base font-black font-cinzel uppercase tracking-wider text-amber-300">
              3 Grandes Magos y Brujas de {house.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {house.characters.map((char) => (
              <div
                key={char.name}
                className="bg-[#141210]/80 border border-amber-600/30 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-md hover:border-amber-400/60 transition-all hover:scale-[1.02] shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-2xl mb-2 shadow-inner">
                  {char.avatarIcon}
                </div>
                <h4 className="text-sm font-bold text-amber-100 font-cinzel mb-0.5">
                  {char.name}
                </h4>
                <span className="text-[10px] font-semibold text-amber-400/90 mb-2 leading-tight">
                  {char.title}
                </span>
                <p className="text-[11px] text-gray-300 leading-snug">
                  {char.deed}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Score Breakdown Bars */}
        <div className="max-w-xl mx-auto bg-black/60 rounded-2xl p-4 border border-amber-500/20 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300/80 mb-3 text-center">
            Afinidad de tus Respuestas
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {(['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'] as HouseId[]).map(hId => {
              const h = HOUSES[hId];
              const score = scores[hId] || 0;
              const percent = Math.round((score / totalScore) * 100);
              const isWinner = hId === houseId;

              return (
                <div
                  key={hId}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isWinner ? 'bg-amber-950/40 border-amber-400' : 'bg-black/40 border-white/5'
                  }`}
                >
                  <div className="text-[11px] font-bold text-gray-300 mb-1 flex items-center justify-center gap-1">
                    {hId === 'gryffindor' && <Shield className="w-3 h-3 text-amber-500" />}
                    {hId === 'hufflepuff' && <Heart className="w-3 h-3 text-yellow-500" />}
                    {hId === 'ravenclaw' && <BookOpen className="w-3 h-3 text-amber-300" />}
                    {hId === 'slytherin' && <Crown className="w-3 h-3 text-emerald-400" />}
                    <span>{h.name}</span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-amber-200">{percent}%</div>
                  <div className="text-[10px] text-gray-400">({score} respuestas)</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Action Buttons - Authentic Wizarding World Style (No Neon) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-10">
          {/* Embossed Antique Gold Button */}
          <button
            onClick={() => {
              AudioController.playSelect();
              onOpenDiploma();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base bg-gradient-to-b from-[#e5be59] via-[#c4982f] to-[#926c19] hover:from-[#f0cf74] hover:via-[#d5aa3c] hover:to-[#a37a20] text-[#1c1204] border-2 border-[#543d12] shadow-[0_4px_16px_rgba(0,0,0,0.8)] flex items-center justify-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 font-cinzel"
          >
            <Download className="w-5 h-5 text-[#1c1204]" />
            <span>Descargar Diploma Oficial</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm bg-[#1c1a16] hover:bg-[#282520] text-amber-200 border border-amber-600/40 flex items-center justify-center gap-2 transition-all hover:border-amber-400/80 shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>¡Copiado al portapapeles!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Compartir Resultado</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              AudioController.playSwoosh();
              onRetake();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm bg-black/70 hover:bg-black/90 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nuevo Estudiante</span>
          </button>
        </div>
      </div>
    </div>
  );
};
