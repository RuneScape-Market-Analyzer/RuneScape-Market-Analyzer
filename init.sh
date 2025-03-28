#!/bin/bash

pip install -r requirements.txt

python3 init_backend.py &
python3 init_frontend.py &

# Keep the terminal open
read -p "Press Enter to continue..."
