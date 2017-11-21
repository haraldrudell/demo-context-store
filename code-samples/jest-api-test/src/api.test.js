test('Issue request to server', async () => {

  console.log('apiTest 1')

  const p = typeof process !== 'undefined' && process
  if (!p) throw new Error(`global process not present: ${typeof p}`)

  const r = p.release
  if (!r) throw new Error(`process.release not present: ${typeof r}`)

  console.log('process:', r)
})
