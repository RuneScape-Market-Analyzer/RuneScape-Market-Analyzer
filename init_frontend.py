import os

# React directory path
REACT_FILE_PATH = os.path.join(os.getcwd(), "my-app")


def main():
    os.chdir(REACT_FILE_PATH)
    os.system("npm install")
    os.system("npm run start")


if __name__ == '__main__':
    main()
