import React from 'react';
import { QuizOption } from '../data/questions';
import { AudioController } from './AudioController';
import { CheckCircle2, Sparkles, Wand2 } from 'lucide-react';

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
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-3 px-2 sm:px-4">
      {/* 1. Prominent High-Contrast Question Card for Kids */}
      <div className="w-full bg-[#18130e]/95 border-2 border-[#d4af37]/85 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.9)] relative overflow-hidden backdrop-blur-md">
        {/* Ambient Warm Golden Corner Glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        {/* Hogwarts golden seal badge */}
        <div className="flex items-center justify-between mb-2.5 sm:mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold font-cinzel uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Misterio {questionNumber} de {totalQuestions}</span>
          </div>
          <span className="text-[11px] font-cinzel text-amber-300/70 hidden sm:inline flex items-center gap-1">
            <Wand2 className="w-3 h-3 text-amber-400" />
            <span>Elige con sinceridad</span>
          </span>
        </div>

        {/* Clear, High-Contrast Question Text in font-outfit (Large & Super Readable for Kids) */}
        <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white font-outfit leading-relaxed sm:leading-snug drop-shadow-md">
          {questionTitle}
        </h2>
      </div>

      {/* 2. The 4 Options (A, B, C, D) Clearly Visible & Easy to Tap */}
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
              className={`w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 flex items-center gap-3.5 active:scale-[0.98] relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#2e2013] to-[#1c140c] border-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.35)] scale-[1.01]'
                  : 'bg-[#14100c]/90 hover:bg-[#201810] border-[#6b5220]/70 hover:border-[#b88c34]'
              }`}
            >
              {/* Burgundy Wax Seal Letter (A, B, C, D) */}
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex-shrink-0 flex items-center justify-center font-black text-lg font-cinzel shadow-md border transition-transform ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#c92a2a] to-[#5a0808] border-amber-400 text-amber-100 scale-110 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'bg-gradient-to-br from-[#801818] to-[#3a0606] border-[#4a0d0d] text-amber-200'
                }`}
              >
                {opt.letter}
              </div>

              {/* Kid-Friendly Clear Text in font-outfit */}
              <div className="flex-1 pr-1 sm:pr-2">
                <p
                  className={`text-sm sm:text-base font-semibold font-outfit leading-snug transition-colors ${
                    isSelected ? 'text-amber-100 font-bold' : 'text-gray-100'
                  }`}
                >
                  {opt.text}
                </p>
              </div>

              {/* Selected Checkmark Indicator */}
              <div className="flex-shrink-0">
                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shadow-md animate-scale-in">
                    <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
