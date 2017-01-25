/**
 * @fileoverview This file contains some base functions useful to both the
 *  server and the client.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * This extension of the Function class allows for class inheritance.
 * Example usage:
 * require('./path/to/base');
 * Player.inheritsFrom(Entity);
 * @param {Function} parent The child object which should inherit from this
 *   object.
 * @return {Function}
 */
Function.prototype.inheritsFrom = function (parent) {
  this.prototype = new parent();
  this.prototype.constructor = this;
  this.prototype.parent = parent.prototype;
  return this;
};

/**
 * Binds a function to a context, useful for assigning event handlers and
 * function callbacks.
 * @param {Object} context The context to assign the method to.
 * @param {function(?)} method The method to bind the context to.
 * @return {function(?)}
 */
function bind(context, method) {
  return function () {
    return method.apply(context, arguments);
  };
}

function update(source, destination) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      if (destination.hasOwnProperty(key)) {
        if (typeof source[key] == 'object' && typeof destination[key] == 'object') {
          update(source[key], destination[key]);
        } else {
          destination[key] = source[key];
        }
      } else {
        destination[key] = source[key];
      }
    }
  }
}

function updateExisting(source, destination) {
  for (var key in destination) {
    if (destination.hasOwnProperty(key) && source.hasOwnProperty(key)) {
      if (typeof destination[key] == 'object' && typeof source[key] == 'object') {
        updateExisting(source[key], destination[key]);
      } else {
        destination[key] = source[key];
      }
    }
  }
}          

function cast(object, type) {
  var ret = new type();
  update(object, ret);
  return ret;
}

function bound(value, a, b) {
  var min = Math.min(a, b);
  var max = Math.max(a, b);
  
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  } else {
    return value;
  }
}

function mod(value, base) {
  var ret = value % base;

  if (ret < 0) {
    ret += base;
  }

  return ret;
}

function magnitude(x, y) {
  return Math.sqrt(x ** 2 + y ** 2);
}

function distance(x1, y1, x2, y2) {
  return magnitude(x1 - x2, y1 - y2);
}

function collide(obj1, obj2) {
  if (obj1.shape == 'circle') {
    if (obj2.shape == 'circle') {
      return collideCircleCircle(obj1, obj2);
    } else if (obj2.shape == 'sector') {
      return collideSectorCircle(obj2, obj1);
    } else if (obj2.shape == 'rectangle') {
      return collideCircleRectangle(obj1, obj2);
    } 
  } else if (obj1.shape == 'sector') {
    if (obj2.shape == 'circle') {
      return collideSectorCircle(obj1, obj2);
    }
  } else if (obj1.shape == 'rectangle') {
    if (obj2.shape == 'circle') {
      return collideCircleRectangle(obj2, obj1);
    }
  }

  return false;
}

function collideCircleCircle(circle1, circle2) {
  return distance(circle1.x, circle1.y, circle2.x, circle2.y) <= circle1.size + circle2.size;
}

function collideSectorCircle(sector, circle) {
  return collideCircleCircle(circle, sector) &&
    mod(Math.atan2(sector.y - circle.y, sector.x - circle.x) - sector.theta, 2 * Math.PI) <= sector.width;
}

function collideCircleRectangle(circle, rectangle) {
  var closestX = bound(circle.x, rectangle.x, rectangle.x + rectangle.width);
  var closestY = bound(circle.y, rectangle.y, rectangle.y + rectangle.height);

  return distance(circle.x, circle.y, closestX, closestY) <= circle.size;
}

function getTile(x, y) {
  return [Math.floor(x / Constants.TILE_SIZE), Math.floor(y / Constants.TILE_SIZE)];
}

function getCenterOfTangentCircle(circle, direction, radius) {
  direction = normalize(direction);
  
  return [circle.x + (circle.size + radius) * direction[0],
          circle.y + (circle.size + radius) * direction[1]];
}

function normalize(vector) {
  var vectorMagnitude = magnitude(vector[0], vector[1]);
  return [vector[0] / vectorMagnitude,
          vector[1] / vectorMagnitude];
}

function getTangentVector(circle, direction) {
  direction = normalize(direction);
  return [-direction[1], direction[0]];
}

function dotProduct(vector1, vector2) {
  return vector1[0] * vector2[0] + vector1[1] * vector2[1];
}

