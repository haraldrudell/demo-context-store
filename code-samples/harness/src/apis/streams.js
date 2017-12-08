import Socket from 'atmosphere.js'
import Utils from '../components/Utils/Utils'

const serviceUrl = () => {
  if (__SERVER__) {
    const hostname = process.env.HOSTNAME || 'localhost'
    const port = process.env.PORT || 8000
    return `ws://${hostname}:${port}/stream/ui`
  }
  console.log('Loading from ' + window.apiUrl)
  if (__CLIENT__) {
    if (window.apiUrl) {
      return window.apiUrl.replace('/api', '/stream/ui')
    }
    // return 'https://wingsci-api.wings.software/stream/ui'
    const port = 9090
    const { protocol, hostname } = window.location

    if (window.location.port === '8000') { // $ DEVELOPMENT: npm run dev
      return `${protocol}//${hostname}:${port}/stream/ui`
    }
    return '/stream/ui' // to run with Java 'static' directory
  }
}

const token = () => `token=${Utils.getBearerToken()}`

const request = (url, onMessage) => {
  return {
    url: serviceUrl() + url + `?${token()}`,
    contentType: 'application/json',
    logLevel: 'debug',
    transport: 'websocket',
    trackMessageLength: true,
    fallbackTransport: 'long-polling',
    onOpen: (response) => {
      // console.log('Atmosphere connected using ' + response.transport)
    },
    onClose: (response) => {
      // console.log('Atmosphere closed using ' + response.transport)
    },
    onError: (response) => {
      // console.log('Atmosphere errored using ' + response.transport)
    },
    onMessage: (response) => {
      // console.log('Atmosphere messaged using ' + response.transport)
      const message = response.responseBody
      try {
        const json = JSON.parse(message)
        if ((json && !json.errorType) && onMessage) {
          onMessage(json)
        }
      } catch (e) {
        return
      }
    }
  }
}

const subscribe = (request) => {
  return Socket.subscribe(request)
}

const unsubscribe = (request) => {
  if (!request || !request.url) {
    throw 'request.url not found: ' + request
  }

  return Socket.unsubscribeUrl(request.url)
}

/** ******* Streaming websocket urls ********/

// -- RELEASE ARTIFACTS

const streamArtifactEndPoint = (appId, accountId) => {
  return `/${accountId}/${appId}/all/all/artifacts`
}

const streamActivityEndPoint = (appId, envId, accountId) => {
  return `/${accountId}/${appId}/${envId}/all/activities`
}

export default {
  socket: Socket,
  request,
  subscribe,
  unsubscribe,
  streamArtifactEndPoint,
  streamActivityEndPoint
}



// WEBPACK FOOTER //
// ../src/apis/streams.js