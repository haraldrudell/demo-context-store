import * as express from 'express';
import {ng2engine, HTTP_PROVIDERS} from 'angular2-universal-preview';
// Angular 2
import {App} from './src/app';

function testRequire() {
  console.log('require-test in server.ts:', require('./src/testjs'))
  var testjs = require('./src/testjs')
  console.log(testjs.jsfn(1, 2)) // jsfn a: 1 b: 2, 17
}
//testRequire()

var postLoader = require('./src/postloader')

let app = express();

// Express View
app.engine('.ng2.html', ng2engine);
app.set('views', __dirname);
app.set('view engine', 'ng2.html');


// static files
app.use(express.static(__dirname));

app.use('/x', (req, res) => {
  var nid = req && req.query && req.query.p
  if (nid) {
    postLoader.loadPost(nid, (e: any, d: any) => {
      var statusCode = e ? 404 : 200
      if (e) d = '' + statusCode
      res.writeHead(statusCode, {'Content-Type': 'text/plain'})
      res.end(d)
    })
  } else {
console.log('/x bad nid')
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.end('404')
  }
})

app.use('/', (req, res) => {
  res.render('index', {
    App,
    providers: [
      HTTP_PROVIDERS,
    ]
  })
})

app.listen(3000, () => {
  console.log('Listen on http://localhost:3000');
});
