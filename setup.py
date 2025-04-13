# setup.py
from setuptools import setup, find_packages

setup(
    name="runescape_tool",
    version="0.1",
    packages=find_packages(include=['backend*']),
    install_requires=[
        'flask',
        'pytest'
    ],
)