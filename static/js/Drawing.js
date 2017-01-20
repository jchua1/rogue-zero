function Drawing(context) {
	this.context = context;
}

Drawing.create = function (context) {
	var drawing = new Drawing(context);
	return drawing;
}

Drawing.prototype.renderPlayer = function (player) {
	this.context.save();
  this.context.globalAlpha = player.health / player.maxHealth;
  this.context.translate(player.x, player.y);
  this.context.rotate(player.theta);
  this.context.beginPath();
  this.context.arc(0, 0, player.size, 0, 2 * Math.PI);
  this.context.fillStyle = Constants.PLAYER_COLOR;
  this.context.fill();
	this.context.restore();
};

Drawing.prototype.renderEnemy = function (enemy) {
	this.context.save();
  this.context.fillStyle = Constants.ENEMY_COLOR;
  this.context.globalAlpha = enemy.health / enemy.maxHealth;
  this.context.translate(enemy.x, enemy.y);
  this.context.beginPath();
  this.context.arc(0, 0, enemy.size, 0, 2 * Math.PI);
	this.context.fill();
  this.context.restore();  
};

Drawing.prototype.renderMelee = function (melee) {
  this.context.save();
  this.context.translate(melee.x, melee.y);
  this.context.rotate(Math.PI / 2 + melee.theta);

  this.context.beginPath();
  this.context.arc(0, 0, melee.range,
                   Math.PI / 2, 0, true);

  this.context.scale(1, 0.3);

  this.context.arc(0, 0, melee.range,
                   0, Math.PI / 2, 0, false);
  
  this.context.closePath();

  this.context.fillStyle = Constants.MELEE_COLOR;
  this.context.fill();

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
  this.context.fill();
  this.context.beginPath();
  this.context.rect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
  this.context.fillStyle = Constants.BACKGROUND_BORDER;
  this.context.stroke();
	this.context.restore();
};

Drawing.prototype.renderTile = function (tile) {

};

Drawing.prototype.clear = function () {
	this.context.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
};
