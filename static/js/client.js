document.addEventListener('DOMContentLoaded', function (e) {
	var socket = io();
	var canvasElement = document.getElementById('canvas');
	var game = Game.create(socket, canvasElement);

	Input.applyEventHandlers(canvasElement);
	Input.addMouseTracker(canvasElement);

	socket.emit('connect', {
		name: 'test'
	});
});
