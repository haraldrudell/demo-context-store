import queryString from 'query-string'
// Definition:
// A pathFunc is a function that returns a string of a route path

function wrapWithQueryString (pathFunc) {
  return (pathParams = {}, queryParams = {}) => {
    let result = pathFunc(pathParams)
    if (queryParams && Object.keys(queryParams).length > 0) {
      result += '?' + queryString.stringify(queryParams)
    }
    return result
  }
}

export default {
  wrapWithQueryString
}



// WEBPACK FOOTER //
// ../src/utils/Url.js