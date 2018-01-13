import Autolinker from 'autolinker'

/*
Good base settings for user-generated text (posts, messages, pitch, etc.).
We can define other instances with different options for more specific use cases.
const messageOptions = {
    ...baseOptions,
    {
        phone: true
    }
}
-gb
https://www.npmjs.com/package/autolinker#options
*/
const baseOptions = {
    newWindow: true,
    stripPrefix: true,
    phone: false,
    twitter: false,
    email: true,
}

/*
slightly more efficient when using multiple times.
-gb
*/
const autolinker = new Autolinker(baseOptions)

export default html => autolinker.link(html)



// WEBPACK FOOTER //
// ./app/libs/autolink/index.js