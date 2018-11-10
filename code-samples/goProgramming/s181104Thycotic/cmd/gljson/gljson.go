/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.

bool, for JSON booleans
float64, for JSON numbers
string, for JSON strings
[]interface{}, for JSON arrays
map[string]interface{}, for JSON objects
nil for JSON null
*/
package main

import (
	"encoding/json" // Unmarshal(data []byte, v interface{}) error
	"fmt"

	"github.com/haraldrudell/s181104Thycotic/refprint"
	"github.com/haraldrudell/s181104Thycotic/valueprint"
)

func main() {
	// data is interface{} with runtime type pointer to JSON data
	data, e := getParsedJSON()
	if e != nil {
		fmt.Printf("getParsedJSON had error: %s\n", e)
		panic(e)
	}

	fmt.Printf("valueprint:\n")
	valueprint.PrintJSON(data)
	fmt.Printf("refprint:\n")
	refprint.PrintJSON(&data)
}

var jsonString = `{
	"_bool": true,
	"_float64": 1,
	"_string": "abc",
	"_array": [
		true
	],
	"_nil": null
}`

func getParsedJSON() (interface{}, error) {

	// convert the raw string to a byte slice
	byteSlice := []byte(jsonString)
	// byteSlice type: []uint8 value: []byte{0x7b, 0xa, …
	//fmt.Printf("byteSlice type: %[1]T value: %#[1]v\n", byteSlice)

	/*
		Unmarshal(data []byte, v interface{}) error
		data: byte slice is a composite type, so the argument value passed
		is the slice description data, not the byte values themselves
		v: interface is a composite type
	*/
	var data interface{} // allocates space for a single runtime dynamic type
	//data := interface{} // interface{} is not an expression
	// Unmarshal has data by reference since it will be updated
	err := json.Unmarshal(byteSlice, &data)

	/*
		// if data is nil: err: json: Unmarshal(nil)
		// this error is if v is not pointer or the pointer value is nil
		var data interface{}
		err := json.Unmarshal(byteSlice, data)
		eString := "[error is nil]"
		if err != nil {
			eString = err.Error()
		}
		// err type: *json.InvalidUnmarshalError value: &json.InvalidUnmarshalError{Type:reflect.Type(nil)} Error: json: Unmarshal(nil)
		fmt.Printf("err type: %[1]T value: %#[1]v Error: %s\n", err, eString)
	*/

	// data type: map[string]interface {} value: map[string]interface {}{"_string":"abc", …
	//fmt.Printf("data type: %[1]T value: %#[1]v\n", data)

	// the data is slice or object, so not inefficient for returning by value
	return data, err
}
