@echo off

:: Name der ZIP-Datei
set ZIP_NAME=project_backup.zip

:: Zielverzeichnis (Backend und Frontend)
set BACKEND_DIR=backend
set FRONTEND_DIR=frontend

:: Temporäres Verzeichnis für die relevanten Dateien
set TEMP_DIR=temp_zip

:: Existierende ZIP-Datei und temporäres Verzeichnis löschen
if exist %ZIP_NAME% del %ZIP_NAME%
if exist %TEMP_DIR% rmdir /s /q %TEMP_DIR%

:: Temporäres Verzeichnis erstellen
mkdir %TEMP_DIR%

:: Relevante Dateien und Ordner vom Backend kopieren
xcopy %BACKEND_DIR% %TEMP_DIR%\%BACKEND_DIR% /e /i /q /exclude:exclude_list.txt

:: Relevante Dateien und Ordner vom Frontend kopieren
xcopy %FRONTEND_DIR% %TEMP_DIR%\%FRONTEND_DIR% /e /i /q /exclude:exclude_list.txt

:: In eine ZIP-Datei komprimieren
powershell Compress-Archive -Path %TEMP_DIR%\* -DestinationPath %ZIP_NAME%

:: Temporäres Verzeichnis entfernen
rmdir /s /q %TEMP_DIR%

:: Erfolgsnachricht
echo Das Projekt wurde erfolgreich in %ZIP_NAME% gepackt!
pause
