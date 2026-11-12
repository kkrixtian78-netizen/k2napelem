@echo off
setlocal
cd /d "%~dp0"
title K2Napelem arajanlatkeszito
chcp 65001 >nul

where node >nul 2>&1
if errorlevel 1 goto :nonode
where npm >nul 2>&1
if errorlevel 1 goto :nonode

if not exist "node_modules\" (
  echo.
  echo Elso inditas: a szukseges csomagok telepitese. Ez eltarthat nehany percig.
  echo.
  call npm install
  if errorlevel 1 goto :failinstall
)

echo.
echo A K2Napelem arajanlatkeszito indul.
echo Cim a bongeszoben: http://localhost:4321/arajanlat
echo Az ajanlatok ezen a gepen maradnak, a data\arajanlat\store.json fajlban.
echo Leallitas: zarjd be ezt az ablakot.
echo.

start "" /min powershell -NoProfile -WindowStyle Hidden -Command "$url='http://127.0.0.1:4321/arajanlat'; for($i=0; $i -lt 90; $i++){ try { $r = Invoke-WebRequest -UseBasicParsing -TimeoutSec 3 $url; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 500){ Start-Process $url; exit 0 } } catch {}; Start-Sleep -Seconds 1 }"

call npm start
echo.
echo A program leallt.
pause
exit /b 0

:nonode
echo.
echo Node.js nincs telepitve, vagy nincs a PATH-ban.
echo Toltsd le a 22-es vagy ujabb verziojat: https://nodejs.org
echo Telepites utan inditsd ujra ezt a fajlt.
echo.
pause
exit /b 1

:failinstall
echo.
echo A telepites nem sikerult. Ellenorizd az internetkapcsolatot, majd inditsd ujra.
echo.
pause
exit /b 1
