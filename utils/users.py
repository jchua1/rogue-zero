from hashlib import sha1
from sqlite3 import connect

f = "data/data.db"

def login(user, password):
    db = connect(f)
    c = db.cursor()
    query = "SELECT password FROM users WHERE username=?"
    sel = ""
    try:
        sel = c.execute(query,(user,))
    except:
        c.execute("CREATE TABLE users (user_id INTEGER, username TEXT, password TEXT, current_room INTEGER, items TEXT, char_state TEXT)")
        sel = c.execute(query,(user,));
    password = sha1(password).hexdigest()
    p = sel.fetchone()[0]
    if password == p:
        return ""
    else:
        return "User login has failed. Invalid password."
    db.commit()
    db.close()
    return "Username does not exist."

def register(user, password):
    db = connect(f)
    c = db.cursor()
    try:
        c.execute("SELECT * FROM users")
    except:
        c.execute("CREATE TABLE users (user_id INTEGER, username TEXT, password TEXT, current_room INTEGER, items TEXT, char_state TEXT)")
    db.commit()
    db.close()
    return regMain(user, password)

def regMain(user, password):
    db = connect(f)
    c = db.cursor()
    reg = regReqs(user, password)
    if reg == "":
        s = c.execute("SELECT MAX(user_id) FROM users")
        i = s.fetchone()[0]
        if i == None:
            i = 0
        else:
            i += 1
        query = "INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)"
        password = sha1(password).hexdigest()
        c.execute(query, (i, user, password, 1, "test", "test"))
        reg = "Account created!" 
    db.commit()
    db.close()
    return reg
        
def regReqs(user,password):
    if len(password) < 8 or len(password) > 32:
        return "Password must be 8-32 characters."
    if duplicate(user): 
        return "Username already exists."
    if " " in user or " " in password:
        return "Spaces not allowed in user or password."
    if user==password:
        return "Username and password must be different."
    return ""

def duplicate(user):
    db = connect(f)
    c = db.cursor()
    query = ("SELECT * FROM users WHERE username=?")
    sel = c.execute(query, (user,))
    retVal = False
    for record in sel:
        retVal = True
    db.commit()
    db.close()
    return retVal
