#!/bin/bash
cd "$(dirname "$0")"

echo "========================================================"
echo "   INSTITUTO OBRAS - EL SOMBRERO SELECCIONADOR"
echo "            Feria Escolar 2026"
echo "========================================================"
echo ""

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js no está instalado."
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "[INFO] Instalando dependencias..."
    npm install
fi

echo "[INFO] Iniciando servidor..."
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173 &
elif command -v open &> /dev/null; then
    open http://localhost:5173 &
fi

npm run dev -- --host
