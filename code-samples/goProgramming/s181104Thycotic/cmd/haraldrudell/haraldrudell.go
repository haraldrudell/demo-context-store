/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.

Requirements:
1. Calculate:
	a. the average temperature
	b. in the 100 largest cities in the United States
	c. at the current time
2. Handle any errors
	a. if a city is missing temperature data and
	b. skip that city in the final calculation
*/
package main

import (
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"time"

	"github.com/Jeffail/gabs"
)

// Coordinate describes the location of a city
type Coordinate struct {
	Latitude  float64
	Longitude float64
}

const weatherCityURLTemplate string = "https://www.metaweather.com/api/location/search/?lattlong=%f,%f"
const weatherURLTemplate string = "https://www.metaweather.com/api/location/%d/%d/%d/%d"
const cityUrls string = "https://public.opendatasoft.com/api/records/1.0/search/?dataset=1000-largest-us-cities-by-population-with-geographic-coordinates&facet=city&facet=state&sort=population&rows=100"

func main() {

	cityData, err := doGetRequest(cityUrls)
	if err != nil {
		panic(err) // Get https:… no such host
	}

	// this code is safe and leads to a slice of json values or nil
	cityDataParsed, _ := gabs.ParseJSON(cityData)
	cities, _ := cityDataParsed.Path("records").Children()

	count := len(cities)
	valueCount := 0
	accumulate := 0.
	for _, city := range cities {
		coord := city.Path("fields.coordinates").Data().([]interface{})
		coo := Coordinate{
			Latitude:  coord[0].(float64),
			Longitude: coord[1].(float64),
		}
		temp := getCurrentTemperatureForCoordinates(coo)

		if !math.IsNaN(temp) {
			valueCount++
			accumulate += temp
		}
	}
	if valueCount > 0 {
		// Average temperature: 18.7 °C in 99 of 100 cities
		fmt.Printf("Average temperature: %.1f °C in %d of %d cities\n", accumulate/(float64)(valueCount), valueCount, count)
	} else {
		fmt.Printf("City data count: %d but no temperatures\n", count)
	}
}

func getCurrentTemperatureForCoordinates(coord Coordinate) float64 {
	weatherCityData, err := doGetRequest(fmt.Sprintf(weatherCityURLTemplate, coord.Latitude, coord.Longitude))
	if err != nil {
		panic(err)
	}

	weatherCitiesParsed, _ := gabs.ParseJSON(weatherCityData)
	weatherCityWoeids := weatherCitiesParsed.Path("woeid").Data().([]interface{})
	weatherURLFormatted := fmt.Sprintf(weatherURLTemplate, int64(weatherCityWoeids[0].(float64)), time.Now().Year(),
		int(time.Now().Month()), time.Now().Day())
	weatherData, err := doGetRequest(weatherURLFormatted)
	if err != nil {
		panic(err)
	}
	weatherDataParsed, _ := gabs.ParseJSON(weatherData)
	if temp, ok := weatherDataParsed.Path("the_temp").Data().([]interface{})[0].(float64); ok {
		return temp // float64
	}
	return math.NaN()
}

func doGetRequest(url string) ([]byte, error) {
	res, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}
