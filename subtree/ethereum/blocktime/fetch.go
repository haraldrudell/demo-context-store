/*
Package fetcher gets the last block from Ethereum mainnet

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package blocktime

import (
	"time"

	"golang.org/x/text/language"
	"golang.org/x/text/message"

	"github.com/INFURA/project-harald-rudell/fetcher"
)

// Fetch gets last block time from Ethereum mainnet
func Fetch() string {

	// get endpoint
	infura, e := GetEndPoint()
	if e != nil {
		panic(e)
	}

	// execute Ethereum get last block
	result, e := infura.EthGetLastBlock()
	if e != nil {
		panic(e)
	}

	// print block number and pacific time stamp
	location, e := time.LoadLocation("America/Los_Angeles")
	if e != nil {
		panic(e)
	}
	t := time.Unix(int64(result.TimeStamp), 0)
	p := message.NewPrinter(language.English)
	return p.Sprintf("Last block number: %d time stamp: %s", result.BlockNumber, t.In(location))
}

// GetEndPoint instatiates infura api
func GetEndPoint() (*fetcher.EndPoint, error) {
	return fetcher.New("", "e94f0902d1e64226bbad1fb202186e30")
}
