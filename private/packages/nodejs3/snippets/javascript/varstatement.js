// varstatement.js

// does var a, b
// equal var a; b
// or var a; var b
//
// ie. is the comma a separator in var statement,
// or multiple evaluation

// example:
var a = 1, b = 2
// if it is multiuple evaluation, b is undeclared
// it works, so the comma is a list separator in the var statement
console.log(a)

// how does var statements apply?
/*
ony var statements that are actually executed apply
the variable exists outside of a block where declared
var do not exist prior to the var statement
*/
if (false) {
	var xb = 1
}
if (true) {
	var xc = 2
}
if (false) var xd = 2
{
	console.log('xebefore', typeof xe)
	var xe = 5
	console.log('xeafter', typeof xe)
}
// undefined number undefined
console.log(typeof xb, typeof xc, typeof xd, typeof xe)