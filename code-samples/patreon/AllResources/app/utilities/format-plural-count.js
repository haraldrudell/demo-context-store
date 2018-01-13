import pluralize from 'pluralize'
import formatNumberComma from './format-number-comma'

export default function (number, word) {
    const pluralizedWord = pluralize(word, number)
    return `${formatNumberComma(number)} ${pluralizedWord}`
}



// WEBPACK FOOTER //
// ./app/utilities/format-plural-count.js