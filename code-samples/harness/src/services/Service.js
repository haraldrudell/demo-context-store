import Url from '../utils/Url'

export const slash = id => (typeof id !== 'undefined' ? '/' + id : '')

export const action = (id, action) => {
  const base = slash(id)
  return base && action ? base + slash(action) : base
}

export function endpointPaths (endpoints) {
  Object.keys(endpoints).forEach(endpointName => {
    const config = endpoints[endpointName]
    const pathFunc = config === true ? _ => endpointName : endpoints[endpointName]
    endpoints[endpointName] = Url.wrapWithQueryString(pathFunc)
  })
  return endpoints
}



// WEBPACK FOOTER //
// ../src/services/Service.js