from hashlib import sha1
from sqlite3 import connect
from os import urandom

f = "data/data.db"

def login(user, password):
    db = connect(f)
    c = db.cursor()
    query = ("SELECT * FROM users WHERE username=?")
    sel = ""
    try:
        sel = c.execute(query,(user,))
    except:
        c.execute("CREATE TABLE users (user_id INTEGER, username TEXT, password TEXT, current_room INTEGER, items TEXT, char_state TEXT)")
        sel = c.execute(query,(user,));
    
    #records with this username
    #so should be at most one record (in theory)
    for record in sel:
        password = sha1(password).hexdigest()
        if (password==record[1]):
            return ""#no error message because it will be rerouted to mainpage
        else:
            return "User login has failed. Invalid password"#error message
    db.commit()
    db.close()
    return "Username does not exist"#error message

def register(user, password):
    db = connect(f)
    c = db.cursor()
    try: #does table already exist?
        c.execute("SELECT * FROM users")
    except: #if not, this is the first user!
        c.execute("CREATE TABLE users (user_id INTEGER, username TEXT, password TEXT, current_room INTEGER, items TEXT, char_state TEXT)")
    db.commit()
    db.close()
    return regMain(user, password)#register helper

def regMain(user, password):#register helper
    db = connect(f)
    c = db.cursor()
    reg = regReqs(user, password)
    if reg == "": #if error message is blank then theres no problem, update database
        s = c.execute("SELECT MAX(user_id) FROM users")
        i = s.fetchone()[0]
        if i == None:
            i = 0
        else:
            i += 1
        query = ("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)")
        password = sha1(password).hexdigest()
        c.execute(query, (i, user, password, 1, "test", "test"))
        db.commit()
        db.close()
        return "Account created!"
    db.commit()
    db.close()
    return reg #return error message
        
def regReqs(user,password):      #error message generator
    if len(password) < 8 or len(password) > 32:
        return "Password must be 8-32 characters"
    if duplicate(user):  #checks if username already exists
        return "Username or email already exists"
    if " " in user or " " in password:
        return "Spaces not allowed in user or password"
    if user==password:
        return "Username and password must be different"
    return ""

def duplicate(user):#checks if username already exists
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
