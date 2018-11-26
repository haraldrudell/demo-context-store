/*
Package fetcher gets the last block from Ethereum mainnet

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package fetcher

import "encoding/json"

// JSONRPCRequest Infura json-rpc format
type JSONRPCRequest struct {
	JSONRPC string        `json:"jsonrpc"`
	Method  string        `json:"method"`
	ID      int64         `json:"id"`
	Params  []interface{} `json:"params"`
}

// ToJSON marshals a JSONRPCRequest into JSON for a post request body
func (req *JSONRPCRequest) ToJSON() ([]byte, error) {
	return json.Marshal(req)
}
