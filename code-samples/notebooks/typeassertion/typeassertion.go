/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package main

import (
	"fmt"
)

type eater interface {
	eat()
}

type animal struct{}

func getAnimal() animal { return animal{} }
func (a animal) eat()   {}

type dog struct {
	animal
}

func getDog() dog {
	return dog{}
}

func main() {
	var e eater
	e = getDog()

	/*
		type assertion
		convert an interface value to a struct type
		t := i.(T): causes runtime type error
		t, ok := i.(T): tests. on failure f = animal{}, ok = false
	*/
	fmt.Printf("e: %T %v\n", e, e) // e: main.dog {{dog}}

	//f1 := e.(animal)             //panic: interface conversion: main.eater is main.dog, not main.animal

	f2, ok2 := e.(animal)                          // f dog, ok true
	fmt.Printf("f2: %T %v ok2: %t\n", f2, f2, ok2) // f2: main.animal {} ok2: false

	var f animal
	var ok bool
	f, ok = e.(animal)                     // f is not modified, ok is false
	fmt.Printf("%T %v ok: %t\n", f, f, ok) // main.animal {} ok: false
}
