class Class{async run() {await new Promise(r => setTimeout(r, 1e3))}}

let debug

start(process.argv)

function start(argv) {
  return new Promise((resolve, reject) => resolve(preClass(argv)))
  .then(options => {
    const i = new Class(options)
    return i.promise || (i.run
      ? i.run(options)
      : i)
  }).catch(errorHandler)
}

function preClass(argv) {
  return new Promise((resolve, reject) => {
    const options = {}
    // parse, read yaml, call the President
    resolve(options)
  })
}

function errorHandler(e) {
  console.error('react-scripts errorHandler:')
  if (!(e instanceof Error)) e = new Error(`Non-error value: ${typeof e} ${e}`)
  console.log(debug ? e : e.message)
  process.exit(1)
}
