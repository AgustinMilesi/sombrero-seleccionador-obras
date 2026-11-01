@echo off
title Sombrero Seleccionador - Instituto Obras
cd /d "%~dp0"

echo ========================================================
echo    INSTITUTO OBRAS - EL SOMBRERO SELECCIONADOR
echo             Feria Escolar 2026
echo ========================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado o no se encuentra en PATH.
    echo Por favor instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [INFO] Instalando dependencias necesarias por primera vez...
    call npm install
)

echo [INFO] Iniciando servidor magico para la feria escolar...
start http://localhost:5173
call npm run dev -- --host

pause
