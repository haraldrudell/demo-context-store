'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under license found in the LICENSE file in the root directory of this source tree.
*/
let stackTrace = true;

/*
construct: the class constructor
options: object options or function, no arguments, returns options object
// get classRunner name into stack traces while arguments in-scope for async
*/
function classRunner({ construct, options, stack }) {
  return (async () => {
    const ct = typeof construct;
    if (ct !== 'function') throw new Error(`classRunner: construct argument not function: ${ct}`);
    if (stack !== undefined) stackTrace = !!stack;
    if (typeof options === 'function') options = options();
    const instance = new construct(options);
    return typeof instance.run === 'function' ? instance.run(options && options.run || options) : instance;
  })().catch(errorHandler);
}

function errorHandler(e) {
  console.error(e instanceof Error && !stackTrace ? e.message : e);
  process.exit(1);
}

exports['default'] = classRunner;
exports.errorHandler = errorHandler;
