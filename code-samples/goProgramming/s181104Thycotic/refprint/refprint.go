/*
Package refprint prints JSON data to text
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package refprint

import (
	"fmt"
	"strconv"
	"strings"
)

// PrintJSON uses a reference to data
func PrintJSON(data interface{}) string {
	// d should be pointer to parsed JSON data
	fmt.Printf("PrintJSONValue type: %[1]T value: %#[1]v\n", data)

	// dereference the data
	dPointer, ok := data.(*interface{})
	if !ok {
		e := fmt.Errorf("PrintJSON: data is not pointer")
		panic(e)
	}
	d := *dPointer
	fmt.Printf("dereferenced type: %[1]T value: %#[1]v\n", d)

	// boolean: true, false
	boolean, ok := d.(bool)
	if ok {
		fmt.Printf("boolean: type: %[1]T value: %#[1]v\n", boolean)
		return strconv.FormatBool(boolean)
	}

	// number
	float, ok := d.(float64)
	if ok {
		fmt.Printf("number: type: %[1]T value: %#[1]v\n", float)
		return strconv.FormatFloat(float, 'E', -1, 64)
	}

	// string
	str, ok := d.(string)
	if ok {
		fmt.Printf("string: type: %[1]T value: %#[1]v\n", str)
		return str
	}

	// null
	if d == nil {
		fmt.Printf("null: type: %[1]T value: %#[1]v\n", d)
		return "null"
	}

	// array
	array, ok := d.([]interface{})
	if ok {
		var ss []string
		for i, v := range array {
			fmt.Printf("index %d: type: %[2]T value: %#[2]v\n", i, v)
			value := PrintJSON(&v)
			_ = value // TODO
		}
		return fmt.Sprintf("[\n%s\n]", strings.Join(ss, "\n"))
	}

	// object
	mapp, ok := d.(map[string]interface{})
	if ok {
		fmt.Printf("object of %d keys\n", len(mapp))
		var ss []string
		i := 0
		for key, v := range mapp {
			fmt.Printf("key #%d '%s': unparsed: type: %[3]T value: %#[3]v\n", i, key, v)
			value := PrintJSON(&v)
			_ = value // TODO
			i++
		}
		fmt.Printf("end of object\n")
		return fmt.Sprintf("[\n%s\n]", strings.Join(ss, "\n"))
	}

	fmt.Printf("illegal value: %[1]T value: %#[1]v\n", d)
	return "<illegal value>"
}
