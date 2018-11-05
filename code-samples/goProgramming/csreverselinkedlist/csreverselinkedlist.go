/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package main

import "fmt"

// Value entity stored in this LinkedList
type Value interface{}

type node struct {
	next  *node
	prev  *node
	value Value
}

// LinkedList contains a list of Value entities
type LinkedList struct {
	first *node
}

func (list *LinkedList) Append(value Value) *LinkedList {
	newNode := &node{value: value}
	n := list.first
	if n == nil { // the list was empty, insert as first
		list.first = newNode
	} else { // append to last item in n list

		// advance n to the last item in list
		for n.next != nil {
			n = n.next
		}

		// append to n
		n.next = newNode
		newNode.prev = n
	}
	return list
}

// Reverse a double-linked list
func (list *LinkedList) Reverse() *LinkedList {
	head := list.first // get items from head of this initial list
	next := head.next
	if next != nil { // more than 1 item: need to reverse
		// insert head items to front of this new tail list
		tail := head
		tail.next = nil
		for next != nil {
			head = next.next // next item in head

			// put next first in tail
			tail.prev = next
			next.next = tail
			tail = next

			next = head
		}
		tail.prev = nil
		list.first = tail
	}
	return list
}

func (L *LinkedList) String() string {
	s := "List:"
	for node := L.first; node != nil; node = node.next {
		v := node.value
		s += fmt.Sprintf(" value: %T %v", v, v)
	}
	return s
}

func main() {
	fmt.Println((&LinkedList{}).Append(1).Append(2).Append(3).Reverse().String())
}
