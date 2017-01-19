import sqlite3

f = "data/data.db"

def saveRoom(userid, roomid, terrain, exit):
    oldroomid = updateRoom(roomid)

def updateRoom(roomid):
    db.connect(f)
    c = db.cursor()
    query = ("UPDATE roomid FROM users WHERE user_id=")
    sel = ""
    sel = c.execute(query,(userid,))
    
