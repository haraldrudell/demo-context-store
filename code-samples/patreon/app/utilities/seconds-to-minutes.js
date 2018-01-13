import numeral from 'numeral'

export default function(seconds) {
    // numeral always returns time format with hours included ¯\_(ツ)_/¯
    // without flooring the seconds we can have times like 1:60
    const flooredSeconds = Math.floor(seconds)
    return numeral(flooredSeconds).format('0:00:00').replace(/0:0?/, '')
}



// WEBPACK FOOTER //
// ./app/utilities/seconds-to-minutes.js