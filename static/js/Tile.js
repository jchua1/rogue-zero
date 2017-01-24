function Tile() {
  this.x = 0;
  this.y = 0;
  this.size = Constants.TILE_SIZE;
  this.item = null;
  this.terrain = null;
  this.terrainSize = 0;
}

Tile.prototype.getShape = function () {
  if (this.terrain != 'ground') {
    return {
      type: 'circle',
      x: this.x + this.size / 2,
      y: this.y + this.size / 2,
      r: this.terrainSize
    };
  } else {
    return {
      type: 'rectangle',
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size
    };
  } 
};
