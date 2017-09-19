'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs-extra'));
var path = _interopDefault(require('path'));

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
var cleanx = (async function (args) {
  if (typeof args === 'string') args = [args];else if (!Array.isArray(args) || !args.length) throw new Error('clean: argument not non-empty string or array');
  for (var _iterator = args, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var [index, s] = _ref;

    var st = typeof s;
    if (st !== 'string' || !s) throw new Error(`clean: index ${index}: not non-empty string: ${st}`);
  }
  console.log(`clean: ${args.join(' ')}…`);

  var projectDir = fs.realpathSync(process.cwd()); // project directory without symlinks
  await Promise.all(args.map(s => removeIfExist(path.resolve(projectDir, s))));
  console.log('clean completed successfully.');
});

async function removeIfExist(p) {
  if (await fs.exists(p)) await fs.remove(p);
}

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
doClean().catch(errorHandler);

async function doClean() {
  var { argv } = process;
  return cleanx(argv.length > 2 ? argv.slice(2) : await getRollupClean());
}

async function getRollupClean() {
  var json = JSON.parse((await fs.readFile(path.resolve('package.json'), 'utf8')));
  return json && json.rollup && json.rollup.clean;
}

function errorHandler(e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
}
