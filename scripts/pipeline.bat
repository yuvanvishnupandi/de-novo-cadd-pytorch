@echo off
cd /d "%~dp0..\backend"
python pipeline_manager.py %*
