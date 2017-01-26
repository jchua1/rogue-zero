import sqlite3
import json
import hashlib

f = "data/data.db"
c = None
db = None

def createDB():
  c.execute('CREATE TABLE IF NOT EXISTS users (user_id INTEGER, username TEXT, passhash TEXT, current_room INTEGER, char_state TEXT);')
  c.execute('CREATE TABLE IF NOT EXISTS rooms (user_id INTEGER, room_id INTEGER, room_info TEXT)')

def initDB():
  global c, db
  db = sqlite3.connect(f)
  c = db.cursor()
  createDB()

def closeDB():
  db.commit()
  db.close()

#before this we need to check if the door has been accessed

def getUserID(username):
  c.execute('SELECT user_id FROM users WHERE username=?', (username,))
  userID = c.fetchone()[0]

  return userID

def getCurrentRoomID(userID):
  c.execute('SELECT current_room FROM users WHERE user_id=?', (userID,))
  currentRoom = c.fetchone()[0]

  return currentRoom
  
#needs userid to get roomid, use them both to update in rooms
def updateRoom(userID, roomID, roomInfo):
  c.execute('UPDATE rooms SET room_info=? WHERE user_id=? AND room_id=?',
            (roomInfo, userID, roomID))

def getRoom(userID, roomID):
  c.execute('SELECT room_info FROM rooms WHERE user_id=? AND room_id=?',
            (userID, roomID))
  roomInfo = json.loads(c.fetchone()[0])

  return roomInfo
  
def getDoorLink(userID, door):#returns the room that door links to
  currentRoomID = getCurrentRoomID(userID)
  c.execute('SELECT doors FROM rooms WHERE user_id=? AND room_id=?',
            (userID, currentRoomID))
  doors = json.loads(c.fetchone()[0])

  return doors[door]

def updateCurrentRoomID(userID, roomID):
  c.execute('UPDATE users SET current_room=? WHERE user_id=?', (roomID, userID))
  
def saveRoom(userID, roomInfo, exitDoor):#needs userid, old room id, old terrain, the exited door
  #find the highest room id
  newRoomID = nextRoomID(userID)
  #update the room in the users table
  currentRoomID = getCurrentRoomID(userID)
  updateCurrentRoomID(userID, newRoomID)
  #Access the old room and set the exited door value to the new room id
  updateOldRoom(userID, currentRoom, newRoomID, roomInfo, exitDoor)
  #Generate the new room with the new id and assign the appropriate door value to the old room id
  
def nextRoomID(userID):
  c.execute('SELECT MAX(room_id) FROM rooms WHERE user_id=?', (userID,))
  maxID = c.fetchone()[0]

  if maxID is None:
    return 0
  else:
    return maxID + 1
  
def createNewRoom(userID, roomID, roomInfo):
  c.execute('INSERT INTO rooms VALUES (?, ?, ?)', (userID, roomID, roomInfo))
  
def login(username, password):
  if isRegistered(username):
    c.execute('SELECT passhash FROM users WHERE username=?', (username,))
    passhash = hashlib.sha256(password).hexdigest()

    if c.fetchone()[0] == passhash:
      return 'Logged in successfully!', 0
    else:
      return 'Invalid password.', -1
  else:
    return 'User not found.', -1

def nextUserID():
  c.execute('SELECT MAX(user_id) FROM users')
  maxID = c.fetchone()[0]

  if maxID is None:
    return 0
  else:
    return maxID + 1
    
def register(username, password, confirm):
  if password != confirm:
    return 'Passwords must match.', -1
  elif isRegistered(username):
    return 'Username already in use.', -1
  elif len(password) < 8 or len(password) > 32:
    return 'Password must be 8-32 characters.', -1
  elif ' ' in username or ' ' in password:
    return 'Username and password must not contain spaces.', -1
  elif username == password:
    return 'Username and password must be different.', -1
  else:
    userID = nextUserID()
    c.execute('INSERT INTO users VALUES (?, ?, ?, ?, ?)',
              (userID, username, hashlib.sha256(password).hexdigest(), 0, ''))
    return 'Registered successfully!', 0
      
def isRegistered(username):
  c.execute('SELECT * FROM users WHERE username=?', (username,))
  return c.fetchone() is not None
