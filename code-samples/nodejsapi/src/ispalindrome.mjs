
Promise.resolve().then(() => run())
function run() {
  const c = new C
  c.print('abc')
    .print('aa')
    .print('aba')
}

class C {
  isPalindrome(s) {
    s = String(s)
    for (let i = 0, i1 = s.length - 1; i < i1; i++, i1--) if (s[i] !== s[i1]) return false
    return true
  }

  print(s) {
    console.log(`'${s}': ${this.isPalindrome(s) ? 'yes' : 'no'}`)
    return this
  }
}