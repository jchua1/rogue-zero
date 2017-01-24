import sqlite3
import json

f = "../data/data.db"


#before this we need to check if the door has been accessed
def saveRoom(userid, roomid, terrain, exitdoor):
    #find the highest room id
    newroomid = newID(userid)
    #update the room in the users table
    updateRoom(userid, newroomid)
    #Access the old room and set the exited door value to the new room id
    updateOld(userid, roomid, newroomid, exitdoor)
    #Generate the new room with the new id and assign the appropriate door value to the old room id
    
def updateRoom(userid, roomid):
    db = sqlite3.connect(f)
    c = db.cursor()
    #query = ("SELECT current_room FROM users WHERE user_id=?")
    #a = c.execute(query, (userid,))
    #c = db.cursor()
    query = ("UPDATE users SET current_room=? WHERE user_id=?")
    sel = ""
    sel = c.execute(query,(roomid, userid))
    db.commit()
    db.close()
    #return a

def newID(userID):
    db = sqlite3.connect(f)
    c = db.cursor()
    query = ("SELECT MAX(room_id) FROM rooms WHERE user_id=?")
    r = c.execute(query,(userID,))
    r = r.fetchone()[0]
    db.commit()
    db.close()
    return r+1


def updateOld(userid, oldroom, newroom, olddoor):
    db = sqlite3.connect(f)
    c = db.cursor()
    query = ("SELECT * FROM rooms WHERE user_id=? AND room_id=?")
    c.execute(query,(userid,oldroom))
    doors = c.fetchone()[4]
    print doors
    d = json.loads(doors)
    if olddoor == 1:
        d['d3'] = newroom
    elif olddoor == 2:
        d['d4'] = newroom
    elif olddoor == 3:
        d['d1'] = newroom
    else:
        d['d2'] = newroom
    a = json.dumps(d)
    query = ("UPDATE rooms SET exits=? WHERE user_id=? AND room_id=?")
    c.execute(query,(a,userid,oldroom))
    db.commit()
    db.close()
    

updateOld(0,3,4,3)
#saveRoom(0,3,'none','wait')
#updateRoom(0,3)
#db = sqlite3.connect(f)
#c = db.cursor()
#c.execute("CREATE TABLE rooms (user_id INTEGER, room_id INTEGER, terrain TEXT, items TEXT, exits TEXT)")
#c.execute('''INSERT INTO rooms VALUES (0,3,"hi","bi","{'d1':-1,'d2':-1,'d3':-1,'d4':-1 }")''')
#db.commit()
#db.close()
#updateRoom(0,3)
#print newID(0)
