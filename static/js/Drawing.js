function Drawing(context) {
	this.context = context;
}

Drawing.create = function (context) {
	var drawing = new Drawing(context);
	return drawing;
}

Drawing.prototype.renderObject = function (obj, type) {
	this.context.save();
	var x = obj.x;
	var y = obj.y;
	var width = 0;
	var height = 0;
	
	if (type == 'player') {
		this.context.fillStyle = 'green';
		width = Constants.PLAYER_WIDTH;
		height = Constants.PLAYER_HEIGHT;
	} else if (type == 'enemy') {
		this.context.fillStyle = 'red';
		width = Constants.ENEMY_WIDTH;
		height = Constants.ENEMY_HEIGHT;
	} else {
		this.context.fillStyle = 'gray';
		width = Constants.OBJECT_WIDTH;
		height = Constants.OBJECT_HEIGHT;
	}

	this.context.fillRect(x - width / 2, y - height / 2, width, height);
	this.context.restore();
};

Drawing.prototype.renderBackground = function () {
	this.context.save();
	this.context.fillStyle = 'white';
	this.context.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
	this.context.restore();
};

Drawing.prototype.clear = function () {
	this.context.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
};
