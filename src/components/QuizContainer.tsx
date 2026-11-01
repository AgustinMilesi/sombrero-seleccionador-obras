import React, { useState } from 'react';
import { QUIZ_QUESTIONS, QuizOption } from '../data/questions';
import { ThreeHatScene } from './ThreeHatScene';
import { QuestionCard } from './QuestionCard';
import { AudioController } from './AudioController';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Wand2,
  CheckCircle2,
  Smartphone
} from 'lucide-react';

interface QuizContainerProps {
  studentName: string;
  onFinishQuiz: (answers: Record<number, QuizOption>) => void;
  onBackToHome: () => void;
}

export const QuizContainer: React.FC<QuizContainerProps> = ({
  studentName,
  onFinishQuiz,
  onBackToHome
}) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, QuizOption>>({});

  const currentQ = QUIZ_QUESTIONS[questionIdx];
  const selectedOptionForThisQ = answers[currentQ.id];

  const handleSelectOption = (opt: QuizOption) => {
    const updated = { ...answers, [currentQ.id]: opt };
    setAnswers(updated);
  };

  const handleNextQuestion = () => {
    AudioController.playSwoosh();
    if (questionIdx < QUIZ_QUESTIONS.length - 1) {
      setQuestionIdx(prev => prev + 1);
    } else {
      onFinishQuiz(answers);
    }
  };

  const handlePrevQuestion = () => {
    AudioController.playSwoosh();
    if (questionIdx > 0) {
      setQuestionIdx(prev => prev - 1);
    } else {
      onBackToHome();
    }
  };

  const isCurrentQAnswered = !!answers[currentQ.id];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const isLastQuestion = questionIdx === totalQuestions - 1;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-5 flex flex-col justify-between min-h-[calc(100vh-76px)]">
      {/* 1. Top Header: Progress bar with magical steps */}
      <div className="w-full mb-3 sm:mb-4">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-300 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold font-cinzel">Pregunta {questionIdx + 1}</span>
            <span className="text-gray-400">de {totalQuestions}</span>
            {studentName && (
              <span className="text-gray-400 hidden sm:inline">
                · Estudiante: <strong className="text-amber-200">{studentName}</strong>
              </span>
            )}
          </div>
          <div className="text-amber-300 font-medium text-xs hidden xs:flex items-center gap-1 font-cinzel">
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Instituto Obras</span>
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const isDone = !!answers[q.id];
            const isCurrent = idx === questionIdx;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  AudioController.playSwoosh();
                  setQuestionIdx(idx);
                }}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-400 shadow-[0_0_12px_#fdb913] scale-y-125'
                    : isDone
                    ? 'bg-amber-500/70'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                title={`Ir a pregunta ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Interactive 3D Sorting Hat - Compact Viewport with Phone Gyroscope Hint */}
      <div className="w-full flex flex-col items-center justify-center my-1 sm:my-2">
        <div className="w-full h-32 sm:h-44 md:h-52 relative flex items-center justify-center">
          <ThreeHatScene
            mode="question"
            themeColor="#fdb913"
          />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-amber-300/80 font-mono tracking-wide -mt-1 mb-2">
          <Smartphone className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Gira tu celular para que el Sombrero rote en 3D</span>
        </div>
      </div>

      {/* 3. High-Contrast Question Card & 4 Clear Options for Kids */}
      <div className="flex-1 flex flex-col justify-center">
        <QuestionCard
          questionTitle={currentQ.title}
          questionNumber={questionIdx + 1}
          totalQuestions={totalQuestions}
          options={currentQ.options}
          selectedLetter={selectedOptionForThisQ ? selectedOptionForThisQ.letter : null}
          onSelectOption={handleSelectOption}
        />
      </div>

      {/* 4. Bottom Sticky Navigation Bar */}
      <div className="w-full pt-4 pb-2 border-t border-white/10 flex items-center justify-between gap-3 mt-4">
        {/* Back Button */}
        <button
          type="button"
          onClick={handlePrevQuestion}
          className="px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-2 transition-all active:scale-95 cursor-pointer font-cinzel"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{questionIdx === 0 ? 'Inicio' : 'Anterior'}</span>
        </button>

        {/* Status Hint */}
        <div className="text-xs text-amber-300/90 hidden sm:flex items-center gap-1.5 font-medium">
          {isCurrentQAnswered ? (
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Opción {answers[currentQ.id].letter} seleccionada
            </span>
          ) : (
            <span>Toca una opción para responder</span>
          )}
        </div>

        {/* Next / Finish Button - Movie Antique Gold */}
        <button
          type="button"
          disabled={!isCurrentQAnswered}
          onClick={handleNextQuestion}
          className={`px-6 sm:px-9 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xl font-cinzel cursor-pointer ${
            !isCurrentQAnswered
              ? 'bg-[#1b1712] text-gray-500 cursor-not-allowed border-2 border-[#3d2e14]'
              : isLastQuestion
              ? 'bg-gradient-to-b from-[#e5be59] via-[#c4982f] to-[#926c19] text-[#1c1204] border-2 border-[#543d12] shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-105 active:scale-95'
              : 'bg-gradient-to-b from-[#caa03e] to-[#8d6919] hover:from-[#dab14c] hover:to-[#9f771e] text-[#1c1204] border-2 border-[#543d12] shadow-md active:scale-95'
          }`}
        >
          {isLastQuestion ? (
            <>
              <Sparkles className="w-4 h-4 text-black" />
              <span>¡Saber mi Casa!</span>
            </>
          ) : (
            <>
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
