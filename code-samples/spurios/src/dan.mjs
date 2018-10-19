/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
// node --experimental-modules src/dan
// https://gist.github.com/DanCech/f5771c4cee4955b308e4abd2cb356f29
/*
Complete the urlencode() function, which should take a javascript object and return a PHP-style query string [1].
The object should be translated into a sequence of <key>=<value> pairs, separated by &.
Reserved characters in keys and values should be percent encoded [2].
If a nested object is encountered it should be added to the output as <top level key>[<sub key]=<value>
There are a number of test-cases defined below, correctness of the function can be tested by running this file:
node urlencode.js
It will loop through the test cases and output whether each is correct.
[1] http://php.net/manual/en/function.http-build-query.php
[2] https://en.wikipedia.org/wiki/Percent-encoding
*/
let i = 0
function urlencode(input) {
  // { firstName: 'John', lastName: 'Smith' }
  // map of parameter names, because they can be repeated
  // repeated value in array
  // ampersand, equal sign
  console.log('HARALD', ++i, {input})

  /*
  object
  array
  class
  */
  let result = []
  for (let [parm, value] of Object.entries(Object(input))) {
    let parmEncoded = encodeURIComponent(parm)

    // special things to value
    if (typeof value !== 'object') {
      if (value === undefined) continue
      let valueEncoded = encodeURIComponent(value)
      result.push({parmEncoded, valueEncoded})
    } else if (true || !Array.isArray(value)) { // object of subkeys
      resolveObject(value, parmEncoded)
    } else { // some array tbd

    }
  }
  const str = result.map(({parmEncoded, valueEncoded}) => `${parmEncoded}=${valueEncoded}`).join('&')
  return str
  /*
  console.log('urlencode', {input})
  urlencodepart
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  */
  function resolveObject(o, key) { // object 'paramname'
    for (let [subkey, subvalue] of Object.entries(Object(o))) {
      if (subvalue === undefined) continue
      let parmEncoded = key + `[${encodeURIComponent(String(subkey))}]`
      if (typeof subvalue !== 'object') result.push({parmEncoded, valueEncoded: encodeURIComponent(subvalue)})
      else resolveObject(subvalue, parmEncoded)
    }
  }
}


var tests = [
  {
    input: {
      firstName: 'John',
      lastName: 'Smith',
    },
    expected: 'firstName=John&lastName=Smith',
  },
  {
    input: {
      firstName: 'John',
      lastName: 'Smith',
      'street address': '123 Test St',
    },
    expected: 'firstName=John&lastName=Smith&street%20address=123%20Test%20St',
  },
  {
    input: {
      firstName: 'John',
      lastName: 'Smith',
      address: {
        street: '123 Test St',
        city: 'Testville',
        zip: 12345,
      },
    },
    expected: 'firstName=John&lastName=Smith&address[street]=123%20Test%20St&address[city]=Testville&address[zip]=12345',
  },
  {
    input: {
      firstName: 'John',
      lastName: 'Smith',
      address: {
        street: {
          number: 123,
          name: 'Test St',
        },
        city: 'Testville',
        zip: 12345,
      },
    },
    expected: 'firstName=John&lastName=Smith&address[street][number]=123&address[street][name]=Test%20St&address[city]=Testville&address[zip]=12345',
  },
  {
    input: {
      firstName: 'John',
      lastName: 'Smith',
      interests: ['javascript', 'riding bikes'],
    },
    expected: 'firstName=John&lastName=Smith&interests[0]=javascript&interests[1]=riding%20bikes',
  },
  {
    input: {
      firstName: 'John',
      lastName: 'Smith',
      address: undefined,
      interests: ['javascript', 'riding bikes'],
    },
    expected: 'firstName=John&lastName=Smith&interests[0]=javascript&interests[1]=riding%20bikes',
  },
];

for (let i in tests) {
  var input = tests[i].input;
  var expected = tests[i].expected;
  console.log('Expected: ' + expected);

  var result = urlencode(input);
  console.log('Result:   ' + result);

  console.log('Match:    ' + (result === expected));
  if (result !== expected) {
    break;
  }
}