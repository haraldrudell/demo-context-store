/*
Package fetcher gets the last block from Ethereum mainnet

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package fetcher

import (
	"fmt"

	infuraClient "github.com/INFURA/project-harald-rudell/client"
	"github.com/INFURA/project-harald-rudell/client/operations"
)

// Fetch gets last block time from Ethereum mainnet
func Fetch() (int, error) {
	fmt.Printf("Preparing… ")
	c := infuraClient.Default.Operations
	params := operations.NewGetV1JsonrpcNetworkMethodParams().
		WithNetwork("mainnet").
		WithMethod("eth_getBlockByNumber").
		WithParams([]string{"latest"})

	fmt.Printf("Issuing Request\n")
	resp, err := c.GetV1JsonrpcNetworkMethod(params)
	if err != nil {
		panic(err)
	}
	// resp is *GetV1JsonrpcNetworkMethodOK
	fmt.Printf("Response: %#[1]v", *resp)
	return 1, nil
}
