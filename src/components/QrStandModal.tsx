import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, X, Printer, Sparkles, ExternalLink } from 'lucide-react';

interface QrStandModalProps {
  onClose: () => void;
}

export const QrStandModal: React.FC<QrStandModalProps> = ({ onClose }) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const printAreaRef = useRef<HTMLDivElement>(null);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://instituto-obras.com';

  useEffect(() => {
    QRCode.toDataURL(currentUrl, {
      width: 450,
      margin: 2,
      color: {
        dark: '#0c0d12',
        light: '#ffffff'
      }
    })
      .then((url: string) => setQrUrl(url))
      .catch((err: unknown) => console.error(err));
  }, [currentUrl]);

  const handlePrint = () => {
    const printContent = printAreaRef.current;
    if (!printContent) return;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Cartel QR - El Sombrero Seleccionador Instituto Obras</title>
            <style>
              body {
                font-family: 'Cinzel', Georgia, serif;
                text-align: center;
                padding: 40px;
                background: #fff;
                color: #111;
              }
              .border-box {
                border: 8px double #c59b27;
                padding: 40px 30px;
                max-width: 650px;
                margin: 0 auto;
                border-radius: 20px;
              }
              h1 { font-size: 30px; margin-bottom: 10px; color: #111; }
              h2 { font-size: 20px; color: #8a6414; margin-top: 0; }
              img.qr { width: 340px; height: 340px; margin: 20px 0; border: 4px solid #111; border-radius: 12px; }
              p { font-size: 18px; line-height: 1.5; color: #333; }
              .logo { height: 70px; margin-bottom: 15px; }
            </style>
          </head>
          <body>
            <div class="border-box">
              <img src="./logo-obras.png" class="logo" />
              <h2>INSTITUTO OBRAS · FERIA ESCOLAR 2026</h2>
              <h1>🎩 EL SOMBRERO SELECCIONADOR</h1>
              <p>¡Familias y Estudiantes! Escaneen este código con la cámara de su celular para descubrir su casa de Hogwarts:</p>
              ${qrUrl ? `<img src="${qrUrl}" class="qr" />` : ''}
              <p style="font-size: 16px; margin: 10px 0; color: #444;">O ingresa directo: <strong style="color: #8a6414; font-size: 18px; letter-spacing: 0.5px;">sombrero-seleccionador-obras.vercel.app</strong></p>
              <p><strong>Responde las 6 preguntas mágicas y ¡recibe tu Diploma Oficial Aurinegro!</strong></p>
            </div>
          </body>
        </html>
      `);
      win.document.close();
      setTimeout(() => {
        win.print();
        win.close();
      }, 350);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#14161f] border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Cartel para el Stand de la Feria</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black font-cinzel text-amber-100 mb-1">
          Código QR para las Familias
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 max-w-sm mb-5">
          Coloca este cartel junto al Sombrero Seleccionador en el stand para que las familias lo escaneen desde sus celulares.
        </p>

        {/* Printable Card Preview */}
        <div
          ref={printAreaRef}
          className="bg-white p-5 rounded-2xl shadow-xl border-4 border-amber-400 mb-5 text-black flex flex-col items-center max-w-xs"
        >
          <div className="flex items-center gap-2 mb-2">
            <img src="./logo-obras.png" alt="Instituto Obras" className="h-8 object-contain" />
            <span className="text-[10px] font-black tracking-wider uppercase text-gray-800">
              Instituto Obras
            </span>
          </div>

          <h4 className="text-sm font-black uppercase tracking-wide text-amber-900 mb-2 font-cinzel">
            🎩 Sombrero Seleccionador
          </h4>

          {qrUrl ? (
            <img src={qrUrl} alt="QR del Sombrero" className="w-52 h-52 object-contain rounded-lg" />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center bg-gray-100 rounded-lg">
              <QrCode className="w-12 h-12 text-gray-400 animate-spin" />
            </div>
          )}

          <p className="text-[11px] text-gray-700 font-semibold mt-2 leading-tight">
            Escanea con tu celular o ingresa a: <span className="font-mono font-bold text-amber-800">sombrero-seleccionador-obras.vercel.app</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Printer className="w-4 h-4 text-black" />
            <span>Imprimir Cartel</span>
          </button>
          <button
            onClick={() => window.open(currentUrl, '_blank')}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
            title="Abrir enlace"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
