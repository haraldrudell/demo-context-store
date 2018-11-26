/*
Package fetcher gets the last block from Ethereum mainnet

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package fetcher

import (
	"fmt"
	"io"
)

// ParsifyReader instatiate and parsify
func (ps *ParsifySteps) ParsifyReader(reader io.Reader) (*JSONData, error) {
	data, e := Parse(reader)
	if e != nil {
		return nil, e
	}
	ps.data = data
	return data, ps.Parsify()
}

// ParsifySteps instructions for parsing JSON
type ParsifySteps struct {
	heading string
	data    *JSONData
	no      int
	steps   []ParsifyStep
}

// Parsify run a Parsify list
func (ps *ParsifySteps) Parsify() error {
	var e error

	for no, step := range ps.steps {
		ps.no = no + 1
		switch step.fn {
		case "VerifyStringProperty":
			e = step.verifyStringProperty(ps)
		case "VerifyNumberProperty":
			e = step.verifyNumberProperty(ps)
		case "EnterKey":
			e = step.enterKey(ps)
		case "StoreNumber":
			e = step.storeNumber(ps)
		default:
			return ps.getError(fmt.Sprintf("unkown function: '%s'", step.fn))
		}
		if e != nil {
			break
		}
	}
	return e
}

func (ps *ParsifySteps) getError(s string) error {
	return fmt.Errorf("%s step %d: %s", ps.heading, ps.no, s)
}
