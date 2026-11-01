import React, { useEffect, useState } from 'react';
import { HouseId, HOUSES } from '../data/houses';
import { AudioController } from './AudioController';
import { ThreeHatScene } from './ThreeHatScene';
import { Sparkles, Wand2 } from 'lucide-react';

interface DeliberationSceneProps {
  topHouse: HouseId;
  studentName: string;
  onDeliberationComplete: () => void;
}

export const DeliberationScene: React.FC<DeliberationSceneProps> = ({
  topHouse,
  studentName,
  onDeliberationComplete
}) => {
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
  const house = HOUSES[topHouse];

  const thoughts = [
    `Mmm... déjame mirar dentro de ti${studentName ? `, ${studentName}` : ''}...`,
    '¡Veo un corazón sincero y un gran potencial por descubrir!',
    'Mucha lealtad... y una chispa que no se rinde ante nada.',
    '¿Será Gryffindor? ¿O tal vez la astucia de Slytherin? ¿Ravenclaw o la nobleza de Hufflepuff?',
    '¡Sí... ya lo veo con total claridad!',
    '¡¡LA DECISIÓN ESTÁ TOMADA!!'
  ];

  useEffect(() => {
    const stopDrone = AudioController.playSuspenseDrone();

    // Voice speaking in the background
    const speechScript = `Mmm, déjame ver qué tenemos por aquí. ¡Qué carácter tan interesante! Veo valentía, astucia y un gran deseo de aprender. No hay duda... ¡Ya sé cuál es tu verdadero hogar!`;
    AudioController.speakHat(speechScript);

    // Timeline for thought phrases
    const interval = setInterval(() => {
      setCurrentThoughtIndex(prev => {
        if (prev < thoughts.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            stopDrone();
            onDeliberationComplete();
          }, 1200);
          return prev;
        }
      });
    }, 1400);

    return () => {
      clearInterval(interval);
      stopDrone();
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center relative">
      {/* 3D Hat thinking in center with mysterious golden glow */}
      <div className="w-full h-64 sm:h-80 relative flex items-center justify-center">
        <ThreeHatScene mode="thinking" themeColor="#fdb913" />
      </div>

      {/* Floating Magic Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 animate-pulse">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>El Sombrero Seleccionador está deliberando</span>
      </div>

      {/* Dynamic Thought Box */}
      <div className="min-h-[90px] flex items-center justify-center w-full px-4">
        <p className="text-xl sm:text-2xl md:text-3xl font-bold font-cinzel text-amber-100 italic transition-all duration-300 transform scale-105 filter drop-shadow-[0_2px_10px_rgba(253,185,19,0.5)]">
          "{thoughts[currentThoughtIndex]}"
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-2 mt-6">
        {thoughts.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i <= currentThoughtIndex ? 'bg-amber-400 scale-110 shadow-[0_0_10px_#fdb913]' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      <div className="mt-8 text-xs text-amber-300/70 flex items-center gap-1.5 font-medium">
        <Wand2 className="w-3.5 h-3.5" /> Escucha la voz del Sombrero...
      </div>
    </div>
  );
};
