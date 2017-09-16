// uuid.js

module.exports = {
	uuid: generate,
}

/**
 * The simplest function to get an UUID string.
 * @returns {string} A version 4 UUID string.
 */
function generate() {
	var result =
		hex(rand(32), 8) + "-" + // time_low
		hex(rand(16), 4) + "-" + // time_mid
		hex(0x4000 | rand(12), 4) + "-" + // time_hi_and_version
		hex(0x8000 | rand(14), 4)+ "-" + // clock_seq_hi_and_reserved clock_seq_low
		hex(rand(48), 12) // node

	return result
}

/**
 * Returns an unsigned x-bit random integer.
 * @param {int} x A positive integer ranging from 0 to 53, inclusive.
 * @returns {int} An unsigned x-bit random integer (0 <= f(x) < 2^x).
 JavaScript has 53 significant bits in multiplication
 */
function rand(x) {
	var result = NaN
	if (x >= 0) {
		if (x <= 30) result = getRandomBits(x)
		else if (x <= 53) result = getRandomBits(30) + getRandomBits(x - 30) * (1 << 30)
	}
	return result
}

// get an integer of x random bits, 0 < x <= 30 
function getRandomBits(x) {
	return (0 | Math.random() * (1 << x))
}

// convert num to hex string, pad with leading '0' if less than length characters
// length <= 12
function hex(num, length) {
	var str = num.toString(16)
	var i = length - str.length
	if (i > 0) str = '000000000000'.substring(0, i) + str
	return str
}