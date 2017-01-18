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

Melee.prototype.update = function (delta) {
  this.parent.update.call(this, delta);
    
  this.x = this.owner.x;
  this.y = this.owner.y;

  if (this.theta - this.startTheta >= this.arc) {
    this.shouldExist = false;
  }
};

  
