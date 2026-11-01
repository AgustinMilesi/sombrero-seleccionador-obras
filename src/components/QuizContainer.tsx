import React, { useState } from 'react';
import { QUIZ_QUESTIONS, QuizOption } from '../data/questions';
import { HouseId } from '../data/houses';
import { ThreeHatScene } from './ThreeHatScene';
import { QuestionCard } from './QuestionCard';
import { AudioController } from './AudioController';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Wand2,
  CheckCircle2
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
  const [optionIdx, setOptionIdx] = useState(0); // 0 to 3 within the 4 options of the active question
  const [answers, setAnswers] = useState<Record<number, QuizOption>>({});

  const currentQ = QUIZ_QUESTIONS[questionIdx];
  const selectedOptionForThisQ = answers[currentQ.id];
  const activeOptionInCarousel = currentQ.options[optionIdx];

  const handleSelectOption = (opt: QuizOption) => {
    const updated = { ...answers, [currentQ.id]: opt };
    setAnswers(updated);

    // If not the last question, automatically smooth advance after 400ms or let child press next
    if (questionIdx < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        handleNextQuestion(updated);
      }, 450);
    }
  };

  const handleNextQuestion = (currentAnswers = answers) => {
    AudioController.playSwoosh();
    if (questionIdx < QUIZ_QUESTIONS.length - 1) {
      setQuestionIdx(prev => prev + 1);
      // Reset option index to 0 or to the previously selected option's index
      const nextQ = QUIZ_QUESTIONS[questionIdx + 1];
      const prevSelected = currentAnswers[nextQ.id];
      if (prevSelected) {
        const found = nextQ.options.findIndex(o => o.letter === prevSelected.letter);
        setOptionIdx(found !== -1 ? found : 0);
      } else {
        setOptionIdx(0);
      }
    } else {
      // Finished all 6 questions!
      onFinishQuiz(currentAnswers);
    }
  };

  const handlePrevQuestion = () => {
    AudioController.playSwoosh();
    if (questionIdx > 0) {
      setQuestionIdx(prev => prev - 1);
      const prevQ = QUIZ_QUESTIONS[questionIdx - 1];
      const prevSelected = answers[prevQ.id];
      if (prevSelected) {
        const found = prevQ.options.findIndex(o => o.letter === prevSelected.letter);
        setOptionIdx(found !== -1 ? found : 0);
      } else {
        setOptionIdx(0);
      }
    } else {
      onBackToHome();
    }
  };

  const isCurrentQAnswered = !!answers[currentQ.id];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const isLastQuestion = questionIdx === totalQuestions - 1;

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col justify-between min-h-[calc(100vh-80px)]">
      {/* Top Header: Progress bar with magical steps */}
      <div className="w-full mb-4 sm:mb-6">
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">Misterio {questionIdx + 1}</span>
            <span>de {totalQuestions}</span>
            {studentName && (
              <span className="text-gray-400 hidden sm:inline">
                · Estudiante: <strong className="text-amber-200">{studentName}</strong>
              </span>
            )}
          </div>
          <div className="text-amber-300 font-medium text-xs hidden xs:flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Feria Instituto Obras</span>
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
                onClick={() => {
                  AudioController.playSwoosh();
                  setQuestionIdx(idx);
                  const chosen = answers[q.id];
                  if (chosen) {
                    const f = q.options.findIndex(o => o.letter === chosen.letter);
                    setOptionIdx(f !== -1 ? f : 0);
                  } else {
                    setOptionIdx(0);
                  }
                }}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'bg-amber-400 shadow-[0_0_12px_#fdb913] scale-y-125'
                    : isDone
                    ? 'bg-amber-500/60'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                title={q.shortTitle}
              />
            );
          })}
        </div>
      </div>

      {/* Center 3D Stage & Question Title */}
      <div className="flex-1 flex flex-col items-center justify-center relative my-2">
        {/* Question Title */}
        <div className="text-center max-w-2xl mx-auto mb-2 sm:mb-4 px-2">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-amber-400/90 inline-block mb-1 font-cinzel">
            {currentQ.shortTitle}
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-cinzel text-amber-50 leading-snug filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            {currentQ.title}
          </h2>
        </div>

        {/* 3D Sorting Hat Canvas with neutral mysterious starlight */}
        <div className="w-full h-36 sm:h-48 md:h-56 relative -my-2 flex items-center justify-center">
          <ThreeHatScene
            mode="question"
            themeColor="#fdb913"
          />
        </div>

        {/* 3D Option Card Slider (The TikTok Experience) */}
        <QuestionCard
          options={currentQ.options}
          currentIndex={optionIdx}
          selectedLetter={selectedOptionForThisQ ? selectedOptionForThisQ.letter : null}
          onSelectOption={handleSelectOption}
          onNavigateOption={setOptionIdx}
        />
      </div>

      {/* Bottom Sticky Navigation Bar */}
      <div className="w-full pt-4 pb-2 border-t border-white/10 flex items-center justify-between gap-3 mt-4">
        {/* Back Button */}
        <button
          onClick={handlePrevQuestion}
          className="px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center gap-2 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{questionIdx === 0 ? 'Inicio' : 'Anterior'}</span>
        </button>

        {/* Status Hint */}
        <div className="text-xs text-amber-300/80 hidden sm:flex items-center gap-1.5 font-medium">
          {isCurrentQAnswered ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Opción {answers[currentQ.id].letter} registrada
            </span>
          ) : (
            <span>Selecciona tu respuesta para continuar</span>
          )}
        </div>

        {/* Next / Finish Button - Movie Antique Gold */}
        <button
          disabled={!isCurrentQAnswered}
          onClick={() => handleNextQuestion()}
          className={`px-6 sm:px-9 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xl font-cinzel ${
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
              <span>¡Consultar al Sombrero!</span>
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
