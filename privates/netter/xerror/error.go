/*
Package xerror provides comprehesive error messages and data

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.

implements: type error interface{Error() string}
*/
package xerror

import (
	"errors"
	"fmt"
	"strings"

	"github.com/haraldrudell/netter/namedstrs"
)

// New Create elaborate error
func New(message string) *Data {
	s, _ := namedstrs.Create("", nil)
	return &Data{message, *s, []error{}}
}

// String get string value of Error
func String(e error) string {
	eData, ok := e.(*Data)
	if !ok {
		return fmt.Sprintf("%T: %s\n", e, e.Error())
	}

	if len(eData.cause) == 0 {
		return eData.Error()
	}
	result := []string{e.Error()}
	for _, e := range eData.cause {
		if !eData.Keys.IsEmpty() {
			result = append(result, eData.Keys.GetLines(indent))
		}
		result = append(result, indent+"cause: Error:"+strings.Replace(String(e), "\n", "\n"+indent, -1))
	}
	return strings.Join(result, "\n")
}

var indent = "\x20\x20"

// AppendCause add another causing Error object
func (ed *Data) AppendCause(e error) {
	if e == nil {
		return
	}
	ed.cause = append(ed.cause, e)
}

// AppendText add another causing Error object
func (ed *Data) AppendText(name string, value interface{}) error {
	return ed.Keys.Append(name, value)
}

// Data contains a string hierarchy and stack traces
type Data struct {
	line  string
	Keys  namedstrs.Strings
	cause []error
}

// Format describes how to format error output
type Format uint8

// Available formats
const (
	ONELINE Format = 0 // single line
	LF                 // multiple-lines, 2-space indent
)

func (ed *Data) Error() string {
	return ed.line
}

func (ed *Data) getError(format Format) string {
	if format == ONELINE {
		return ed.Error()
	}
	if format == LF {

	}
	panic(errors.New("Unknown format to getError"))
}
