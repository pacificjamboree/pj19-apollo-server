module.exports = function() {
  const args = [].slice.call(arguments);
  const literals = args[0];
  let result = typeof literals === 'string' ? literals : literals[0];

  for (var i = 1; i < args.length; i++) {
    if (args[i] && args[i].kind && args[i].kind === 'Document') {
      result += args[i].loc.source.body;
    } else {
      result += args[i];
    }

    result += literals[i];
  }
  return result;
};
