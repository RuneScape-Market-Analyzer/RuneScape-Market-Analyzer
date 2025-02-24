import os

react_app_dir = "my-app"

os.chdir(react_app_dir)
os.system("npm install")
os.system("npm run start")
