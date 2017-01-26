function Drawing(context) {
	this.context = context;
}

Drawing.create = function (context) {
	var drawing = new Drawing(context);
	return drawing;
}

Drawing.prototype.setRoomClip = function () {
  this.context.beginPath();
  this.context.rect(Constants.BORDER_SIZE, Constants.BORDER_SIZE,
                    Constants.ROOM_SIZE, Constants.ROOM_SIZE);
  this.context.clip();
};

Drawing.prototype.renderUI = function (player) {
  this.context.save();
  this.context.font = '24px Helvetica';
  this.context.fillStyle = Constants.UI_TEXT_COLOR;
  this.context.textBaseline = 'top';
  this.context.fillText('Current weapon: ' + player.weapons[player.currentWeapon], 5, 5);
  this.context.restore();
};

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
  this.setRoomClip();
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
  this.context.arc(0, 0, melee.size,
                   Math.PI / 2, 0, true);

  this.context.scale(1, 0.3);

  this.context.arc(0, 0, melee.size,
                   0, Math.PI / 2, 0, false);
  
  this.context.closePath();

  this.context.fillStyle = Constants.MELEE_COLOR;
  this.context.fill();

  this.context.restore();
};

Drawing.prototype.renderProjectile = function (projectile) {
	this.context.save();
  this.setRoomClip();
  this.context.fillStyle = Constants.PROJECTILE_COLOR;
  this.context.translate(projectile.x, projectile.y);
  this.context.beginPath();
  this.context.arc(0, 0, projectile.size, 0, 2 * Math.PI, false);
  this.context.fill();
	this.context.restore();
};

Drawing.prototype.renderBackground = function () {
	this.context.save();
  this.context.fillStyle = Constants.BACKGROUND_BORDER;
  this.context.fillRect(0, 0, Constants.CANVAS_SIZE, Constants.CANVAS_SIZE);
	this.context.fillStyle = Constants.GROUND_COLOR;
  this.context.fillRect(Constants.BORDER_SIZE, Constants.BORDER_SIZE,
                        Constants.ROOM_SIZE, Constants.ROOM_SIZE);
	this.context.restore();
};

Drawing.prototype.renderPit = function (pit) {
  this.context.save();
  this.setRoomClip();
  this.context.translate(pit.x, pit.y);
  this.context.beginPath();
  this.context.arc(0, 0, pit.size, 0, 2 * Math.PI);
  this.context.fillStyle = pit.color;
  this.context.fill();
  this.context.restore();
};

Drawing.prototype.renderRock = function (rock) {
  this.context.save();
  this.setRoomClip();
  this.context.translate(rock.x, rock.y);
  this.context.beginPath();
  this.context.arc(0, 0, rock.size, 0, 2 * Math.PI);
  this.context.fillStyle = rock.color;
  this.context.fill();
  this.context.restore();
};

Drawing.prototype.renderPatch = function (patch) {
  this.context.save();
  this.setRoomClip();
  this.context.translate(patch.x, patch.y);
  this.context.beginPath();
  this.context.arc(0, 0, patch.size, 0, 2 * Math.PI);
  this.context.fillStyle = patch.color;
  this.context.fill();
  this.context.restore();
};

Drawing.prototype.renderDoor = function (door) {
  this.context.save();
  this.setRoomClip();
  this.context.translate(door.x, door.y);
  this.context.beginPath();
  this.context.arc(0, 0, door.size, 0, 2 * Math.PI);
  this.context.fillStyle = door.color;
  this.context.fill();
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
