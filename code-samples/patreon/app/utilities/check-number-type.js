/* number can be int or string. This helper is intended for use with numeral library, which handles string/int parsing. -gb */
export default number => {
    if (typeof number !== 'number' && typeof number !== 'string') {
        return 0
    }
    return number
}



// WEBPACK FOOTER //
// ./app/utilities/check-number-type.js