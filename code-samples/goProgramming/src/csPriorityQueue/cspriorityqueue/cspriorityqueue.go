/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package main

import "fmt"

// Value entity stored in the PriorityQueue
type Value interface{}

type isGreaterFunc func(a Value, b Value) bool

// PriorityQueue is a queue of entities in a specific order
type PriorityQueue struct {
	queue     []Value
	isGreater isGreaterFunc
}

// Get fetches the next item from a priority queue
func (pq *PriorityQueue) Get() Value {
	if len(pq.queue) < 1 {
		return nil
	}
	value := pq.queue[0]
	pq.queue = pq.queue[1:]
	return value
}

// Insert adds a Value entity to the priority queue
func (pq *PriorityQueue) Insert(value Value) *PriorityQueue {
	cf := pq.isGreater
	q := pq.queue
	i0 := 0
	i1 := len(q) - 1
	for i1 >= i0 {
		i2 := (i0 + i1) / 2
		if cf(q[i0], q[i2]) {
			i0 = i2 + 1
		} else {
			i1 = i2 - 1
		}
	}
	q = append(q, nil) // add zero at the end
	pq.queue = q
	copy(q[i0+1:], q[i0:]) // dst, src
	q[i0] = value
	return pq
}

func isGreaterInt(a Value, b Value) bool {
	return a.(int) > b.(int)
}

func main() {
	pq := &PriorityQueue{isGreater: isGreaterInt}
	pq.Insert(3).Insert(2).Insert(1)
	print("Priority Queue:")
	ii := 0
	for i := pq.Get(); i != nil; i = pq.Get() {
		i1 := i.(int)
		fmt.Printf(" %v", i1)
		ii++
		if ii > 4 {
			break
		}
	}
	println()
}
