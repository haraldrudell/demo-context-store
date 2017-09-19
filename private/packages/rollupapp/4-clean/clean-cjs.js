'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs-extra'));
var path = _interopDefault(require('path'));

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
async function removeIfExist(p) {
  if (await fs.exists(p)) await fs.remove(p);
}

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
doClean().catch(errorHandler);

async function doClean() {
  var _process = process,
      argv = _process.argv;

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
