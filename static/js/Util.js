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
  var shape1 = obj1.getShape();
  var shape2 = obj2.getShape();

  if (!shape1 || !shape2) {
    return false;
  }
  
  if (shape1.type == 'circle') {
    if (shape2.type == 'circle') {
      return collideCircleCircle(shape1, shape2);
    } else if (shape2.type == 'sector') {
      return collideSectorCircle(shape2, shape1);
    } else if (shape2.type == 'rectangle') {
      return collideCircleRectangle(shape1, shape2);
    } 
  } else if (shape1.type == 'sector') {
    if (shape2.type == 'circle') {
      return collideSectorCircle(shape1, shape2);
    }
  } else if (shape1.type == 'rectangle') {
    if (shape2.type == 'circle') {
      return collideCircleRectangle(shape2, shape1);
    }
  }

  return false;
}

function collideCircleCircle(circle1, circle2) {
  return distance(circle1.x, circle1.y, circle2.x, circle2.y) <= circle1.r + circle2.r;
}

function collideSectorCircle(sector, circle) {
  return collideCircleCircle(circle, sector) &&
    mod(Math.atan2(sector.y - circle.y, sector.x - circle.x) - sector.theta, 2 * Math.PI) <= sector.width;
}

function collideCircleRectangle(circle, rectangle) {
  var closestX = bound(circle.x, rectangle.x, rectangle.x + rectangle.width);
  var closestY = bound(circle.y, rectangle.y, rectangle.y + rectangle.height);

  return distance(circle.x, circle.y, closestX, closestY) <= circle.r;
}

function getTile(x, y) {
  return [Math.floor(x / Constants.TILE_SIZE), Math.floor(y / Constants.TILE_SIZE)];
}

function getCenterOfTangentCircle(circle, direction, radius) {
  var directionMagnitude = magnitude(direction[0], direction[1]);
  direction[0] /= directionMagnitude;
  direction[1] /= directionMagnitude;
  
  return [circle.x + (circle.r + radius) * direction[0],
          circle.y + (circle.r + radius) * direction[1]];
}
