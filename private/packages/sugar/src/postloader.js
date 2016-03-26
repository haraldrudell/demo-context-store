var http = require('http')
/*
nid: number
cb(err, data): err: Error
- if !err: data is object
*/

exports.getWindow = getWindow
function getWindow() {
  return typeof window !== "undefined" ? window : null
}

exports.loadPost = loadPost
function loadPost(nid, cb) {
  var isDone = false
  
  http.get({
    hostname: 'www.popsugar.com',
    path: '/m/api/v2/post?nid=' + nid
  }, (res) => {
    if (res.statusCode == 200) {
      var data = '';
      res.setEncoding('utf8')
      res.on('data', (d) => data += d)
      res.on('end', () => getResult(null, data))
      res.on('error', (e) => getResult(e))
    } else getResult(new Error('status code: ' + res.statusCode))
  }).on('error', (e) => getResult(e))
  
  function getResult(err, data) {
    if (!isDone) {
      isDone = true
      cb(err, data)
    }
  }
}

exports.makeObject = makeObject
function makeObject(s, cb) {
  var object = null
  var err = null
  if (typeof s === 'string' && s) try {
      object = JSON.parse(s)
    } catch (e) {
      err = e
    }
  else err = new Error('no data')    
  cb(err, object)
}

exports.loadObject = loadObject
function loadObject(nid, cb) {
  loadPost(nid, (e, d) => {
    if (!e) makeObject(d, cb)
    else cb(e)
  })
}
