/*
Package encapsulation exhibits Golang encapsulation
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.

Encapsulation in go is by hiding declaration inside a package

A package consists of files in a particular directory
All files in a particular directory must belong to the same package
Only upper case identifiers are exported from a package
- First character upper case and
- Declared in the package block or it is a field or method name
The scope of the package name is the file block
*/
package encapsulation

import (
	"math"
)

// One is an exported field
// One := 1 syntax error: non-declaration statement outside function body
var One = 1
var two = 2

// If is a public interface
type If interface {
	Area() uint
	// c.secret undefined (cannot refer to unexported field or method secret)
	secret()
}

type circle struct {
	radius uint
}

func (c circle) Area() uint {
	return uint(math.Pow(float64(c.radius), 2) * math.Pi)
}

func (c circle) secret() {}

type square struct {
	side uint
}

func (s square) area() uint {
	f := float64(s.side)
	return uint(math.Pow(f, f))
}

// GetCircle factory method
func GetCircle(radius uint) If {
	return circle{radius: radius}
}
