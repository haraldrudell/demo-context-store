// mod.js
// http://javascript.about.com/od/problemsolving/a/modulobug.htm

// 5 % 3: 2
console.log('5 % 3:', 5 % 3)
// bad: does not work! expected 2
// -1 % 3: -1
console.log('-1 % 3:', -1 % 3)

console.log('5 % 3:', mod(5, 3))
// bad: does not work! expected 2
// -1 % 3: -1
console.log('-1 % 3:', mod(-1, 3))

function mod(a, b) {
	return (a % b + b) % b
}