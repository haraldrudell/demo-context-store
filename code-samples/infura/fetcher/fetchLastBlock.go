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
	httptransport "github.com/go-openapi/runtime/client"
)

// Fetch gets last block time from Ethereum mainnet
func Fetch() (int, error) {
	fmt.Printf("Preparing… ")

	useDebug := true
	var c *operations.Client // from client/operations/operations_client.go
	if useDebug {
		cfg := infuraClient.DefaultTransportConfig()
		transport := httptransport.New(cfg.Host, cfg.BasePath, cfg.Schemes)
		transport.SetDebug(true)
		ic := infuraClient.New(transport, nil)
		c = ic.Operations
	} else {
		c = infuraClient.Default.Operations
	}
	// c.transport.SetDebug(true)
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
