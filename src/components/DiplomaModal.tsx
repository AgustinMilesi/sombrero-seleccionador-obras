import React, { useRef, useEffect } from 'react';
import { HouseId, HOUSES } from '../data/houses';
import { Download, X, Award, Printer } from 'lucide-react';

interface DiplomaModalProps {
  houseId: HouseId;
  studentName: string;
  onClose: () => void;
}

export const DiplomaModal: React.FC<DiplomaModalProps> = ({
  houseId,
  studentName,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const house = HOUSES[houseId];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution canvas for sharp printing: 1600 x 1130 (A4 landscape ratio)
    canvas.width = 1600;
    canvas.height = 1130;

    // 1. Vintage Parchment Background
    const bgGrad = ctx.createRadialGradient(800, 565, 100, 800, 565, 900);
    bgGrad.addColorStop(0, '#fbf6e9');
    bgGrad.addColorStop(0.7, '#eedfc4');
    bgGrad.addColorStop(1, '#dfcb9f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1600, 1130);

    // Subtle parchment texture noise
    ctx.fillStyle = 'rgba(160, 130, 80, 0.04)';
    for (let i = 0; i < 6000; i++) {
      ctx.fillRect(Math.random() * 1600, Math.random() * 1130, Math.random() * 3, Math.random() * 3);
    }

    // 2. Ornate Golden Borders
    ctx.strokeStyle = '#c59b27';
    ctx.lineWidth = 12;
    ctx.strokeRect(50, 50, 1500, 1030);

    ctx.strokeStyle = '#3d2b0f';
    ctx.lineWidth = 3;
    ctx.strokeRect(66, 66, 1468, 998);

    ctx.strokeStyle = '#c59b27';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(74, 74, 1452, 982);

    // Corner flourishes
    const drawCorner = (x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.strokeStyle = '#c59b27';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, 35, 0, Math.PI / 2);
      ctx.stroke();
      ctx.fillStyle = '#8a0303';
      ctx.beginPath();
      ctx.arc(20, 20, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    drawCorner(85, 85, 0);
    drawCorner(1515, 85, Math.PI / 2);
    drawCorner(1515, 1045, Math.PI);
    drawCorner(85, 1045, -Math.PI / 2);

    // 3. Header Text
    ctx.textAlign = 'center';

    // School Title
    ctx.fillStyle = '#1c1b18';
    ctx.font = 'bold 34px "Cinzel", Georgia, serif';
    ctx.fillText('INSTITUTO OBRAS SANITARIAS DE LA NACIÓN', 800, 140);

    ctx.fillStyle = '#8f681a';
    ctx.font = '600 22px "Cinzel", Georgia, serif';
    ctx.fillText('GRAN FERIA ESCOLAR DE CIENCIAS, ARTES Y MAGIA', 800, 180);

    // Decorative line
    ctx.strokeStyle = '#c59b27';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(450, 205);
    ctx.lineTo(1150, 205);
    ctx.stroke();

    // Main Title
    ctx.fillStyle = '#2b1d0c';
    ctx.font = '900 48px "Cinzel Decorative", "Cinzel", Georgia, serif';
    ctx.fillText('CERTIFICADO DE SELECCIÓN HOGWARTS', 800, 275);

    // Body preamble
    ctx.fillStyle = '#3a3429';
    ctx.font = 'italic 26px "MedievalSharp", Georgia, serif';
    ctx.fillText('Por decisión solemne e inapelable del venerable Sombrero Seleccionador,', 800, 340);
    ctx.fillText('y en reconocimiento a sus virtudes, carácter y noble corazón:', 800, 380);

    // Student Name (large calligraphic)
    const displayName = studentName.trim() || 'Estudiante Mágico';
    ctx.fillStyle = '#111111';
    ctx.font = 'bold 56px "Cinzel", Georgia, serif';
    ctx.fillText(displayName.toUpperCase(), 800, 480);

    // Underline below student name
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(350, 505);
    ctx.lineTo(1250, 505);
    ctx.stroke();

    // Declaration text
    ctx.fillStyle = '#3a3429';
    ctx.font = '26px "MedievalSharp", Georgia, serif';
    ctx.fillText('Ha sido asignado formalmente para defender con honor la casa de:', 800, 570);

    // House Name (Majestic and in House Primary Color)
    ctx.fillStyle = house.primaryColor;
    ctx.font = '900 76px "Cinzel Decorative", "Cinzel", Georgia, serif';
    ctx.fillText(house.name.toUpperCase(), 800, 675);

    // House Traits
    ctx.fillStyle = '#614d23';
    ctx.font = 'bold 24px "Cinzel", Georgia, serif';
    ctx.fillText(`« ${house.traits.join('  ·  ')} »`, 800, 730);

    // House motto / connection to Obras
    ctx.fillStyle = '#383226';
    ctx.font = 'italic 20px Georgia, serif';
    ctx.fillText(`"${house.obrasConnection}"`, 800, 785);

    // Date
    const today = new Date().toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    ctx.fillStyle = '#6b5c3e';
    ctx.font = '18px "Cinzel", Georgia, serif';
    ctx.fillText(`Emitido en el Gran Salón de Obras, el día ${today}`, 800, 835);

    // Signatures
    ctx.strokeStyle = '#2b1d0c';
    ctx.lineWidth = 1.5;

    // Hat signature
    ctx.beginPath();
    ctx.moveTo(250, 960);
    ctx.lineTo(550, 960);
    ctx.stroke();
    ctx.fillStyle = '#1c1b18';
    ctx.font = 'bold 20px "Cinzel", Georgia, serif';
    ctx.fillText('El Sombrero Seleccionador', 400, 990);
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('Voz de los Cuatro Fundadores', 400, 1015);

    // School Directorate signature
    ctx.beginPath();
    ctx.moveTo(1050, 960);
    ctx.lineTo(1350, 960);
    ctx.stroke();
    ctx.fillStyle = '#1c1b18';
    ctx.font = 'bold 20px "Cinzel", Georgia, serif';
    ctx.fillText('Dirección Instituto Obras', 1200, 990);
    ctx.font = 'italic 16px Georgia, serif';
    ctx.fillText('Comunidad Aurinegra', 1200, 1015);

    // Load House Crest in the center bottom
    const crestImg = new Image();
    crestImg.crossOrigin = 'anonymous';
    crestImg.src = house.crest;
    crestImg.onload = () => {
      ctx.drawImage(crestImg, 725, 875, 150, 150);
    };

    // Load Obras logo on top left
    const obrasImg = new Image();
    obrasImg.crossOrigin = 'anonymous';
    obrasImg.src = './logo-obras.png';
    obrasImg.onload = () => {
      ctx.drawImage(obrasImg, 110, 95, 160, 80);
    };
  }, [houseId, studentName]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Diploma_Hogwarts_Obras_${(studentName || 'Estudiante').replace(/\s+/g, '_')}_${house.name}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const win = window.open('');
    if (win) {
      win.document.write(`
        <html>
          <head><title>Diploma ${studentName} - Instituto Obras</title></head>
          <body style="margin:0;display:flex;align-items:center;justify-content:center;background:#000;">
            <img src="${dataUrl}" style="max-width:100%;max-height:100vh;" onload="window.print();window.close();"/>
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg animate-fade-in">
      <div className="w-full max-w-4xl bg-[#14161f] border-2 border-amber-500/60 rounded-3xl p-4 sm:p-6 shadow-2xl relative flex flex-col max-h-[92vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h3 className="text-base sm:text-xl font-bold font-cinzel text-amber-200">
              Diploma Oficial de Selección · Instituto Obras
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Canvas container */}
        <div className="flex-1 overflow-auto flex items-center justify-center bg-black/50 rounded-2xl p-2 border border-white/5">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-[62vh] object-contain rounded-lg shadow-2xl border border-amber-500/30"
          />
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 shrink-0">
          <span className="text-xs text-gray-400 text-center sm:text-left">
            Listo para imprimir o guardar como recuerdo inolvidable de la feria escolar.
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            >
              <Download className="w-4 h-4 text-black" />
              <span>Descargar PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
