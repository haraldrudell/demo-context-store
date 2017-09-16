// traverseobject.js

var o = {
	object: { a: '1' },
	array: [ '2' ],
	string: '3',
	null: null,
	undefined: undefined,
	primobj: Object('4'),
}

scan(o)
console.log(o)

// scan an object and examine each string primitive
function scan(o) {
	scan(o, '')

	function scan(o, inProperty) {

		// examine properties if o is an object
		if (isObject(o)) {

			for (var property in o) {
				var v = o[property]
				if (!isObject(v)) {
					if (isString(v)) {
						console.log(inProperty, property, v)
						o[property] = 'string:' + v
					}
				} else scan(v,  inProperty + '.' + property)
			}
		}
	}

	function isObject(o) {
		return o != null && typeof o.valueOf() == 'object'
	}
	function isString(s) {
		return s != null && typeof s.valueOf() == 'string'
	}
}