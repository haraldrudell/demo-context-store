import getWindow from 'utilities/get-window'

export default (url, redirectLocation, redirectParamName) => {
    redirectParamName = redirectParamName || 'ru'
    return `${url}${url.includes('?')
        ? '&'
        : '?'}${redirectParamName}=${getWindow().encodeURIComponent(
        redirectLocation,
    )}`
}



// WEBPACK FOOTER //
// ./app/utilities/with-redirect.js