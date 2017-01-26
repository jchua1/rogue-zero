# Rogue Zero

## Video Link - https://youtu.be/FTL-X6PmUqA

## Overview
Rogue Zero is a roguelike game, or a single player RPG/dungeon crawler. The objective is to kill the monsters and move from room to room, trying to last as long as you can. The rooms are randomly generated, as are the monsters.

The project utilizes databases to save progress when a door is used, including the player state and the level state, allowing you to return to already-cleared rooms and resume where you leave off upon exiting the game.

Game logic and mechanics are managed on the client side (insecure, but fast) with JavaScript, while user accounts, sessions, progress saving, and random room generation is done on the server side with Python, Flask, and SQLite3. Communication between the client and server is managed by SocketIO, an external websockets library for JavaScript and Python.


## Instructions
In order to play the game, you must first register an account to track progress and high scores. Upon login, you are taken immediately to the game page.

The game features three types of terrain: quicksand, which slows you down (and enemies, but you moreso); pits, which kill you instantly upon contact; and rocks, which are impassable to players, enemies, and bullets.

Enemies will constantly move towards you, but through clever maneuvers and careful management of your attacks -- a strong, area-of-effect, slow melee attack and a weak, small, fast ranged attack -- you can clear a room and proceed through any of the now-open doors to generate a new room.

The more enemies (of high health) you kill, the higher your score will be.

Do you have what it takes to be a rogue?


## Dependencies
Requires flask-socketio. To install:

    $ pip install flask-socketio

When in doubt:

    $ rm data/data.db


## Controls
+ W / UP ARROW - UP
+ A / LEFT ARROW - LEFT
+ S / RIGHT ARROW - RIGHT
+ D / DOWN ARROW - DOWN
+ LEFT CLICK - ATTACK
+ RIGHT CLICK - SWITCH WEAPONS


## Credits
### Team Useless But Fun
Daniel Chiu (HTML/CSS, Project Manager)
Kenneth Li (JavaScript/Python)
Nick Ng (Python/SQL)
Jason Chua (Python/SQL)

Softdev Fall 2016 Final Project
