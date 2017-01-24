function Melee() {
  this.startTheta = 0;
  this.arc = 0;
  this.range = 0;
  this.width = 0;
  this.damage = 0;
  this.owner = 0;
  this.origColor = Constants.MELEE_COLOR;
  this.color = this.origColor;
}

Melee.inheritsFrom(Entity);

Melee.prototype.update = function (delta) {
  this.parent.update.call(this, delta);

  this.x = this.owner.x;
  this.y = this.owner.y;

  if (mod(this.theta - this.startTheta, 2 * Math.PI) >= this.arc) {
    this.shouldExist = false;
  }
};

Melee.prototype.getShape = function () {
  return {
    type: 'sector',
    x: this.x,
    y: this.y,
    r: this.range,
    width: this.width,
    theta: this.theta
  };
};
