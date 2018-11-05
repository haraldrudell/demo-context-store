/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package main // to execute: main function of main package

import (
	/*
		Golang only has print println predefined
		fmt has Printf
	*/
	"fmt"
	"math"
)

/*
Shape shape
polymorphism in Golang is implemented using interfaces
Any struct that features the methods declared in an interface, is of that interface type
*/
type Shape interface {
	area() uint // parenthesis is function, otherwise a type name
}

/*
Circle In Go objects are defined by structs
*/
type Circle struct {
	radius uint
}

// Circle does not implement Shape (missing area method)
// a ethod declaration is a func with a single non-variadic Receiver base type
func (c Circle) area() uint {
	// Golang does not have **, it is math.Pow
	// unit has to be explicitly converted to float64 (there is no float, only float32 float64)
	// return must be explicitly used, and conversion to the proper type
	return uint(math.Pow(float64(c.radius), 2) * math.Pi)
}

// Square a square shape
type Square struct {
	side uint
}

func main() {
	// instantiating a struct
	var c1 Circle     // c is a circle struct with default values
	c1.radius = 2     // area = 2**2 * 3.14 => 12
	c2 := new(Circle) // c is *Circle
	// make only does slice map channel
	c3 := Circle{1}         // c3 is Circle
	c4 := Circle{radius: 1} // c4 is Circle

	// c2 declared and not used
	// if has no parenthesis and is an expression followed by {}
	if c2 == nil && c3 == c4 {
	}

	var shape Shape
	shape = c1

	fmt.Printf("Shape calculation: %d\n", shape.area())
}
