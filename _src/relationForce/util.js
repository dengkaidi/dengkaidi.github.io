var arrayProto = Array.prototype;
var nativeSlice = arrayProto.slice;
var nativeMap = arrayProto.map;

/**
 * 数组映射
 * @memberOf module:zrender/core/util
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */
export function map(obj, cb, context) {
  if (!(obj && cb)) {
    return;
  }
  if (obj.map && obj.map === nativeMap) {
    return obj.map(cb, context);
  }
  else {
    var result = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      result.push(cb.call(context, obj[i], i, obj));
    }
    return result;
  }
}

/**
 * @memberOf module:zrender/core/util
 * @param {Function} func
 * @return {Function}
 */
export function curry(func) {
  var args = nativeSlice.call(arguments, 1);
  return function () {
    return func.apply(this, args.concat(nativeSlice.call(arguments)));
  };
}
