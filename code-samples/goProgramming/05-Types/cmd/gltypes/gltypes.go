/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.

/opt/foxyboy/sw/pri/code-samples/goProgramming
go run 05-Types/cmd/gltypes/gltypes.go

gltypes.go

Some predeclared identifiers are types.
Predeclared identifiers are in the Universe block that encompasses all Go source text.
They are global and their definitions cannot be displayed.
Predeclared type identifiers: 20[bool, byte, complex64, complex128, error, float32, float64, int, int8, int16, int32, int64, rune, string, uint, uint8, uint16, uint32, uint64, uintptr]

A type alias declaration binds an additional identifier to a type.
Predeclared type alias identifiers: 4[byte→uint8, int→int32/int64 depending on compiler, uint→uint32/uint64 depending on compiler, rune→uint32]

The predeclared types define sets of values: 13[bool: true false,
uint8: from 0 to 255, uint16: from 0 to 65535, uint32: from 0 to 4294967295, uint64: from 0 to 18446744073709551615,
int8: from -128 to 127, int16: from -32768 to 32767, int32: from -2147483648 to 2147483647, int64: from -9223372036854775808 to 9223372036854775807,
float32: , float64: , complex64: , complex128: ]

default types for literals:
- int float64 complex128 rune bool string
- int is int32 or int64 depending on the compiler
- more specific types use conversion expression: "i := byte(1)"

A defined type: declared using "type identifier Type"
- a distinct type
- same underlying type and operations
- does not inherit methods

composite types: array, struct, pointer, function, interface, slice, map, and channel
- may have type literals, ie. "a := []byte { ElementList }"
- types that can be assigned nil: pointer, function, slice, map, channel, or interface
- composite types that cannot be assigned nil: array struct
Array: [n]type numbered sequence of elements of a single type
Struct: struct{…} sequence of named elements, called fields, each of which has a name and a type
Pointer: *type points to a variable of a given type, the base type
Function: func…(…)… has parameters and result types
Interface: interface{…} specifies a method set called its interface. Can store a value of any type implementing the interface
Slice: []type descriptor for a contiguous segment of an underlying array
Map: map[type]type unordered group of elements of the element type, indexed by a set of unique keys of the key type
Channel: chan type, chan <- type, <- chan type mechanism to communicate by sending and receiving values of a specified element type

A type may have methods associated with it. The method set for an interface type is its interface
*/
package main

import (
	"errors"
	"fmt"
	"log"
	"strconv"
	"strings"
	"time"
)

func main() {
	fmt.Printf("gltypes.go\n\n")
	fmt.Println(strings.Join([]string{
		"Some predeclared identifiers are types.",
		"Predeclared identifiers are in the Universe block that encompasses all Go source text.",
		"They are global and their definitions cannot be displayed.",
		fmt.Sprintf("Predeclared type identifiers: %d[%s]\n", len(predeclaredTypes), predeclaredTypes),

		"A type alias declaration binds an additional identifier to a type.",
		fmt.Sprintf("Predeclared type alias identifiers: %d[%s]\n", len(predeclaredAliasTypes), predeclaredAliasTypes),

		fmt.Sprintf("The predeclared types define sets of values: %d[%s]\n", len(predeclaredSetOfValues), predeclaredSetOfValues),
		`default types for literals:
- int float64 complex128 rune bool string
- int is int32 or int64 depending on the compiler
- more specific types use conversion expression: "i := byte(1)"
`,
		`A defined type: declared using "type identifier Type"
- a distinct type
- same underlying type and operations
- does not inherit methods
`,
		`composite types: array, struct, pointer, function, interface, slice, map, and channel
- may have type literals, ie. "a := []byte { ElementList }"
- types that can be assigned nil: pointer, function, slice, map, channel, or interface
- composite types that cannot be assigned nil: array struct
Array: [n]type numbered sequence of elements of a single type
Struct: struct{…} sequence of named elements, called fields, each of which has a name and a type
Pointer: *type points to a variable of a given type, the base type
Function: func…(…)… has parameters and result types
Interface: interface{…} specifies a method set called its interface. Can store a value of any type implementing the interface
Slice: []type descriptor for a contiguous segment of an underlying array
Map: map[type]type unordered group of elements of the element type, indexed by a set of unique keys of the key type
Channel: chan type, chan <- type, <- chan type mechanism to communicate by sending and receiving values of a specified element type
`,
		`A type may have methods associated with it. The method set for an interface type is its interface
`,
	}, "\n"))

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

var predeclaredTypes = stringList{
	"bool", "byte", "complex64", "complex128", "error", "float32", "float64",
	"int", "int8", "int16", "int32", "int64", "rune", "string",
	"uint", "uint8", "uint16", "uint32", "uint64", "uintptr",
}

var predeclaredAliasTypes = orderedStringMap{
	{"byte": "uint8"},
	{"int": "int32/int64 depending on compiler"},
	{"uint": "uint32/uint64 depending on compiler"},
	{"rune": "uint32"},
}

var predeclaredSetOfValues = valueSets{
	{false, valuesForType{"bool": {true, false}}},
	{true, valuesForType{"uint8": {uint8(0), ^uint8(0)}}},
	{true, valuesForType{"uint16": {uint16(0), ^uint16(0)}}},
	{true, valuesForType{"uint32": {uint32(0), ^uint32(0)}}},
	{true, valuesForType{"uint64": {uint64(0), ^uint64(0)}}},
	{true, valuesForType{"int8": {-int8(^uint8(0)>>1) - 1, int8(^uint8(0) >> 1)}}},
	{true, valuesForType{"int16": {-int16(^uint16(0)>>1) - 1, int16(^uint16(0) >> 1)}}},
	{true, valuesForType{"int32": {-int32(^uint32(0)>>1) - 1, int32(^uint32(0) >> 1)}}},
	{true, valuesForType{"int64": {-int64(^uint64(0)>>1) - 1, int64(^uint64(0) >> 1)}}},
	{true, valuesForType{"float32": {}}},
	{true, valuesForType{"float64": {}}},
	{true, valuesForType{"complex64": {}}},
	{true, valuesForType{"complex128": {}}},
}

type stringList []string

func (sl stringList) String() string {
	return strings.Join(sl, ",\x20")
}

type orderedStringMap []map[string]string

func (s orderedStringMap) String() string {
	result := []string{}
	for _, mapp := range s {
		for key, value := range mapp {
			result = append(result, key+"→"+value)
		}
	}
	return strings.Join(result, ",\x20")
}

type valueSets []valueSet

func (sets valueSets) String() string {
	result := []string{}
	for _, set := range sets {
		result = append(result, set.String())
	}
	return strings.Join(result, ",\x20")
}

type valueSet struct {
	isRange bool
	values  valuesForType
}

type valuesForType map[string][]interface{}

func (set valueSet) String() string {
	result := []string{}
	for typeName, values := range set.values {
		str := ""
		if set.isRange {
			str = getRange(values)
		} else {
			str = getSet(values)
		}
		result = append(result, typeName+": "+str)
	}
	return strings.Join(result, ",\x20")
}

func getSet(values []interface{}) string {
	result := []string{}
	for _, value := range values {
		var str string
		switch value.(type) {
		case bool:
			str = strconv.FormatBool(value.(bool))
		default:
			panic(errors.New("bad type to valueList"))
		}
		result = append(result, str)
	}
	return strings.Join(result, "\x20")
}

func getRange(values []interface{}) string {
	if len(values) == 0 {
		return ""
	}
	if len(values) < 2 {
		panic(errors.New("getRange: less than 2 values"))
	}
	result := []string{
		"from",
		getValue(values[0]),
		"to",
		getValue(values[1]),
	}
	if len(values) > 2 {
		result = append(result, "and")
		for _, v := range values[2:] {
			result = append(result, getValue(v))
		}
	}
	return strings.Join(result, "\x20")
}

func getValue(value interface{}) string {
	switch value.(type) {
	case uint:
		return strconv.FormatUint(uint64(value.(uint)), 10)
	case uint8:
		return strconv.FormatUint(uint64(value.(uint8)), 10)
	case uint16:
		return strconv.FormatUint(uint64(value.(uint16)), 10)
	case uint32:
		return strconv.FormatUint(uint64(value.(uint32)), 10)
	case uint64:
		return strconv.FormatUint(value.(uint64), 10)
	case int:
		return strconv.Itoa(value.(int))
	case int8:
		return strconv.FormatInt(int64(value.(int8)), 10)
	case int16:
		return strconv.FormatInt(int64(value.(int16)), 10)
	case int32:
		return strconv.FormatInt(int64(value.(int32)), 10)
	case int64:
		return strconv.FormatInt(value.(int64), 10)
	default:
		panic(errors.New("bad type to getValue"))
	}
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
