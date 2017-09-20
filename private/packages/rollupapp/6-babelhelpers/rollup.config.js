/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

import util from 'util'
import path from 'path'
import {Hash} from 'crypto'

const input = '6-babelhelpers/helper'

const config = []
export default config

// empty babel configuration: add strict, converts to cjs, no helpers
config.push(getConfig({input, output: `${input}-default`, plugins: () => getBabel({
  babelrc: false,
})}))

/*
env transpiles to ECMAScript 5.1
_classCallCheck repeated for each module

This produces a Rollup warning:
(!) The 'classCallCheck' Babel helper is used more than once in your code. It's strongly recommended that you use the "external-helpers" plugin or the "es2015-rollup" preset. See https://github.com/rollup/rollup-plugin-babel#configuring-babel for more information
= the warning occurs once per Rollup invocation
*/
/* TODO remove comment
config.push(getConfig({input, output: `${input}-env`, babelOptions: {
  babelrc: false,
  presets: [['env', {modules: false}]],
}}))
*/
/*
From the Rollup warning above, add Babel plugin external-helpers
The Babel plugin external-helpers causes the use of a once-per-bundle babelHelpers object:
https://babeljs.io/docs/plugins/external-helpers/
_classCallCheck becomes babelHelpers.classCallCheck
babelHelpers.createClass
it sets the internal Babel value babelHelpers
DO NOT USE: externalHelpers: true prevents the babel helpers from being bundled at all
https://github.com/babel/babel/blob/master/packages/babel-plugin-external-helpers/src/index.js
NO: A less good alternative is:
Babel plugin transform-runtime
Babel option runtimeHelpers: true

Troubles:
- The warning above still occcurs
- running the output produces error: ReferenceError: babelHelpers is not defined
- experiments: add transform-runtime: output now runs successfully

Add Babel plugin transform-runtime
- what is required is the helpers: true option that is default
- polyfill: false should be used
- helpers appear at the top of the bundle.
https://babeljs.io/docs/plugins/transform-runtime/

Rollup warning: (!) Unresolved dependencies
https://github.com/rollup/rollup/wiki/Troubleshooting#treating-module-as-external-dependency
babel-runtime/helpers/classCallCheck (imported by 6-babelhelpers/ClassA.js, 6-babelhelpers/ClassB.js)
- the output requires babel-runtime at runtime. This is bad.
- the root cause is that Babel requires babel-runtime
- this is located in node_modules and is a CommonJS module
- Rollup needs rollup-plugin-node-resolve and rollup-plugin-commonjs

Add:
rollup-plugin-node-resolve
- Unresolved warning is gone
- Above warning remains

Troubles:
- The warning above still occcurs
- It is produces by the Rollup Babel Plugin
- It is issued when helpers are not BUNDLED or RUNTIME
- The plugin’s preflightCheck.js examines the output from transpiling 'export default class Foo {}'
  var Foo = function Foo() {
    _classCallCheck(this, Foo);
  };
- If plugin sees 'import _classCallCheck from' it's RUNTIME
- 'function _classCallCheck' INLINE
- 'babelHelpers' BUNDLED
- otherwise Error An unexpected situation arose.

STOP

rollup-plugin-babel is supposed to provide the helpers
it uses buildExternalHelpers from babel-core
bugs:
add: console.log('ROLLUPPLUGINBABEL', __filename)
line 2 of /opt/foxyboy/sw/private/node_modules/rollup-plugin-babel/dist/rollup-plugin-babel.cjs.js
line 4 og /opt/foxyboy/sw/private/node_modules/rollup-plugin-babel/dist/rollup-plugin-babel.es.js
- conclusion: the cjs version is run
line 83 function babel console.log('ROLLUPPLUGINBABEL.babel', options)
line 115 function resolveId console.log('ROLLUPPLUGINBABEL.resolveId', id, HELPERS)
- resolving babelHelpers, such module id does not exist
line 127: console.log('ROLLUPPLUGINBABEL.load', helpers)

NO: 151109 http://jamesknelson.com/the-six-things-you-need-to-know-about-babel-6
Use Babel plugin transform-runtime
- this is not consistent with rollup-babel-lugin instructions

NO: need to include the babel plugin transform-runtime.
Rollup then errors: (!) Unresolved dependencies
babel-runtime/helpers/classCallCheck (imported by 6-babelhelpers/helper.js)
babel-runtime/helpers/createClass…
- this happens when transform-runtime imports the helpers
*/
config.push(getConfig({input, output: `${input}-helpers`, plugins: () => [getBabel({
    babelrc: false,
    runtimeHelpers: true,
    presets: [['env', {modules: false}]],
    plugins: [
      'external-helpers',
      'transform-runtime',
      //['transform-runtime', {polyfill: false}],
    ],
  }),
  resolve(),
  commonjs(),
  sha256Plugin(),
]}))

function getConfig({input, output, plugins}) {
  output += '.js'
  console.log(`node ${output}`)
  const config = {
    input,
    output: {file: output, format: 'cjs'},
    plugins: plugins(),
  }

  console.log(`Rollup configuration: ${util.inspect(config, {colors: true, depth: null})}`)

  return config
}

function getBabel(babelOptions) {
  console.log(`Babel options: ${util.inspect(babelOptions, {colors: true, depth: null})}`)
  return babel(babelOptions)
}

function sha256Plugin() {
  return {
    name: 'sha256Plugin',
    onwrite(bundle, data) {
      const {code} = data
      console.log(`${path.basename(bundle.file)} bytes: ${code.length} sha256: ${new Hash('sha256').update(code).digest('hex')}`)
    },
  }
}
