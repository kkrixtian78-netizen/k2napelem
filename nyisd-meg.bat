@echo off
set N=0
:loop
set /a N+=1
netstat -ano | findstr ":4321" >nul
if not errorlevel 1 goto :open
if %N% GEQ 90 goto :open
ping -n 2 127.0.0.1 >nul
goto :loop
:open
start http://127.0.0.1:4321/arajanlat
