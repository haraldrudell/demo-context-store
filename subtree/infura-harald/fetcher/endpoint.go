/*
Package fetcher gets the last block from Ethereum mainnet

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package fetcher

import (
	"errors"
	"fmt"
	"strings"
)

// New create endpoint object
func New(network string, projectID string) (*EndPoint, error) {
	if network == "" {
		network = networks[0]
	} else {
		isOk := false
		for _, nw := range networks {
			if nw == network {
				isOk = true
				break
			}
		}
		if !isOk {
			return nil, fmt.Errorf("Unknown network, available: %s", strings.Join(networks, ", "))
		}
	}

	if len(projectID) == 0 {
		return nil, errors.New("projectID caot be empty")
	}

	return &EndPoint{fmt.Sprintf("https://%s.infura.io/v3/%s", network, projectID)}, nil
}

// EndPoint provides API requests
type EndPoint struct {
	url string
}

var networks = []string{
	"mainnet",
	"ropsten",
	"kovan",
	"rinkeby",
}

var applicationJSON = "application/json"
var aJSONRpcVersion = "2.0"

var id = int64(0)
