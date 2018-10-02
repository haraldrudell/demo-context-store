/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.

inheritance:
An interface is required so a variable can contain a base or derived value
The base type is embedded as a value or pointer
Factory methods are used to instantiate

Interfaces can be defined that include already defined classes
*/
package main

import (
	"fmt"
)

type eater interface {
	eat()
}

type animal struct {
	//name := "animal" syntax error: unexpected :=, expecting type
	name string
}

func getAnimal() animal { return animal{"animal"} }

func (a animal) eat() {
	fmt.Printf("%s eating\n", a.name)
}

type dog struct {
	animal // embed by value
}

func (d dog) bark() {
	fmt.Println("bark")
}

func getDog() dog {
	//return dog{"dog"} cannot use "dog" (type string) as type animal in field value
	return dog{animal{"dog"}}
}

type cat struct {
	*animal // embed pointer
}

func (c cat) meow() {
	fmt.Println("meow")
}

func getCat() cat {
	//return cat{animal{"cat"}} cannot use animal literal (type animal) as type *animal in field value
	return cat{&animal{"cat"}}
}

func main() {
	/*
		animal eating
		dog eating
		bark
		cat eating
		meow
		dog eating
	*/
	a := getAnimal()
	a.eat()

	d := getDog()
	d.eat()
	d.bark()

	c := getCat()
	c.eat()
	c.meow()

	//var x animal
	//x = d cannot use d (type dog) as type animal in assignment

	var e eater
	e = d
	e.eat()
}
