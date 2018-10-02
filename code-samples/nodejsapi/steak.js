// IMPORT LIBRARY PACKAGES NEEDED BY YOUR PROGRAM
// SOME FUNCTIONALITY WITHIN A PACKAGE MAY BE RESTRICTED
// DEFINE ANY FUNCTION NEEDED
// FUNCTION SIGNATURE BEGINS, THIS FUNCTION IS REQUIRED

function SteakHouse(x, y) {
  this.result = [x, y]
  this.dist = Math.sqrt(x * x + y * y) // sqrt can be removed
}

function compareFunction(a, b) {
  var aDist = a.dist
  var bDist = b.dist
  return aDist < bDist ? -1 : aDist === bDist ? 0 : 1
}

function nearestXsteakHouses(totalSteakhouses, allLocations, numSteakhouses) {

  // Node.js 4.4.7: no let const class

  // customer location: 0, 0
  // distance tie: use any

  // all steakhouses has to be considered
  // then use the nearest

  // list steakhouses as a class and sort by distance
  // one could also use binary insertion
  var steakHouses = allLocations.map(loc => new SteakHouse(loc[0], loc[1])).sort(compareFunction)

  // get the result for the closest steak houses
  var result = steakHouses.slice(0, numSteakhouses).map(steakHouse => steakHouse.result)

  return result
}
// FUNCTION SIGNATURE ENDS
