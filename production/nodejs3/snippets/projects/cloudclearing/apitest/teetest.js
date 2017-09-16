// teetest.js
// test tee of console log
var haraldops = require('haraldops')

haraldops.tee({
	logRotate: 'minute'
})

setInterval(echo, 5000)
echo()

function echo() {
	console.log(new Date())
}
