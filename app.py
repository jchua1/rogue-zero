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
  
if __name__ == '__main__':
  run()
