// objectclone.js

var a = { a:'original' }
var b = a
b.a = 'changed'
console.log('Assignment of object refers to the same object:', a)

var a = { a:'original' }
var b = Array.prototype.slice.call(a)
b.a = 'changed'
console.log('Array.prototype.slice.call clones an object but it becomes an array:', b, a)

/*
failed: get empty array
var a = {a:'originala'}
var b = {b:'originalb'}
var c = {a:a, b:b}
var d = Array.prototype.slice.call(c)
console.log('clones an object:', d)
d.a.a = 'changed'
console.log('Array.prototype.slice.call clones an object:', c)
*/

/*
failed: becomes array of object or 0
var a = {a:'originala'}
var b = {b:'originalb'}
var c =  Array.prototype.concat.call(a, b)
console.log('Array.prototype.concat.call fails for object merge:', c)
var c =  [].push.apply(a, b)
console.log('Array.prototype.concat.call fails for object merge:', c)
console.log(Object([1, 2]))
*/