from flask import Flask, session, request, url_for, redirect, render_template, flash
from flask_socketio import SocketIO, send, emit
from utils import level, upgrades, util, db
import json

app = Flask(__name__)
socketio = SocketIO(app)

def run():
  app.secret_key = 'hi'
  socketio.run(app, debug = True)

def isLoggedIn():
  if 'username' in session:
    db.initDB()
    if db.isRegistered(session['username']):
      db.closeDB()
      return True
    else:
      db.closeDB()
      session.pop('username')
      return False
  else:
    return False
  
@app.route('/game/')
def game():
  if isLoggedIn():
    return render_template('game.html')

  return redirect(url_for('root'))

@socketio.on('get_room')
def sendRoom():
  room = level.Room().asDict()
  emit('new_room', room)

@socketio.on('upgradePlayers')
def upgrades(data):
  skills = data['upgrades']
  print skills
  
@socketio.on('save_room')
def saveRoom(data):
  db.initDB()
  player = data['player']
  currentRoom = data['room']
  exitDoor = data['exitDoor']
  username = session['username']
  userID = db.getUserID(username)

  currentRoomID = db.getCurrentRoomID(userID)
  nextRoomID = currentRoom['doors'][exitDoor]['link']
  nextRoom = None

  newPosition = level.DOOR_POSITIONS[(exitDoor + 2) % 4]
  player['x'] = newPosition[0]
  player['y'] = newPosition[1]
  
  if nextRoomID == -1: #entirely new room
    nextRoomID = db.nextRoomID(userID)
    nextRoom = level.Room(player['x'], player['y'], player['health']).asDict()
    db.createNewRoom(userID, nextRoomID, json.dumps(nextRoom))
    currentRoom['doors'][exitDoor] = nextRoomID
  else:
    nextRoom = {
      'player': player,
      'room': db.getRoom(userID, nextRoomID)
    }

  db.updateRoom(userID, currentRoomID, json.dumps(currentRoom))
  db.updateCurrentRoomID(userID, currentRoomID)
  db.closeDB()
  emit('new_room', nextRoom)

  #db.door(player, room, session['username'])
  #db.leaveroom(session['username'], room) #this is 'current lvl', update its room in the db
  #enterroom = db.checkdoor(session['username'], room, door)
  #if enterroom != -1: check if the exit door has been used
  #if so load level the level and set the current level to that id
  #oldroomstuff = enterOld(session['username'], enterroom)
  #otherwise generate a new level and id, store them in the db
  #getLevel(newlevel), and update currentroom
  
#login
@app.route('/')
def root():
  if isLoggedIn():
    return redirect(url_for('game'))
  
  return redirect(url_for('auth'))

@app.route('/auth/')
def auth():
  if isLoggedIn():
    return redirect(url_for('game'))
    
  return render_template('auth.html')

@app.route('/login/', methods = ['POST'])
def login():
  username = request.form['username']
  password = request.form['password']
  db.initDB()
  text, status = db.login(username, password) #error message
  db.closeDB()
  
  if status == 0: #if no error message, succesful go back home
    session['username'] = username
    return redirect(url_for('game'))
  else:
    return render_template('auth.html', message = text)

@app.route('/register/', methods=['POST'])
def register():
  username = request.form['username']
  password = request.form['password']
  confirm = request.form['confirm']
  db.initDB()
  text, status = db.register(username, password, confirm)
  db.closeDB()
  
  return render_template('auth.html', message = text)
    
@app.route('/logout/')
def logout():
  if 'username' in session:
    session.pop('username')
    
  return redirect(url_for('root'))
  
if __name__ == '__main__':
  run()
