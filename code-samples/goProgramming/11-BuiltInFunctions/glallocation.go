/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.


*/
package main

import "fmt"

func main() {
	/*
		value types
		- bool byte complex64 complex128 float32 float64
		- int int8 int16 int32 int64 rune string
		- uint uint8 uint16 uint32 uint64
	*/
	var a int
	// uninitialized int: type: int value: 0
	fmt.Printf("uninitialized int: type: %[1]T value: %#[1]v\n", a)

	var b rune
	// uninitialized rune: type: int32 value: 0
	fmt.Printf("uninitialized rune: type: %[1]T value: %#[1]v\n", b)

	var c string
	// uninitialized string: type: string value: ""
	fmt.Printf("uninitialized string: type: %[1]T value: %#[1]v\n", c)

	/*
		composite types
		array:
		struct, pointer, function, interface, slice, map, and channel

		some predeclared composite types:
		error: is an interface
		uintptr: is a pointer

		nil assignable: pointer, function, slice, map, channel, or interface
		array and struct cannot have nil value

		var identifier T
		new(T) - allocates and returns pointer
		make(T) - allocates an returns value, not for arrays
		- for slice map channel
		identifier := &T

		&…{} address operator: does not allocate
		variable, pointer indirection, slice indexing operation,
		a field selector of an addressable struct operand,
		an array indexing operation of an addressable array
	*/

	// array: var array [1]int or var array2 = [...]int{1, 2}
	var array [1]int
	// uninitialized array: type: [1]int value: [1]int{0}
	fmt.Printf("uninitialized array: type: %[1]T value: %#[1]v\n", array)
	var array2 = [...]int{} // must have the type literal
	// array from type literal: type: [0]int value: [0]int{}
	fmt.Printf("array from type literal: type: %[1]T value: %#[1]v\n", array2)
	var array1 = [1]int{} // must have the type literal
	_ = array1
	a4 := new([1]int)
	fmt.Printf("array from new: type: %[1]T value: %#[1]v\n", a4)
	// cannot make type [1]int
	//a5 := make([1]int)
	a6 := &[1]int{}
	fmt.Printf("array from ampersand: type: %[1]T value: %#[1]v\n", a6)

	type Struct struct {
		a int
	}
	var s Struct
	fmt.Printf("struct: %[1]T value: %#[1]v\n", s)

	// slice: s := []int{1}, sli := make([]int, 1)
	// func make([]T, len, cap) []T
	sli := make([]int, 1) // must have len
	// slice: []int value: []int{0}
	fmt.Printf("slice: %[1]T value: %#[1]v\n", sli)
	sli1 := []int{1}
	_ = sli1

	var m map[string]int
	_ = m
	m1 := make(map[string]int)
	_ = m1
	m2 := map[string]int{}
	fmt.Printf("map: %[1]T value: %#[1]v\n", m2)

	// channel

	/*
		The empty interface
		interface{} is a type that at runtime can be assigned any value
	*/
	var i1 interface{}
	// empty interface: <nil> value: <nil>
	fmt.Printf("empty interface: %[1]T value: %#[1]v\n", i1)
	// compile-time: type interface {} is not an expression
	//var i2 = interface{}
	//i3 := &(interface{})
	//i4 := &interface{}
	i5 := new(interface{})
	// new(interface{}): *interface {} value: (*interface {})(0xc000088030)
	fmt.Printf("new(interface{}): %[1]T value: %#[1]v\n", i5)
	// compile-time: cannot make type interface {}
	//i6 := make(interface{})
}
