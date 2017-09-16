import pkg from './package.json'
import babel from 'rollup-plugin-babel'

export default [{
  input: 'src/run.js',
  output: [
    {file: `build/${pkg.name}.js`, format: 'cjs', exports: 'named'},
  ],
  external: Object.keys(pkg.dependencies || {}).concat('util', 'babel-runtime'),
  onwarn: function (message) {
    if (message) {
      const {code, source} = message
    // https://github.com/rollup/rollup/issues/794
    // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
    /*{ code: 'THIS_IS_UNDEFINED',
      message: 'The \'this\' keyword is equivalent to \'undefined\' at the top level of an ES module, and has been rewritten',
      url: 'https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined',
      pos: 12,
      loc: { file: '/opt/foxyboy/sw/packages/syslogtcp/src/Syslog.js', line: 1, column: 12 },
      frame: '1: var _this = this;\n               ^\n2: \n3: /*',
      id: '/opt/foxyboy/sw/packages/syslogtcp/src/Syslog.js',
      toString: [Function] }
    */
      if (code === 'THIS_IS_UNDEFINED') return
      // https://github.com/rollup/rollup-plugin-babel/issues/13
      if (code === 'UNRESOLVED_IMPORT' && source.startsWith('babel-runtime/')) return
    }
    console.error(message);
  },
  plugins: [
    babel({
      babelrc: false,
      runtimeHelpers: true,
      presets: [['env', {modules: false}]],
      plugins: [
        'transform-class-properties',
        'transform-object-rest-spread',
        'external-helpers',
        'transform-runtime',
      ],
    })
  ],
}]
