/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package main

import "fmt"

func main() {
	list := []int{1, 3, 4, 2}
	for a := 0; a < len(list)-1; a++ {
		for b := a + 1; b < len(list); b++ {
			if list[a] > list[b] {
				c := list[a]
				list[a] = list[b]
				list[b] = c
			}
		}
	}
	fmt.Printf("%v\n", list)
}
