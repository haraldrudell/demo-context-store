/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package fetcher

import (
	"fmt"
	"testing"
)

func TestMain(*testing.T) {
	actual, e := Fetch()
	if e != nil {
		panic(e)
	}
	fmt.Printf("actual: %#v\n", actual)
}
