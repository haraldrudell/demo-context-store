export default (str) =>
    str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )



// WEBPACK FOOTER //
// ./app/utilities/format-title-case.js