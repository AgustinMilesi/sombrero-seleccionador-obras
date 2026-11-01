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
  CheckCircle,
  MessageSquare,
  Brain,
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
  Eye,
  CheckCircle,
  MessageSquare,
  Brain,
  Wand2
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
    const tiltX = -(y / (rect.height / 2)) * 9;
    const tiltY = (x / (rect.width / 2)) * 9;
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
        {/* Previous Button - Antique Hogwarts Bronze Seal */}
        <button
          onClick={handlePrev}
          aria-label="Opción anterior"
          className="absolute -left-3 sm:-left-6 md:-left-10 z-20 p-2.5 sm:p-3.5 rounded-full bg-[#1b1712] border-2 border-[#8e6d2b] text-[#f2d88c] hover:text-[#fff2be] hover:bg-[#282117] hover:border-[#d4af37] hover:scale-110 active:scale-95 transition-all duration-200 shadow-[0_6px_20px_rgba(0,0,0,0.8)] backdrop-blur-md group"
          onMouseEnter={() => AudioController.playHover()}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Opción siguiente"
          className="absolute -right-3 sm:-right-6 md:-right-10 z-20 p-2.5 sm:p-3.5 rounded-full bg-[#1b1712] border-2 border-[#8e6d2b] text-[#f2d88c] hover:text-[#fff2be] hover:bg-[#282117] hover:border-[#d4af37] hover:scale-110 active:scale-95 transition-all duration-200 shadow-[0_6px_20px_rgba(0,0,0,0.8)] backdrop-blur-md group"
          onMouseEnter={() => AudioController.playHover()}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 3D Hogwarts Parchment / Dark Oak Interactive Card */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.15s ease-out, border-color 0.4s ease, box-shadow 0.4s ease'
          }}
          className={`w-full rounded-2xl sm:rounded-3xl p-6 sm:p-9 backdrop-blur-xl border-2 transition-all duration-300 relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.85)] ${
            isSelected
              ? 'bg-gradient-to-br from-[#241a12]/95 via-[#16120e]/98 to-[#0d0a08]/98 border-[#d4af37] shadow-[0_0_40px_rgba(212,175,55,0.25)]'
              : 'bg-gradient-to-br from-[#1a1612]/95 via-[#120f0d]/98 to-[#0a0807]/98 border-[#6b5220]/60 hover:border-[#aa822c] shadow-[0_15px_35px_rgba(0,0,0,0.7)]'
          }`}
        >
          {/* Subtle Warm Amber Vignette Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none bg-amber-600/10 group-hover:bg-amber-600/20 transition-colors duration-500" />

          {/* Card Header: Wax seal letter badge & neutral mystery seal */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-10">
            <div className="flex items-center gap-3">
              {/* Authentic Burgundy Wax Seal */}
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-black text-xl text-[#f5ecd0] font-cinzel shadow-[0_4px_12px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:scale-105 border-2 border-[#420909] bg-radial from-[#961a1a] via-[#610a0a] to-[#360505]">
                {activeOption.letter}
              </div>

              <div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-amber-300/90 flex items-center gap-1 font-cinzel">
                  <Wand2 className="w-3 h-3 text-amber-400" /> Opción {activeOption.letter}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-amber-100 font-cinzel">
                  Elección Misteriosa
                </h4>
              </div>
            </div>

            {/* Secret Mystery Crest Seal */}
            <div className="flex items-center gap-1.5 bg-[#1f1912] px-3.5 py-1.5 rounded-full border border-[#8a6825]/50 backdrop-blur-md shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] sm:text-xs font-bold font-cinzel text-amber-200">
                Secreto de Hogwarts
              </span>
            </div>
          </div>

          {/* Centerpiece Icon & Dilemma Text */}
          <div className="my-5 sm:my-7 flex flex-col items-center text-center relative z-10">
            {/* Antique Bronze Icon Medallion */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-inner bg-[#251e16] border-2 border-[#8f6d2a]/50 shadow-[0_0_20px_rgba(0,0,0,0.7)]">
              <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300" />
            </div>

            {/* The Choice Text */}
            <p className="text-base sm:text-lg md:text-xl font-medium text-[#f7eee2] leading-relaxed max-w-xl font-outfit">
              "{activeOption.text}"
            </p>
          </div>

          {/* Action Button: "Elegir esta Opción" */}
          <div className="mt-6 pt-4 border-t border-[#4a3a1b]/60 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            <div className="text-xs text-amber-200/60 text-center sm:text-left font-cinzel">
              Opción <span className="font-bold text-amber-400">{currentIndex + 1}</span> de{' '}
              <span className="font-bold text-amber-100">{options.length}</span>
            </div>

            <button
              onClick={handleSelect}
              className={`w-full sm:w-auto px-7 sm:px-9 py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 transform active:scale-95 shadow-xl font-cinzel ${
                isSelected
                  ? 'bg-gradient-to-b from-[#e5be59] via-[#c4982f] to-[#926c19] text-[#1c1204] border-2 border-[#543d12] shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-[1.02]'
                  : 'bg-[#1e1913] hover:bg-[#2b241c] text-[#f2e2be] border-2 border-[#73551f] hover:border-[#b88c34]'
              }`}
            >
              {isSelected ? (
                <>
                  <CheckCircle className="w-5 h-5 text-[#1c1204]" />
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

      {/* Quick Option Selector Pills (A, B, C, D) - Antique Hogwarts Wax Seal Buttons */}
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
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold font-cinzel transition-all duration-200 border-2 ${
                isCurrent
                  ? 'bg-[#2e2316] border-[#d4af37] text-amber-200 scale-105 shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-[#15120e] border-[#523d17] text-gray-400 hover:text-amber-200 hover:border-[#8e6d2b]'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 shadow-sm" />
              <span>Opción {opt.letter}</span>
              {isChosen && <CheckCircle className="w-3.5 h-3.5 text-amber-400 ml-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
