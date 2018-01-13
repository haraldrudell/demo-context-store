import requestPrototype from 'nets'
import access from 'safe-access'
import startsWith from 'lodash/startsWith'
import url from 'url'
import querystring from 'querystring'
import urlFactory from 'url-factory'
import { getCsrfHeaders } from 'utilities/csrf'

const JSON_API_STABLE = '1.0'
const JSON_CONTENT_TYPE = 'application/json'
const DEFAULT_CONTENT_TYPE = JSON_CONTENT_TYPE
const CSRF_PATH = '/REST/auth/CSRFTicket'
const COMPUTATION_DONE = true

/**
 * Eventually poacher will be standalone and we will pass the API_HOST in
 * as a config option. Right now _py react pages will declare `apiServer` so
 * poacher talks to the correct server based on env (delta etc).
 */
const windowInScope = typeof window !== 'undefined'
const _window = windowInScope ? window : {}
export const DEFAULT_API_HOST =
    access(_window, 'patreon.apiServer') || 'api.patreon.com'

// tokens expire after 2 hours, but we refresh every 1.5 just to be on the safe side
const ONE_AND_HALF_HOUR = 5400000
const ticketTimeExpired = (now, ticketTime) => {
    return now - ticketTime > ONE_AND_HALF_HOUR
}

function isFunction(action) {
    return typeof action === 'function'
}

function isRequest(action) {
    return typeof action === 'object' && action.method
}

function xhrResponse(error, response, body, self, resolvePromise) {
    self.error = error
    self.response = response
    self.body = body
    return resolvePromise(self)
}

function xhrRequest(self, action, uri, data) {
    // Allow uri/url (caller can use FQD or just the API URI path)
    const _uri = url.parse(uri)

    if (!_uri.host && _uri.pathname !== CSRF_PATH) {
        const hostAndPath = urlFactory(self.apiHost)(_uri.pathname)
        const parsedHostAndPath = url.parse(hostAndPath)
        _uri.host = parsedHostAndPath.host
        _uri.pathname = parsedHostAndPath.pathname
    }

    if (!_uri.host && _uri.pathname === CSRF_PATH) {
        _uri.host = window.location.host
    }

    if (!_uri.protocol) _uri.protocol = 'https'

    const qs = {
        ...querystring.parse(_uri.query),
        'json-api-version': JSON_API_STABLE,
    }

    delete _uri.query
    delete _uri.search

    let requestPrototypeObject = {
        method: action.toUpperCase(),
        uri:
            url.format({ ..._uri, query: '' }) +
            '?' +
            querystring.stringify(qs),
        withCredentials: true,
        encoding: undefined,
        headers: {
            'Content-Type': self.contentType,
            ...getCsrfHeaders(),
        },
    }

    if (data) {
        if (self.contentType === JSON_CONTENT_TYPE) {
            requestPrototypeObject.body = JSON.stringify({ data: data })
        } else {
            requestPrototypeObject.body = data
        }
    }

    return new Promise(function(resolve) {
        return requestPrototype(requestPrototypeObject, function(
            error,
            response,
            body,
        ) {
            return xhrResponse(error, response, body, self, resolve)
        })
    })
}

class Poacher {
    constructor(options = null) {
        this.contentType = DEFAULT_CONTENT_TYPE
        this.index = 0
        this.queue = null
        this.body = null
        this.error = null
        this.response = null
        this.csrfUri = null
        this.csrfTime = null
        this.csrfSignature = null
        this.apiHost = this.standardizeAPIHost(DEFAULT_API_HOST)

        if (options) {
            for (let key in options) {
                if (this.hasOwnProperty(key)) {
                    this[key] = options[key]
                }
            }
        }
    }

    process(queue) {
        this.queue = queue
        this.index = 0

        return this.performStepInQueue(this.queue[this.index])
    }

    iterateOverQueue() {
        this.index = this.index + 1

        return this.index < this.queue.length
            ? this.performStepInQueue(this.queue[this.index])
            : COMPUTATION_DONE
    }

    performStepInQueue(action) {
        if (isFunction(action)) {
            return this.callback(action).then(function(results) {
                return results.iterateOverQueue()
            })
        } else if (isRequest(action)) {
            switch (action.method) {
                case 'csrf':
                    return this.getCsrfHeader(action.uri).then(function(
                        results,
                    ) {
                        return results.iterateOverQueue()
                    })
                default:
                    return xhrRequest(
                        this,
                        action.method,
                        action.uri,
                        action.payload,
                    ).then(function(results) {
                        const iterationResult = results.iterateOverQueue()
                        if (iterationResult === COMPUTATION_DONE) {
                            return results
                        } else {
                            return iterationResult
                        }
                    })
            }
        } else {
            return console.error(
                'Wrong usage of the API, only accepts functions and request objects',
            )
        }
    }

    standardizeAPIHost(uri) {
        // 1. defensive programming -- we want to have this full, protocol-specified URL on the poacher object,
        //      no matter what's on window.patreon.apiServer
        // 2. the node-url module we are using here *should* be able to do this without us doing `.startsWith`
        //      but there doesn't seem to be any way to treat the string as a host by default.
        //      Specifically, url.parse('google.com') thinks that {host: null, 'pathname: google.com'},
        //      when it should do {host: 'google.com', pathname: null}.
        //      Prepending a protocol like 'http://' before passing to url.parse fixes this.
        if (!(startsWith(uri, 'http://') || startsWith(uri, 'https://'))) {
            uri = 'https://' + uri
        }
        const _uri = url.parse(uri, false, false)
        if (!_uri.protocol) {
            _uri.protocol = 'https:'
        }
        return url.format({ ..._uri, query: '' })
    }

    getCsrfHeader(uri = null) {
        let self = this

        if (!uri) {
            console.error('Must provide URI to get CSRF token.')

            return false
        }

        return xhrRequest(this, 'get', `${CSRF_PATH}?uri=${uri}`).then(function(
            response,
        ) {
            const csrf = JSON.parse(response.body)

            self.csrfUri = csrf.URI
            self.csrfTime = csrf.time
            self.csrfSignature = csrf.token

            return response
        })
    }

    xhrCheckingCSRF(queue) {
        const hasValidCSRF =
            this.csrfUri &&
            (windowInScope && window.location.pathname === this.csrfUri) &&
            !ticketTimeExpired(Date.now(), this.csrfTime)

        return hasValidCSRF || !windowInScope
            ? this.process(queue)
            : this.process([
                  { method: 'csrf', uri: window.location.pathname },
                  ...queue,
              ])
    }

    callback(action) {
        let self = this

        return new Promise(function(resolve) {
            action(self)

            return resolve(self)
        })
    }

    get(uri, data) {
        return xhrRequest(this, 'GET', uri, data)
    }

    post(uri, data) {
        return this.xhrCheckingCSRF([
            { method: 'POST', uri: uri, payload: data },
        ])
    }

    patch(uri, data) {
        return this.xhrCheckingCSRF([
            { method: 'PATCH', uri: uri, payload: data },
        ])
    }

    delete(uri, data) {
        return this.xhrCheckingCSRF([
            { method: 'DELETE', uri: uri, payload: data },
        ])
    }
}

module.exports = Poacher



// WEBPACK FOOTER //
// ./app/utilities/poacher/index.js