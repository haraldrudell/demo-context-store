/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync/atomic"
	"time"

	"github.com/INFURA/project-harald-rudell/blocktime"
	"github.com/INFURA/project-harald-rudell/fetcher"
	"github.com/gorilla/mux"
)

var infura *fetcher.EndPoint
var rq = uint64(0)
var ec = uint64(0)

func main() {
	i, e := blocktime.GetEndPoint()
	if e != nil {
		log.Fatal(e)
	}
	infura = i

	router := mux.NewRouter()
	router.HandleFunc("/", get).Methods("GET")
	go tickLog()
	s := ":8000"
	log.Printf("Listening at '%s': ^C to exit…", s)
	log.Fatal(http.ListenAndServe(s, router))
}

func get(w http.ResponseWriter, r *http.Request) {
	result, e := infura.EthGetLastBlock()
	if e == nil {
		e = json.NewEncoder(w).Encode(result)
	}
	if e != nil {
		atomic.AddUint64(&ec, 1)
		es := fmt.Sprintf("Error: %s", e)
		log.Println(es)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(es))
	}
	atomic.AddUint64(&rq, 1)
}

func tickLog() {
	ticker := time.NewTicker(time.Second)
	lastValue := uint64(0)
	lastE := uint64(0)
	isFirst := true
	for {
		select {
		case <-ticker.C:
			if isFirst {
				isFirst = false
				log.Println("First tick - 1 s")
			}
			newValue := atomic.LoadUint64(&rq)
			newE := atomic.LoadUint64(&ec)
			if newValue != lastValue {
				s := fmt.Sprintf("Requests per second: %d", newValue-lastValue)
				if lastE != newE {
					s += fmt.Sprintf(" errors: %d", newE-lastE)
					lastE = newE
				}
				log.Println(s)
			}
			lastValue = newValue
		}
	}
}
