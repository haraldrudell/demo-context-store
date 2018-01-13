const sanitizeUrl = (url) => {
    if(!url.startsWith('http')) {
        return `http://${url}`
    }
    return url
}

export default sanitizeUrl



// WEBPACK FOOTER //
// ./app/utilities/sanitize-url.js