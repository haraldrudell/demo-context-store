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

type a struct {
	a int
}

type b struct {
	b int
}

func (b) String() string {
	return "thisB"
}

func main() {
	fmt.Printf("netter 0.0.1\n\n")

	fmt.Println(a{})
	fmt.Println(b{})
	//fmt.Printf("string(b): %T %#[1]v\n", string(b{})) cannot convert b literal (type b) to type string

	fmt.Println("Information provided by a built-in error:")
	if e := fails(); e != nil {
		fmt.Println(e)
	}

	fmt.Println("\nExtended error data from an xerror:")
	if e := extendedError(); e != nil {
		fmt.Println(e)
	}
}

func extendedError() error {
	if e := fails(); e != nil {
		return xerror.New("Problem during fails function: "+e.Error()).
			AppendCause(e).
			AppendText("Creating user", namedstrs.Create("user ID", "123"))
	}
	return nil
}

func fails() error {
	return errors.New("Some error")
}
