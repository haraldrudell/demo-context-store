console.log('The next ReactJS version is going to be:')
f()
async function f () {
  for await (let v of [Promise.resolve(17)]) console.log(`${v}`)
}
