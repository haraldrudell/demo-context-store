/**
 * High order functions to help with route paths
 * All Application Route Paths
 * This allows for easy changes in the future to the URLS
 */
import { Url } from 'utils'
import RouteDefinitions from './RouteDefinitions'
import RouteVerifiers from './RouteVerifiers'

const RoutePaths = Object.assign({}, RouteVerifiers)

// Append paths properties with query string handling by default
Object.keys(RouteDefinitions).forEach(pathName => {
  const pathFunc = RouteDefinitions[pathName]
  RoutePaths[pathName] = Url.wrapWithQueryString(pathFunc)
})

export default RoutePaths



// WEBPACK FOOTER //
// ../src/routes/RoutePaths.js