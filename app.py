from flask import Flask, session, request, url_for, redirect, render_template, flash
from flask_socketio import SocketIO, send, emit
from utils import level, util, db#, upgrades
import json
from pprint import pprint

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
    return render_template('game.html',
                           # healthOldSkill = upgrades.health(0),
                           # healthCost=upgrades.cost(0),
                           # healthNewSkill= upgrades.health(0+1),
                           # speedOldSkill = upgrades.speed(0),
                           # speedCost=upgrades.cost(0),
                           # speedNewSkill= upgrades.speed(0+1),
                           # atkspdOldSkill = upgrades.shootSpeed(0),
                           # atkspdCost=upgrades.cost(0),
                           # atkspdNewSkill= upgrades.shootSpeed(0+1),
                           # shootdmgOldSkill = upgrades.health(0),
                           # shootdmgCost=upgrades.cost(0),
                           # shootdmgNewSkill= upgrades.shootDamage(0+1),
                           # meleedmgOldSkill = upgrades.meleeDamage(0),
                           # meleedmgCost=upgrades.cost(0),
                           # meleedmgNewSkill= upgrades.meleeDamage(0+1),
                           # meleesizeOldSkill = upgrades.meleeRange(0),
                           # meleeSizeCost=upgrades.cost(0),
                           # meleesizeNewSkill= upgrades.meleeRange(0+1)
    )

  return redirect(url_for('root'))

@socketio.on('get_room')
def sendRoom():
  db.initDB()
  username = session['username']
  userID = db.getUserID(username)
  roomID = db.getCurrentRoomID(userID)
  maxID = db.maxRoomID(userID)
  room = None

  if roomID > maxID:
    print 'room does not exist'
    room = level.Room().asDict()
    db.createNewRoom(userID, roomID, room['room'])
  else:
    print 'fetching existing room %d' % roomID
    room = {
      'player': db.getPlayer(userID),
      'room': db.getRoom(userID, roomID)
    };

  pprint(room)
  db.closeDB()
  emit('new_room', room)

# @socketio.on('upgradePlayers')
# def notUpgrades(data):
  # skills = data['upgrades']
  # print skills

@socketio.on('player_death')
def playerDeath():#clears user info in database
  db.initDB()
  db.reset(session['username'])
  db.closeDB()
  return render_template('death.html')

@socketio.on('save_room')
def saveRoom(data):
  db.initDB()
  player = data['player']
  currentRoom = data['room']
  exitDoor = data['exitDoor']
  entryDoor = (exitDoor + 2) % 4
  username = session['username']
  userID = db.getUserID(username)

  currentRoomID = db.getCurrentRoomID(userID)
  nextRoomID = currentRoom['doors'][exitDoor]['link']
  maxRoomID = db.maxRoomID(userID)
  # pprint(currentRoom)
  nextRoom = None

  newPosition = level.DOOR_POSITIONS[(exitDoor + 2) % 4]
  player['x'] = newPosition[0]
  player['y'] = newPosition[1]

  if nextRoomID == -1: #entirely new room
    nextRoomID = db.nextRoomID(userID)
    print 'generating new room with id %d from room %d' % (nextRoomID, currentRoomID)
    nextRoom = level.Room(player).asDict()
    nextRoom['room']['doors'][entryDoor]['link'] = currentRoomID
    db.createNewRoom(userID, nextRoomID, nextRoom['room'])
    currentRoom['doors'][exitDoor]['link'] = nextRoomID
  else:
    print 'fetching old room with id %d' % nextRoomID
    nextRoom = {
      'player': player,
      'room': db.getRoom(userID, nextRoomID)
    }
    # nextRoom['room']['doors'][entryDoor]['link'] = currentRoomID
    # db.updateRoom(userID, nextRoomID, nextRoom['room'])

  db.updateRoom(userID, currentRoomID, currentRoom)
  db.updatePlayer(userID, nextRoom['player'])
  db.updateCurrentRoomID(userID, nextRoomID)
  db.closeDB()

  # pprint(currentRoom)
  pprint(nextRoom)
  
  emit('new_room', nextRoom)
  
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
