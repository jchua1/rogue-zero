function Player() {
  this.health = 0;
  this.maxHealth = 0;
  this.speed = 0;
  this.speedModifier = 1;
  this.size = 0;
  this.switchDelay = 0;
  this.shootDamage = 0;
  this.shootRange = 0;
  this.shootSize = 0;
  this.shootSpeed = 0;
  this.shootDelay = 0;
  this.meleeDamage = 0;
  this.meleeRange = 0;
  this.meleeArc = 0;
  this.meleeSpeed = 0;
  this.meleeDelay = 0;
  this.lastShootTime = 0;
  this.lastMeleeTime = 0;
  this.lastSwitchTime = 0;
  this.origColor = Constants.PLAYER_COLOR;
  this.color = this.origColor;
  this.lastTile = {};
  this.currentTile = {};
  this.invincible = 0;
  this.shape = 'circle';
}

Player.inheritsFrom(Entity);

Player.prototype.update = function (delta) {
  if (this.health <= 0) {
    this.shouldExist = false;
    return;
  }
  
  if (this.x <= this.size) {
    this.vx = Math.max(this.vx, 0);
  } else if (this.x >= Constants.CANVAS_SIZE - this.size) {
    this.vx = Math.min(this.vx, 0);
  }

  if (this.y <= this.size) {
    this.vy = Math.max(this.vy, 0);
  } else if (this.y >= Constants.CANVAS_SIZE - this.size) {
    this.vy = Math.min(this.vy, 0);
  }

  this.parent.update.call(this, delta);
  
  if (this.invincible > 0) {
    this.invincible--;

    if (this.invincible == 0) {
      this.color = this.origColor;
    }
  }
};

Player.prototype.takeDamage = function (damage) {
  if (this.invincible == 0) {
    this.health = bound(this.health - damage, 0, this.maxHealth);
    this.invincible = 30;
    this.opacity = 0.5;
  }
};

