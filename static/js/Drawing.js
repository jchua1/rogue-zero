function Drawing(context) {
	this.context = context;
}

Drawing.create = function (context) {
	var drawing = new Drawing(context);
	return drawing;
}

Drawing.prototype.renderPlayer = function (player) {
	this.context.save();
  this.context.translate(player.x, player.y);
  this.context.rotate(player.theta);
  this.context.beginPath();
  this.context.arc(0, 0, player.size, 0, 2 * Math.PI);
  this.context.globalAlpha = player.alpha;
  this.context.fillStyle = player.color;
  this.context.fill();
	this.context.restore();
  this.renderHealth(player);
};

Drawing.prototype.renderEnemy = function (enemy) {
	this.context.save();
  this.context.fillStyle = enemy.color;
  this.context.translate(enemy.x, enemy.y);
  this.context.beginPath();
  this.context.arc(0, 0, enemy.size, 0, 2 * Math.PI);
	this.context.fill();
  this.context.restore();

  this.renderHealth(enemy);
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
  this.context.rect(0, 0, Constants.CANVAS_SIZE, Constants.CANVAS_SIZE);
	this.context.fillStyle = Constants.BACKGROUND_COLOR;
  this.context.fill();
  this.context.beginPath();
  this.context.fillStyle = Constants.BACKGROUND_BORDER;
  this.context.stroke();
	this.context.restore();
};

Drawing.prototype.renderTile = function (tile) {
  this.context.save();
  this.context.translate(tile.x, tile.y);
  this.context.beginPath();
  this.context.rect(0, 0, Constants.TILE_SIZE, Constants.TILE_SIZE);

  if (tile.terrain == 'rock') {
    this.context.fillStyle = Constants.ROCK_COLOR;
    this.context.fill();
  } else if (tile.terrain == 'pit') {
    this.context.fillStyle = Constants.GROUND_COLOR;
    this.context.fill();
    this.context.translate(Constants.TILE_SIZE / 2, Constants.TILE_SIZE / 2);
    this.context.beginPath();
    this.context.arc(0, 0, Constants.TILE_SIZE / 3, 0, 2 * Math.PI);
    this.context.fillStyle = Constants.PIT_COLOR;
    this.context.fill();
  } else if (tile.terrain == 'quicksand') {
    this.context.fillStyle = Constants.QUICKSAND_COLOR;
    this.context.fill();
  } else {
    this.context.fillStyle = Constants.GROUND_COLOR;
    this.context.fill();
  }

  this.context.restore();
};

Drawing.prototype.renderHealth = function (entity) {
  this.context.save();
  this.context.translate(entity.x, entity.y);
  this.context.translate(-entity.maxHealth / 2, -entity.size - Constants.HEALTH_HEIGHT * 2);
  this.context.beginPath();
  this.context.rect(0, 0, entity.health, Constants.HEALTH_HEIGHT);
  this.context.fillStyle = entity.origColor;
  this.context.fill();
  this.context.beginPath();
  this.context.rect(0, 0, entity.maxHealth, Constants.HEALTH_HEIGHT);
  this.context.fillStyle = 'black';
  this.context.stroke();
  this.context.restore();
};

Drawing.prototype.clear = function () {
	this.context.clearRect(0, 0, Constants.CANVAS_SIZE, Constants.CANVAS_SIZE);
};
