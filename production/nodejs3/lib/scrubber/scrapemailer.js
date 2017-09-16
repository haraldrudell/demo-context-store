// scrapemailer.js
// Mail results from a scraping session
// © Harald Rudell 2012 MIT License

module.exports = {
	init: init,
	shutDown: shutDown,
}

var time1minute = 60 * 1e3
var time1hour = 60 * time1minute
var time24hours = 24 * time1hour

var theFunc
var timer
var interval

function init(func) {
	theFunc = func
	// first timer: 1 am tomorrow
	var t = new Date()
	var hours = 24 - t.getHours() // hours left to midnight local timezone
	hours += 1 - t.getMinutes() / 60 // add minutes to full hour (ie. time to 1 am)
	var fractions = time1minute - t.getTime() % time1minute // time to next full minute
	timer = setTimeout(firstTimer, hours * time1hour + fractions)
	console.log('scrapeMailer scheduled for 1 am local')
}

function firstTimer() {
	timer = null
	interval = setInterval(doScrub, time24hours)
	doScrub()
}

// timer initiated scrub
function doScrub() {
	theFunc()
}

function shutDown() {
	if (timer) {
		clearTimeout(timer)
		timer = null
	}
	if (interval) {
		clearInterval(interval)
		interval = null
	}
}
