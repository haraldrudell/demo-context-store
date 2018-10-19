console.log(process)

/*
// pow(x, y)
x, y integer
M<ath.power(xc0
a ** 2
*/

x^y = x^(y/2) * x ^(y/2) if y is even
x^y = x^(y/2) * x ^(y/2) * x if y is odd

y is 0: x^0 is 1.
x^1 is x
y=2: x^1 * x^1


function pow2(x, y) {
    // direct solution: y 0, 1
    // greater y: recursive

    if (y === 0) return 1
    if (y === 1) return x

    let isEven = !(y & 1) // boolean
    let v = pow2(x, y / 2)
    if (isEven) {
      return v * v
    } else {
        return v * v * x
    }
}


function power(x, y) { // x, y integers, 0 or positive
    let exp = Math.round(y)
    if (isNaN(exp)) throw new Error('bad')

    // 0
    // >0
    // <0
    if (y === 0) return 1
    let result = x
    while (y > 1) {
        result *= x
        y--
    }
    return result
}


// test cases:
x = 2 y = 1
result = 2
y is not > 1: 2

x = 4 y = 3
result = 4 (y 3)
result 16 (y 2)
result 64 (y 1)


Given an array of stock_prices = [10,5,15,20,25,4,50,30, etc] (integers) which gives the stock price at each minute (say for a day), write a function that calculates the maximum profit if you buy once and sell once. A buy must come before a sell in time.

/*
maximum pofit buy and sell
go through the array max number followed by a min number
- max time
- min time
- difference

go through from start to end
hiold on to the min value as the purchase price
- check agains larger value = profit
dfo not need when
*/

function profit(arr) { // array of integer numbers
  let buy
  let sell
  let profit = 0

  for (let v of arr) {
    if (buy == null) {
      buy = v
      continue
      }

    // we have a buy - check profit
    let x = v - buy
    if (profit == null || x > profit) profit = x

    if (v < buy) buy = v
  }
  return profit
}

REST
GET POST PUT
POST new record
PUT update
GET gets
OPTIONS
PATCH

/users/id
/usres/
/users/1
&country=US

- query string: unique URL &json
- paramneters: authneitcation, format

streaming MySQL 5.1
- very large query: map 1 users favorites against users faborites
- recommendatiomn item 5 favoryred look 6,7,8
levaes the query alive on the server, 1000
pagintaion re-runs query

lucene - id - top list ifs fabiorted


https://en.wikipedia.org/wiki/Collaborative_filtering




