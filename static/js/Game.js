function Game(socket, drawing) {
	this.socket = socket;
	this.drawing = drawing;
	this.animationFrameId = 0;
}

Game.create = function (socket, canvasElement) {
	var canvasContext = canvasElement.getContext('2d');
	var drawing = Drawing.create(canvasContext);
	var game = new Game(socket, drawing);
	game.init();
	return game;
};

Game.prototype.init = function () {
	var context = this;
	
	this.socket.on('update', function (data) {
		context.receiveGameState(data);
	});
};

Game.prototype.receiveGameState = function (state) {
	
};

Game.prototype.update = function () {
	
};

Game.prototype.draw = function () {

};

Game.prototype.animate = function () {
	var context = this;
	
	this.animationFrameId = window.requestAnimationFrame(function () {
		this.run();
	});
};

Game.prototype.run = function () {
	this.update();
	this.draw();
	this.animate();
};
