function Projectile(x, y, vx, vy, ax, ay) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.ax = ax;
  this.ay = ay;
}

Projectile.inheritsFrom(Entity);
