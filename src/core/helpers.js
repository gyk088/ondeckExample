/**
 * Copy object
 * @param  {Object}  obj - object
 * @param  {boolean} req - deep copy
 * @return {Object}      - сopy object
 */
export function clone(obj, req) {
  var newObj = isArray(obj) ? [] : {}
  for (var i in obj) {
    if (req && typeof obj[i] === "object" && i !== "prototype") {
      newObj[i] = clone(obj[i])
    } else {
      newObj[i] = obj[i]
    }
  }
  return newObj
}

export function isFunction(obj) {
  return Object.prototype.toString.call(obj) === "[object Function]"
}

export function isArray(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]"
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]"
}

export function isEmpty(obj) {
  if (Object.prototype.toString.call(obj) !== "[object Object]") {
    return false
  }
  for (var i in obj) {
    if (o.hasOwnProperty(i)) {
      return false
    }
  }
  return true
}
