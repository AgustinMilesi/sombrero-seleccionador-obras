import React, { useState } from 'react';
import { HouseId, HOUSES } from './data/houses';
import { QuizOption } from './data/questions';
import { ThreeHatScene } from './components/ThreeHatScene';
import { QuizContainer } from './components/QuizContainer';
import { DeliberationScene } from './components/DeliberationScene';
import { TieBreakModal } from './components/TieBreakModal';
import { ResultView } from './components/ResultView';
import { DiplomaModal } from './components/DiplomaModal';
import { QrStandModal } from './components/QrStandModal';
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
    AudioController.startBackgroundMusic();
    setIsMusicPlaying(true);
    setStep('quiz');
  };

  // Called when all 6 questions have been answered
  const handleFinishQuiz = (answers: Record<number, QuizOption>) => {
    // 1. Tally scores secretly
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

    // 2. Find max score
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

    // 3. Check for ties
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
        // Unlock browser audio context on first interaction
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
      <header className="w-full border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Left: Instituto Obras School Branding */}
        <div className="flex items-center gap-3">
          <img
            src="./logo-obras.png"
            alt="Instituto Obras"
            className="h-9 sm:h-11 object-contain filter drop-shadow-[0_2px_8px_rgba(253,185,19,0.4)]"
          />
          <div className="hidden xs:block border-l border-white/15 pl-3">
            <h1 className="text-xs sm:text-sm font-bold tracking-wider uppercase text-amber-200 font-cinzel">
              Instituto Obras
            </h1>
            <p className="text-[10px] text-gray-400 font-medium">Feria Escolar 2026</p>
          </div>
        </div>

        {/* Right: Actions (Background Music, Stand QR Code, Mute Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Harry Potter Background Music Button */}
          <button
            onClick={handleToggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
              isMusicPlaying
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(253,185,19,0.3)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
            title={isMusicPlaying ? 'Pausar música mágica' : 'Reproducir música de Harry Potter'}
          >
            <Music className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isMusicPlaying ? 'text-amber-400 animate-pulse' : 'text-gray-400'}`} />
            <span className="hidden sm:inline">
              {isMusicPlaying ? 'Música: Hedwig' : 'Música: Off'}
            </span>
          </button>

          {/* QR Stand Modal Button for School Staff/Families */}
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/40 transition-all shadow-md active:scale-95"
            title="Cartel QR para el stand"
          >
            <QrCode className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Cartel QR</span>
          </button>

          {/* Master Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all active:scale-95"
            title={isMuted ? 'Activar Sonidos' : 'Silenciar Todo'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-2 sm:p-4">
        {step === 'welcome' && (
          <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center animate-fade-in">
            {/* Top Aurinegro Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Día de la Feria · El Gran Salón Aurinegro</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-cinzel text-white leading-tight mb-2 tracking-wide">
              EL SOMBRERO <span className="text-amber-400">SELECCIONADOR</span>
            </h1>
            <p className="text-sm sm:text-lg text-gray-300 max-w-xl mx-auto mb-4 font-medium leading-relaxed">
              ¿Gryffindor, Ravenclaw, Hufflepuff o Slytherin? Responde las 6 preguntas mágicas y deja que el legendario Sombrero decida tu destino según tus verdaderas elecciones.
            </p>

            {/* 3D Interactive Hat Scene */}
            <div className="w-full h-56 sm:h-72 md:h-80 relative -my-2 flex items-center justify-center">
              <ThreeHatScene mode="idle" themeColor="#fdb913" />
            </div>

            {/* Student Name Input Box */}
            <div className="w-full max-w-md bg-black/50 backdrop-blur-xl border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-2 text-left flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Nombre del Estudiante o Familia:</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Ej. Mateo, Sofía, Familia García..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 font-medium text-sm sm:text-base transition-all"
                onKeyDown={e => {
                  if (e.key === 'Enter') handleStartQuiz();
                }}
              />
              <span className="text-[11px] text-gray-400 block text-left mt-2">
                * Tu nombre aparecerá grabado en el Diploma Oficial de Selección.
              </span>
            </div>

            {/* Primary Start CTA Button */}
            <button
              onClick={handleStartQuiz}
              className="px-8 sm:px-12 py-4 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black shadow-[0_0_35px_rgba(253,185,19,0.55)] flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-black text-black" />
              <span>¡Probarme el Sombrero Seleccionador!</span>
            </button>

            {/* 4 Houses Mystery Teaser */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mt-10 pt-8 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Gryffindor</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
                <Heart className="w-4 h-4 text-amber-400" />
                <span>Hufflepuff</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Ravenclaw</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300">
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
          <ResultView
            houseId={winningHouse}
            studentName={studentName}
            scores={houseScores}
            onRetake={handleRetake}
            onOpenDiploma={() => setShowDiplomaModal(true)}
          />
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

      {/* Modals */}
      {showQrModal && <QrStandModal onClose={() => setShowQrModal(false)} />}
      {showDiplomaModal && (
        <DiplomaModal
          houseId={winningHouse}
          studentName={studentName}
          onClose={() => setShowDiplomaModal(false)}
        />
      )}
    </div>
  );
};

export default App;
