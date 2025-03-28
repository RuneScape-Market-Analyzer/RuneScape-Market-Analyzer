import os
import subprocess
import sys

# React directory path
REACT_FILE_PATH = os.path.join(os.getcwd(), "my-app")


def check_node_and_npm():
    try:
        # Check Node.js version
        subprocess.run(["node", "-v"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("Node.js is installed.")
    except FileNotFoundError:
        print("Node.js is not installed. Please download and install it from https://nodejs.org/")

    try:
        # Check npm version
        subprocess.run(["npm", "-v"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("npm is installed.")
    except FileNotFoundError:
        print("npm is not installed. Please ensure npm is installed along with Node.js.")


def main():
    check_node_and_npm()

    os.chdir(REACT_FILE_PATH)
    os.system("npm install")
    os.system("npm run start")


if __name__ == '__main__':
    main()
