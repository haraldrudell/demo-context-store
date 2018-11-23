/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.

/opt/foxyboy/sw/pri/code-samples/goProgramming
go run 02-LexcialElements/glliterals.go

1. literals

1.1 basic literals
- integer, floating-point, imaginary rune or string literals
- octal, decimal or hexadecimal integer literals
- raw or interpreted string literals

1.2 composite literal
Constructs values for structs, arrays, slices and maps
- struct, array, slice and map literals
composite type name and values enclosed in braces
[...]int{1} array
[]int{1} slice

1.3 function literal
Represents an anonymous function.
Function literals are closures
- a function literal is an expression and has no function name but does have signature and body
- a function literal is used to create a closure and a function inside a function declaration
- a function declaration has a fuction name, signature and may have function body
- a function declaration implements a function or declares the signature of a function outside of Go
- a function type literal is func and signature, no function name or body
- a function type literal is used to store function values
func(…) [return value] {…}

1.4 type literal
composes a type from existing types
array struct pointer function interface slice map channel
used in a type declaraion: type T [1]int
array: [1]int
struct: struct{x int}
pointer: *int
function: func(…) int
interface: interface{Fn()}
slice: []int
map: map[int]int
channel: chan <- int // send int
*/

package main

func main() {

}
