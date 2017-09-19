'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs-extra'));
var path = _interopDefault(require('path'));

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
var clean = list => clean$1(list).catch(errorHandler);

async function clean$1(args) {
  if (typeof args === 'string') args = [args];
  else if (!Array.isArray(args)) throw new Error('clean: package.json cleans field not non-empty string or array')
  args.forEach((s, index) => {
    const st = typeof s;
    if (st !== 'string' || !s) throw new Error(`clean: index ${index}: not non-empty string: ${st}`)
  });
  console.log(`clean: ${args.join(' ')}…`);

  const projectDir = process.cwd();
  await Promise.all(args.map(s => removeIfExist(path.join(projectDir, s))));
  console.log('clean completed successfully.');
}

async function removeIfExist(p) {
  if (await fs.exists(p)) await fs.remove(p);
}

function errorHandler(e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
}

clean(process.argv.slice(2));
