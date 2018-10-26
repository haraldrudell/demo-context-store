process.stdin.resume();
process.stdin.setEncoding("ascii");
var input = "";
process.stdin.on("data", function (chunk) {
    input += chunk;
});
process.stdin.on("end", function () {
    // now we can read/parse input
});
const i = require('immutable')

async function f() {
    await new Promise(resolve => setTimeout(() => console.log('2s', new Date()) + resolve(), 2e3))
}
f()
console.log('endofscript', new Date())