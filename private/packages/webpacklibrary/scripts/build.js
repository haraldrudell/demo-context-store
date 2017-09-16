const fs = require('fs-extra')
const del = require('del')
const rollup = require('rollup').rollup // {rollup}
const babel = require('rollup-plugin-babel')
const uglify = require('rollup-plugin-uglify')
const pkg = require('../package.json')

build().catch(errorHandler)

async function build() {
  console.log('start')
  const bundle = await rollup({
    input: 'src/Syslog.js',
    external: Object.keys(pkg.dependencies),
    plugins: [
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [['env', {modules: false}]],
        plugins: [
          'transform-class-properties',
          'transform-object-rest-spread',
        ],
      })
    ]
  })
  console.log('mid')
  await bundle.write({
    dest: `dist/${config.moduleName || 'main'}${config.ext}`,
    format: config.format,
    sourceMap: !config.minify,
    moduleName: config.moduleName,
  })
  console.log('end')
}

function errorHandler(e) {
  console.error(e)
}
