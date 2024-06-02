@echo off
echo Starting both frontend and backend servers...

:: 启动后端服务
echo Starting backend server...
start "Backend Server" node app.js

:: 等待几秒钟，确保后端服务启动
timeout /t 5

:: 启动前端服务
echo Starting frontend server...
start "Frontend Server" npx http-server

:: 等待前端服务启动
timeout /t 5

@REM :: 使用 find 和 for 命令提取地址
@REM for /F "delims=" %%a in ('npx http-server ^| find "Available on:"') do (
@REM     set "line=%%a"
@REM )

@REM :: 从提取的行中获取地址
@REM set "address=http://%line:Available on: =%"

@REM :: 输出 address 变量的值
@REM echo %address%

@REM :: 打开默认浏览器并访问前端页面
@REM start %address%

:: 打开默认浏览器并访问前端页面
start http://localhost:8080

echo Servers are starting...
pause