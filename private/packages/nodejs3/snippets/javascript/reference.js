// reference.js
// explore how references work

// only objects can hold references

// an object copy can modify an integer field in original object
var o1 = { value: 5 }
var o2 = o1
o2.value++
console.log(o1)

// also assignment
var o1 = { value: 5 }
var o2 = o1
o2.value = 6
console.log(o1)

// if the field value is copies, the original value cna no longer be changes
var o1 = { value: 5 }
var o2 = {}
o2.value = o1.value
o2.value ++
console.log(o1)

// change in reference, original fields no longer changes
var o1 = { value: 5 }
var o2 = { ref: o1 }
var o3 = o2
o3.ref = 7
console.log(o1)

// a reference is modifying the original object
var o1 = { value: 5 }
var o2 = { ref: o1 }
var o3 = o2
o3.ref.value = 1
console.log(o1)

var o1 = { value: 5 }
var a1 = [ o1 ]
var o2 = a1[0]
o2.value = 6
console.log(o1)

// opts example
// caller has an option object
// if that is passed to a function, can the function modify
// the oroginal option object?
var o1 = { option: 1 }
f(o1)
console.log(o1)
function f(opts) {
	opts.option = 4
	opts = { option: opts.option || 2 }
	opts.option = 3
}

// assigning an object still maitains the same list of references
var o1 = { date: new Date() }
console.log(typeof o1.date)
var o2 = o1
o2.date = o1.date
console.log(typeof o1.date)
o2.date = o2.date.getTime()
console.log(typeof o1.date)

var o1 = { date: new Date() }
console.log(typeof o1.date)
var o2 = {}
o2.date = o1.date
console.log(typeof o1.date)
o2.date = o2.date.getTime()
console.log(typeof o1.date)
