/*
Package fetcher gets the last block from Ethereum mainnet

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package fetcher

import (
	"fmt"

	"github.com/INFURA/project-harald-rudell/client"
)

// Fetch gets last block time from Ethereum mainnet
func Fetch() (int, error) {
	fmt.Printf("Creating client\n")
	infuraClient := client.NewHTTPClient()
	return infuraClient, nil
}
