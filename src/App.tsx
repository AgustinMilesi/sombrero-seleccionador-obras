import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HouseId } from './data/houses';
import { QuizOption } from './data/questions';
import { ThreeHatScene } from './components/ThreeHatScene';
import { QuizContainer } from './components/QuizContainer';
import { DeliberationScene } from './components/DeliberationScene';
import { TieBreakModal } from './components/TieBreakModal';
import { AudioController } from './components/AudioController';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Music,
  QrCode,
  Wand2,
  Play,
  Shield,
  Heart,
  BookOpen,
  Crown
} from 'lucide-react';

// Code-split heavy modals and views for blazing-fast mobile startup
const ResultView = lazy(() => import('./components/ResultView').then(m => ({ default: m.ResultView })));
const DiplomaModal = lazy(() => import('./components/DiplomaModal').then(m => ({ default: m.DiplomaModal })));
const QrStandModal = lazy(() => import('./components/QrStandModal').then(m => ({ default: m.QrStandModal })));

type AppStep = 'welcome' | 'quiz' | 'deliberation' | 'result';

export const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('welcome');
  const [studentName, setStudentName] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(AudioController.isMuted);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(AudioController.isMusicPlaying);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showDiplomaModal, setShowDiplomaModal] = useState<boolean>(false);

  // Quiz state
  const [houseScores, setHouseScores] = useState<Record<HouseId, number>>({
    gryffindor: 0,
    ravenclaw: 0,
    hufflepuff: 0,
    slytherin: 0
  });
  const [winningHouse, setWinningHouse] = useState<HouseId>('gryffindor');
  const [tiedHouses, setTiedHouses] = useState<HouseId[] | null>(null);

  // Requirement: Music is turned ON always from the start, and user can mute it later
  useEffect(() => {
    AudioController.initCtx();
    AudioController.startBackgroundMusic();
    setIsMusicPlaying(true);
    setIsMuted(false);

    const unlockAudio = () => {
      AudioController.initCtx();
      if (!AudioController.isMuted) {
        AudioController.startBackgroundMusic();
        setIsMusicPlaying(true);
      }
    };

    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('pointerdown', unlockAudio, { passive: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
    };
  }, []);

  const handleToggleMute = () => {
    const muted = AudioController.toggleMute();
    setIsMuted(muted);
    setIsMusicPlaying(AudioController.isMusicPlaying);
  };

  const handleToggleMusic = () => {
    AudioController.initCtx();
    const playing = AudioController.toggleBackgroundMusic();
    setIsMusicPlaying(playing);
  };

  const handleStartQuiz = () => {
    AudioController.playSelect();
    if (!isMuted) {
      AudioController.startBackgroundMusic();
      setIsMusicPlaying(true);
    }
    setStep('quiz');
  };

  const handleFinishQuiz = (answers: Record<number, QuizOption>) => {
    const tallies: Record<HouseId, number> = {
      gryffindor: 0,
      ravenclaw: 0,
      hufflepuff: 0,
      slytherin: 0
    };

    Object.values(answers).forEach(opt => {
      tallies[opt.house] = (tallies[opt.house] || 0) + 1;
    });
    setHouseScores(tallies);

    let max = -1;
    const leaders: HouseId[] = [];
    (Object.keys(tallies) as HouseId[]).forEach(h => {
      const score = tallies[h];
      if (score > max) {
        max = score;
        leaders.length = 0;
        leaders.push(h);
      } else if (score === max) {
        leaders.push(h);
      }
    });

    if (leaders.length > 1) {
      setTiedHouses(leaders);
      setStep('deliberation');
    } else {
      setWinningHouse(leaders[0]);
      setTiedHouses(null);
      setStep('deliberation');
    }
  };

  const handleDeliberationComplete = () => {
    if (!tiedHouses) {
      setStep('result');
    }
  };

  const handleTieBreakChoice = (chosen: HouseId) => {
    setWinningHouse(chosen);
    setTiedHouses(null);
    setStep('result');
  };

  const handleRetake = () => {
    setStudentName('');
    setHouseScores({ gryffindor: 0, ravenclaw: 0, hufflepuff: 0, slytherin: 0 });
    setTiedHouses(null);
    setStep('welcome');
  };

  return (
    <div
      onClick={() => {
        AudioController.initCtx();
      }}
      className="min-h-screen bg-[#0c0d12] text-amber-50 flex flex-col justify-between selection:bg-amber-500 selection:text-black relative overflow-x-hidden"
    >
      {/* Background Ambience Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-600/5 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-950/20 rounded-full blur-[140px]" />
      </div>

      {/* Main Top Navbar */}
      <header className="w-full border-b border-white/10 bg-black/75 backdrop-blur-xl sticky top-0 z-40 px-3 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between">
        {/* Left: Instituto Obras School Branding - Always visible on mobile and desktop */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="./logo-obras.png"
            alt="Instituto Obras Sanitarias"
            className="h-8 sm:h-11 object-contain filter drop-shadow-[0_2px_8px_rgba(253,185,19,0.6)]"
          />
          <div className="flex flex-col border-l-2 border-amber-500/50 pl-2 sm:pl-3">
            <h1 className="text-xs sm:text-sm font-black tracking-wider uppercase text-amber-300 font-cinzel leading-tight drop-shadow-sm">
              Instituto Obras
            </h1>
            <p className="text-[9px] sm:text-[10px] text-amber-100/70 font-medium">Feria Escolar 2026</p>
          </div>
        </div>

        {/* Right: Actions (Música Activa, Cartel QR, Botón Silenciar) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Harry Potter Background Music Button */}
          <button
            onClick={handleToggleMusic}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
              isMusicPlaying && !isMuted
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(253,185,19,0.3)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
            title={isMusicPlaying && !isMuted ? 'Música activa de Harry Potter' : 'Activar música de Harry Potter'}
          >
            <Music className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isMusicPlaying && !isMuted ? 'text-amber-400 animate-pulse' : 'text-gray-400'}`} />
            <span className="text-[11px] sm:text-xs">
              {isMusicPlaying && !isMuted ? 'Música: ON' : 'Música: OFF'}
            </span>
          </button>

          {/* QR Stand Modal Button for School Staff/Families */}
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/40 transition-all shadow-md active:scale-95"
            title="Cartel QR para el stand"
          >
            <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="hidden sm:inline">Cartel QR</span>
          </button>

          {/* Master Sound Toggle (Mute / Unmute) */}
          <button
            onClick={handleToggleMute}
            className={`p-2 sm:p-2.5 rounded-xl border transition-all active:scale-95 flex items-center gap-1.5 ${
              isMuted
                ? 'bg-red-500/15 border-red-400/30 text-red-300'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-300'
            }`}
            title={isMuted ? 'Activar Sonidos' : 'Silenciar Todo'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                <span className="text-[10px] sm:text-xs font-bold hidden md:inline">Muteado</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                <span className="text-[10px] sm:text-xs font-bold hidden md:inline">Sonido ON</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-2 sm:p-4">
        {step === 'welcome' && (
          <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center text-center animate-fade-in">
            {/* Top Aurinegro Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Día de la Feria · El Gran Salón Aurinegro</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-cinzel text-white leading-tight mb-2 tracking-wide">
              EL SOMBRERO <span className="text-amber-400">SELECCIONADOR</span>
            </h1>
            <p className="text-xs sm:text-base text-gray-300 max-w-xl mx-auto mb-3 font-medium leading-relaxed">
              ¿Gryffindor, Ravenclaw, Hufflepuff o Slytherin? Responde las 6 preguntas mágicas y deja que el legendario Sombrero decida tu destino según tus verdaderas elecciones.
            </p>

            {/* 3D Interactive Hat Scene with Gyroscope */}
            <div className="w-full h-56 sm:h-72 md:h-80 relative -my-1 flex items-center justify-center">
              <ThreeHatScene mode="idle" themeColor="#fdb913" />
            </div>

            {/* Student Name Input Box - Hogwarts Oak & Brass */}
            <div className="w-full max-w-md bg-[#16120e]/80 backdrop-blur-xl border-2 border-[#806024]/50 rounded-2xl p-4 sm:p-5 shadow-2xl mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-200 mb-2 text-left flex items-center gap-1.5 font-cinzel">
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Nombre del Estudiante o Familia:</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Ej. Mateo, Sofía, Familia García..."
                className="w-full px-4 py-3 rounded-xl bg-[#0e0c0a] border-2 border-[#574119] text-amber-100 placeholder-gray-500 focus:outline-none focus:border-[#d4af37] font-medium text-sm sm:text-base transition-all font-outfit"
                onKeyDown={e => {
                  if (e.key === 'Enter') handleStartQuiz();
                }}
              />
              <span className="text-[11px] text-amber-200/60 block text-left mt-2">
                * Tu nombre aparecerá grabado con tinta dorada en el Diploma Oficial.
              </span>
            </div>

            {/* Primary Start CTA Button - Movie Style Embossed Gold */}
            <button
              onClick={handleStartQuiz}
              className="px-8 sm:px-14 py-3.5 sm:py-4 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-b from-[#e5be59] via-[#c4982f] to-[#926c19] hover:from-[#f0cf74] hover:via-[#d5aa3c] hover:to-[#a37a20] text-[#1c1204] border-2 border-[#543d12] shadow-[0_6px_25px_rgba(0,0,0,0.85)] flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 font-cinzel"
            >
              <Play className="w-5 h-5 fill-[#1c1204] text-[#1c1204]" />
              <span>¡Probarme el Sombrero Seleccionador!</span>
            </button>

            {/* 4 Houses Mystery Teaser */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-2xl mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Gryffindor</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
                <Heart className="w-4 h-4 text-amber-400" />
                <span>Hufflepuff</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Ravenclaw</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Slytherin</span>
              </div>
            </div>
          </div>
        )}

        {step === 'quiz' && (
          <QuizContainer
            studentName={studentName}
            onFinishQuiz={handleFinishQuiz}
            onBackToHome={() => setStep('welcome')}
          />
        )}

        {step === 'deliberation' && (
          <>
            <DeliberationScene
              topHouse={tiedHouses ? tiedHouses[0] : winningHouse}
              studentName={studentName}
              onDeliberationComplete={handleDeliberationComplete}
            />
            {tiedHouses && (
              <TieBreakModal
                tiedHouses={tiedHouses}
                studentName={studentName}
                onSelectHouse={handleTieBreakChoice}
              />
            )}
          </>
        )}

        {step === 'result' && (
          <Suspense fallback={<div className="text-amber-300 text-center py-12 font-cinzel">Revelando tu Casa Mágica...</div>}>
            <ResultView
              houseId={winningHouse}
              studentName={studentName}
              scores={houseScores}
              onRetake={handleRetake}
              onOpenDiploma={() => setShowDiplomaModal(true)}
            />
          </Suspense>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-md py-3 px-4 text-center text-xs text-gray-400 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Instituto Obras Sanitarias de la Nación · Feria Escolar</span>
        </div>
        <div className="text-[11px] text-gray-400">
          Inspirado en el Sombrero Seleccionador del Mundo Mágico para niños y familias.
        </div>
      </footer>

      {/* Modals with Lazy Suspense */}
      {showQrModal && (
        <Suspense fallback={null}>
          <QrStandModal onClose={() => setShowQrModal(false)} />
        </Suspense>
      )}
      {showDiplomaModal && (
        <Suspense fallback={null}>
          <DiplomaModal
            houseId={winningHouse}
            studentName={studentName}
            onClose={() => setShowDiplomaModal(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default App;
