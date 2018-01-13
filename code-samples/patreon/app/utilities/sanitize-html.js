import sanitizeHtml, { simpleTransform } from 'sanitize-html'

const allowedTags = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'p',
    'a',
    'ul',
    'ol',
    'br',
    'nl',
    'li',
    'b',
    'i',
    'strong',
    'em',
    'strike',
    'code',
    'img',
    'hr',
    'div',
    'table',
    'thead',
    'caption',
    'tbody',
    'tr',
    'th',
    'td',
    'pre',
]
const allowedAttributes = {
    a: ['href'],
    img: ['src', 'width', 'height'],
}

const nofollowAttributes = {
    a: ['href', 'rel'],
    img: ['src', 'width', 'height'],
}

export default (dirtyHtml, nofollow = false) => {
    let sanitized = sanitizeHtml(dirtyHtml, {
        allowedTags,
        allowedAttributes,
        transformTags: {
            a: simpleTransform('a', { rel: 'nofollow' }),
        },
    })

    if (nofollow) {
        sanitized = sanitizeHtml(sanitized, {
            allowedTags,
            allowedAttributes: nofollowAttributes,
            transformTags: {
                a: simpleTransform('a', { rel: 'nofollow' }),
            },
        })
    }
    return sanitized
}



// WEBPACK FOOTER //
// ./app/utilities/sanitize-html.js