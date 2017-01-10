function Drawing(context) {
	this.context = context;
}

Drawing.create = function (context) {
	var drawing = new Drawing(context);
	return drawing;
}

Drawing.prototype.render = function (obj) {
	if (obj instanceof Player) {

	}
};

Drawing.prototype.renderPlayer = function (player) {
	this.context.save();
	var x = player.coords[0];
	var y = player.coords[1];
	var width = player.size[0];
	var height = player.size[1];
	this.context.fillStyle = 'green';
	this.context.fillRect(x - width / 2, y - height / 2, width, height);
	this.context.restore();
};
