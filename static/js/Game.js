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

  this.room.tiles.forEach(function (row, i, tiles) {
    row.forEach(function (tile, j, row) {
      tiles[i][j] = cast(tile, Tile);
    });
  });
};

Game.prototype.update = function () {
  var player = this.player;
  var enemies = this.room.enemies;
  var projectiles = this.projectiles;
  var melees = this.melees;
  var tiles = this.room.tiles;
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

	  var shoot = Input.LEFT_CLICK;
    var melee = Input.MISC_KEYS[70]; // F

	  var delta = now - this.lastFrameTime;

    var coords = getTile(player.x, player.y);

    player.vx = horizontal * player.speed * walk * player.speedModifier;
    player.vy = vertical * player.speed * walk * player.speedModifier;
    
    player.update(delta);

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        var x = coords[0] + i - 1;
        var y = coords[1] + j - 1;

        if (x >= 0 && x < Constants.GRID_SIZE &&
            y >= 0 && y < Constants.GRID_SIZE) {
          var tile = tiles[coords[0] + i - 1][coords[1] + j - 1];

          if (collide(player, tile)) {
            switch (tile.terrain) {
            case 'pit':
              player.shouldExist = false;
              break;

            case 'quicksand':
              player.speedModifier = 0.2;
              break;

            case 'rock':
              var shape = tile.getShape();
              var center = getCenterOfTangentCircle(shape,
                                                    [player.x - shape.x,
                                                     player.y - shape.y],
                                                    player.size);
              player.x = center[0];
              player.y = center[1];

              // if (i == 0) {
              // horizontal = Math.max(horizontal, 0);
              // } else if (i == 2) {
              // horizontal = Math.min(horizontal, 0);
              // }

              // if (j == 0) {
              // vertical = Math.max(vertical, 0);
              // } else if (j == 2) {
              // vertical = Math.min(vertical, 0);
              // }

              break;

            default:
              player.speedModifier = 1;
              break;
            }
          }
        }
      }
    }

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

    enemies.forEach(function (enemy, i, enemies) {
      var coords = getTile(enemy.x, enemy.y);
      var dispX = player.x - enemy.x;
      var dispY = player.y - enemy.y;
      var disp = magnitude(dispX, dispY);
      dispX /= disp;
      dispY /= disp;

      enemy.vx = dispX * enemy.speed * enemy.speedModifier;
      enemy.vy = dispY * enemy.speed * enemy.speedModifier;
      
      enemy.update(delta);

      for (var j = 0; j < 3; j++) {
        for (var k = 0; k < 3; k++) {
          var x = coords[0] + j - 1;
          var y = coords[1] + k - 1;

          if (x >= 0 && x < Constants.GRID_SIZE &&
              y >= 0 && y < Constants.GRID_SIZE) {
            var tile = tiles[coords[0] + j - 1][coords[1] + k - 1];

            if (collide(enemy, tile)) {
              switch (tile.terrain) {
              case 'pit':
                enemy.shouldExist = false;
                break;

              case 'quicksand':
                enemy.speedModifier = 0.2;
                break;

              case 'rock':
                var shape = tile.getShape();
                var center = getCenterOfTangentCircle(shape,
                                                      [enemy.x - shape.x,
                                                       enemy.y - shape.y],
                                                      enemy.size);
                enemy.x = center[0];
                enemy.y = center[1];

                break;

              default:
                enemy.speedModifier = 1;
                break;
              }
            }
          }
        }
      }
      
      if (collide(enemy, player)) {
        player.takeDamage(enemy.attack);
      }

      if (!enemy.shouldExist) {
        enemies.splice(i, 1);
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
  var tiles = this.room.tiles;
  var enemies = this.room.enemies;
  var melees = this.melees;
  var projectiles = this.projectiles;

  drawing.clear();

  drawing.renderBackground();

  tiles.forEach(function (row, i, tiles) {
    row.forEach(function (tile, j, row) {
      drawing.renderTile(tile);
    });
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
