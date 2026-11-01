import React, { useEffect } from 'react';
import { HouseId, HOUSES } from '../data/houses';
import { AudioController } from './AudioController';
import { Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

interface TieBreakModalProps {
  tiedHouses: HouseId[];
  studentName: string;
  onSelectHouse: (chosen: HouseId) => void;
}

export const TieBreakModal: React.FC<TieBreakModalProps> = ({
  tiedHouses,
  studentName,
  onSelectHouse
}) => {
  useEffect(() => {
    AudioController.playHatAudio('tiebreak');
  }, [tiedHouses, studentName]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-gradient-to-b from-[#181a24] to-[#0e0f14] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(253,185,19,0.3)] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>¡El Sombrero pide tu consejo!</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-100 font-cinzel">
            ¡Tenemos un Empate Mágico!
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mt-2 max-w-lg mx-auto">
            {studentName ? `${studentName}, ` : ''}tus respuestas han demostrado el equilibrio perfecto entre dos grandes caminos. Como en la leyenda de Harry Potter, <strong className="text-amber-400">¡tu elección final tiene el poder definitivo!</strong>
          </p>
        </div>

        {/* Head-to-Head House Cards */}
        <div className={`grid gap-4 sm:gap-6 relative z-10 ${tiedHouses.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
          {tiedHouses.map((houseId) => {
            const h = HOUSES[houseId];
            return (
              <div
                key={houseId}
                className="group relative rounded-2xl p-5 border border-white/10 hover:border-amber-400/80 transition-all duration-300 hover:scale-[1.03] flex flex-col items-center text-center bg-gradient-to-b from-white/5 to-black/60 shadow-xl"
                style={{
                  boxShadow: `0 0 25px ${h.accentGlow}`
                }}
              >
                {/* Crest */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3 relative flex items-center justify-center">
                  <img
                    src={h.crest}
                    alt={h.name}
                    className="w-full h-full object-contain filter drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] group-hover:rotate-3 transition-transform"
                  />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-cinzel text-white mb-1">
                  {h.name}
                </h3>
                <span className="text-xs text-amber-300 font-semibold mb-3">
                  {h.animal} · {h.element}
                </span>

                <p className="text-xs text-gray-300 mb-4 line-clamp-3">
                  {h.kidDescription}
                </p>

                <button
                  onClick={() => {
                    AudioController.playSelect();
                    onSelectHouse(houseId);
                  }}
                  className="w-full mt-auto py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-b from-[#e5be59] via-[#c4982f] to-[#926c19] hover:from-[#f0cf74] hover:via-[#d5aa3c] hover:to-[#a37a20] text-[#1c1204] border-2 border-[#543d12] shadow-[0_4px_14px_rgba(0,0,0,0.8)] flex items-center justify-center gap-2 group-hover:scale-105 transition-all font-cinzel"
                >
                  <Sparkles className="w-4 h-4 text-[#1c1204]" />
                  <span>¡Elijo {h.name}!</span>
                  <ArrowRight className="w-4 h-4 ml-0.5 text-[#1c1204]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
