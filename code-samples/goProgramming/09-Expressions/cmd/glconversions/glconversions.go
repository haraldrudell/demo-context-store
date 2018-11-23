/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.

/opt/foxyboy/sw/pri/code-samples/goProgramming
go run 09-Expressions/cmd/glconversions/glconversions.go

Value sets: (gltypes.go)
The predeclared types define sets of values: 13[
	bool: true false,
	uint8: from 0 to 255,
	uint16: from 0 to 65535,
	uint32: from 0 to 4294967295,
	uint64: from 0 to 18446744073709551615,
	int8: from -128 to 127,
	int16: from -32768 to 32767,
	int32: from -2147483648 to 2147483647,
	int64: from -9223372036854775808 to 9223372036854775807,
	float32: ,
	float64: ,
	complex64: ,
	complex128:
]
predeclared types defines value spaces:
boolean
integral
float
complex
string: utf-8 encoded
- types that can be converted to
- pointer values converted to number

composite types: array, struct, pointer, function, interface, slice, map, and channel
*/
package main

import (
	"fmt"
	"reflect"
	"strconv"
	"strings"
	"unicode/utf8"

	//	"github.com/haraldrudell/text"
	"github.com/haraldrudell/text"
)

func main() {
	fmt.Printf("\n\n=== glconversions\n\n")
	t := text.New()
	t.S("Conversions", text.P{
		`Go conversions: T(x)`,
		`Other conversions between value spaces`,
		t.Sub("Value sets", text.P{
			`boolean, integral, float, complex
string: implicitly utf-8 encoded
- types that can be converted to string
- pointer values converted to string or number??
integral types map to strings both as code points and numeric strings`,
		}),
	}).S("Go Conversions", text.P{
		`A two way channel can be converted to a read or write channel`,
		`Conversions within integral types`,
		`Conversions between character codes and integral types`,
		`Conversions to and from aliased types`,
	}).S("Other Conversions", text.P{
		t.Sub("Type names and constant literals to string", text.P{
			t.F(typeStringConversion),
		}),
		t.Sub("Between numeric strings and integral types", text.P{}),
		t.Sub("Conversion of value spaces to string representation", text.P{
			t.F(stringConversion),
		}),
	}).S("utf-8 string encoding", text.P{
		t.F(characterCodeConversions),
	}).S("10 Statements: Switch Statements: Type Switch", text.P{
		`:\n%s\n", typeSwitch`,
		`printTypeAndValue("reflect.TypeOf(5)", reflect.TypeOf(5))`,
		`printValue("reflect.TypeOf(5)", reflect.TypeOf(5).Name)`,
	})
}

func characterCodeConversions() {
	type Utf8 struct {
		desc string
		s    string
		name string
	}
	chs := []Utf8{
		{"1-byte utf-8", "$", "$ U+0024 Dollar sign"},
		{"2-byte utf-8", "\u00a2", "¢ U+00a2 cent"},
		{"3-byte utf8", "\u20ac", "€ U+20ac Euro Sign"},
		{"4-byte utf-8", "\U00010348", "𐍈 U_10348 Hwair"},
		{"invalid utf-8", "\xfe", "bad Unicode"},
	}
	sAll := ""
	for _, u8 := range chs {
		sAll = u8.s + sAll
	}

	for _, u8 := range chs {
		s := u8.s
		fmt.Printf("%s: '%s' len(): %d RuneCountInString(): %d ValidString(): %v\n", u8.desc,
			s,
			len(s),
			utf8.RuneCountInString(s),
			utf8.ValidString(s))
	}
	ps := []string{}
	for chPos, rune := range sAll {
		_ = rune
		ps = append(ps, strconv.Itoa(chPos))
	}
	rune, byteSize := utf8.DecodeRuneInString(sAll[1:])
	fmt.Printf("rune %d, byteSize %d := utf8.DecodeRuneInString()\n", rune, byteSize)
	fmt.Printf("string(rune) %s\n", string(97))
	fmt.Printf("range: %s\n", strings.Join(ps, ",\x20"))
	fmt.Println("Valid([]byte) ValidRune(rune) ValidString(string)")
	fmt.Println("RuneCount([]byte) RuneCountInString(string)")
}

/*
var goTypes map[string]func(){
	{"bool", nil},
	{""}
}
*/
var typeSwitch = `
switch i := x.(type) {
case nil:
	printString("x is nil")                // type of i is type of x (interface{})
case bool,int,float64,string:
case func(int) float64:
default:
}`[1:]

func typeStringConversion() {
	fmt.Printf("%T %#[1]v '%[1]s'\n", reflect.TypeOf(3))
	fmt.Printf("%T %#[1]v\n", reflect.TypeOf(3).String())
}

func stringConversion() {

	// bool
	b := true
	//printValue("bool.(type)", b.(type))
	printValue("strconv.FormatBool(bool)", strconv.FormatBool(b))
	printValue("fmt.Sprintf(\"%t\", bool)", fmt.Sprintf("%t", b))
	printTypeAndValue("bool", b)
	// printValue("bool.String()", b.String()) b.String undefined (type bool has no field or method String)
	//printValue("%s bool", fmt.Sprintf("%s", b)) Sprintf format %s has arg b of wrong type bool
	//printValue("string(bool)", string(b)) cannot convert b (type bool) to type string

	// int
	i := 5
	printValue("string(int)", string(i))
	printValue("strconv.Itoa(int)", strconv.Itoa(i))
	printValue("fmt.Sprintf(\"%d\", int)", fmt.Sprintf("%d", i))

	// TODO complex128
	// TODO uintptr
	//ar := [1]{5}
}

func printValue(heading string, v string) {
	fmt.Printf("%s → %T %#[2]v\n", heading, v)
}

func printTypeAndValue(heading string, v interface{}) {
	fmt.Printf("fmt.Sprintf(\"%%T %%#[1]v\", %s) → %s\n", heading, fmt.Sprintf("%T %#[1]v", v))
}

func f(fn func()) string {
	fn()
	return ""
}
