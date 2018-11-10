/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.


*/
package main

import "github.com/haraldrudell/08-DeclarationsAndScope/exportdemo"

func main() {
	// cannot refer to unexported name exportdemo.pri
	//var pri exportdemo.pri

	var pub exportdemo.Public
	// compile-time: pub.privateField undefined (cannot refer to unexported field or method privateField)
	//_ = pub.privateField

	_ = pub.PublicField
	_ = pub.PublicField.PublicField

	// compile-time: 	// compile-timepub.privateField undefined (cannot refer to unexported field or method privateField)
	//_ = pub.PublicField.privateField

	pub.PublicMethod()

	// compile-time: pub.privateMethod undefined (cannot refer to unexported field or method exportdemo.(*Public).privateMethod)
	//pub.privateMethod()

	pub.PublicField.PublicMethod()

	// compile-time: pub.PublicField.privateMethod undefined (cannot refer to unexported field or method exportdemo.(*private).privateMethod)
	//pub.PublicField.privateMethod()
}
