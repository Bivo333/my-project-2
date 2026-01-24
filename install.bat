@echo off
echo Установка зависимостей для Moslistva...
call npm install
echo.
echo Сборка CSS файла...
call npm run build
echo.
echo Готово! Теперь можно использовать index-local.html
echo Или запустите "npm run dev" для режима разработки
pause
