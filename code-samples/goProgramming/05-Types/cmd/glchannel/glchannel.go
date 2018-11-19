/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package main

import (
	"fmt"
	"sync"
)

/*
ChannelType = ( "chan" | "chan" "<-" | "<-" "chan" ) ElementType
chan <- bool: send only
<- chan bool
*/

func main() {

	// uninitialized channels
	{
		var unin chan bool
		// The value of an uninitialized channel is nil (chan bool)(nil)
		fmt.Printf("The value of an uninitialized channel is nil: %#v\n", unin)
	}

	// empty channel
	{
		// fatal error: all goroutines are asleep - deadlock!
		//<-make(chan bool)
		// fatal error: all goroutines are asleep - deadlock!
		//value, ok := <-make(chan bool)
		select {
		case <-make(chan bool):
		default:
			fmt.Printf("Empty channel\n")
		}
	}

	// closed channels
	{
		c := make(chan bool)
		close(c)
		// Receive from closed channel: false
		fmt.Printf("Receive from closed channel: %#v\n", <-c)
		value, ok := <-c
		// Receive from closed channel value, ok: false false
		fmt.Printf("Receive from closed channel value, ok: %#v %#v\n", value, ok) // send on closed channel: panic: send on closed channel
		//c <- true
	}

	// how to use sync.WaitGroup
	{
		var wg sync.WaitGroup // counter is initially zero
		wg.Wait()             // wait for counter zero
		fmt.Printf("WaitGroup was zero\n")
		wg.Add(1)
		go func() {
			defer wg.Done()
			fmt.Printf("Goroutine terminating\n")
		}()
		wg.Wait()
		fmt.Printf("Goroutine terminated\n")
	}

	// sync.WaitGroup
	{
		worker := func(wg *sync.WaitGroup) {
			defer wg.Done()
			fmt.Printf("arg: Goroutine terminating\n")
		}
		var wg sync.WaitGroup // counter is initially zero
		wg.Add(1)
		go worker(&wg)
		wg.Wait()
		fmt.Printf("arg: Goroutine terminated\n")
	}

	// buffered channel
	{
		c := make(chan int, 2)
		c <- 1
		close(c)
		for i := range c {
			fmt.Printf("Received: %d\n", i)
		}
		fmt.Printf("Buffered channel closed\n")
	}

	// Workers with buffered channel
	{
		worker := func(workerID int, wg *sync.WaitGroup, work chan string) {
			defer wg.Done()
			for data := range work {
				fmt.Printf("worker %d: work: %s\n", workerID, data)
			}
		}

		buffer := 2
		workerCount := 2
		var wg sync.WaitGroup
		work := make(chan string, buffer)
		for i := 0; i < workerCount; i++ {
			wg.Add(1)
			go worker(i, &wg, work)
		}
		work <- "one" // worker 1: work: one
		close(work)
		wg.Wait()
		fmt.Printf("Buffered: workers terminated\n")
	}
}
