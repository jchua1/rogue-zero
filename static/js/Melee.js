function Melee(theta, omega, arc, range, width, owner) {
  this.startTheta = theta;
  this.omega = omega;
  this.arc = arc;
  this.range = range;
  this.width = width;
  this.owner = owner;
  this.shouldExist = true;
}

Melee.inheritsFrom(Entity);

Melee.fromObject = function (obj) {
  console.log(obj);
  return cast(cast(obj, Entity), Melee);
};

Melee.prototype.update = function (delta) {
  bind(this, this.parent.update)(delta);
  
  this.x = this.owner.x;
  this.y = this.owner.y;

  if (this.theta - this.startTheta >= this.arc) {
    this.shouldExist = false;
  }
};

  
