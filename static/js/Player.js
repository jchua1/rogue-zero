function Player() {
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.ax = 0;
  this.ay = 0;
  this.theta = 0;
  this.omega = 0;
  this.health = 0;
  this.speed = 0;
  this.shootRange = 0;
  this.shootSize = 0;
  this.shootSpeed = 0;
  this.shootDelay = 0;
  this.meleeRange = 0;
  this.meleeArc = 0;
  this.meleeSpeed = 0;
  this.meleeDelay = 0;
  this.lastShootTime = 0;
  this.lastMeleeTime = 0;
}

Player.inheritsFrom(Entity);

Player.fromObject = function (obj) {
  return cast(cast(obj, Entity), Player);
};

Player.prototype.update = function (delta) {
  bind(this, this.parent.update)(delta);

  this.x = bound(this.x, 0, Constants.CANVAS_WIDTH);
  this.y = bound(this.y, 0, Constants.CANVAS_HEIGHT);
};
