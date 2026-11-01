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
  Award,
  Heart,
  BookOpen,
  Crown
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
    // 1. Shouting the house name!
    const announceText = `¡¡¡${house.name.toUpperCase()}!!! ¡Bienvenido a ${house.name}!`;
    AudioController.speakHat(announceText);
    AudioController.playFanfare();

    // 2. Confetti explosions
    const houseColorsMap: Record<HouseId, string[]> = {
      gryffindor: ['#8a0303', '#f1be32', '#ffffff'],
      ravenclaw: ['#0c2340', '#38bdf8', '#9e7339'],
      hufflepuff: ['#fdb913', '#111111', '#ffffff'],
      slytherin: ['#1a472a', '#a7a8aa', '#34d399']
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
        // user cancelled or share failed
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Instituto Obras · Feria Escolar</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-300 font-cinzel">
          ¡El Sombrero Seleccionador ha hablado!
        </h2>
      </div>

      {/* Hero House Reveal Card */}
      <div
        className="rounded-3xl p-6 sm:p-10 border-2 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-center mb-8"
        style={{
          borderColor: house.secondaryColor,
          background: `radial-gradient(circle at top, ${house.primaryColor}55, #0c0d12 85%)`,
          boxShadow: `0 0 60px ${house.accentGlow}`
        }}
      >
        {/* Floating 3D Hat Header */}
        <div className="w-full h-44 sm:h-56 -mt-4 sm:-mt-6 relative flex items-center justify-center">
          <ThreeHatScene mode="reveal" activeHouse={houseId} themeColor={house.secondaryColor} />
        </div>

        {/* House Shield / Crest */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto -mt-6 sm:-mt-8 mb-4 relative z-10 animate-float">
          <img
            src={house.crest}
            alt={house.name}
            className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]"
          />
        </div>

        {/* Big House Name */}
        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-black font-cinzel tracking-wider uppercase mb-2"
          style={{
            color: house.secondaryColor,
            textShadow: `0 0 30px ${house.accentGlow}`
          }}
        >
          {house.name}
        </h1>

        {/* Student greeting */}
        <p className="text-lg sm:text-2xl font-bold text-white mb-4">
          ¡Felicitaciones, <span className="text-amber-400">{studentName || 'Joven Mago'}</span>!
        </p>

        {/* Traits Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {house.traits.map(t => (
            <span
              key={t}
              className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-black/50 border border-white/15 text-amber-200 backdrop-blur-md"
            >
              ★ {t}
            </span>
          ))}
        </div>

        {/* Kid Lore Description */}
        <div className="max-w-2xl mx-auto bg-black/40 rounded-2xl p-4 sm:p-6 border border-white/10 mb-6 text-left">
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-3">
            {house.kidDescription}
          </p>
          <div className="flex items-start gap-2.5 pt-3 border-t border-white/10 text-xs sm:text-sm text-amber-300 font-medium">
            <span className="text-lg">🏀</span>
            <span>
              <strong className="text-amber-400">Tu espíritu en el Instituto Obras:</strong>{' '}
              {house.obrasConnection}
            </span>
          </div>
        </div>

        {/* Score Breakdown Bars */}
        <div className="max-w-xl mx-auto bg-black/60 rounded-2xl p-4 border border-white/10 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300/80 mb-3 text-center">
            Afinidad Mágica de tus Respuestas
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
                  className={`p-2 rounded-xl border transition-all ${
                    isWinner ? 'bg-amber-500/20 border-amber-400' : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className="text-[11px] font-bold text-gray-300 mb-1 flex items-center justify-center gap-1">
                    {hId === 'gryffindor' && <Shield className="w-3 h-3 text-red-400" />}
                    {hId === 'hufflepuff' && <Heart className="w-3 h-3 text-yellow-400" />}
                    {hId === 'ravenclaw' && <BookOpen className="w-3 h-3 text-blue-400" />}
                    {hId === 'slytherin' && <Crown className="w-3 h-3 text-emerald-400" />}
                    <span>{h.name}</span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-white">{percent}%</div>
                  <div className="text-[10px] text-gray-400">({score} votos)</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary CTA: Diploma Generator */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-10">
          <button
            onClick={() => {
              AudioController.playSelect();
              onOpenDiploma();
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black shadow-[0_0_30px_rgba(253,185,19,0.5)] flex items-center justify-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
          >
            <Download className="w-5 h-5 text-black" />
            <span>Descargar Diploma Oficial</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center gap-2 transition-all hover:border-amber-400/50"
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
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm bg-black/60 hover:bg-black/90 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nuevo Estudiante</span>
          </button>
        </div>
      </div>
    </div>
  );
};
