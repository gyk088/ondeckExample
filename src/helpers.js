export function isFunction(obj) {
  return Object.prototype.toString.call(obj) === '[object Function]';
}

export function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isEmpty(obj) {
  let flag = false;
  if (Object.prototype.toString.call(obj) !== '[object Object]') {
    return flag;
  }

  Object.keys(obj).forEach((key) => {
    if (Object.prototype.isPrototypeOf.call(obj, key)) {
      flag = true;
    }
  });

  return flag;
}

/**
 * Copy object
 * @param  {Object}  obj - object
 * @param  {boolean} req - deep copy
 * @return {Object}      - copy object
 */
export function clone(obj, req) {
  const newObj = isArray(obj) ? [] : {};
  Object.keys(obj).forEach((key) => {
    if (req && typeof obj[key] === 'object' && key !== 'prototype') {
      newObj[key] = clone(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  });

  return newObj;
}
