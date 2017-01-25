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
    makeNew(userid, roomid, newroomid, exitdoor)
    
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
        d['d1'] = newroom
    elif olddoor == 2:
        d['d2'] = newroom
    elif olddoor == 3:
        d['d3'] = newroom
    else:
        d['d4'] = newroom
    a = json.dumps(d)
    query = ("UPDATE rooms SET exits=? WHERE user_id=? AND room_id=?")
    c.execute(query,(a,userid,oldroom))
    db.commit()
    db.close()

def makeNew(userid, oldroom, newroom, olddoor):
    db = sqlite3.connect(f)
    c = db.cursor()
    s = ''
    d = {}
    d['d1'] = -1
    d['d2'] = -1
    d['d3'] = -1
    d['d4'] = -1
    if olddoor == 1:
        d['d3'] = oldroom
    elif olddoor == 2:
        d['d4'] = oldroom
    elif olddoor == 3:
        d['d1'] = oldroom
    else:
        d['d2'] = oldroom
    doors = json.dumps(d)
    query = ("INSERT INTO rooms VALUES (?,?,'hi','we',?)")
    c.execute(query,(userid,newroom,doors))
    db.commit()
    db.close()

    
saveRoom(0,4,'sdfsd',3)#need to get terrain passed of new room
