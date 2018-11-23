/*
Package text facilitiates formatted output

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package text

import (
	"errors"
	"fmt"
	"strconv"
)

// New create a new Text
func New() *Text {
	return &Text{0, 0, newFns("QQ")}
}

// Text a text of sections, subsections ad paragraphs
type Text struct {
	no    uint
	subno uint
	fns   fnCache
}

// P is a list of text lines
type P []string

// Fn a function that can print to stdout inline
type Fn func()

// S starts a new section
func (t *Text) S(heading string, p P) *Text {
	t.no++
	if t.no != 1 {
		fmt.Println()
	}
	fmt.Printf("%d %s\n", t.no, heading)
	t.subno = 0
	return t.process(p)
}

func (t *Text) process(p P) *Text {
	marker := t.fns.getMarker()
	for _, s := range p {
		if len(s) < len(marker) || s[0:len(marker)] != marker {
			fmt.Println(s)
		} else {
			t.fns.execute(s)
		}
	}
	return t
}

// Sub starts a new subsection
func (t *Text) Sub(heading string, p P) string {
	fn := func() {
		t.subno++
		fmt.Printf("\n%d.%d %s\n", t.no, t.subno, heading)
		t.process(p)
	}
	return t.fns.add(fn)
}

// F defers invokes a function
func (t *Text) F(fn func()) string {
	return t.fns.add(fn)
}

func newFns(marker string) fnCache {
	return fnCache{marker, 0, map[fnKey]Fn{}}
}

type fnCache struct {
	marker string
	nextid uint
	fns    map[fnKey]Fn
}

type fnKey string

func (f *fnCache) newID() fnKey {
	id := f.nextid
	f.nextid++
	return fnKey(f.marker + strconv.FormatUint(uint64(id), 10))
}

func (f *fnCache) add(fn Fn) string {
	ID := f.newID()
	f.fns[ID] = fn
	return string(ID)
}

func (f *fnCache) getMarker() string {
	return f.marker
}

func (f *fnCache) execute(key string) {
	fn := f.fns[fnKey(key)]
	if fn == nil {
		panic(errors.New("fnCache.execute: unknown fnKey"))
	}
	fn()
}
