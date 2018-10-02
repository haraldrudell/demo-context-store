test([2, 3, 4, 5, 6], 1)
test([2, 4, 6, 8, 10], 2)

function test(input, expected) {
  process.stdout.write(input + ': ')
  const actual = generalizedGCD(input.length, input)
  if (actual === expected) {
    console.log('ok')
    return
  }
  console.log('expected:', expected)
  console.log('actual:', actual)
}

function generalizedGCD(num, arr) {

  // Node.js 4.4.7: no let, for of

  // process the first number with each subsequent number
  // arr is a list of positive integers, length may be 0
  var a = arr[0]
  for (var i = 1; i < arr.length; i++) a = gcd(a, arr[i])
  return a
}
// FUNCTION SIGNATURE ENDS

function gcd(a, b) { // a b: positive integers
  if (a === 0) return b
  return gcd(b % a, a)
}
