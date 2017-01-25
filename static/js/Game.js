function Game(socket, drawing) {
  this.socket = socket;
  this.drawing = drawing;
  this.player = {};
  this.room = {};
  this.projectiles = [];
  this.melees = [];
  this.isRunning = false;
  this.animationFrameId = 0;
	this.lastFrameTime = 0;
  this.currentWeapon = 'gun';
}

Game.create = function (socket, canvasElement) {
  canvasElement.width = Constants.CANVAS_SIZE;
  canvasElement.height = Constants.CANVAS_SIZE;
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

  this.room.enemies.forEach(function (enemy, i, enemies) {
    enemies[i] = cast(enemy, Enemy);
  });

  this.room.rocks.forEach(function (rock, i, rocks) {
    rocks[i] = cast(rock, Obstacle);
  });

  this.room.quicksand.forEach(function (patch, i, quicksand) {
    quicksand[i] = cast(patch, Obstacle);
  });
  
  this.room.pits.forEach(function (pit, i, pits) {
    pits[i] = cast(pit, Obstacle);
  });
};

Game.prototype.update = function () {
  var player = this.player;
  var enemies = this.room.enemies;
  var projectiles = this.projectiles;
  var melees = this.melees;
  var items = this.room.items;
  var rocks = this.room.rocks;
  var quicksand = this.room.quicksand;
  var pits = this.room.pits;
	var now = (new Date()).getTime() / 1000;
  
  if (this.lastFrameTime != 0) {
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

	  var attack = Input.LEFT_CLICK;
    var switchWeapon = Input.RIGHT_CLICK;

	  var delta = now - this.lastFrameTime;

    var coords = getTile(player.x, player.y);

    player.vx = horizontal * player.speed * walk * player.speedModifier;
    player.vy = vertical * player.speed * walk * player.speedModifier;
    player.speedModifier = 1;
    
    player.update(delta);

    enemies.forEach(function (enemy, i, enemies) {
      var dispX = player.x - enemy.x;
      var dispY = player.y - enemy.y;
      var disp = magnitude(dispX, dispY);
      dispX /= disp;
      dispY /= disp;

      enemy.vx = dispX * enemy.speed * enemy.speedModifier;
      enemy.vy = dispY * enemy.speed * enemy.speedModifier;
      
      enemy.update(delta);
      
      if (collide(enemy, player)) {
        player.takeDamage(enemy.attack);
      }

      if (!enemy.shouldExist) {
        enemies.splice(i, 1);
        return;
      }
    });
    
    rocks.forEach(function (rock, i, rocks) {
      if (collide(player, rock)) {
        var center = getCenterOfTangentCircle(rock.getShape(),
                                              [player.x - rock.x,
                                               player.y - rock.y],
                                              player.size);
        player.x = center[0];
        player.y = center[1];
      }

      enemies.forEach(function (enemy, j, enemies) {
        if (collide(enemy, rock)) {
          var center = getCenterOfTangentCircle(rock.getShape(),
                                                [enemy.x - rock.x,
                                                 enemy.y - rock.y],
                                                enemy.size);
          enemy.x = center[0];
          enemy.y = center[1];
        }
      });

      projectiles.forEach(function (projectile, j, projectiles) {
        if (collide(projectile, rock)) {
          projectile.shouldExist = false;
        }
      });
    });

    pits.forEach(function (pit, i, pits) {
      if (collide(player, pit)) {
        player.shouldExist = false;
      }

      enemies.forEach(function (enemy, j, enemies) {
        if (collide(enemy, pit)) {
          enemy.shouldExist = false;
        }
      });
    });
    
    quicksand.forEach(function (patch, i, quicksand) {
      if (collide(player, patch)) {
        player.speedModifier = 0.2;
      }

      enemies.forEach(function (enemy, j, enemies) {
        if (collide(enemy, patch)) {
          enemy.speedModifier = 0.2;
        }
      });
    });
    
    if (switchWeapon) {
      if (this.currentWeapon == 'gun') {
        this.currentWeapon = 'sword';
      } else {
        this.currentWeapon = 'gun';
      }
    }
    
    if (attack) {
      if (this.currentWeapon == 'sword') {
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
      } else if (this.currentWeapon == 'gun') {
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
    }

    melees.forEach(function (melee, i, melees) {
      melee.update(delta);

      enemies.forEach(function (enemy, j, enemies) {
        if (distance(melee.x, melee.y, enemy.x, enemy.y) <= melee.range + enemy.size)
          if (collide(melee, enemy)) {
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
        if (collide(projectile, enemy)) {
          enemy.takeDamage(projectile.damage);
          projectile.shouldExist = false;
        }
      });

      if (!projectile.shouldExist) {
        projectiles.splice(i, 1);
        return;
      }
    });
  }
  
	this.lastFrameTime = now;

  if (!player.shouldExist) {
    this.isRunning = false;
  }
};

Game.prototype.draw = function () {
  var drawing = this.drawing;
  var player = this.player;
  var enemies = this.room.enemies;
  var melees = this.melees;
  var projectiles = this.projectiles;
  var quicksand = this.room.quicksand;
  var pits = this.room.pits;
  var rocks = this.room.rocks;

  drawing.clear();

  drawing.renderBackground();

  quicksand.forEach(function (patch, i, quicksand) {
    drawing.renderPatch(patch);
  });

  pits.forEach(function (pit, i, pits) {
    drawing.renderPit(pit);
  });

  rocks.forEach(function (rock, i, rocks) {
    drawing.renderRock(rock);
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
