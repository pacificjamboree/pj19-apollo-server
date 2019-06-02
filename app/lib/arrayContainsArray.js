// https://github.com/lodash/lodash/issues/1743

function arrayContainsArray(superset, subset) {
  if (0 === subset.length) {
    return false;
  }
  return subset.every(function(value) {
    return superset.indexOf(value) >= 0;
  });
}

module.exports = arrayContainsArray;
