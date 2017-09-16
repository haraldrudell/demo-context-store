// nodeapi-url.js

// http://nodejs.org/api/url.html
var url = require('url')

/*
url.parse(urlStr, [parseQueryString], [slashesDenoteHost])
url.format(urlObj)
url.resolve(from, to)
*/

var s = 'http://www.rhapsody.com/about/jobs.html?jvi=oxZtWfwF,Job'

// true as the second argument to also parse the query string using the querystring module. Defaults to false
var urlObject = url.parse(s, true)
/*
parse-1. { protocol: 'http:',
  slashes: true,
  host: 'www.rhapsody.com',
  hostname: 'www.rhapsody.com',
  href: 'http://www.rhapsody.com/about/jobs.html?jvi=oxZtWfwF,Job',
  search: '?jvi=oxZtWfwF,Job',
  query: { jvi: 'oxZtWfwF,Job' },
  pathname: '/about/jobs.html',
  path: '/about/jobs.html?jvi=oxZtWfwF,Job' }
*/
console.log('parse-1.', urlObject)
/*
{ protocol: 'http:',
  slashes: true,
  host: 'host.com',
  hostname: 'host.com',
  href: 'http://host.com/a/b/',
  search: '',
  query: {},
  pathname: '/a/b/',
  path: '/a/b/' }
*/
var s2 = 'http://hostno80.com/a/b/'
var s2a = url.parse(s2, true)
var s2b = url.format(s2a, true)
console.log(s2, s2a, s2b)

var s2 = 'HTTP://HOSTwith80.COM:80/A/B/'
var s2a = url.parse(s2, true)
var s2b = url.format(s2a, true)
console.log(s2, s2a, s2b)

var s2 = 'HTTPS://HOST.COMhttps80:80/A/B/'
var s2a = url.parse(s2, true)
var s2b = url.format(s2a, true)
console.log(s2, s2a, s2b)

var s2 = 'HTTPS://HOST.COMwith443:443/A/B/'
var s2a = url.parse(s2, true)
var s2b = url.format(s2a, true)
console.log(s2, s2a, s2b)
