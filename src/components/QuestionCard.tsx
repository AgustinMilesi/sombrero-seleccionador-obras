import React, { useRef, useState } from 'react';
import { QuizOption } from '../data/questions';
import { AudioController } from './AudioController';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  HeartHandshake,
  Compass,
  Sword,
  BookOpen,
  Smile,
  Zap,
  Moon,
  Sun,
  Crown,
  Shield,
  Users,
  Search,
  Award,
  Scale,
  Heart,
  Gem,
  Coffee,
  Feather,
  Sparkle,
  DoorOpen,
  Scroll,
  Book,
  Eye,
  CheckCircle2,
  Wand2
} from 'lucide-react';

interface QuestionCardProps {
  options: QuizOption[];
  currentIndex: number;
  selectedLetter: string | null;
  onSelectOption: (option: QuizOption) => void;
  onNavigateOption: (newIndex: number) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Flame,
  Sparkles,
  HeartHandshake,
  Compass,
  Sword,
  BookOpen,
  Smile,
  Zap,
  Moon,
  Sun,
  Crown,
  Shield,
  Users,
  Search,
  Award,
  Scale,
  Heart,
  Gem,
  Coffee,
  Feather,
  Sparkle,
  DoorOpen,
  Scroll,
  Book,
  Eye
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  options,
  currentIndex,
  selectedLetter,
  onSelectOption,
  onNavigateOption
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const activeOption = options[currentIndex];
  const IconComponent = ICON_MAP[activeOption.iconName] || Sparkles;
  const isSelected = selectedLetter === activeOption.letter;

  // 3D Tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = -(y / (rect.height / 2)) * 10;
    const tiltY = (x / (rect.width / 2)) * 10;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handlePrev = () => {
    AudioController.playSwoosh();
    const nextIdx = (currentIndex - 1 + options.length) % options.length;
    onNavigateOption(nextIdx);
  };

  const handleNext = () => {
    AudioController.playSwoosh();
    const nextIdx = (currentIndex + 1) % options.length;
    onNavigateOption(nextIdx);
  };

  const handleSelect = () => {
    AudioController.playSelect();
    onSelectOption(activeOption);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4">
      {/* 3D Option Carousel Viewport */}
      <div className="relative flex items-center justify-center">
        {/* Previous Button (TikTok style navigation) */}
        <button
          onClick={handlePrev}
          aria-label="Opción anterior"
          className="absolute -left-3 sm:-left-6 md:-left-10 z-20 p-2 sm:p-3 rounded-full bg-black/60 border border-amber-500/30 text-amber-200 hover:text-amber-400 hover:bg-black/90 hover:border-amber-400 hover:scale-110 active:scale-95 transition-all duration-200 shadow-xl backdrop-blur-md group"
          onMouseEnter={() => AudioController.playHover()}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Opción siguiente"
          className="absolute -right-3 sm:-right-6 md:-right-10 z-20 p-2 sm:p-3 rounded-full bg-black/60 border border-amber-500/30 text-amber-200 hover:text-amber-400 hover:bg-black/90 hover:border-amber-400 hover:scale-110 active:scale-95 transition-all duration-200 shadow-xl backdrop-blur-md group"
          onMouseEnter={() => AudioController.playHover()}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 3D Glassmorphic Interactive Card - Completely neutral and mysterious */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.15s ease-out, border-color 0.4s ease, box-shadow 0.4s ease'
          }}
          className={`w-full rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-xl border transition-all duration-300 relative overflow-hidden group shadow-2xl ${
            isSelected
              ? 'bg-gradient-to-br from-amber-950/70 via-black/90 to-amber-950/40 border-amber-400 shadow-[0_0_35px_rgba(253,185,19,0.35)]'
              : 'bg-gradient-to-br from-[#12141c]/90 via-[#0d0e14]/95 to-black/90 border-white/10 hover:border-amber-500/40 shadow-[0_15px_35px_rgba(0,0,0,0.6)]'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none bg-amber-500/15 group-hover:bg-amber-500/25 transition-colors duration-500" />

          {/* Card Header: Wax seal letter badge & neutral mystical tag */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
            <div className="flex items-center gap-3">
              {/* Neutral Wax Seal / Letter Badge */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-black text-lg sm:text-xl text-amber-200 shadow-lg transition-transform duration-300 group-hover:scale-105 border border-amber-400/50 bg-gradient-to-br from-amber-700/60 via-amber-900/80 to-black shadow-[0_0_15px_rgba(253,185,19,0.3)]">
                {activeOption.letter}
              </div>

              <div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-amber-400/90 flex items-center gap-1">
                  <Wand2 className="w-3 h-3 text-amber-400" /> Opción {activeOption.letter}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-gray-200">
                  {activeOption.badgeLabel}
                </h4>
              </div>
            </div>

            {/* Secret Mystery Seal - NO house hints */}
            <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-full border border-amber-500/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] sm:text-xs font-medium text-amber-200/90">
                Elección Secreta
              </span>
            </div>
          </div>

          {/* Centerpiece Icon & Dilemma Text */}
          <div className="my-4 sm:my-6 flex flex-col items-center text-center relative z-10">
            {/* Glowing Golden Icon Orb */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-inner bg-amber-500/10 border border-amber-400/30 shadow-[0_0_20px_rgba(253,185,19,0.25)]">
              <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300" />
            </div>

            {/* The Choice Text */}
            <p className="text-base sm:text-lg md:text-xl font-medium text-amber-50/95 leading-relaxed max-w-xl">
              "{activeOption.text}"
            </p>
          </div>

          {/* Action Button: "Elegir esta Opción" */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            <div className="text-xs text-gray-400 text-center sm:text-left">
              Opción <span className="font-bold text-amber-400">{currentIndex + 1}</span> de{' '}
              <span className="font-bold text-gray-300">{options.length}</span>
            </div>

            <button
              onClick={handleSelect}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 transform active:scale-95 shadow-xl ${
                isSelected
                  ? 'bg-amber-400 text-black shadow-[0_0_25px_rgba(253,185,19,0.6)] scale-[1.02]'
                  : 'bg-white/10 hover:bg-white/20 text-white hover:text-amber-300 border border-white/15 hover:border-amber-400/50'
              }`}
            >
              {isSelected ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-black" />
                  <span>¡Opción Elegida!</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>Elegir esta Opción</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Option Selector Pills (A, B, C, D) - Neutral, no house colors */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-4 mt-5 sm:mt-6">
        {options.map((opt, idx) => {
          const isCurrent = idx === currentIndex;
          const isChosen = selectedLetter === opt.letter;
          return (
            <button
              key={opt.letter}
              onClick={() => {
                AudioController.playSwoosh();
                onNavigateOption(idx);
              }}
              onMouseEnter={() => AudioController.playHover()}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 border ${
                isCurrent
                  ? 'bg-amber-500/25 border-amber-400 text-amber-200 scale-105 shadow-[0_0_15px_rgba(253,185,19,0.3)]'
                  : 'bg-black/40 border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/25'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400/80" />
              <span>Opción {opt.letter}</span>
              {isChosen && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 ml-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
