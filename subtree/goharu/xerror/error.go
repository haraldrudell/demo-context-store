/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.

implements: type error interface{Error() string}
*/
// Package xerror provides comprehesive error messages and data
package xerror

import (
	"errors"
	"fmt"
	"strings"

	"github.com/haraldrudell/goharu/namedstrs"
)

// New Create elaborate error
func New(message string) *Data {
	return &Data{message, *namedstrs.Create("", nil), []error{}}
}

// String get string value of Error
func (ed *Data) String() string {

	/*
		// print things that are not xerror
		eData, ok := e.(*Data)
		if !ok {
			result := e.Error()
			if typeName := fmt.Sprintf("%T", e); typeName != "*errors.errorString" {
				result = typeName + ": " + result
			}
			return result
		}
	*/
	// xerror basic Error string
	result := []string{ed.line}

	// xerror string tree
	if !ed.Keys.IsEmpty() {
		result = append(result, ed.Keys.GetLines(indent))
	}

	// xerror cause: list of underlying errors
	useCauseNumber := len(ed.cause) > 0
	for id, e := range ed.cause {
		cause := indent + "cause"
		if useCauseNumber {
			cause += " " + string(id+1)
		}
		cause += ": Error: "

		// print typename for custom errors
		if _, ok := e.(*Data); !ok {
			if typeName := fmt.Sprintf("%T", e); typeName != "*errors.errorString" {
				cause += typeName + ": "
			}
		}
		result = append(result, cause+strings.Replace(e.Error(), "\n", "\n"+indent, -1))
	}

	return strings.Join(result, "\n")
}

var indent = "\x20\x20"

// AppendCause add another causing Error object
func (ed *Data) AppendCause(e error) *Data {
	if e != nil {
		ed.cause = append(ed.cause, e)
	}
	return ed
}

// AppendText add another causing Error object
func (ed *Data) AppendText(name string, value interface{}) *Data {
	if len(name) > 0 {
		ed.Keys.Append(name, value)
	}
	return ed
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
	return ed.String()
}

func (ed *Data) FormatError(format Format) string {
	if format == ONELINE {
		return ed.Error()
	}
	if format == LF {

	}
	panic(errors.New("Unknown format to getError"))
}
