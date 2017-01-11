from flask import Flask, session, request, url_for, redirect, render_template
from flask_socketio import SocketIO, send, emit
from utils import level, users

app = Flask(__name__)
socketio = SocketIO(app)

def run():
  app.secret_key = 'hi'
  socketio.run(app, debug = True)

@app.route('/game')
def game():
  return render_template('game.html')

@socketio.on('new_player')
def new_player(data):
  name = data['name']
  print 'new player %s connected' % name
  emit('new_level', getLevel())

@socketio.on('get_level')
def sendLevel(data = {}):
  seed = None
  
  if 'seed' in data:
    seed = data['seed']

  print 'generating level with seed %s' % seed
  emit('new_level', getLevel(seed))

def getLevel(seed = None):
  newLevel = level.Level(seed).asDict()
  print newLevel
  return newLevel

#login
@app.route('/')
def root():
  if( 'username' in session.keys() ):
    return redirect(url_for( 'game' ))
  else:
    return redirect(url_for( 'login' ))

@app.route('/login/')
def login():
  if 'username' in session:
    return redirect(url_for('game'))
    return render_template('login.html')

@app.route('/authenticate/', methods=['POST'])
def authenticate():
  pw = request.form['pass']
  un = request.form['user']
  text = users.login(un,pw)#error message
  if text == '':#if no error message, succesful go back home
    session['username'] = un
    return redirect(url_for('game'))
    return render_template('login.html', message = text)

@app.route('/register/', methods=['POST'])
def register():
  pw = request.form['pass']
  un = request.form['user']
  pw2 = request.form['passconf']
  if pw2 == pw:
    regRet = users.register(un,pw)#returns an error/success message
    return render_template('login.html', message = regRet)
  else:
    return render_template('login.html', message = 'Passwords don\'t match')
    
@app.route('/logout/')
def logout():
  session.pop('username')
  return redirect(url_for('root'))
  
if __name__ == '__main__':
  run()
