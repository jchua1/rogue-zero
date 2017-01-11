function Enemy(x, y, health, attack, speed) {
	this.x = x;
	this.y = y;
	this.health = health;
	this.attack = attack;
	this.speed = speed;
}

Enemy.createFromObject = function (obj) {
	return new Enemy(obj.x, obj.y, obj.health, obj.attack, obj.speed);
};

Enemy.createFromValues = function (x, y, health, attack, speed) {
	return new Enemy(x, y, health, attack, speed);
};

Enemy.prototype.update = function (horizontal, vertical, delta) {
	this.x += horizontal * delta;
	this.y += vertical * delta;
}
