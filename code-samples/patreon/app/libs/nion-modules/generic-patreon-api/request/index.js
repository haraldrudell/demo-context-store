import { getCsrfHeaders } from 'utilities/csrf'

export const beforeRequest = (method, options) => {
    return Promise.resolve()
}

export const afterRequest = (method, options) => {
    return Promise.resolve()
}

export const getRequestParameters = (
    method,
    { endpoint, body, meta, declaration },
) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/json, application/xml, text/plain, text/html, *.*',
        ...getCsrfHeaders(),
    }

    return {
        headers: declaration.headers || defaultHeaders,
        credentials: 'include',
    }
}



// WEBPACK FOOTER //
// ./app/libs/nion-modules/generic-patreon-api/request/index.js