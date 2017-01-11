function Game(socket, drawing) {
  this.socket = socket;
  this.drawing = drawing;
  this.player = {};
  this.room = {};
  this.hasData = false;
  this.animationFrameId = 0;
	this.lastFrameTime = 0;
}

Game.create = function (socket, canvasElement) {
  canvasElement.width = Constants.CANVAS_WIDTH;
  canvasElement.height = Constants.CANVAS_HEIGHT;
  var canvasContext = canvasElement.getContext('2d');
  var drawing = Drawing.create(canvasContext);
  var game = new Game(socket, drawing);
  game.init();
  return game;
};

Game.prototype.init = function () {
  var context = this;
  
  this.socket.on('new_level', function (data) {
    context.receiveLevel(data);
  });
};

Game.prototype.receiveLevel = function (level) {
  this.player = level.player;
  this.room = level.room;
};

Game.prototype.update = function () {
	var horizontal = ((Input.LEFT ? 1 : 0) + (Input.RIGHT ? -1 : 0)) * this.player.speed;
	var vertical = ((Input.UP ? 1 : 0) + (Input.DOWN ? -1 : 0)) * this.player.speed;
	var heading = Math.atan2(Input.MOUSE[1] - this.player.y,
													 Input.MOUSE[0] - this.player.x);
	var shot = Input.LEFT_CLICK;
	var now = (new Date()).getTime();
	var delta = this.lastFrameTime - now;

	this.player.x += horizontal * delta;
	this.player.y += vertical * delta;

	// for (var i = 0; i < this.room.enemies.length; i++) {
		// this.room.enemies[i].x += horizontal * delta;
		// this.room.enemies[i].y += vertical * delta;
	// }
	
	this.lastFrameTime = now;
};

Game.prototype.draw = function () {
  this.drawing.clear();

  this.drawing.renderBackground();

  for (var i = 0; i < this.room.enemies.length; i++) {
    this.drawing.renderObject(this.room.enemies[i], 'enemy');
    // console.log('enemy rendered');
  }

  this.drawing.renderObject(this.player, 'player');
};

Game.prototype.animate = function () {
  var context = this;
  
  this.animationFrameId = window.requestAnimationFrame(function () {
    context.run();
  });
};

Game.prototype.stopAnimation = function () {
  window.cancelAnimationFrame(this.animationFrameId);
};

Game.prototype.run = function () {
  this.update();
  this.draw();
  this.animate();
};
