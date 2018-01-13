import numeral from 'numeral'
import checkNumberType from 'utilities/check-number-type'

export default function (number) {
    return numeral(checkNumberType(number)).format('$0,0[.]00')
}



// WEBPACK FOOTER //
// ./app/utilities/format-currency.js