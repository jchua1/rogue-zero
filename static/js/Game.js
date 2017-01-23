function Game(socket, drawing) {
  this.socket = socket;
  this.drawing = drawing;
  this.player = {};
  this.room = {};
  this.projectiles = [];
  this.melees = [];
  this.hasData = false;
  this.isRunning = false;
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
  this.player = cast(this.player, Player);

  for (var i = 0; i < this.room.enemies.length; i++) {
    this.room.enemies[i] = cast(this.room.enemies[i], Enemy);
  }
};

Game.prototype.update = function () {
  var player = this.player;
  var enemies = this.room.enemies;
  var projectiles = this.projectiles;
  var melees = this.melees;
  
	var horizontal = ((Input.LEFT ? -1 : 0) + (Input.RIGHT ? 1 : 0));
	var vertical = ((Input.UP ? -1 : 0) + (Input.DOWN ? 1 : 0));

  if (horizontal != 0 || vertical != 0) {
    var inputMagnitude = magnitude(horizontal, vertical);
    horizontal /= inputMagnitude;
    vertical /= inputMagnitude;
  }
  
  var walk = (Input.MISC_KEYS[16] ? 0.2 : 1);

  if (Input.MOUSE.length == 2) {
	  var heading = Math.PI + Math.atan2(Input.MOUSE[1] - player.y,
													             Input.MOUSE[0] - player.x);
    player.theta = heading;
  }

	var shoot = Input.LEFT_CLICK;
  var melee = Input.MISC_KEYS[70]; // F

	var now = (new Date()).getTime() / 1000;
	var delta = now - this.lastFrameTime;

  player.vx = horizontal * player.speed * walk;
  player.vy = vertical * player.speed * walk;

  player.update(delta);

  if (melee) {
    if (now - player.lastMeleeTime > player.meleeDelay) {
      var melee = new Melee();

      update({
        startTheta: player.theta - player.meleeArc / 2,
        theta: player.theta - player.meleeArc / 2,
        omega: player.meleeSpeed,
        arc: player.meleeArc,
        range: player.meleeRange,
        width: player.meleeWidth,
        damage: player.meleeDamage,
        owner: player
      }, melee);

      melees.push(melee);
      player.lastMeleeTime = now;
    }
  }

  if (shoot) {
    if (now - player.lastShootTime > player.shootDelay) {
      var projectile = new Projectile();

      update({
        x: player.x,
        y: player.y,
        vx: player.shootSpeed * -Math.cos(heading),
        vy: player.shootSpeed * -Math.sin(heading),
        range: player.shootRange,
        size: player.shootSize,
        startX: player.x,
        startY: player.y,
        damage: player.shootDamage
      }, projectile);

      projectiles.push(projectile);
      player.lastShootTime = now;
    }
  }

  melees.forEach(function (melee, i, melees) {
    melee.update(delta);

    enemies.forEach(function (enemy, j, enemies) {
      if (collideSectorCircle(melee.x,
                              melee.y,
                              melee.range,
                              melee.theta,
                              melee.width,
                              enemy.x,
                              enemy.y,
                              enemy.size)) {
        enemy.takeDamage(melee.damage);
      }
    });  

    if (!melee.shouldExist) {
      melees.splice(i, 1);
      return;
    }
  });

  projectiles.forEach(function (projectile, i, projectiles) {
    projectile.update(delta);

    enemies.forEach(function (enemy, j, enemies) {
      if (collideCircleCircle(projectile.x,
                              projectile.y,
                              projectile.size,
                              enemy.x,
                              enemy.y,
                              enemy.size)) {
        enemy.takeDamage(projectile.damage);
        projectile.shouldExist = false;
      }
    });

    if (!projectile.shouldExist) {
      projectiles.splice(i, 1);
      return;
    }
  });

  enemies.forEach(function (enemy, i, enemies) {
    enemy.update(delta);

    if (collideCircleCircle(enemy.x,
                            enemy.y,
                            enemy.size,
                            player.x,
                            player.y,
                            player.size)) {
      player.takeDamage(enemy.attack);
    }

    if (!enemy.shouldExist) {
      enemies.splice(i, 1);
      return;
    }
  });

	this.lastFrameTime = now;

  if (!player.shouldExist) {
    this.isRunning = false;
  }
};

Game.prototype.draw = function () {
  var drawing = this.drawing;
  var player = this.player;
  var tiles = this.room.tiles;
  var enemies = this.room.enemies;
  var melees = this.melees;
  var projectiles = this.projectiles;

  drawing.clear();

  drawing.renderBackground();

  tiles.forEach(function (tile, i, tiles) {
    drawing.renderTile(tile);
  });

  enemies.forEach(function (enemy, i, enemies) {
    drawing.renderEnemy(enemy);
  });

  melees.forEach(function (melee, i, melees) {
    drawing.renderMelee(melee);
  });

  projectiles.forEach(function (projectile, i, projectiles) {
    drawing.renderProjectile(projectile);
  });

  drawing.renderPlayer(player);
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
  if (this.isRunning) {
    this.update();
    this.draw();
    this.animate();
  } else {
    this.stopAnimation();
  }
};

Game.prototype.start = function () {
  this.isRunning = true;
  this.run();
};
