@echo off
echo =========================================
echo 🚀 Pushing to GitHub
echo =========================================
echo.
echo This will open Git Bash to push your code.
echo.
echo When prompted for credentials:
echo   Username: alasarjadeed
echo   Password: Use your Personal Access Token
echo.
echo Get token: https://github.com/settings/tokens
echo.
echo Press any key to open Git Bash...
pause >nul

start "" "C:\Program Files\Git\git-bash.exe"

echo.
echo In Git Bash, type these commands:
echo.
echo   cd "/c/Users/Aamirqurashi/Desktop/white board/google-whiteboard/google whiteboard project"
echo   git push -u origin main
echo.
echo Then enter your credentials when prompted.
echo.
pause
