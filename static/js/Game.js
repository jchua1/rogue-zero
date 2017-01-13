function Game(socket, drawing) {
  this.socket = socket;
  this.drawing = drawing;
  this.player = {};
  this.room = {};
  this.projectiles = [];
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
  update(level, this);

  if (!this.hasData) {
    this.player = cast(this.player, Player);

    for (var i = 0; i < this.room.enemies.length; i++) {
      this.room.enemies[i] = cast(this.room.enemies[i], Enemy);
    }
    
    this.hasData = true;
  }
};

Game.prototype.update = function () {
	var horizontal = ((Input.LEFT ? 1 : 0) + (Input.RIGHT ? -1 : 0));
	var vertical = ((Input.UP ? 1 : 0) + (Input.DOWN ? -1 : 0));
	var heading = Math.PI + Math.atan2(Input.MOUSE[1] - this.player.y,
													           Input.MOUSE[0] - this.player.x);
	var shot = Input.LEFT_CLICK;
	var now = (new Date()).getTime();
	var delta = this.lastFrameTime - now;

  this.player.vx = horizontal * this.player.speed;
  this.player.vy = vertical * this.player.speed;
  this.player.heading = heading;

  this.player.update(delta);

  if (shot) {
    if (now - this.player.lastShotTime > this.player.shotDelay * 1000) {
      var projectile = new Projectile(this.player.x, this.player.y,
                                      this.player.projectileSpeed * Math.cos(heading),
                                      this.player.projectileSpeed * Math.sin(heading),
                                      0, 0);
      this.projectiles.push(projectile);
      this.player.lastShotTime = now;
    }
  }

	// for (var i = 0; i < this.room.enemies.length; i++) {
		// this.room.enemies[i].x += horizontal * delta;
		// this.room.enemies[i].y += vertical * delta;
	// }

  for (var i = 0; i < this.projectiles.length; i++) {
    this.projectiles[i].update(delta);
  }
	
	this.lastFrameTime = now;
};

Game.prototype.draw = function () {
  this.drawing.clear();

  this.drawing.renderBackground();

  for (var i = 0; i < this.room.enemies.length; i++) {
    this.drawing.renderEnemy(this.room.enemies[i]);
  }

  for (var i = 0; i < this.projectiles.length; i++) {
    this.drawing.renderProjectile(this.projectiles[i]);
  }

  this.drawing.renderPlayer(this.player);
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
