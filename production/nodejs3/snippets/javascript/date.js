// date.js

var d = new Date
console.log(d,
	d.getYear(),
	d.getMonth(),
	d.getDate(),
	d.getDay(),
	d.getHours(),
	d.getMinutes(),
	d.getSeconds(),
	d.getMilliseconds(),
	d.getTimezoneOffset()
)

var dd = new Date('pqr')
console.log(dd)
console.log(dd.getTime())

for (var x = 95; x < 115; x += 1)
	console.log(new Date(x, 0, 1).toISOString())

console.log((function f(x) {;}).toString())