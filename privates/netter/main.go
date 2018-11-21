/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package main

import (
	"errors"
	"fmt"

	"github.com/haraldrudell/netter/namedstrs"

	"github.com/haraldrudell/netter/xerror"
)

func main() {
	if e := fails(); e != nil {
		e2 := xerror.New("main function: fails failed")
		e2.AppendCause(e)
		key2, _ := namedstrs.Create("key2", "value2")
		//e2.Append("a", "b")
		e2.AppendText("key", key2)
		fmt.Printf("Regular error: %s\n", e)
		fmt.Printf("%s\n", xerror.String(e2))
	}
	var f error
	_ = f
}

func fails() error {
	return errors.New("Fails fails")
}
