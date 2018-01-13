import numeral from 'numeral'

export default function(number){
    return numeral(number).format('0.0%')
}



// WEBPACK FOOTER //
// ./app/utilities/number-to-percent.js