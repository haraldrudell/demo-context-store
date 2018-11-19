/*
Package fetcher gets the last block from Ethereum mainnet

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package fetcher

import (
	"net/http"
	"strings"
)

// issues a post request ad returs the result value as JSONData from the response
func (infura *EndPoint) issuePost(method string, params []interface{}) (*JSONData, error) {
	rqID := id
	rqBody, e := (&JSONRPCRequest{
		aJSONRpcVersion,
		method,
		rqID,
		params,
	}).ToJSON()
	if e != nil {
		return nil, e
	}

	// issue post request
	id++
	reader := strings.NewReader(string(rqBody))
	resp, err := http.Post(infura.url, applicationJSON, reader)
	if err != nil { // resp: *http.Response
		return nil, err
	}

	// verify jsonrpc and id in JSON response into data
	body := resp.Body // body: io.Reader
	defer body.Close()
	ps := &ParsifySteps{
		"Parsing body",
		nil,
		0,
		[]ParsifyStep{
			{"VerifyStringProperty", "jsonrpc", aJSONRpcVersion, nil},
			{"VerifyNumberProperty", "id", float64(rqID), nil},
			{"EnterKey", "result", nil, nil},
		},
	}
	return ps.ParsifyReader(body)
}
