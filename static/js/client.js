document.addEventListener('DOMContentLoaded', function (e) {
	var socket = io();
	var canvasElement = document.getElementById('canvas');
	var game = Game.create(socket, canvasElement);

	Input.applyEventHandlers(canvasElement);
	Input.addMouseTracker(canvasElement);

	console.log('loaded');

	socket.emit('client_handshake', {
		name: 'test'
	});

	socket.on('server_handshake', function (data) {
		console.log(data);
	});
});
