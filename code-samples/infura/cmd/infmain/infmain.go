/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package main

import (
	"fmt"

	"github.com/INFURA/project-harald-rudell/blocktime"
)

func main() {
	fmt.Println("infmain 0.0.1 Retrieve data from Ethereum via Infura")
	fmt.Println(blocktime.Fetch())
}
