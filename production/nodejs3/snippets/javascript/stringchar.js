// stringchar.js

/*
conclusion:
individual characters of a string can be accessed with array access
the characters of a string can not be assigned using array access 
*/
var s = 'abc'
s1 = 'x'

console.log('Character at index 1 of \'' + s + '\':', s[1])
s[1] = 'x'
console.log('Assigning index 1 with \'' + s1 + '\':', s)