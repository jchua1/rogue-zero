function Player(x, y, health, attack, speed) {
	this.x = x;
	this.y = y;
	this.health = health;
	this.attack = attack;
	this.speed = speed;
}

Player.createFromObject = function (obj) {
	return new Player(obj.x, obj.y, obj.health, obj.attack, obj.speed);
};

Player.createFromValues = function (x, y, health, attack, speed) {
	return new Player(x, y, health, attack, speed);
};

Player.prototype.update = function (horizontal, vertical, delta) {
	this.x += horizontal * delta;
	this.y += vertical * delta;
}

