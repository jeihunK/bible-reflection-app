@echo off
echo ========================================
echo  Bible Reflection App - Android Builder
echo ========================================
echo.

echo Step 1: Checking if you're logged in to Expo...
eas whoami
if %errorlevel% neq 0 (
    echo.
    echo You need to login to Expo first.
    echo Please run: eas login
    echo Then run this script again.
    pause
    exit /b 1
)

echo.
echo Step 2: Starting Android APK build...
echo This will take 10-20 minutes on Expo servers.
echo.

eas build --platform android --profile preview

echo.
echo ========================================
echo Build command completed!
echo.
echo Next steps:
echo 1. Monitor your build at: https://expo.dev/
echo 2. Download APK when build completes
echo 3. Install on Android device to test
echo ========================================
pause