function Player() {
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.ax = 0;
  this.ay = 0;
  this.health = 0;
  this.attack = 0;
  this.speed = 0;
  this.projectileSpeed = 0;
  this.shotDelay = 0;
  this.lastShotTime = 0;
}

Player.inheritsFrom(Entity);
