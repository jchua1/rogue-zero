from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
socketio = SocketIO(app)

def run():
  app.SECRET_KEY = 'secret'
  app.DEBUG = True
  socketio.run(app)

@app.route('/game')
def game():
  return render_template('game.html')

@socketio.on('client_handshake')
def connect(data):
  name = data['name']
  print 'new player %s connected' % name
  emit('server_handshake', {
    'message': 'hello %s' % name
  });

if __name__ == '__main__':
  run()
