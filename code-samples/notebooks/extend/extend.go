/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.

Golang inheritance does not work for method arguments and return values of the embedded type
- embedding in a struct are anonymous fields of another struct type
- methods on an embedded object are promoted to the embedding object
- arguments to an embedded method that are of the embedded type will not work
- return values from the embedded method will not be of the embedding type
- the get-around is to write delegating methods in the embedding type

Writing an interface for existing struct is of little value
- the base methods that has this argument or return value must match exactly
- ie. cannot be replaced with interface names
- if the struct contains its own type in an argument or return value, the interface must, too
*/
package main

type base struct{}

func (b base) overriddenMethod(arg base) base {
	println("base")
	return b
}

func (b base) baseMethod(arg base) base {
	println("baseMethod")
	return b
}

/*
The pre-existing struct as an interface
- both extend and base implement this interface
- methods provided from base must have the base signature
type baseInterface interface {
	overriddenMethod(bi baseInterface) baseInterface
	baseMethod(b base) base
}
*/

type extend struct {
	base
}

func (e extend) overriddenMethod(e1 extend) extend {
	e.base.overriddenMethod(e.base)
	println("extend")
	return e
}

func (e extend) extendMethod(arg extend) extend {
	println("extendMethod")
	return e
}

func main() {
	/*
		To be able to invoke extendMethod, the value used must be extend
	*/
	e := extend{}

	/*
		get a baseInterface representation
		var bi baseInterface
		bi = e
	*/

	/*
				To see why e is not a baseInterface assign between two typed variables
				cannot use e (type extend) as type baseInterface in assignment:
			    extend does not implement baseInterface (wrong type for baseMethod method)
			        have baseMethod(base) base
							want baseMethod(baseInterface) baseInterface
		e1 := extend{}
		var bi1 baseInterface
		bi1 = e1
	*/

	/*
			b2 := base{}
			var bi2 baseInterface
			bi2 = b2
		bi.baseMethod(bi.(base))
	*/

	/*
		invoke all methods on e
		baseMethod
		base
		extend
		extendMethod
	*/
	var f extend
	//f = e.baseMethod(e) does not work: baseMethod returns the base value
	e.baseMethod(e.base) // argument and return value are base
	f = e.overriddenMethod(e)
	f = e.extendMethod(e)
	_ = f

	/*
		//e.baseMethod(extend{}) cannot use e (type extend) as type base in argument to e.base.baseMethod
		bi := extend{}.(baseInterface)
		bi.baseMethod(bi)
		bi.overriddenMethod(bi) // base extend
		bi.extendMethod(bi)
	*/
}
