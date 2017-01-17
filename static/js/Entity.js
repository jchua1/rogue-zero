function Entity() {
  this.x = 0;
  this.y = 0;
  this.vx = 0;
  this.vy = 0;
  this.ax = 0;
  this.ay = 0;
  this.theta = 0;
  this.omega = 0;
  this.shouldExist = true;
}

Entity.prototype.update = function (delta) {
  // console.log('entity update');
  // console.log(this);
  if (this.ax && this.ay) {
    this.vx += this.ax * delta;
    this.vy += this.ay * delta;
  }
  
  this.x += this.vx * delta;
  this.y += this.vy * delta;

  if (this.omega) {
    this.theta += this.omega * delta;
  }
};
