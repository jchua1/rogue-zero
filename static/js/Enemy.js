function Enemy() {
	this.x = 0;
	this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.ax = 0;
  this.ay = 0;
	this.health = 0;
	this.attack = 0;
	this.speed = 0;
}

Enemy.inheritsFrom(Entity);

Enemy.fromObject = function (obj) {
  return cast(cast(obj, Entity), Enemy);
};
