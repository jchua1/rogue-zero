function Player() {
  this.health = 0;
  this.maxHealth = 0;
  this.speed = 0;
  this.size = 0;
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
  this.origColor = Constants.PLAYER_COLOR;
  this.color = this.origColor;
  this.currentTile = {};
  this.invincible = 0;
}

Player.inheritsFrom(Entity);

Player.prototype.update = function (delta) {
  if (this.health <= 0) {
    this.shouldExist = false;
    return;
  }
  
  this.parent.update.call(this, delta);

  this.x = bound(this.x, this.size, Constants.CANVAS_WIDTH - this.size);
  this.y = bound(this.y, this.size, Constants.CANVAS_HEIGHT - this.size);

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

