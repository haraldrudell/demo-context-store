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

// PriorityQueueInt is a queue of entities in a specific order
type PriorityQueueInt struct {
	PriorityQueue
}

// New instantiuates a PriorityQueue for int
func New() *PriorityQueueInt {
	pqi := &PriorityQueueInt{PriorityQueue{isGreater: isGreaterInt}}
	return pqi
}

// Insert adds int to the priority queue
func (pqi *PriorityQueueInt) Insert(value int) *PriorityQueueInt {
	pqi.PriorityQueue.Insert(value)
	return pqi
}

// Get int from priority queue
func (pqi *PriorityQueueInt) Get() (int, bool) {
	var v int
	hasValue := len(pqi.PriorityQueue.queue) > 0
	if hasValue {
		v = pqi.PriorityQueue.Get().(int)
	}
	return v, hasValue
}

func isGreaterInt(a Value, b Value) bool {
	return a.(int) > b.(int)
}

func main() {
	pq := New().Insert(3).Insert(2).Insert(1)
	fmt.Print("Priority Queue:")
	for i, hasValue := pq.Get(); hasValue; i, hasValue = pq.Get() {
		fmt.Printf(" %v", i)
	}
	fmt.Println()
}
