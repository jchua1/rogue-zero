import sqlite3
import json

f = "../data/data.db"
c = None
db = None

def createDB():
  c.execute('CREATE TABLE IF NOT EXISTS users (user_id INTEGER, username TEXT, passhash TEXT, current_room INTEGER, char_state TEXT);')
  c.execute('CREATE TABLE IF NOT EXISTS rooms (user_id INTEGER, room_id INTEGER, room_info TEXT, doors TEXT)')

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
  initDB()
  c.execute('SELECT user_id FROM users WHERE username=?', (username,))
  userID = c.fetchone()[0]
  closeDB()
  return userID

def getCurrentRoomID(userID):
  initDB()
  c.execute('SELECT current_room FROM users WHERE user_id=?', (userID,))
  currentRoom = c.fetchone()[0]
  closeDB()
  return currentRoom
  
#needs userid to get roomid, use them both to update in rooms
def updateRoom(userID, roomID, roomInfo):
  initDB()
  c.execute('UPDATE rooms SET room_info=? WHERE user_id=? AND room_id=?',
            (roomInfo, userID, roomID))
  closeDB()

def getDoorLink(userID, door):#returns the room that door links to
  initDB()
  currentRoom = getCurrentRoom(userID)
  c.execute('SELECT doors FROM rooms WHERE user_id=? AND room_id=?',
            (userID, currentRoom))
  doors = json.loads(c.fetchone()[0])
  closeDB()

  return doors[door]

def updateCurrentRoomID(userID, roomID):
  initDB()
  c.execute('UPDATE users SET current_room=? WHERE user_id=?', (roomID, userID))
  closeDB()
  
def enterOld(userID, roomID):#returns the terrain for an old room and updates the current room to roomid
  initDB()
  c.execute('SELECT room_info FROM rooms WHERE user_id=? AND room_id=?')
  roomInfo = c.fetchone()[0]
  updateCurrentRoom(userID, roomID)
  closeDB()
  return roomInfo
  
def saveProgress(userID, playerInfo, roomInfo):
  print 'room'
  #print playerInfo
  roomInfo = json.dumps(roominfo)
  saveRoom(userID, roomInfo, 1)

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
  initDB()
  query = ('SELECT MAX(room_id) FROM rooms WHERE user_id=?')
  r = c.execute(query, (userID,))
  r = r.fetchone()[0]
  closeDB()
  return r + 1

def updateOldRoom(userID, oldRoomID, newRoomID, roomInfo, exitDoor):
  initDB()
  c.execute('UPDATE rooms SET room_info=? WHERE user_id=? AND room_id=?',
            (roomInfo, userID, oldRoomID))
  c.execute('SELECT * FROM rooms WHERE user_id=? AND room_id=?', (userID, oldRoomID))

  doors = json.loads(c.fetchone()[3])
  print doors
  doors[exitDoor] = newRoomID
  
  c.execute('UPDATE rooms SET doors=? WHERE user_id=? AND room_id=?',
            (json.dumps(doors), userID, oldRoomID))
  closeDB()

def createNewRoom(userID, oldRoomID, newRoomID, exitDoor):
  initDB()
  doors = [oldRoomID if door == exitDoor else -1 for door in range(4)]

  c.execute('INSERT INTO rooms VALUES (?, ?, 'enemies', 'items', 'terrain', ?)',
            (query, (userID, newRoomID, json.dumps(doors))))
  closeDB()

#db = sqlite3.connect(f)
#c = db.cursor()
#c.execute('CREATE TABLE rooms (user_id INTEGER, room_id INTEGER, enemies TEXT, items TEXT, terrain TEXT, exits T#EXT)')
#c.execute('''INSERT INTO rooms VALUES (0,1,'enemies','items','terrain','{'d1':-1,'d2':-1,'d3':-1,'d4':-1}')''')
#db.commit()
#db.close()
#saveRoom(0,'enemies','items','terrain',1)
#updateRoom(0,1)
#leaveroom('asdf','hi')
#enterOld('asdf',3)
