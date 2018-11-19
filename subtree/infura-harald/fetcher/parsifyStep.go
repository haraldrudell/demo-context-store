/*
Package fetcher gets the last block from Ethereum mainnet

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package fetcher

import (
	"fmt"
)

// ParsifyStep instructions for parsing JSON
type ParsifyStep struct {
	fn            string
	parameter     string
	value         interface{}
	storeLocation interface{} // pointer to something
}

// ParsifyJSON run a Parsify list
func (s *ParsifyStep) verifyStringProperty(ps *ParsifySteps) error {
	pStr := ps.data.GetStringProperty(s.parameter)
	strValue, ok := s.value.(string)
	if pStr == nil || !ok || *pStr != strValue {
		return ps.getError(fmt.Sprintf("bad value for %s", s.parameter))
	}
	return nil
}

func (s *ParsifyStep) verifyNumberProperty(ps *ParsifySteps) error {
	pf := ps.data.GetNumberProperty(s.parameter)
	value, ok := s.value.(float64)
	if pf == nil || !ok || *pf != value {
		return ps.getError(fmt.Sprintf("bad value for %s", s.parameter))
	}
	return nil
}

func (s *ParsifyStep) enterKey(ps *ParsifySteps) error {
	pf := ps.data.EnterKey(s.parameter)
	if pf == nil {
		return ps.getError(fmt.Sprintf("key not found: '%s'", s.parameter))
	}
	return nil
}

func (s *ParsifyStep) storeNumber(ps *ParsifySteps) error {
	pf := ps.data.GetHexProperty(s.parameter) // hex string to *uint64
	if pf != nil {
		ptr, ok := s.storeLocation.(*uint64)
		if ok {
			*ptr = *pf
			return nil
		}
	}
	return ps.getError(fmt.Sprintf("failed to store number: '%s'", s.parameter))
}
