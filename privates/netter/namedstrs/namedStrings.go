/*
Package namedstrings collects a hierarchy of named strings
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.

implements: type error interface{Error() string}
*/
package namedstrs

import (
	"errors"
	"strings"
)

// Create create a named string, value: string or *Strings
func Create(name string, value interface{}) (*Strings, error) {
	if name == "" {
		return &Strings{[]named{}}, nil
	}
	ptName, e := createName(name, value)
	if e != nil {
		return nil, e
	}
	return &Strings{[]named{*ptName}}, nil
}

// Append add a named string
func (s *Strings) Append(name string, value interface{}) error {
	ptName, e := createName(name, value)
	if e != nil {
		return e
	}
	s.strings = append(s.strings, *ptName)
	return nil
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

func createName(name string, value interface{}) (*named, error) {
	if _, ok := value.(string); ok {
		return &named{name, value}, nil
	}
	if value != nil {
		if ptStrings, ok := value.(*Strings); ok {
			return &named{name, ptStrings}, nil
		}
	}
	return nil, errors.New("Bad value argument: not string or pointer to Strings")
}

type named struct {
	name  string
	value interface{} // string, *StringTree
}
