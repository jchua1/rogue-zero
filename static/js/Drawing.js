function Drawing(context) {
	this.context = context;
}

Drawing.create = function (context) {
	var drawing = new Drawing(context);
	return drawing;
}

Drawing.prototype.render = function (obj) {
	
};
