test(optimalUtilization(20, [[1, 8], [2, 7], [3, 14]], [[1, 5], [2, 10], [3, 14]]), [[3, 1]])
test(optimalUtilization(20, [[1, 8], [2, 15], [3, 9]], [[1, 8], [2, 11], [3, 12]]), [[1, 3], [3, 2]])

function test(actual, expected) {
  console.log('actual:', actual)
  console.log('expected:', expected)
}

// IMPORT LIBRARY PACKAGES NEEDED BY YOUR PROGRAM
// SOME FUNCTIONALITY WITHIN A PACKAGE MAY BE RESTRICTED
// DEFINE ANY FUNCTION NEEDED
// FUNCTION SIGNATURE BEGINS, THIS FUNCTION IS REQUIRED
function App(id, mem) {
  this.id = id
  this.mem = mem
}

function compareFunction(a, b) {
  var aMem = a.mem
  var bMem = b.mem
  return aMem < bMem ? -1 : aMem === bMem ? 0 : 1
}

function optimalUtilization(deviceCapacity, foregroundAppList,
                          backgroundAppList) {
  // maximize memory use for a single device
  // app is id, memory consumption
  // one foreground one background for max less than capacity
  // for each foregorund maximize the background

  // list background apps in order of memory consumption
  var bg = backgroundAppList.map(app => new App(app[0], app[1])).sort(compareFunction)

  // process each foreground
  // remember the optimal ones
  var optMem = 0
  var result = [[-1]]
  for (var i = 0; i < foregroundAppList.length; i++) {
      var fg = foregroundAppList[i]

      // find the optimal background app for fg
      var fgId = fg[0]
      var fgMem = fg[1]
      var bgMax = deviceCapacity - fgMem

      var bgApp = getBestApp(bg, bgMax)
      if (!bgApp) continue // no background app will work

      // check if this is optimal
      var memUse = fgMem + bgApp.mem
      if (memUse < optMem) continue // a worse solution
      var thisResult = [fgId, bgApp.id]
      if (memUse > optMem) { // a new level of utilization
          optMem = memUse
          result = [thisResult]
      } else if (memUse === optMem) { // an aditional tie
          result.push(thisResult)
      }
  }
  return result
}
// FUNCTION SIGNATURE ENDS

function getBestApp(bg, bgMaxMem) {
  if (bgMaxMem < 0) return // does not fit at all

  var result
  var i0 = 0
  var i1 = bg.length - 1
  while (i0 <= i1) {

      // pick the middle entry
      var i = Math.floor((i0 + i1) / 2)
      var bgApp = bg[i]

      // does this entry fit?
      if (bgApp.mem <= bgMaxMem) { // this one fits!
          result = bgApp
          i0 = i + 1 // check bigger ones
      } else i1 = i - 1 // check smaller ones
  }
  return result
}
