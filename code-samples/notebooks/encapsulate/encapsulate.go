/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package main

import (
	"fmt"

	e "../encapsulation"
)

func main() {
	c := e.GetCircle(3) // 3*3 * 3.14 => 28
	//c.secret() c.secret undefined (cannot refer to unexported field or method secret)
	// if e.One == e.two {}

	fmt.Printf("Shape calculation: %d %d\n", c.Area(), // Shape calculation: 28 1
		e.One,
		//e.two, cannot refer to unexported name encapsulation.two
	)
}
