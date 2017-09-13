/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import fs from 'fs'

console.log(__filename)
process.exit(1)

//run(process.argv.slice(2)).catch(errorHandler).catch(console.error)

async function run(argv) {
  console.log('cmdline-scripts argv:', argv)
  const script = argv[0]
  const absScript = await ensureTranspilation(script)
  await spawn('node', [absScript].concat(argv.slice(1)))
  console.log(`${script} completed successfully`)
}

async function spawn(cmd, args) {
  return new Promise((resolve, reject) => crossSpawn(cmd, args, {stdio: 'inherit'})
    .once('close', (status, signal) => {
      if (status === 0 && !signal) resolve(status)
      else {
        let msg = `status code: ${status}`
        if (signal) msg += ` signal: ${signal}`
        msg += ` '${cmd} ${args.join(' ')}'`
        reject(new Error(msg))
      }
    }).on('error', reject)
  )
}

async function ensureTranspilation(script) { // 'Build'
  const scriptFile = script + '.js'
  const outputDir = path.join(__dirname, '../build')
  const es = path.join(__dirname, '../src', scriptFile)
  const js = path.join(outputDir, scriptFile)
  const exists = await fs.pathExists(js)
  let doTranspile = !exists
  if (!doTranspile) {
    const updateTimes = await Promise.all([
      await fs.stat(es),
      await fs.stat(js),
    ])
    doTranspile = updateTimes[0].mtimeMs > updateTimes[1].mtimeMs
  }
  if (doTranspile) {
    const config = {
      ...webpackConfig,
      entry: {script: es},
      output: {path: outputDir},
    }
    const status = await doWebpack(config)
  }
  return js
}

doWebpack = config => new Promise((resolve, reject) => webpack(config, (err, status) => {
  if (!err) {
    if (status.hasErrors()) err = new Error('webpack errors')
    if (status.hasWarnings()) err = new Error('webpack waringns')
    console.log(status.toString())
  }
  if (!err) resolve(status)
  else reject(err)
}))

async function errorHandler(e) {
  console.error('cmdline-script.errorhandler:')
  console.error(e)
  console.error(new Error('errorHandler invocation'))
  process.exit(1)
}
