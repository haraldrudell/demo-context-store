import moment from 'moment'

const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60
const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24

export default (date) => {
    const now = moment()
    const secondsLeft = date.diff(now, 'seconds')
    if (secondsLeft < SECONDS_PER_MINUTE) {
        return 'Less than a minute left'
    } else if (secondsLeft < SECONDS_PER_HOUR) {
        const minutesLeft = Math.floor(secondsLeft / SECONDS_PER_MINUTE)
        return minutesLeft + ' minute' + (minutesLeft !== 1 ? 's' : '') + ' left'
    } else if (secondsLeft < SECONDS_PER_DAY) {
        const hoursLeft = Math.floor(secondsLeft / SECONDS_PER_HOUR)
        return hoursLeft + ' hour' + (hoursLeft !== 1 ? 's' : '') + ' left'
    } else {
        const daysLeft = Math.floor(secondsLeft / SECONDS_PER_DAY)
        return daysLeft + ' day' + (daysLeft !== 1 ? 's' : '') + ' left'
    }
}



// WEBPACK FOOTER //
// ./app/utilities/time-left.js