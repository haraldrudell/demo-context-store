import fetchPlus from 'fetch-plus'
import plusJson from 'fetch-plus-json'
import plusBearerAuth from 'fetch-plus-bearerauth'
import Utils from '../components/Utils/Utils'
import responseMessageMiddleWare from './responseMessageMiddleWare'

// include this 'isomorphic-fetch' into the build so Safari can fetch data:
import isomorphicFetch from 'isomorphic-fetch' // eslint-disable-line no-unused-vars

const serviceUrl = () => {
  if (__SERVER__) {
    // return 'http://jsonplaceholder.typicode.com'
    const hostname = process.env.HOSTNAME || 'localhost'
    const port = process.env.PORT || 8000
    return `http://${hostname}:${port}/api`
  }
  if (__CLIENT__) {
    if (window.apiUrl) {
      return window.apiUrl
    }
    // const port = 8000 // connect to Server APIs (set CI or DEMO in apiRouter.js) using NodeJS-Backend api proxy
    const port = 9090 // connect to Local Java APIs
    const { protocol, hostname } = window.location
    if (window.location.port === '8000') {
      // $ npm run dev
      return `${protocol}//${hostname}:${port}/api`
    }
    return '/api' // to run with Java 'static' directory
  }
}

const endpoint = fetchPlus.connectEndpoint(serviceUrl())
endpoint.addMiddleware(plusJson())

// --- Generic fetch for custom endpoints which uses isomorphicFetch (whatwg-fetch) directly:
endpoint.fetch = (path, options) => {
  const bodyData = options.body
  let promise
  if (bodyData instanceof FormData) {
    // use isomorphicFetch to have support for FormData
    return endpoint.isomorphicFetch(path, options)
  } else {
    // stringify body data (whatwg-fetch's requirement)
    if (typeof bodyData === 'object') {
      options.body = JSON.stringify(bodyData)
    }
    promise = endpoint.request(path, options)
  }
  return promise
}

endpoint.isomorphicFetch = (path, options) => {
  const headers = options.headers || {}
  headers['Authorization'] = Utils.getBearerHeader()
  options.headers = headers
  const promise = isomorphicFetch(serviceUrl() + '/' + path, options)
  return promise
}

const bearerTokenMiddleWareID = 1111 // some random
endpoint.ensureBearerToken = token => {
  if (!endpoint.middlewares[bearerTokenMiddleWareID]) {
    const bearerToken = plusBearerAuth(token)
    bearerToken._middlewareId = bearerTokenMiddleWareID
    endpoint.addMiddleware(bearerToken)
  }
}

endpoint.clearBearerAuthMiddleware = () => {
  if (endpoint.middlewares[bearerTokenMiddleWareID]) {
    const _bMiddleware = endpoint.middlewares[bearerTokenMiddleWareID]
    endpoint.removeMiddleware(_bMiddleware)
  }
}

endpoint.addMiddleware(responseMessageMiddleWare())

endpoint.makeRequest = async function makeRequest (resourceEndpoint, options = { method: 'GET' }) {
  try {
    const response = await endpoint.fetch(resourceEndpoint, options).catch(error => {
      throw error
    })
    return { resource: response.resource }
  } catch (e) {
    return { error: { details: e, status: e.status } }
  }
}

module.exports = endpoint



// WEBPACK FOOTER //
// ../src/apis/dataService.js