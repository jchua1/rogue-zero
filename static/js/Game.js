function Game(socket, drawing) {
  this.socket = socket;
  this.drawing = drawing;
  this.player = {};
  this.room = {};
  this.projectiles = [];
  this.melees = [];
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

  this.player = Player.fromObject(this.player);
  
  for (var i = 0; i < this.room.enemies.length; i++) {
    this.room.enemies[i] = Enemy.fromObject(this.room.enemies[i]);
  }
};

Game.prototype.update = function () {
	var horizontal = ((Input.LEFT ? 1 : 0) + (Input.RIGHT ? -1 : 0));
	var vertical = ((Input.UP ? 1 : 0) + (Input.DOWN ? -1 : 0));
	var heading = Math.PI + Math.atan2(Input.MOUSE[1] - this.player.y,
													           Input.MOUSE[0] - this.player.x);

	var shoot = Input.LEFT_CLICK;
  var melee = Input.MISC_KEYS[70]; // F

	var now = (new Date()).getTime();
	var delta = this.lastFrameTime - now;

  this.player.vx = horizontal * this.player.speed;
  this.player.vy = vertical * this.player.speed;
  this.player.theta = heading;

  this.player.update(delta);

  if (melee) {
    if (now - this.player.lastMeleeTime > this.player.meleeDelay * 1000) {
      var melee = Melee.fromObject({
        startTheta: this.player.theta,
        omega: this.player.meleeSpeed,
        arc: this.player.meleeArc,
        range: this.player.meleeRange,
        width: this.player.meleeWidth,
        owner: this.player
      });
        
      this.melees.push(melee);
      this.player.lastMeleeTime = now;
    }
  }

  if (shoot) {
    if (now - this.player.lastShootTime > this.player.shootDelay * 1000) {
      var projectile = Projectile.fromObject({
        x: this.player.x,
        y: this.player.y,
        vx: this.player.shootSpeed * Math.cos(heading),
        vy: this.player.shootSpeed * Math.sin(heading),
        startX: this.player.x,
        startY: this.player.y,
        range: this.player.shootRange,
        size: this.player.shootSize
      });

      this.projectiles.push(projectile);
      this.player.lastShootTime = now;
    }
  }

  for (var i = 0; i < this.melees.length; i++) {
    this.melees[i].update(delta);

    if (this.melees[i].shouldExist) {
      this.melees.splice(i, 1);
    }
  }

  for (var i = 0; i < this.projectiles.length; i++) {
    this.projectiles[i].update(delta);
    
    if (!this.projectiles[i].shouldExist) {
      this.projectiles.splice(i, 1);
    } 
  }
	
	this.lastFrameTime = now;
};

Game.prototype.draw = function () {
  this.drawing.clear();

  this.drawing.renderBackground();

  for (var i = 0; i < this.room.enemies.length; i++) {
    this.drawing.renderEnemy(this.room.enemies[i]);
  }

  for (var i = 0; i < this.melees.length; i++) {
    this.drawing.renderMelee(this.melees[i]);
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
