import moment from 'moment'

const now = moment()
export function formatDate(dateString) {
    const date = moment(dateString)
    return date.format(date.isSame(now, 'year') ? 'MMM D' : 'MMM D, YYYY')
}

export function formatDateRelative(dateString) {
    return moment(dateString).fromNow(true)
}

export const apiDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ'

/* formatter function for use with react-timeago component */
export function formatTimeAgo(value, unit, suffix, date) {
    if (unit === 'second') {
        return 'just now'
    } else if (unit === 'minute') {
        return `${value}min`
    } else if (unit === 'month') {
        return `${value}mo`
    }
    return `${value}${unit.substring(0, 1)}`
}

export const formatDateAndTime = (isoTime, customDateFormat) => {
    /**
     * Display the year if it's different from the current year.
     * this doesn't account for locale offset on the last day of the year,
     * but this isn't that big a deal (the year, if displayed, will always be correct). -gb
     */
    const year = isoTime.slice(0, 4)
    const format =
        year === String(moment().year())
            ? 'MMM D [at] h:mma'
            : 'MMM D, YYYY [at] h:mma'
    return moment(isoTime).format(`${customDateFormat || format}`)
}

export const daysFromNow = (futureDate, initialDate = moment(), min = 0) => {
    const initialMomemnt = moment(initialDate).startOf('day')
    const futureMoment = moment(futureDate).startOf('day')

    const result = futureMoment.diff(initialMomemnt, 'days')
    return result < min ? min : result
}



// WEBPACK FOOTER //
// ./app/utilities/format-date.js