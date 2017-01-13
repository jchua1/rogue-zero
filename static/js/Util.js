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
        if (typeof source[key] == 'object') {
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

function cast(object, type) {
  var ret = new type();
  update(object, ret);
  return ret;
}
