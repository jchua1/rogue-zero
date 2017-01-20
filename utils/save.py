import sqlite3

f = "data/data.db"


#before this we need to check if the door has been accessed
def saveRoom(userid, roomid, terrain, exit):
    #update the room in the users table
    oldroomid = updateRoom(userid, roomid)
    #find the highest room id
    #Access the old room and set the exited door value to the new room id
    #Generate the new room with the new id and assign the appropriate door value to the old room id

    
def updateRoom(userid, roomid):
    db = sqlite3.connect(f)
    c = db.cursor()
    query = ("SELECT current_room FROM users WHERE user_id=?")
    a = c.execute(query, (userid,))
    c = db.cursor()
    query = ("UPDATE users SET current_room=? WHERE user_id=?")
    sel = ""
    sel = c.execute(query,(roomid, userid))
    db.commit()
    db.close()
    return a

def newid():
    
