// precedence.js

// precendence of ! typeof
// make x Boolen
// x instanceof Error is false
// !(x instanceof Error) is true
// (!x) instanceof Error is false
console.log('!(x instanceof Error): requires parenthesis.')
console.log('    !true instanceof Error:', true instanceof Error)
console.log('    !(true instanceof Error):', !(true instanceof Error))
console.log('    (!true) instanceof Error:', (!true) instanceof Error)
console.log()

console.log('!(typeof x == \'function\'): requires parenthesis.')
console.log('    note: typeof 1:', typeof 1)
console.log('    !typeof 1 == \'function\':', !typeof 1 == 'function')
console.log('    !(typeof 1 == \'function\'):', !(typeof 1 == 'function'))
console.log('    (!typeof 1) == \'function\':', (!typeof 1) == 'function')

console.log(typeof Object(undefined), JSON.stringify(Object(undefined)))
console.log(Object(null).constructor.name, JSON.stringify(Object(null)))


//if (!typeof (cb = args.pop()) == 'function') throw 'Callback must be function'