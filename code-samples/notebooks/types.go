/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package main

import (
	"log"
	"time"
)

func main() {
	/*
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
	rawString := `abc`
	string := "a\nb"
	if booleanLiteral && decimalLiteral+octalLiteral+hexLiteral != 0 && imaginary != 0 && runes[0] != runes[1] && rawString+string != "" {
	}
	log.Printf("Binomial took %s", time.Since(start)) // 157 ns, ie. 5 ns per line
}
