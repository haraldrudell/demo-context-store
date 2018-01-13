import numeral from 'numeral'
import checkNumberType from 'utilities/check-number-type'

export default function (intCents) {
    const number = (checkNumberType(intCents) / 100)
    return numeral(number).format('$0,0[.]00')
}



// WEBPACK FOOTER //
// ./app/utilities/format-currency-from-cents.js