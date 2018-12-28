// require server file
// test cam instryument it
// -= mock expresss
// affect the server in-operatioln

// is this require or is irt running command-line
const params = {
  ab_prob_red: 0.5,
}

console.log('server import')

if (!process.test) f()
else module.exports = {
  server: f,
  params,
}

function f() {
console.log('server f executig', params)

const express = require('express')
const cookieParser = require('cookie-parser')
const app = new express()
//app.configure(() => {
  app.use(cookieParser())
//})

app.listen(3001, () => console.log('listening'))

// render something a/b
// sticky value

// automated test

app.get('/', (req, res) => {
  let isRed = false

  console.log('cookies', typeof req.cookies, req.cookies)
  const cookieValue = req.cookies && typeof req.cookies.color === 'string' && req.cookies.color
  const hasCookie = !!cookieValue // TODO
  if (hasCookie) {
    isRed = cookieValue === 'true'
  }

  console.log('rq', hasCookie, isRed)
  if (!hasCookie) {
    const p = Math.random()
    console.log('p', p)
    isRed = p <= params.ab_prob_red
    res.cookie('color', String(isRed))
  }

  res.end(isRed ? 'red' : 'green')
})
console.log('endofscript')
}
