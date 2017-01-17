function Drawing(context) {
	this.context = context;
}

Drawing.create = function (context) {
	var drawing = new Drawing(context);
	return drawing;
}

Drawing.prototype.renderPlayer = function (player) {
  var width = Constants.PLAYER_WIDTH;
  var height = Constants.PLAYER_HEIGHT;
  
	this.context.save();
  this.context.fillStyle = Constants.PLAYER_COLOR;
  this.context.translate(player.x, player.y);
  this.context.rotate(player.theta);
  this.context.translate(-width / 2, -height / 2);
  this.context.fillRect(0, 0, width, height);
	this.context.restore();
};

Drawing.prototype.renderEnemy = function (enemy) {
  var width = Constants.ENEMY_WIDTH;
  var height = Constants.ENEMY_HEIGHT;

	this.context.save();
  this.context.fillStyle = Constants.ENEMY_COLOR;
  this.context.translate(enemy.x, enemy.y);
  this.context.rotate(enemy.theta);
  this.context.translate(-width / 2, -height / 2);
  this.context.fillRect(0, 0, width, height)
	this.context.restore();  
};

Drawing.prototype.renderMelee = function (melee) {
  this.context.save();
  this.context.fillStyle = 'orange';
  this.context.translate(melee.x, melee.y);
  this.context.rotate(melee.theta);
  this.context.translate(-melee.range, -melee.width / 2);
  this.context.fillRect(0, 0, melee.range, melee.width);
  this.context.restore();
};

Drawing.prototype.renderProjectile = function (projectile) {
	this.context.save();
  this.context.fillStyle = Constants.PROJECTILE_COLOR;
  this.context.translate(projectile.x, projectile.y);
  this.context.beginPath();
  this.context.arc(0, 0, projectile.size, 0, 2 * Math.PI, false);
  this.context.fill();
	this.context.restore();
};

Drawing.prototype.renderBackground = function () {
	this.context.save();
	this.context.fillStyle = Constants.BACKGROUND_COLOR;
	this.context.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
	this.context.restore();
};

Drawing.prototype.clear = function () {
	this.context.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
};
