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

function bound(value, min, max) {
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

function collideCircleCircle(x1, y1, r1, x2, y2, r2) {
  return distance(x1, y1, x2, y2) <= r1 + r2;
}

function collideSectorCircle(x1, y1, r1, theta, width, x2, y2, r2) {
  return collideCircleCircle(x1, y1, r1, x2, y2, r2) &&
    mod(Math.atan2(y1 - y2, x1 - x2) - theta, 2 * Math.PI) <= width;
}

function getTile(x, y) {
  return [Math.floor(x / Constants.TILE_SIZE), Math.floor(y / Constants.TILE_SIZE)];
}
