/*
Package fetcher gets the last block from Ethereum mainnet

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package fetcher

// Block contains data of the last Ethereum block
type Block struct {
	TimeStamp   uint64
	BlockNumber uint64
}

// EthGetLastBlock https://infura.io/docs/ethereum/json-rpc/eth_getBlockByNumber
func (infura *EndPoint) EthGetLastBlock() (*Block, error) {
	// exeute post request
	result, e := infura.issuePost("eth_getBlockByNumber", []interface{}{"latest", false})
	if e != nil {
		return nil, e
	}

	// get timestamp ad block number
	block := Block{}
	ps := &ParsifySteps{
		"Parsing result",
		result,
		0,
		[]ParsifyStep{
			{"StoreNumber", "timestamp", nil, &block.TimeStamp},
			{"StoreNumber", "number", nil, &block.BlockNumber},
		},
	}
	return &block, ps.Parsify()
}
