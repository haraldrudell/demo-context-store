/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
// Package namedstrs collects a hierarchy of named strings
package namedstrs

import (
	"errors"
	"fmt"
	"strings"
)

// Create create a named string, value: string or *Strings
func Create(name string, value interface{}) *Strings {
	names := []named{}
	if name != "" { // empty key means empty result
		names = []named{createName(name, value)}
	}
	return &Strings{names}
}

// Append add a named string
func (s *Strings) Append(name string, value interface{}) *Strings {
	s.strings = append(s.strings, createName(name, value))
	return s
}

var newLine = "\n"

// GetLines assemble strigns with indentation ad newlines
func (s *Strings) GetLines(indent string) string {
	return strings.Join(getSlice([]string{}, s.strings, indent), newLine)
}

var indent = "\x20\x20"

func getSlice(result []string, list []named, thisIndent string) []string {
	for _, aNamed := range list {
		thisHeading := thisIndent + aNamed.name + ":"
		if str, ok := aNamed.value.(string); ok {
			if len(str) > 0 {
				str = "\x20" + str
			}
			result = append(result, thisHeading+str)
		} else if pts, ok := aNamed.value.(*Strings); ok {
			result = getSlice(append(result, thisHeading), pts.strings, thisIndent+indent)
		} else {
			panic(errors.New("Bad strings value"))
		}
	}
	return result
}

// IsEmpty determine if no text lines exist
func (s *Strings) IsEmpty() bool {
	return len(s.strings) == 0
}

// Strings a list of names, each value a strings or pointer to Strings
type Strings struct {
	strings []named
}

func createName(name string, value interface{}) named {
	if _, ok := value.(string); !ok { // may need conversion
		_, ok := value.(*Strings) // should not be converted
		if value == nil || !ok {
			value = fmt.Sprintf("%T %#[1]v", value)
		}
	}
	return named{name, value}
}

type named struct {
	name  string
	value interface{} // string, *StringTree
}
