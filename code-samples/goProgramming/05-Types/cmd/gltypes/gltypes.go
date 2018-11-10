/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package main

import (
	"fmt"
	"log"
	"time"
)

func main() {
	/*
		Types

		predeclared types:
		- bool byte complex64 complex128 error float32 float64
		- int int8 int16 int32 int64 rune string
		- uint uint8 uint16 uint32 uint64 uintptr

		A defined type: declared using "type identifier Type"
		- a distinct type
		- same underlying type and operations
		- does not inherit methods

		composite types: array, struct, pointer, function, interface, slice, map, and channel
		- may have type literals, ie. "a := []byte { ElementList }"
		array: numbered sequence of elements of a single type
		struct: sequence of named elements, called fields, each of which has a name and a type
		pointer: points to a variable of a given type, the base type
		function: has parameters and result types
		interface: specifies a method set called its interface. Can store a value of any type implementing the interface
		slice: descriptor for a contiguous segment of an underlying array
		map: unordered group of elements of the element type, indexed by a set of unique keys of the key type
		channel: mechanism to communicate by sending and receiving values of a specified element type
		nil: pointer, function, slice, map, channel, or interface types can be assigned nil

		default types for literals:
		- int float64 complex128 rune bool string
		- int is int32 or int64 depending on the compiler
		- more specific types use conversion expression: "i := byte(1)"

			numeric: int uint float complex (aliases: rune byte)
			string [method set] uintptr struct{} bool
			Pointer: *type
			Array: [n]type
			Slice []type
			func()
			interface{}
			map[type]type
			chan type, chan <- type, <- chan type
	*/

	start := time.Now()
	booleanLiteral := false
	decimalLiteral := 123
	octalLiteral := 07
	hexLiteral := 0x1
	imaginary := 6.67428e-11i
	runes := []rune{
		'x',          // Unicode character
		'\u1234',     // 16-bit code point
		'\U00101234', // 32 bit code point 0 - 10ffff
		'\b',         // escaped char: abfnrtv\ single-quote double-quote
		'\001',       // octal code point: 3 digits
		'\x0a',       // hexadecimal codepoint: 2 digits
	}

	// conversion
	x := byte(0)
	_ = x

	rawString := `abc`
	string := "a\nb" + "\x20\x22"
	if booleanLiteral && decimalLiteral+octalLiteral+hexLiteral != 0 && imaginary != 0 && runes[0] != runes[1] && rawString+string != "" {
	}
	log.Printf("Binomial took %s", time.Since(start)) // 157 ns, ie. 5 ns per line
	printTypes()
}

func printTypes() {
	u8 := uint8(8)
	fmt.Printf("uint8: %v %#v %T\n", u8, u8, u8) // uint8: 8 0x8 uint8

	by := byte(7)
	fmt.Printf("byte: %v %#v %T\n", by, by, by) // byte: 7 0x7 uint8

	u1 := uint16(6)
	fmt.Printf("uint16: %v %#v %T\n", u1, u1, u1) // uint16: 6 0x6 uint16

	a := [1]string{"5"}
	fmt.Printf("array-string: %v %#v %T\n", a, a, a) // array-string: [5] [1]string{"5"} [1]string

	sc := a[:]
	fmt.Printf("slice-string: %[1]v %#[1]v %[1]T\n", sc) // slice-string: [5] []string{"5"} []string

	fmt.Printf("func: %[1]v %#[1]v %[1]T\n", fun) // func: 0x1095150 (func())(0x1095150) func()

}

func fun() {}
