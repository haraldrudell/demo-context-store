/*
Package fetcher gets the last block from Ethereum mainnet

© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
package fetcher

import (
	"encoding/json"
	"fmt"
	"io"
	"strconv"
)

// Parse data from a reader as JSON, the reader is typically resp.body from a http request
func Parse(reader io.Reader) (*JSONData, error) {
	data := JSONData{}
	e := json.NewDecoder(reader).Decode(&data.value)
	return &data, e
}

// JSONData hold parsed JSON data
type JSONData struct {
	value *interface{}
}

func (j *JSONData) getMap() *map[string]interface{} {
	mapp, ok := (*j.value).(map[string]interface{})
	if !ok {
		return nil
	}
	return &mapp
}

func (j *JSONData) getProperty(key string) *(interface{}) {
	mapp := j.getMap()
	if mapp == nil {
		return nil
	}

	value, ok := (*mapp)[key]
	if !ok {
		return nil
	}

	return &value
}

// GetStringProperty ensure object and property to be string value
func (j *JSONData) GetStringProperty(key string) *string {
	value := j.getProperty(key)
	if value == nil {
		return nil
	}
	//fmt.Printf("GetStringProperty %T %#[1]v\n", *value)

	stringValue, ok := (*value).(string)
	if !ok {
		return nil
	}

	return &stringValue
}

// GetNumberProperty ensure object ad property to be string value
func (j *JSONData) GetNumberProperty(key string) *float64 {
	if key == "timestamp" {
		j.Print()
	}
	value := j.getProperty(key)
	if value == nil {
		return nil
	}
	//fmt.Printf("GetNumberProperty %T %#[1]v\n", *value)

	numeric, ok := (*value).(float64)
	if !ok {
		return nil
	}

	return &numeric
}

// EnterKey zooms in to an object property value of the JSON
func (j *JSONData) EnterKey(key string) *JSONData {
	value := j.getProperty(key)
	if value == nil {
		return nil
	}
	j.value = value
	return j
}

// IsMap determie if data is map
func (j *JSONData) IsMap() bool {
	return j.getMap() == nil
}

// GetHexProperty gets timestamp, block number
func (j *JSONData) GetHexProperty(key string) *uint64 {
	str := j.GetStringProperty(key)
	if str == nil {
		return nil
	}

	num, e := strconv.ParseUint(*str, 0, 64)
	if e != nil {
		return nil
	}

	return &num
}

// Print what do I have?
func (j *JSONData) Print() {
	if j.value != nil {
		fmt.Printf("json: %T %#[1]v\n", *j.value)
	} else {
		fmt.Println("json: nil")
	}
}
