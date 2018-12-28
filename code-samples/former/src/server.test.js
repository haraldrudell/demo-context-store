const http = require('http')

process.test = true

const serv = require('./server')

// instrument the server before it starts
// mock express



console.log('test:serv', serv)
// ionstrument the server file
// set p 0 : check color
console.log(serv.params)
serv.params.ab_prob_red = 0

serv.server()
console.log('server launched')

// set p 1 check color
// set p 0, req., set p 1 ensure same color


t().catch(eh)

async function t() {
  const url = 'http://localhost:3001'
  const expected = 'greens'

  const actual = await new Promise((resolve, reject) => {
    let body = ''
    http.get(url, res => {
      res.setEncoding('utf8')
      console.log('inside', !!res)
      res.on('data', d => body += d)
      res.once('end', () => resolve(body))
    }).on('error', reject)
  })
  if (actual !== expected) throw new Error(`is green: color returjed: ${actual}`)
  console.log('r', actual)
}

function eh(e) {
  console.error('erorHandler')
  console.error(e)
  process.exit(1)
}