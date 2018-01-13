function decodeHTMLEntities(input) {
    const el = document.createElement('span')
    el.innerHTML = input
    return el.textContent
}

export default { decode: decodeHTMLEntities }



// WEBPACK FOOTER //
// ./app/utilities/html-entities.js