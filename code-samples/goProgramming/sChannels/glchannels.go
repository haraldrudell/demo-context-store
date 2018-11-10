/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.

Go Concurrency Patterns: Context
https://blog.golang.org/context
https://golang.org/pkg/context/

uses AWS variable values: S3Bucket s3.Private
JSON: json.NewDecoder
io.LimitReader
1. separate goroutine for each JSON array element, 1M r/s: need to cap number of goroutines
2. send array elements via channel to a uploading goroutine
3. workers send their cannels on a channel
http://marcio.io/2015/07/handling-1-million-requests-per-minute-with-golang/

https://stackoverflow.com/questions/43692778/shall-we-run-a-goroutine-for-every-async-request-even-when-they-are-spawned-fro
*/
package main

import "context"

// A Context carries a deadline, cancelation signal, and request-scoped values
// across API boundaries. Its methods are safe for simultaneous use by multiple
// goroutines.
type Context interface {
	// Done returns a channel that is closed when this Context is canceled
	// or times out.
	Done() <-chan struct{}

	// Err indicates why this context was canceled, after the Done channel
	// is closed.
	Err() error

	// Deadline returns the time when this Context will be canceled, if any.
	Deadline() (deadline time.Time, ok bool)

	// Value returns the value associated with key or nil if none.
	Value(key interface{}) interface{}
}

func myHandler(w http.ResponseWriter, r *http.Request) {
	go func(w http.ResponseWriter, r *http.Request) {
			// There's no advantage to this
	}(w,r)
}
func myHandler(w http.ResponseWriter, r *http.Request) {
wg := &sync.WaitGroup{}
wg.Add(2)
go func() {
		defer wg.Done()
		/* query a remote API */
}()
go func() {
		defer wg.Done()
		/* query a database */
}()
wg.Wait()
// finish handling the response
}
func myHandler(w http.ResponseWriter, r *http.Request) {
// handle request
w.Write( ... )
go func() {
		// Log the request, and send an email
}()
}

func main() {

}
