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
  this.exitDoor = -1;
  this.canEnterDoor = false;
  this.defaultAttributes = [];
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
  this.socket.on('new_room', (data) => {
    this.receiveRoom(data);
    this.start();
  });
};

Game.prototype.receiveRoom = function (data) {
  this.reset();
  update(data, this);
  this.player = cast(this.player, Player);

  this.room.defaultAttributes = [];
  
  for (key in data.room) {
    this.room.defaultAttributes.push(key);
  }
  
  for (key in data.player) {
    this.player.defaultAttributes.push(key);
  }  

  this.room.enemies.forEach((enemy, i, enemies) => {
    enemies[i] = cast(enemy, Enemy);
  });

  this.room.rocks.forEach((rock, i, rocks) => {
    rocks[i] = cast(rock, Obstacle);
  });

  this.room.quicksand.forEach((patch, i, quicksand) => {
    quicksand[i] = cast(patch, Obstacle);
  });
  
  this.room.pits.forEach((pit, i, pits) => {
    pits[i] = cast(pit, Obstacle);
  });

  this.room.doors.forEach((door, i, doors) => {
    doors[i] = cast(door, Obstacle);
  });
};

Game.prototype.reset = function () {
  this.player = {};
  this.room = {};
  this.projectiles = [];
  this.melees = [];
  this.exitDoor = -1;
  this.canEnterDoor = false;
};

Game.prototype.saveRoom = function () {
  var player = {};
  var room = {};

  for (var key in this.room) {
    if (this.room.defaultAttributes.includes(key)) {
      room[key] = this.room[key];
    }
  }
  
  for (var key in this.player) {
    if (this.player.defaultAttributes.includes(key)) {
      player[key] = this.player[key];
    }
  }

  var packet = {
    player: player,
    room: room,
    exitDoor: this.exitDoor
  };

  console.log(packet);
  
  this.socket.emit('save_room', packet);
};

Game.prototype.update = function () {
	var now = (new Date()).getTime() / 1000;

  if (!this.player.shouldExist) {
    this.socket.emit('player_death');
  }
  
  if (this.lastFrameTime != 0) {
	  var horizontal = ((Input.LEFT ? -1 : 0) + (Input.RIGHT ? 1 : 0));
	  var vertical = ((Input.UP ? -1 : 0) + (Input.DOWN ? 1 : 0));

    if (horizontal != 0 || vertical != 0) {
      var inputMagnitude = magnitude(horizontal, vertical);
      horizontal /= inputMagnitude;
      vertical /= inputMagnitude;
    }
    
    if (Input.MOUSE.length == 2) {
	    var heading = Math.PI + Math.atan2(Input.MOUSE[1] - this.player.y,
													               Input.MOUSE[0] - this.player.x);
      this.player.theta = heading;
    }

	  var attack = Input.LEFT_CLICK;
    var switchWeapon = Input.RIGHT_CLICK;

	  var delta = now - this.lastFrameTime;

    this.player.vx = horizontal * this.player.speed * this.player.speedModifier;
    this.player.vy = vertical * this.player.speed * this.player.speedModifier;
    this.player.speedModifier = 1;
    
    this.room.enemies.forEach((enemy, i, enemies) => {
      var dispX = this.player.x - enemy.x;
      var dispY = this.player.y - enemy.y;
      var disp = magnitude(dispX, dispY);
      dispX /= disp;
      dispY /= disp;

      enemy.vx = dispX * enemy.speed * enemy.speedModifier;
      enemy.vy = dispY * enemy.speed * enemy.speedModifier;
      enemy.speedModifier = 1;
      
      enemy.update(delta);
      
      if (collide(enemy, this.player)) {
        this.player.takeDamage(enemy.attack);
      }

      if (!enemy.shouldExist) {
        enemies.splice(i, 1);
        return;
      }
    });
    
    this.room.rocks.forEach((rock, i, rocks) => {
      if (collide(this.player, rock)) {
        var center = getCenterOfTangentCircle(rock,
                                              [this.player.x - rock.x,
                                               this.player.y - rock.y],
                                              this.player.size);
        this.player.x = center[0];
        this.player.y = center[1];
      }

      this.room.enemies.forEach((enemy, j, enemies) => {
        if (collide(enemy, rock)) {
          var center = getCenterOfTangentCircle(rock,
                                                [enemy.x - rock.x,
                                                 enemy.y - rock.y],
                                                enemy.size);
          enemy.x = center[0];
          enemy.y = center[1];
        }
      });

      this.projectiles.forEach((projectile, j, projectiles) => {
        if (collide(projectile, rock)) {
          projectile.shouldExist = false;
        }
      });
    });

    this.player.x = bound(this.player.x, this.player.size + Constants.BORDER_SIZE,
                          Constants.CANVAS_SIZE - Constants.BORDER_SIZE - this.player.size);
    this.player.y = bound(this.player.y, this.player.size + Constants.BORDER_SIZE,
                          Constants.CANVAS_SIZE - Constants.BORDER_SIZE - this.player.size);

    this.player.update(delta);

    this.room.pits.forEach((pit, i, pits) => {
      if (collide(this.player, pit)) {
        this.player.shouldExist = false;
      }

      this.room.enemies.forEach((enemy, j, enemies) => {
        if (collide(enemy, pit)) {
          enemy.shouldExist = false;
        }
      });
    });
    
    this.room.quicksand.forEach((patch, i, quicksand) => {
      if (collide(this.player, patch)) {
        this.player.speedModifier = Constants.PLAYER_QUICKSAND_MODIFIER;
      }

      this.room.enemies.forEach((enemy, j, enemies) => {
        if (collide(enemy, patch)) {
          enemy.speedModifier = Constants.ENEMY_QUICKSAND_MODIFIER;
        }
      });
    });

    var onDoor = false;
    
    this.room.doors.forEach((door, i, doors) => {
      if (collide(this.player, door)) {
        onDoor = true;
        
        if (this.canEnterDoor) {
          if (this.room.enemies.length == 0) {
            this.exitDoor = i;
          }
        }
      } 
    });

    if (!onDoor) {
      this.canEnterDoor = true;
    }

    if (this.exitDoor != -1) {
      this.saveRoom();
      this.stop();
    }
    
    if (now - this.player.lastSwitchTime > this.player.switchDelay) {
      if (switchWeapon) {
        this.player.currentWeapon = (this.player.currentWeapon + 1) % this.player.weapons.length;
        this.player.lastSwitchTime = now;
      } else if (attack) {
        console.log(this.player.weapons + ' ' + this.player.currentWeapon);
        if (this.player.weapons[this.player.currentWeapon] == 'sword') {
          if (now - this.player.lastMeleeTime > this.player.meleeDelay) {
            var melee = new Melee();

            update({
              startTheta: this.player.theta - this.player.meleeArc / 2,
              theta: this.player.theta - this.player.meleeArc / 2,
              omega: this.player.meleeSpeed,
              arc: this.player.meleeArc,
              size: this.player.meleeRange,
              width: this.player.meleeWidth,
              damage: this.player.meleeDamage,
              owner: this.player
            }, melee);

            this.melees.push(melee);
            this.player.lastMeleeTime = now;
          }
        } else if (this.player.weapons[this.player.currentWeapon] == 'gun') {
          if (now - this.player.lastShootTime > this.player.shootDelay) {
            var projectile = new Projectile();

            update({
              x: this.player.x,
              y: this.player.y,
              vx: this.player.shootSpeed * -Math.cos(heading),
              vy: this.player.shootSpeed * -Math.sin(heading),
              range: this.player.shootRange,
              size: this.player.shootSize,
              startX: this.player.x,
              startY: this.player.y,
              damage: this.player.shootDamage
            }, projectile);

            this.projectiles.push(projectile);
            this.player.lastShootTime = now;
          }
        }
      }
    }
    
    this.melees.forEach((melee, i, melees) => {
      melee.update(delta);

      this.room.enemies.forEach((enemy, j, enemies) => {
        if (collide(melee, enemy)) {
          enemy.takeDamage(melee.damage);

          if (enemy.health == 0) {
            this.player.experience += enemy.health;
          }
        }
      });  

      if (!melee.shouldExist) {
        melees.splice(i, 1);
        return;
      }
    });

    this.projectiles.forEach((projectile, i, projectiles) => {
      projectile.update(delta);

      this.room.enemies.forEach((enemy, j, enemies) => {
        if (collide(projectile, enemy)) {
          enemy.takeDamage(projectile.damage);

          if (enemy.health == 0) {
            this.player.experience += enemy.health;
          }
          
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

  if (!this.player.shouldExist) {
    this.isRunning = false;
  }
};

Game.prototype.draw = function () {
  this.drawing.clear();

  this.drawing.renderBackground();

  this.room.quicksand.forEach((patch, i, quicksand) => {
    this.drawing.renderPatch(patch);
  });

  this.room.pits.forEach((pit, i, pits) => {
    this.drawing.renderPit(pit);
  });

  this.room.rocks.forEach((rock, i, rocks) => {
    this.drawing.renderRock(rock);
  });

  this.room.enemies.forEach((enemy, i, enemies) => {
    this.drawing.renderEnemy(enemy);
  });

  this.melees.forEach((melee, i, melees) => {
    this.drawing.renderMelee(melee);
  });

  this.projectiles.forEach((projectile, i, projectiles) => {
    this.drawing.renderProjectile(projectile);
  });

  this.room.doors.forEach((door, i, doors) => {
    this.drawing.renderDoor(door);
  });
  
  this.drawing.renderPlayer(this.player);
};

Game.prototype.animate = function () {
  this.animationFrameId = window.requestAnimationFrame(() => {
    this.run();
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

Game.prototype.stop = function () {
  this.isRunning = false;
  this.stopAnimation();
};

