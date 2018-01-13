import { CALL_API, isRSAA } from 'redux-api-middleware'
import getCsrfHeadersWithPromise from 'utilities/csrf'

export const extendActionHeaders = (action, headers) => {
    const callApi = action[CALL_API]

    return {
        [CALL_API]: {
            ...callApi,
            headers: { ...callApi.headers, ...headers },
        },
    }
}

/**
 * Create a CSRF ticket for non GET RSAA actions and extend action
 * headers before hitting the `redux-api-middleware`. This middleware
 * should be included BEFORE `redux-api-middleware`.
 */
export default store => next => action => {
    if (!isRSAA(action)) return next(action)

    const callApi = action[CALL_API]
    const skipMethods = ['get', 'options']
    if (skipMethods.indexOf(callApi.method.toLowerCase()) > -1) {
        return next(action)
    }

    return getCsrfHeadersWithPromise()
        .then(csrfHeaders => {
            return next(extendActionHeaders(action, csrfHeaders))
        })
        .catch(() => next(action))
}



// WEBPACK FOOTER //
// ./app/shared/middleware/csrf-ticket/index.js