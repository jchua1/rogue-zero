function Enemy() {
  this.size = 0;
	this.health = 0;
  this.maxHealth = 0;
	this.attack = 0;
	this.speed = 0;
  this.speedModifier = 1;
  this.origColor = Constants.ENEMY_COLOR;
  this.color = this.origColor;
}

Enemy.inheritsFrom(Entity);

Enemy.prototype.update = function (delta) {
  this.parent.update.call(this, delta);
  
  if (this.health <= 0) {
    this.shouldExist = false;
    return;
  }
};

Enemy.prototype.takeDamage = function (damage) {
  this.health = bound(this.health - damage, 0, this.maxHealth);
};

Enemy.prototype.getShape = function () {
  return {
    type: 'circle',
    x: this.x,
    y: this.y,
    r: this.size
  };
};
