@echo off

pip install -r requirements.txt

start /B python init_backend.py
start /B python init_frontend.py

pause
