import React from 'react';
import { QuizOption } from '../data/questions';
import { AudioController } from './AudioController';
import { CheckCircle2, Scroll, Sparkles } from 'lucide-react';

interface QuestionCardProps {
  questionTitle: string;
  questionNumber: number;
  totalQuestions: number;
  options: QuizOption[];
  selectedLetter: string | null;
  onSelectOption: (option: QuizOption) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionTitle,
  questionNumber,
  totalQuestions,
  options,
  selectedLetter,
  onSelectOption
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-3.5 px-2 sm:px-4">
      {/* 1. ANCIENT WEATHERED PAPYRUS QUESTION SCROLL (Papiro Viejo del Gran Comedor) */}
      <div className="w-full relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 overflow-hidden bg-gradient-to-b from-[#fbf4e2] via-[#f4e6c5] to-[#e4cea0] border-4 border-[#825c27] shadow-[0_16px_45px_rgba(0,0,0,0.9),inset_0_0_70px_rgba(102,68,26,0.32)]">
        {/* Burnished Aged Parchment Texture Vignette & Creases */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#875d27]/10 to-[#523311]/35" />
        
        {/* Vintage Papyrus Deckled Edge Border Highlights */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#5a3613] via-[#a37637] to-[#5a3613] opacity-80" />
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#5a3613] via-[#a37637] to-[#5a3613] opacity-80" />

        {/* Antique Corner Filigree Accents (⚜) */}
        <span className="absolute top-2.5 left-3 text-sm text-[#875c27]/70 select-none font-serif">❧</span>
        <span className="absolute top-2.5 right-3 text-sm text-[#875c27]/70 select-none font-serif">❧</span>
        <span className="absolute bottom-2.5 left-3 text-sm text-[#875c27]/70 select-none font-serif">❧</span>
        <span className="absolute bottom-2.5 right-3 text-sm text-[#875c27]/70 select-none font-serif">❧</span>

        {/* Papyrus Header Banner */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10 border-b border-[#a67c3e]/40 pb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#523414]/15 border border-[#855c27]/50 text-[#422509] text-xs font-black font-cinzel tracking-wider uppercase shadow-inner">
            <Scroll className="w-3.5 h-3.5 text-[#7a4e1a]" />
            <span>Instituto Obras · Pregunta {questionNumber} de {totalQuestions}</span>
          </div>
          <span className="text-[11px] font-cinzel font-bold text-[#694218] hidden sm:inline flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#996420]" />
            <span>Voz de la Sabiduría</span>
          </span>
        </div>

        {/* Clear, High-Contrast Question Text in Deep Wizard Iron-Gall Ink */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1a0f05] font-outfit leading-relaxed sm:leading-snug relative z-10 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
          {questionTitle}
        </h2>
      </div>

      {/* 2. THE 4 OPTIONS: AGED PAPYRUS TABLETS WITH WAX SEALS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 mt-0.5">
        {options.map((opt) => {
          const isSelected = selectedLetter === opt.letter;
          return (
            <button
              key={opt.letter}
              type="button"
              onClick={() => {
                AudioController.playSelect();
                onSelectOption(opt);
              }}
              onMouseEnter={() => AudioController.playHover()}
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 sm:border-3 transition-all duration-200 flex items-center gap-3.5 active:scale-[0.98] relative overflow-hidden cursor-pointer shadow-lg ${
                isSelected
                  ? 'bg-gradient-to-r from-[#fffcf2] via-[#faedd2] to-[#f4deb5] border-[#b47a1c] ring-3 ring-amber-500/80 shadow-[0_0_24px_rgba(217,144,30,0.45)] scale-[1.01]'
                  : 'bg-gradient-to-r from-[#fefbf3] via-[#f8eedc] to-[#f0e0c3] hover:from-[#fffdf7] hover:to-[#f6e7cd] border-[#9e7a41]/70 hover:border-[#694619] shadow-[inset_0_0_12px_rgba(138,98,44,0.12)]'
              }`}
            >
              {/* Authentic 3D Burgundy Wax Seal with Letter (A, B, C, D) */}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xl font-cinzel shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] border-2 transition-transform ${
                  isSelected
                    ? 'bg-radial from-[#ba1e1e] via-[#750e0e] to-[#400505] border-amber-300 text-amber-100 scale-110 shadow-[0_0_12px_rgba(235,160,25,0.6)]'
                    : 'bg-radial from-[#8a1a1a] via-[#5c0d0d] to-[#360505] border-[#4f0c0c] text-amber-200'
                }`}
              >
                {opt.letter}
              </div>

              {/* Kid-Friendly Clear Text in Deep Antique Ink */}
              <div className="flex-1 pr-1 sm:pr-2">
                <p
                  className={`text-sm sm:text-base md:text-[17px] font-bold font-outfit leading-snug transition-colors ${
                    isSelected ? 'text-[#120a03] font-black' : 'text-[#241609]'
                  }`}
                >
                  {opt.text}
                </p>
              </div>

              {/* Selected Checkmark Stamp Indicator */}
              <div className="flex-shrink-0">
                {isSelected ? (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-amber-800 flex items-center justify-center shadow-md animate-scale-in">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#241303] stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-[#875d27]/40" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
