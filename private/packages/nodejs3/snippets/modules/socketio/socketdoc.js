// socketdoc.js

// https://github.com/LearnBoost/socket.io/wiki/Exposed-events

// the following events have not been seen
// client
// message anything reconnecting reconnect_failed

// on connect: connecting, connect

// on loss of connection: disconnect and a number of reconnecting

// to force reconnect: socket.socket.connect()

// when you arrive
// socket.on('connect', function () {
//})
// there are no arguments
// this is the socket object

// var socket = io.connect(5) forces an error event

/*
client socket object from io.connect is:
SocketNamespace
$events: Object
ackPackets: 0
acks: Object
flags: Object
json: Flag
name: "/socktest"

// socket property
socket: Socket
$events: Object
buffer: Array[0]
closeTimeout: 60000
connectTimeoutTimer: 1751
connected: true
connecting: false
doBuffer: false
heartbeatTimeout: 60000
heartbeatTimeoutTimer: 1755
namespaces: Object
open: true
options: Object
reconnecting: false
sessionid: "14702706051188755227"
transport: WS
transports: Array[4]
__proto__: Socket
addListener: function (name, fn) {
connect: function (fn) {
constructor: function Socket(options) {
disconnect: function () {
disconnectSync: function () {
emit: function (name) {
getTransport: function (override) {
handshake: function (fn) {
isXDomain: function () {
listeners: function (name) {
of: function (name) {
on: function (name, fn) {
onClose: function () {
onConnect: function () {
onDisconnect: function (reason) {
onError: function (err) {
onOpen: function () {
onPacket: function (packet) {
once: function (name, fn) {
packet: function (data) {
publish: function () {
reconnect: function () {
removeAllListeners: function (name) {
removeListener: function (name, fn) {
setBuffer: function (v) {
setHeartbeatTimeout: function () {
__proto__: Object

__proto__: SocketNamespace
$emit: function (name) {
addListener: function (name, fn) {
constructor: function SocketNamespace(socket, name) {
disconnect: function () {
emit: function (name) {
listeners: function (name) {
of: function () {
on: function (name, fn) {
onPacket: function (packet) {
once: function (name, fn) {
packet: function (packet) {
removeAllListeners: function (name) {
removeListener: function (name, fn) {
send: function (data, fn) {
__proto__: Object*/

// faster disconnects:
/*
server
close timeout defaults to 25 seconds

The timeout for the client, when it closes the connection it still X amounts of seconds to do re open of the connection. This value is sent to the client after a successful handshake.
heartbeat timeout defaults to 60 seconds

The timeout for the client when it should send a new heartbeat to the server. This value is sent to the client after a successful handshake.
heartbeat interval defaults to 25 seconds

server: {
	// heartbeats defaults to true
	'heartbeat timeout': 5, // defaults to 60 seconds
	'heartbeat interval': 1, // defaults to 25 seconds
}

client: {
	// reconnect defaults to true
	// reconnection delay defaults to 500 ms

	// reconnections starts with 'reconnection delay', then
	// doubles every time, maxed by 'reconnection limit',
	// until 'max reconnection attempts'

	'connect timeout': 1000, // defaults to 10000 ms
	'reconnection limit': 1000, // defaults to Infinity ms
	'max reconnection attempts': 2, // defaults to 10
}

// debug settings:
// server disconnect in 5 seconds
// client disconnect in 4 seconds, followed by 3 reconnection attempts

// object types
// server side the socket parameter on connect is Socket
// socket.id is session id
//
// client side
// the result from io.connect is SocketNamespace
// it has a property socket that is Socket
// socket.socket.sessionid
//
// the session id changes on each reconnect
//
// on the client, send does not reconnect

/*
authentication
https://github.com/LearnBoost/socket.io/wiki/Authorizing

the data provided as handshakeData in socket authentiocation:
{
	"headers":	{
		"host":"192.168.1.15:3000",
		"connection":"keep-alive",
		"cache-control":"max-age=0",
		"user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_4) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.47 Safari/536.11",
		"accept":"* /*",
		"referer":"http://192.168.1.15:3000/socktest",
		"accept-encoding":"gzip,deflate,sdch",
		"accept-language":"en-US,en;q=0.8",
		"accept-charset":"UTF-8,*;q=0.5",
		"cookie":"connect.sid=AzeEFgQcEhMXo31xZ1k84LqP.K5mlrmB62wRBxqw9jWoqPmQaJMhCBGGiEMhGF7Rqxis"
	},
	"address":{
		"address":"192.168.1.45","port":57746
	},
	"time":"Mon Jul 02 2012 11:41:40 GMT-0700 (PDT)",
	"query":{
		"t":"1341254500701"
	},
	"url":"/socket.io/1/?t=1341254500701","xdomain":false
}

http://www.danielbaulig.de/socket-ioexpress/

express session ids are found in request.sessionID
'7Vki7sfvNT2pHvJLSsYW286P.L1FVj5wcnyUoolJH9dm4kswgp9+aWw3aYnlCgusdD6c'

how to parse cookies:
1. app.js has: app.use(express.cookieParser())
2. in debugger, look at cookieParser.js
2a. line 34: gets  cookie data from req.headers.cookie
2b. line 39: stores cookie data in req.cookies using utils.parseCookie
3. in debugger, look at connect/lib/utils.js 
in the socket authentication function, we can parse the session id out:
var cookieObject = cookiem.parse(handshakeData.headers.cookie)
{ 'connect.sid': 'XdWYUGfsnAiSyLOQ4aUZzDCl.l+YP7BQWSNgq0J95rathIHvRu2KZk1F9vqLNpxKKu3k' }
issue: express uses connect 1.9.1, otherwise used is connect is 2.3.5
connect 2.3.5 uses require('cookie').parse

find the session store:
1. app.js has app.use(express.session(...))
2. in debugger, look at express.js: exported from connect.middleware
3. in debugger, look at session.js:
3a. line 299: gets cookie from req.cookies
3a. line 251: store is exposed as request.sessionStore
3b. line 310: checks hash: store.hash(req, base)
3c. line 318: store.get(id, cb(err, sess))
in the debugger, examining session
looking in app.js, app.configure:
express.cookieParser is in the file cookieParser.js but does not decrypt the cookie content
express.session

on the client we were using
socket.connected
socket.connecting
unfortunately, failed authentication is not tracked
*/


/*
server: io = socketio.listen(app)
is a Manager object
{ server: 
   { stack: [ [Object] ],
     connections: 0,
     allowHalfOpen: true,
     _handle: null,
     _events: 
      { request: [Function],
        connection: [Function: connectionListener],
        listening: [Object],
        error: [Function],
        upgrade: [Function],
        close: [Function] },
     httpAllowHalfOpen: false,
     cache: {},
     settings: { env: 'development', hints: true },
     redirects: {},
     isCallbacks: {},
     _locals: { settings: [Object], app: [Circular] },
     dynamicViewHelpers: {},
     errorHandlers: [],
     route: '/',
     routes: 
      { app: [Circular],
        routes: {},
        params: {},
        _params: [],
        middleware: [Function] },
     	router: [Getter] },
namespaces: { '': 
      { manager: [Circular],
        name: '',
        sockets: {},
        auth: false,
        flags: [Object],
        _events: [Object] } },
sockets: { manager: [Circular],
     name: '',
     sockets: {},
     auth: false,
     flags: { endpoint: '', exceptions: [] },
      _events: { connection: [Function] } },
_events: { 'set:transports': [ [Function], [Function] ],
     'set:store': [Function],
     'set:origins': [Function],
     'set:flash policy port': [Function] },
settings:    { origins: '*:*',
     log: true,
     store: { options: undefined, clients: {}, manager: [Circular] },
     logger: { colors: true, level: 3, enabled: true },
     static: { manager: [Circular], cache: {}, paths: [Object] },
     heartbeats: true,
     resource: '/socket.io',
     transports: [ 'websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling' ],
     authorization: false,
     blacklist: [ 'disconnect' ],
     'log level': 0,
     'log colors': true,
     'close timeout': 60,
     'heartbeat interval': 25,
     'heartbeat timeout': 60,
     'polling duration': 20,
     'flash policy server': true,
     'flash policy port': 10843,
     'destroy upgrade': true,
     'destroy buffer size': 100000000,
     'browser client': true,
     'browser client cache': true,
     'browser client minification': false,
     'browser client etag': false,
     'browser client expires': 315360000,
     'browser client gzip': false,
     'browser client handler': false,
     'client store expiration': 15,
     'match origin protocol': false },
  handshaken: {},
  connected: {},
  open: {},
  closed: {},
  rooms: {},
  roomClients: {},
  oldListeners: [ [Function] ] }

  io.sockets.on('connection', function (socket) {
  	the socket is of type Socket
  	io.sockets is type SocketNameSpace
*/