import { getCsrfHeaders } from 'utilities/csrf'

export const beforeRequest = (method, options) => {
    return Promise.resolve()
}

export const afterRequest = (method, options) => {
    return Promise.resolve()
}

export const getRequestParameters = (method, options, csrfProvider) => {
    return Promise.resolve()
        .then(() => {
            const skipMethods = {
                get: true,
                options: true,
            }
            if (skipMethods[method.toLowerCase()]) {
                return
            }

            return getCsrfHeaders()
        })
        .then(headers => ({
            credentials: 'include',
            headers: {
                ...headers,
                'Content-Type': 'application/vnd.api+json',
            },
        }))
}



// WEBPACK FOOTER //
// ./app/libs/nion-modules/json-api/request/index.js