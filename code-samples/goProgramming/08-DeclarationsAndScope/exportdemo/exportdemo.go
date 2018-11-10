/*
Package exportdemo tests exports
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package exportdemo

type private struct {
	privateField int
	PublicField  int
}

func (*private) privateMethod() {}
func (*private) PublicMethod()  {}

// Public holds no data
type Public struct {
	privateField int
	PublicField  private
}

func (*Public) privateMethod() {}

// PublicMethod does nothing
func (*Public) PublicMethod() {}
