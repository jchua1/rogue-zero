from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
from utils import level

app = Flask(__name__)
socketio = SocketIO(app)

def run():
  socketio.run(app, debug = True)

@app.route('/game')
def game():
  return render_template('game.html')

@socketio.on('client_handshake')
def connect(data):
  name = data['name']
  print 'new player %s connected' % name
  emit('server_handshake', {
    'message': 'hello %s' % name
  })

@socketio.on('get_level')
def sendLevel(data):
  print 'get got'
  seed = None
  
  if 'seed' in data:
    seed = data['seed']

  newLevel = level.Level(seed).asDict()
  print newLevel
  emit('new_level', newLevel)    

if __name__ == '__main__':
  run()
