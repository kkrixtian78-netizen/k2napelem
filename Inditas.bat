@echo off
cd /d "%~dp0"
title K2Napelem arajanlatkeszito
echo.
echo K2Napelem arajanlatkeszito
echo Mappa: %CD%
echo Ez az ablak nyitva marad, amig a program fut. Ne zarjd be.
echo.

if not exist package.json goto :nofolder

where node >nul 2>&1
if errorlevel 1 goto :nonode
where npm >nul 2>&1
if errorlevel 1 goto :nonode

echo Node verzio:
node -v
echo.

if exist node_modules\nul goto :run

echo Elso inditas: a csomagok telepitese. Ez 2-5 perc lehet.
echo Kozben sorok jelennek meg. Varj, ne zarjd be az ablakot.
echo.
call npm.cmd install --no-audit --no-fund
if errorlevel 1 goto :failinstall

:run
echo.
echo A program indul. A bongeszo magatol megnyilik, amikor kesz.
echo Ha nem nyilik meg, ird be ezt a cimet: http://localhost:4321/arajanlat
echo.
start "" /b node scripts\open-quote.js
call npm.cmd start
echo.
echo A program leallt.
pause
exit /b 0

:nofolder
echo Ebben a mappaban nincs meg a program.
echo Bontsd ki a ZIP-et, majd a k2napelem-cursor-arajanlat-keszito-640b mappaban kattints duplan az Inditas.bat fajlra.
echo.
pause
exit /b 1

:nonode
echo Node.js nincs telepitve.
echo 1. Nyisd meg: https://nodejs.org
echo 2. Telepitsd a 22-es vagy ujabb verziojat. A telepito vegen a PATH legyen bejelolve.
echo 3. Utana inditsd ujra ezt a fajlt dupla kattintassal.
echo.
pause
exit /b 1

:failinstall
echo.
echo A telepites nem sikerult. Ellenorizd az internetet, majd inditsd ujra a fajlt.
echo.
pause
exit /b 1
