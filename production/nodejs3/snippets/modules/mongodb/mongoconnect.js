// mongoconnect.js
// explain how to connect to a mongo database
// © 2013 Harald Rudell <harald@allgoodapps.com> All rights reserved.

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

/*
File inventory

1. mongoconnect.js
mongodb.connect, Db, Server, db.close, db.connect
no data for: db.addUser db.admin db.authenticate db.command db.db dereference
error eval executeDbAdminCommand executeDbCommand lastError lastStatus logout
resetErrorHistory state wrap open previousErrors removeAllEventListeners removeUser
Db: mongoconnect.js
Server: mongoconnect.js

2. mongocollections.js
db.collection db.collectionName db.collections db.collectionsInfo db.createCollection db.dropCollection
db.renameCollection

count
distinct
drop, remove, rename, save, update
Collection

3. mongocrud.js
Demonstration of create-read-update-delete operations

4. mongocursor.js
examine operations on a cursor
Cursor db.cursorInfo

5. mongoitems.js
examine and manipulate items of a collection
find, findAndModify, findAndRemove, findOne
insert
geoHayStackSearch, geoNear, isCapped, mapReduce

6. mongoindex.js
prove that unique indexes work
db.createIndex, db.dropAllIndexes, db.dropIndex, db.dropIndexes, db.ensureIndex, db.indexExist, db.indexInformation, db.indexes, db.reIndex
indexInformation db.reIndex

mongohelper

mongoserial

test-mongo

*/
/*
Conclusions:
use mongodb.connect, not Db or Server
- single operation, has callback, verifies database connectivity

by defaults: a failed connect ios detected in 63 seconds.


use option ssl: true: password not in the clear

use one global/module-wide dbvariable for the database connection
note: the app does not exit until the database is closed

use collections on the fly from this db variable

provide user and password in thye connect string

// to connect to a database
// Google Doc MeetingManager Application, 120401

Concepts
server: holds databases and is identified by an ip address and a port

has both constructors and a connect function
- new Db('string', server. opts)
- new Server('ip', port, opts)
-- typical port is 27017
and connect()

a url look like: 'mongodb://headless:qweasd@ds031647.mongolab.com:31647/cloudclearing'
*/

// how do you verify database connectivity?

// https://github.com/mongodb/node-mongodb-native
var mongodb = require('mongodb')

var defaults = {

	// for Server constructor
	serverIp: 'ds031647.mongolab.com',
	serverPort: 31647,
	serverOpts: {
		ssl: true,
	},

	// for Db constructor
	dbDatabaseName: 'cloudclearing',
	dbOpts: {
	},

	// for connect function
	connectUrl: 'mongodb://headless:qweasd@ds031647.mongolab.com:31647/cloudclearing',
	connectOpts: {
		ssl: true,
	},
}

// Server constructor
// only initiates an object, no communcation occurs
// object:Server
/**
 * Class representing a single MongoDB Server connection
 *
 * Options
 *  - **readPreference** {String, default:null}, set's the read preference (Server.READ_PRIMAR, Server.READ_SECONDARY_ONLY, Server.READ_SECONDARY)
 *  - **ssl** {Boolean, default:false}, use ssl connection (needs to have a mongod server with ssl support)
 *  - **slaveOk** {Boolean, default:false}, legacy option allowing reads from secondary, use **readPrefrence** instead.
 *  - **poolSize** {Number, default:1}, number of connections in the connection pool, set to 1 as default for legacy reasons.
 *  - **socketOptions** {Object, default:null}, an object containing socket options to use (noDelay:(boolean), keepAlive:(number), timeout:(number))
 *  - **logger** {Object, default:null}, an object representing a logger that you want to use, needs to support functions debug, log, error **({error:function(message, object) {}, log:function(message, object) {}, debug:function(message, object) {}})**.
 *  - **auto_reconnect** {Boolean, default:false}, reconnect on error.
 *
 * @class Represents a Server connection.
 * @param {String} host the server host
 * @param {Number} port the server port
 * @param {Object} [options] optional options for insert command
 */
var server = new mongodb.Server(defaults.serverIp, defaults.serverPort, defaults.serverOpts)
/*
server: object Server
.isConnected() boolean determines if the driver has a connection to the server
.options object contains options for this server
.socketOptions object contains options for the socket
the server emits: ?
- does not seem to be possible to access the socket

server: object:Server {
  _state:{
    runtimeStats:{
      queryStats:{
        (get)sScore:0,
        m_newM:0,
        (get)standardDeviation:0,
        m_n:0,
        (get)mean:0,
        m_oldM:0,
        (get)numDataValues:0,
        m_oldS:0,
        m_newS:0,
        (get)variance:0,
        -- prototype,
        push:function (x)
      }
    }
  },
  connected:false,
  logger:{
    log:function (message, object),
    error:function (message, object),
    debug:function (message, object)
  },
  slaveOk:undefined,
  disableDriverBSONSizeCheck:false,
  port:31647,
  options:{
    ssl:true
  },
  socketOptions:{
    ssl:true
  },
  recordQueryStats:false,
  eventHandlers:{
    timeout:0:[(nonE)length:0],
    error:0:[(nonE)length:0],
    close:0:[(nonE)length:0],
    message:0:[(nonE)length:0],
    poolReady:0:[(nonE)length:0],
    parseError:0:[(nonE)length:0]
  },
  _readPreference:null,
  internalMaster:false,
  host:'ds031647.mongolab.com',
  poolSize:5,
  _used:false,
  ssl:true,
  _serverState:'disconnected',
  -- prototype:Server,
  (get)queryStats:[getter Exception:TypeError: Cannot read property 'runtimeStats' of undefined],
  (get)runtimeStats:[getter Exception:TypeError: Cannot read property 'runtimeStats' of undefined],
  (get)autoReconnect:[getter Exception:TypeError: Cannot read property 'auto_reconnect' of undefined],
  (get)connection:undefined,
  (get)primary:object:Server {
    (get)queryStats:[getter Exception:TypeError: Cannot read property 'runtimeStats' of undefined],
    (get)runtimeStats:[getter Exception:TypeError: Cannot read property 'runtimeStats' of undefined],
    (get)autoReconnect:[getter Exception:TypeError: Cannot read property 'auto_reconnect' of undefined],
    (get)connection:undefined,
    (get)primary:recursive-object#19,
    checkoutWriter:function (read),
    (get)readPreference:'primary',
    isMongos:function (),
    connect:function (dbInstance, options, callback),
    checkoutReader:function (),
    allRawConnections:function (),
    _isUsed:function (),
    close:function (callback),
    setReadPreference:function (),
    allServerInstances:function (),
    enableRecordQueryStats:function (enable),
    (get)master:undefined,
    isSetMember:function (),
    isConnected:function (),
    (nonE)constructor:function Server(host, port, options) {
      READ_PRIMARY:'primary',
      super_:function EventEmitter(),
      READ_SECONDARY:'secondaryPreferred',
      READ_SECONDARY_ONLY:'secondary'
    },
    -- prototype:EventEmitter,
    removeListener:function (type, listener),
    addListener:function (type, listener),
    listeners:function (type),
    emit:function (),
    on:recursive-object#35,
    once:function (type, listener),
    setMaxListeners:function (n),
    removeAllListeners:function (type)
  },
  checkoutWriter:recursive-object#20,
  (get)readPreference:'primary',
  isMongos:recursive-object#21,
  connect:recursive-object#22,
  checkoutReader:recursive-object#23,
  allRawConnections:recursive-object#24,
  _isUsed:recursive-object#25,
  close:recursive-object#26,
  setReadPreference:recursive-object#27,
  allServerInstances:recursive-object#28,
  enableRecordQueryStats:recursive-object#29,
  (get)master:undefined,
  isSetMember:recursive-object#30,
  isConnected:recursive-object#31,
  -- prototype:EventEmitter,
  removeListener:recursive-object#34,
  addListener:recursive-object#35,
  listeners:recursive-object#36,
  emit:recursive-object#37,
  on:recursive-object#35,
  once:recursive-object#38,
  setMaxListeners:recursive-object#39,
  removeAllListeners:recursive-object#40
}
*/
//console.log('server:', haraldutil.inspectAll(server))

// Db constructor
// prepares a database instance, does not actually connect
// object:Db
/**
 * Create a new Db instance.
 *
 * Options
 *  - **strict** {true | {w:n, wtimeout:n} | {fsync:true}, default:false}, execute insert with a getLastError command returning the result of the insert command.
 *  - **native_parser** {Boolean, default:false}, use c++ bson parser.
 *  - **forceServerObjectId** {Boolean, default:false}, force server to create _id fields instead of client.
 *  - **pkFactory** {Object}, object overriding the basic ObjectID primary key generation.
 *  - **slaveOk** {Boolean, default:false}, allow reads from secondaries.
 *  - **serializeFunctions** {Boolean, default:false}, serialize functions.
 *  - **raw** {Boolean, default:false}, peform operations using raw bson buffers.
 *  - **recordQueryStats** {Boolean, default:false}, record query statistics during execution.
 *  - **reaper** {Boolean, default:false}, enables the reaper, timing out calls that never return.
 *  - **reaperInterval** {Number, default:10000}, number of miliseconds between reaper wakups.
 *  - **reaperTimeout** {Number, default:30000}, the amount of time before a callback times out.
 *  - **retryMiliSeconds** {Number, default:5000}, number of miliseconds between retries.
 *  - **numberOfRetries** {Number, default:5}, number of retries off connection.
 *
 * @class Represents a Collection
 * @param {String} databaseName name of the database.
 * @param {Object} serverConfig server config object.
 * @param {Object} [options] additional options for the collection.
 */
//function Db(databaseName, serverConfig, options)
var db = new mongodb.Db(defaults.dbDatabaseName, server, defaults.dbOpts)
/*
Db object:
.options object db options
.serverConfig the server object
- emits: ?

Db object: object:Db {
  bson_deserializer:{
    Long:function Long(low, high) {
      TWO_PWR_24_:object:Long {
        _bsontype:'Long',
        low_:16777216,
        high_:0,
        -- prototype:Long,
        add:function (other),
        modulo:function (other),
        lessThanOrEqual:function (other),
        shiftRightUnsigned:function (numBits),
        lessThan:function (other),
        and:function (other),
        xor:function (other),
        isNegative:function (),
        or:function (other),
        div:function (other),
        getNumBitsAbs:function (),
        negate:function (),
        compare:function (other),
        getLowBitsUnsigned:function (),
        multiply:function (other),
        greaterThanOrEqual:function (other),
        subtract:function (other),
        isZero:function (),
        toNumber:function (),
        isOdd:function (),
        toString:function (opt_radix),
        toInt:function (),
        getHighBits:function (),
        shiftLeft:function (numBits),
        not:function (),
        getLowBits:function (),
        toJSON:function (),
        greaterThan:function (other),
        equals:function (other),
        notEquals:function (other),
        shiftRight:function (numBits)
      },
      MAX_VALUE:object:Long {
        _bsontype:'Long',
        low_:-1,
        high_:2147483647,
        -- prototype:Long,
        add:recursive-object#5,
        modulo:recursive-object#6,
        lessThanOrEqual:recursive-object#7,
        shiftRightUnsigned:recursive-object#8,
        lessThan:recursive-object#9,
        and:recursive-object#10,
        xor:recursive-object#11,
        isNegative:recursive-object#12,
        or:recursive-object#13,
        div:recursive-object#14,
        getNumBitsAbs:recursive-object#15,
        negate:recursive-object#16,
        compare:recursive-object#17,
        getLowBitsUnsigned:recursive-object#18,
        multiply:recursive-object#19,
        greaterThanOrEqual:recursive-object#20,
        subtract:recursive-object#21,
        isZero:recursive-object#22,
        toNumber:recursive-object#23,
        isOdd:recursive-object#24,
        toString:recursive-object#25,
        toInt:recursive-object#26,
        getHighBits:recursive-object#27,
        shiftLeft:recursive-object#28,
        not:recursive-object#29,
        getLowBits:recursive-object#30,
        toJSON:recursive-object#31,
        greaterThan:recursive-object#32,
        equals:recursive-object#33,
        notEquals:recursive-object#34,
        shiftRight:recursive-object#35
      },
      TWO_PWR_31_DBL_:2147483648,
      TWO_PWR_63_DBL_:9223372036854776000,
      NEG_ONE:object:Long {
        _bsontype:'Long',
        low_:-1,
        high_:-1,
        -- prototype:Long,
        add:recursive-object#5,
        modulo:recursive-object#6,
        lessThanOrEqual:recursive-object#7,
        shiftRightUnsigned:recursive-object#8,
        lessThan:recursive-object#9,
        and:recursive-object#10,
        xor:recursive-object#11,
        isNegative:recursive-object#12,
        or:recursive-object#13,
        div:recursive-object#14,
        getNumBitsAbs:recursive-object#15,
        negate:recursive-object#16,
        compare:recursive-object#17,
        getLowBitsUnsigned:recursive-object#18,
        multiply:recursive-object#19,
        greaterThanOrEqual:recursive-object#20,
        subtract:recursive-object#21,
        isZero:recursive-object#22,
        toNumber:recursive-object#23,
        isOdd:recursive-object#24,
        toString:recursive-object#25,
        toInt:recursive-object#26,
        getHighBits:recursive-object#27,
        shiftLeft:recursive-object#28,
        not:recursive-object#29,
        getLowBits:recursive-object#30,
        toJSON:recursive-object#31,
        greaterThan:recursive-object#32,
        equals:recursive-object#33,
        notEquals:recursive-object#34,
        shiftRight:recursive-object#35
      },
      INT_CACHE_:{
        0:object:Long {
          _bsontype:'Long',
          low_:0,
          high_:0,
          -- prototype:Long,
          add:recursive-object#5,
          modulo:recursive-object#6,
          lessThanOrEqual:recursive-object#7,
          shiftRightUnsigned:recursive-object#8,
          lessThan:recursive-object#9,
          and:recursive-object#10,
          xor:recursive-object#11,
          isNegative:recursive-object#12,
          or:recursive-object#13,
          div:recursive-object#14,
          getNumBitsAbs:recursive-object#15,
          negate:recursive-object#16,
          compare:recursive-object#17,
          getLowBitsUnsigned:recursive-object#18,
          multiply:recursive-object#19,
          greaterThanOrEqual:recursive-object#20,
          subtract:recursive-object#21,
          isZero:recursive-object#22,
          toNumber:recursive-object#23,
          isOdd:recursive-object#24,
          toString:recursive-object#25,
          toInt:recursive-object#26,
          getHighBits:recursive-object#27,
          shiftLeft:recursive-object#28,
          not:recursive-object#29,
          getLowBits:recursive-object#30,
          toJSON:recursive-object#31,
          greaterThan:recursive-object#32,
          equals:recursive-object#33,
          notEquals:recursive-object#34,
          shiftRight:recursive-object#35
        },
        1:object:Long {
          _bsontype:'Long',
          low_:1,
          high_:0,
          -- prototype:Long,
          add:recursive-object#5,
          modulo:recursive-object#6,
          lessThanOrEqual:recursive-object#7,
          shiftRightUnsigned:recursive-object#8,
          lessThan:recursive-object#9,
          and:recursive-object#10,
          xor:recursive-object#11,
          isNegative:recursive-object#12,
          or:recursive-object#13,
          div:recursive-object#14,
          getNumBitsAbs:recursive-object#15,
          negate:recursive-object#16,
          compare:recursive-object#17,
          getLowBitsUnsigned:recursive-object#18,
          multiply:recursive-object#19,
          greaterThanOrEqual:recursive-object#20,
          subtract:recursive-object#21,
          isZero:recursive-object#22,
          toNumber:recursive-object#23,
          isOdd:recursive-object#24,
          toString:recursive-object#25,
          toInt:recursive-object#26,
          getHighBits:recursive-object#27,
          shiftLeft:recursive-object#28,
          not:recursive-object#29,
          getLowBits:recursive-object#30,
          toJSON:recursive-object#31,
          greaterThan:recursive-object#32,
          equals:recursive-object#33,
          notEquals:recursive-object#34,
          shiftRight:recursive-object#35
        },
        -1:recursive-object#37
      },
      ZERO:recursive-object#39,
      ONE:recursive-object#40,
      TWO_PWR_48_DBL_:281474976710656,
      fromInt:function (value),
      fromString:function (str, opt_radix),
      fromNumber:function (value),
      MIN_VALUE:object:Long {
        _bsontype:'Long',
        low_:0,
        high_:-2147483648,
        -- prototype:Long,
        add:recursive-object#5,
        modulo:recursive-object#6,
        lessThanOrEqual:recursive-object#7,
        shiftRightUnsigned:recursive-object#8,
        lessThan:recursive-object#9,
        and:recursive-object#10,
        xor:recursive-object#11,
        isNegative:recursive-object#12,
        or:recursive-object#13,
        div:recursive-object#14,
        getNumBitsAbs:recursive-object#15,
        negate:recursive-object#16,
        compare:recursive-object#17,
        getLowBitsUnsigned:recursive-object#18,
        multiply:recursive-object#19,
        greaterThanOrEqual:recursive-object#20,
        subtract:recursive-object#21,
        isZero:recursive-object#22,
        toNumber:recursive-object#23,
        isOdd:recursive-object#24,
        toString:recursive-object#25,
        toInt:recursive-object#26,
        getHighBits:recursive-object#27,
        shiftLeft:recursive-object#28,
        not:recursive-object#29,
        getLowBits:recursive-object#30,
        toJSON:recursive-object#31,
        greaterThan:recursive-object#32,
        equals:recursive-object#33,
        notEquals:recursive-object#34,
        shiftRight:recursive-object#35
      },
      TWO_PWR_64_DBL_:18446744073709552000,
      TWO_PWR_32_DBL_:4294967296,
      TWO_PWR_16_DBL_:65536,
      fromBits:function (lowBits, highBits),
      TWO_PWR_24_DBL_:16777216
    },
    Symbol:function Symbol(value),
    Binary:function Binary(buffer, subType) {
      SUBTYPE_MD5:4,
      BUFFER_SIZE:256,
      SUBTYPE_BYTE_ARRAY:2,
      SUBTYPE_USER_DEFINED:128,
      SUBTYPE_FUNCTION:1,
      SUBTYPE_DEFAULT:0,
      SUBTYPE_UUID:3
    },
    BSON:function BSON() {
      BSON_DATA_REGEXP:11,
      BSON_DATA_INT:16,
      BSON_DATA_NULL:10,
      BSON_DATA_NUMBER:1,
      calculateObjectSize:function calculateObjectSize(object, serializeFunctions),
      deserialize:function (buffer, options, isArray),
      BSON_BINARY_SUBTYPE_FUNCTION:1,
      BSON_DATA_ARRAY:4,
      serializeWithBufferAndIndex:function serializeWithBufferAndIndex(object, checkKeys, buffer, index, serializeFunctions),
      BSON_DATA_TIMESTAMP:17,
      BSON_DATA_SYMBOL:14,
      BSON_DATA_STRING:2,
      functionCache:{},
      JS_INT_MIN:-9007199254740992,
      BSON_DATA_OID:7,
      BSON_INT64_MAX:9223372036854776000,
      BSON_BINARY_SUBTYPE_UUID:3,
      JS_INT_MAX:9007199254740992,
      BSON_DATA_LONG:18,
      BSON_DATA_MAX_KEY:127,
      BSON_INT32_MAX:2147483647,
      checkKey:function checkKey(key),
      serialize:function (object, checkKeys, asBuffer, serializeFunctions),
      BSON_BINARY_SUBTYPE_USER_DEFINED:128,
      BSON_DATA_DATE:9,
      BSON_INT32_MIN:-2147483648,
      BSON_INT64_MIN:-9223372036854776000,
      BSON_DATA_CODE_W_SCOPE:15,
      BSON_BINARY_SUBTYPE_DEFAULT:0,
      BSON_DATA_OBJECT:3,
      BSON_BINARY_SUBTYPE_BYTE_ARRAY:2,
      BSON_DATA_MIN_KEY:255,
      BSON_DATA_BOOLEAN:8,
      deserializeStream:function (data, startIndex, numberOfDocuments, documents, docStartIndex, options),
      BSON_DATA_CODE:13,
      BSON_DATA_BINARY:5,
      BSON_BINARY_SUBTYPE_MD5:4
    },
    MaxKey:function MaxKey(),
    Double:function Double(value),
    ObjectID:function ObjectID(id, _hex) {
      index:0,
      createFromHexString:function createFromHexString(hexString),
      createFromTime:function createFromTime(time),
      createPk:function createPk()
    },
    Timestamp:function Timestamp(low, high) {
      TWO_PWR_24_:object:Timestamp {
        _bsontype:'Timestamp',
        low_:16777216,
        high_:0,
        -- prototype:Timestamp,
        add:function (other),
        modulo:function (other),
        lessThanOrEqual:function (other),
        shiftRightUnsigned:function (numBits),
        lessThan:function (other),
        and:function (other),
        xor:function (other),
        isNegative:function (),
        or:function (other),
        div:function (other),
        getNumBitsAbs:function (),
        negate:function (),
        compare:function (other),
        getLowBitsUnsigned:function (),
        multiply:function (other),
        greaterThanOrEqual:function (other),
        subtract:function (other),
        isZero:function (),
        toNumber:function (),
        isOdd:function (),
        toString:function (opt_radix),
        toInt:function (),
        getHighBits:function (),
        shiftLeft:function (numBits),
        not:function (),
        getLowBits:function (),
        toJSON:function (),
        greaterThan:function (other),
        equals:function (other),
        notEquals:function (other),
        shiftRight:function (numBits)
      },
      MAX_VALUE:object:Timestamp {
        _bsontype:'Timestamp',
        low_:-1,
        high_:2147483647,
        -- prototype:Timestamp,
        add:recursive-object#64,
        modulo:recursive-object#65,
        lessThanOrEqual:recursive-object#66,
        shiftRightUnsigned:recursive-object#67,
        lessThan:recursive-object#68,
        and:recursive-object#69,
        xor:recursive-object#70,
        isNegative:recursive-object#71,
        or:recursive-object#72,
        div:recursive-object#73,
        getNumBitsAbs:recursive-object#74,
        negate:recursive-object#75,
        compare:recursive-object#76,
        getLowBitsUnsigned:recursive-object#77,
        multiply:recursive-object#78,
        greaterThanOrEqual:recursive-object#79,
        subtract:recursive-object#80,
        isZero:recursive-object#81,
        toNumber:recursive-object#82,
        isOdd:recursive-object#83,
        toString:recursive-object#84,
        toInt:recursive-object#85,
        getHighBits:recursive-object#86,
        shiftLeft:recursive-object#87,
        not:recursive-object#88,
        getLowBits:recursive-object#89,
        toJSON:recursive-object#90,
        greaterThan:recursive-object#91,
        equals:recursive-object#92,
        notEquals:recursive-object#93,
        shiftRight:recursive-object#94
      },
      TWO_PWR_31_DBL_:2147483648,
      TWO_PWR_63_DBL_:9223372036854776000,
      NEG_ONE:object:Timestamp {
        _bsontype:'Timestamp',
        low_:-1,
        high_:-1,
        -- prototype:Timestamp,
        add:recursive-object#64,
        modulo:recursive-object#65,
        lessThanOrEqual:recursive-object#66,
        shiftRightUnsigned:recursive-object#67,
        lessThan:recursive-object#68,
        and:recursive-object#69,
        xor:recursive-object#70,
        isNegative:recursive-object#71,
        or:recursive-object#72,
        div:recursive-object#73,
        getNumBitsAbs:recursive-object#74,
        negate:recursive-object#75,
        compare:recursive-object#76,
        getLowBitsUnsigned:recursive-object#77,
        multiply:recursive-object#78,
        greaterThanOrEqual:recursive-object#79,
        subtract:recursive-object#80,
        isZero:recursive-object#81,
        toNumber:recursive-object#82,
        isOdd:recursive-object#83,
        toString:recursive-object#84,
        toInt:recursive-object#85,
        getHighBits:recursive-object#86,
        shiftLeft:recursive-object#87,
        not:recursive-object#88,
        getLowBits:recursive-object#89,
        toJSON:recursive-object#90,
        greaterThan:recursive-object#91,
        equals:recursive-object#92,
        notEquals:recursive-object#93,
        shiftRight:recursive-object#94
      },
      INT_CACHE_:{
        0:object:Timestamp {
          _bsontype:'Timestamp',
          low_:0,
          high_:0,
          -- prototype:Timestamp,
          add:recursive-object#64,
          modulo:recursive-object#65,
          lessThanOrEqual:recursive-object#66,
          shiftRightUnsigned:recursive-object#67,
          lessThan:recursive-object#68,
          and:recursive-object#69,
          xor:recursive-object#70,
          isNegative:recursive-object#71,
          or:recursive-object#72,
          div:recursive-object#73,
          getNumBitsAbs:recursive-object#74,
          negate:recursive-object#75,
          compare:recursive-object#76,
          getLowBitsUnsigned:recursive-object#77,
          multiply:recursive-object#78,
          greaterThanOrEqual:recursive-object#79,
          subtract:recursive-object#80,
          isZero:recursive-object#81,
          toNumber:recursive-object#82,
          isOdd:recursive-object#83,
          toString:recursive-object#84,
          toInt:recursive-object#85,
          getHighBits:recursive-object#86,
          shiftLeft:recursive-object#87,
          not:recursive-object#88,
          getLowBits:recursive-object#89,
          toJSON:recursive-object#90,
          greaterThan:recursive-object#91,
          equals:recursive-object#92,
          notEquals:recursive-object#93,
          shiftRight:recursive-object#94
        },
        1:object:Timestamp {
          _bsontype:'Timestamp',
          low_:1,
          high_:0,
          -- prototype:Timestamp,
          add:recursive-object#64,
          modulo:recursive-object#65,
          lessThanOrEqual:recursive-object#66,
          shiftRightUnsigned:recursive-object#67,
          lessThan:recursive-object#68,
          and:recursive-object#69,
          xor:recursive-object#70,
          isNegative:recursive-object#71,
          or:recursive-object#72,
          div:recursive-object#73,
          getNumBitsAbs:recursive-object#74,
          negate:recursive-object#75,
          compare:recursive-object#76,
          getLowBitsUnsigned:recursive-object#77,
          multiply:recursive-object#78,
          greaterThanOrEqual:recursive-object#79,
          subtract:recursive-object#80,
          isZero:recursive-object#81,
          toNumber:recursive-object#82,
          isOdd:recursive-object#83,
          toString:recursive-object#84,
          toInt:recursive-object#85,
          getHighBits:recursive-object#86,
          shiftLeft:recursive-object#87,
          not:recursive-object#88,
          getLowBits:recursive-object#89,
          toJSON:recursive-object#90,
          greaterThan:recursive-object#91,
          equals:recursive-object#92,
          notEquals:recursive-object#93,
          shiftRight:recursive-object#94
        },
        -1:recursive-object#96
      },
      ZERO:recursive-object#98,
      ONE:recursive-object#99,
      TWO_PWR_48_DBL_:281474976710656,
      fromInt:function (value),
      fromString:function (str, opt_radix),
      fromNumber:function (value),
      MIN_VALUE:object:Timestamp {
        _bsontype:'Timestamp',
        low_:0,
        high_:-2147483648,
        -- prototype:Timestamp,
        add:recursive-object#64,
        modulo:recursive-object#65,
        lessThanOrEqual:recursive-object#66,
        shiftRightUnsigned:recursive-object#67,
        lessThan:recursive-object#68,
        and:recursive-object#69,
        xor:recursive-object#70,
        isNegative:recursive-object#71,
        or:recursive-object#72,
        div:recursive-object#73,
        getNumBitsAbs:recursive-object#74,
        negate:recursive-object#75,
        compare:recursive-object#76,
        getLowBitsUnsigned:recursive-object#77,
        multiply:recursive-object#78,
        greaterThanOrEqual:recursive-object#79,
        subtract:recursive-object#80,
        isZero:recursive-object#81,
        toNumber:recursive-object#82,
        isOdd:recursive-object#83,
        toString:recursive-object#84,
        toInt:recursive-object#85,
        getHighBits:recursive-object#86,
        shiftLeft:recursive-object#87,
        not:recursive-object#88,
        getLowBits:recursive-object#89,
        toJSON:recursive-object#90,
        greaterThan:recursive-object#91,
        equals:recursive-object#92,
        notEquals:recursive-object#93,
        shiftRight:recursive-object#94
      },
      TWO_PWR_64_DBL_:18446744073709552000,
      TWO_PWR_32_DBL_:4294967296,
      TWO_PWR_16_DBL_:65536,
      fromBits:function (lowBits, highBits),
      TWO_PWR_24_DBL_:16777216
    },
    DBRef:function DBRef(namespace, oid, db),
    MinKey:function MinKey(),
    Code:function Code(code, scope)
  },
  numberOfRetries:60,
  auths:0:[(nonE)length:0],
  _state:'disconnected',
  readPreference:undefined,
  _lastReaperTimestamp:1356123951970,
  databaseName:'cloudclearing',
  isInitializing:true,
  logger:{
    log:function (message, object),
    error:function (message, object),
    debug:function (message, object)
  },
  bson:object:BSON {
    -- prototype:BSON,
    calculateObjectSize:function (object, serializeFunctions),
    deserialize:function (data, options),
    serializeWithBufferAndIndex:function (object, checkKeys, buffer, startIndex, serializeFunctions),
    serialize:function (object, checkKeys, asBuffer, serializeFunctions),
    deserializeStream:function (data, startIndex, numberOfDocuments, documents, docStartIndex, options)
  },
  slaveOk:false,
  commands:0:[(nonE)length:0],
  native_parser:undefined,
  options:{},
  serializeFunctions:false,
  recordQueryStats:false,
  eventHandlers:{
    error:0:[(nonE)length:0],
    close:0:[(nonE)length:0],
    message:0:[(nonE)length:0],
    poolReady:0:[(nonE)length:0],
    parseError:0:[(nonE)length:0]
  },
  openCalled:false,
  pkFactory:recursive-object#58,
  _applicationClosed:false,
  bson_serializer:recursive-object#2,
  serverConfig:object:Server {
    _state:{
      runtimeStats:{
        queryStats:{
          (get)sScore:0,
          m_newM:0,
          (get)standardDeviation:0,
          m_n:0,
          (get)mean:0,
          m_oldM:0,
          (get)numDataValues:0,
          m_oldS:0,
          m_newS:0,
          (get)variance:0,
          -- prototype,
          push:function (x)
        }
      }
    },
    connected:false,
    logger:recursive-object#109,
    slaveOk:undefined,
    disableDriverBSONSizeCheck:false,
    port:31647,
    options:{
      ssl:true
    },
    socketOptions:{
      ssl:true
    },
    recordQueryStats:false,
    eventHandlers:{
      timeout:0:[(nonE)length:0],
      error:0:[(nonE)length:0],
      close:0:[(nonE)length:0],
      message:0:[(nonE)length:0],
      poolReady:0:[(nonE)length:0],
      parseError:0:[(nonE)length:0]
    },
    _readPreference:null,
    internalMaster:false,
    host:'ds031647.mongolab.com',
    poolSize:5,
    _used:true,
    ssl:true,
    _serverState:'disconnected',
    -- prototype:Server,
    (get)queryStats:[getter Exception:TypeError: Cannot read property 'runtimeStats' of undefined],
    (get)runtimeStats:[getter Exception:TypeError: Cannot read property 'runtimeStats' of undefined],
    (get)autoReconnect:[getter Exception:TypeError: Cannot read property 'auto_reconnect' of undefined],
    (get)connection:undefined,
    (get)primary:object:Server {
      (get)queryStats:[getter Exception:TypeError: Cannot read property 'runtimeStats' of undefined],
      (get)runtimeStats:[getter Exception:TypeError: Cannot read property 'runtimeStats' of undefined],
      (get)autoReconnect:[getter Exception:TypeError: Cannot read property 'auto_reconnect' of undefined],
      (get)connection:undefined,
      (get)primary:recursive-object#141,
      checkoutWriter:function (read),
      (get)readPreference:'primary',
      isMongos:function (),
      connect:function (dbInstance, options, callback),
      checkoutReader:function (),
      allRawConnections:function (),
      _isUsed:function (),
      close:function (callback),
      setReadPreference:function (),
      allServerInstances:function (),
      enableRecordQueryStats:function (enable),
      (get)master:undefined,
      isSetMember:function (),
      isConnected:function (),
      (nonE)constructor:function Server(host, port, options) {
        READ_PRIMARY:'primary',
        super_:function EventEmitter(),
        READ_SECONDARY:'secondaryPreferred',
        READ_SECONDARY_ONLY:'secondary'
      },
      -- prototype:EventEmitter,
      removeListener:function (type, listener),
      addListener:function (type, listener),
      listeners:function (type),
      emit:function (),
      on:recursive-object#157,
      once:function (type, listener),
      setMaxListeners:function (n),
      removeAllListeners:function (type)
    },
    checkoutWriter:recursive-object#142,
    (get)readPreference:'primary',
    isMongos:recursive-object#143,
    connect:recursive-object#144,
    checkoutReader:recursive-object#145,
    allRawConnections:recursive-object#146,
    _isUsed:recursive-object#147,
    close:recursive-object#148,
    setReadPreference:recursive-object#149,
    allServerInstances:recursive-object#150,
    enableRecordQueryStats:recursive-object#151,
    (get)master:undefined,
    isSetMember:recursive-object#152,
    isConnected:recursive-object#153,
    -- prototype:EventEmitter,
    removeListener:recursive-object#156,
    addListener:recursive-object#157,
    listeners:recursive-object#158,
    emit:recursive-object#159,
    on:recursive-object#157,
    once:recursive-object#160,
    setMaxListeners:recursive-object#161,
    removeAllListeners:recursive-object#162
  },
  _callBackStore:{
    _notReplied:{},
    -- prototype,
    -- prototype:EventEmitter,
    removeListener:recursive-object#156,
    addListener:recursive-object#157,
    listeners:recursive-object#158,
    emit:recursive-object#159,
    on:recursive-object#157,
    once:recursive-object#160,
    setMaxListeners:recursive-object#161,
    removeAllListeners:recursive-object#162
  },
  tag:1356123951970,
  notReplied:{},
  strict:false,
  retryMiliSeconds:1000,
  reaperInterval:10000,
  reaperTimeout:30000,
  bsonLib:recursive-object#2,
  reaperEnabled:false,
  forceServerObjectId:false,
  raw:false,
  -- prototype:Db,
  dropDatabase:function (callback),
  dropIndex:function (collectionName, indexName, callback),
  _registerHandler:function (db_command, raw, connection, exhaust, callback),
  command:function (selector, options, callback),
  stats:function stats(options, callback),
  collection:function (collectionName, options, callback),
  admin:function (callback),
  previousErrors:function (options, callback),
  collections:function (callback),
  indexInformation:function (collectionName, options, callback),
  _hasHandler:function (id),
  _removeHandler:function (id),
  resetErrorHistory:function (options, callback),
  _reRegisterHandler:function (newId, object, callback),
  executeDbAdminCommand:function (command_hash, options, callback),
  lastStatus:function (options, connectionOptions, callback),
  renameCollection:function (fromCollection, toCollection, callback),
  error:recursive-object#181,
  (get)state:[getter Exception:TypeError: Cannot read property '_serverState' of undefined],
  createCollection:function (collectionName, options, callback),
  authenticate:function (username, password, options, callback),
  ensureIndex:function (collectionName, fieldOrSpec, options, callback),
  addUser:function (username, password, options, callback),
  lastError:recursive-object#181,
  wrap:function (error),
  collectionsInfo:function (collectionName, callback),
  removeAllEventListeners:function (),
  dereference:function (dbRef, callback),
  close:function (forceClose, callback),
  _executeInsertCommand:function (db_command, options, callback),
  db:function (dbName),
  _callHandler:function (id, document, err),
  _findHandler:function (id),
  _executeUpdateCommand:recursive-object#192,
  executeDbCommand:function (command_hash, options, callback),
  dropCollection:function (collectionName, callback),
  cursorInfo:function (options, callback),
  _executeQueryCommand:function (db_command, options, callback),
  logout:function (options, callback),
  collectionNames:function (collectionName, options, callback),
  eval:function (code, parameters, options, callback),
  reIndex:function (collectionName, callback),
  _executeRemoveCommand:recursive-object#192,
  open:function (callback),
  removeUser:function (username, options, callback),
  createIndex:function (collectionName, fieldOrSpec, options, callback),
  -- prototype:EventEmitter,
  removeListener:recursive-object#156,
  addListener:recursive-object#157,
  listeners:recursive-object#158,
  emit:recursive-object#159,
  on:recursive-object#157,
  once:recursive-object#160,
  setMaxListeners:recursive-object#161,
  removeAllListeners:recursive-object#162
}
*/
//console.log('Db object:', haraldutil.inspectAll(db))

// using connect
// does Server and Db internally, no return value, callback(err, db)
// err is Error or null, db is the Db object
/**
 * Connect to MongoDB using a url as documented at
 *
 *  www.mongodb.org/display/DOCS/Connections
 *
 * Options
 *  - **uri_decode_auth** {Boolean, default:false} uri decode the user name and password for authentication
 *
 * @param {String} url connection url for MongoDB.
 * @param {Object} [options] optional options for insert command
 * @param {Function} callback callback returns the initialized db.
 * @return {null}
 * @api public
 */
// Db.connect = function(url, options, callback) {
var db2 = mongodb.connect(defaults.connectUrl, defaults.connectOpts, function (err, db) {
	console.log('connect callback:', typeof db, db.constructor.name)
	if (err) console.log('mongodb.connect err:', err)
	else if (db) db.close(function (err, db) {
		if (err) console.log('db.close err:', err)
		else console.log('db.close successful')
	})
})
// db2 undefined
//console.log('db2', db2)

// close database
// err is Error, result is undefined
/**
 * Close the current db connection, including all the child db instances. Emits close event if no callback is provided.
 *
 * @param {Boolean} [forceClose] connection can never be reused.
 * @param {Function} [callback] returns the results.
 * @return {null}
 * @api public
 */
//Db.prototype.close = function(forceClose, callback) {
function close(db, cb) {
	db.close(function (err, result) {
		if (err) throw err
		console.log('close successful')
	})
}
console.log('end of ', __filename)