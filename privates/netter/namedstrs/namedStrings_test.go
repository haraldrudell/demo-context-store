/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.

implements: type error interface{Error() string}
*/
package namedstrs

import (
	"fmt"
	"testing"
)

func TestCreate(t *testing.T) {
	expected := named{"Name", "Value"}
	s := Create(expected.name, expected.value)

	if len(s.strings) != 1 ||
		s.strings[0].name != expected.name ||
		s.strings[0].value != expected.value {
		fmt.Printf("Create failed\n")
		t.Fail()
	}

	expected2 := "Name2"
	s2 := Create(expected2, s)

	if len(s.strings) != 1 ||
		s2.strings[0].name != expected2 ||
		s2.strings[0].value != s {
		fmt.Printf("Create with pointer failed\n")
		t.Fail()
	}
}

func TestAppend(t *testing.T) {
	expected := named{"Name", "Value"}
	s := Create(expected.name, expected.value)

	if len(s.strings) != 1 ||
		s.strings[0].name != expected.name ||
		s.strings[0].value != expected.value {
		fmt.Printf("Append Create failed\n")
		t.Fail()
	}

	expected2 := named{"Name2", "Value2"}
	s.Append(expected2.name, expected2.value)

	if len(s.strings) != 2 ||
		s.strings[1].name != expected2.name ||
		s.strings[1].value != expected2.value {
		fmt.Printf("Append failed\n")
		t.Fail()
	}
}

func TestGetLines(t *testing.T) {
	n1 := "Name"
	n2 := "Name2"
	v2 := "Value"
	expected :=
		n1 + ":\n" +
			"\x20\x20" + n2 + ": " + v2

	s2 := Create(n2, v2)
	s := Create(n1, s2)

	actual := s.GetLines("")

	if actual != expected {
		fmt.Printf("GetLines failed:\na: \x27" + actual + "\x27\ne: \x27" + expected + "\x27\n")
		t.Fail()
	}
}
