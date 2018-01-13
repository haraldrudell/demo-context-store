import EASING from 'styles/themes/america/easing'

const DEFAULT_TIME = 300 // ms
const SLOW_TIME = 500

export default {
    default: `all ${DEFAULT_TIME}ms ${EASING.EXPO}`,
    slow: `all ${SLOW_TIME}ms ${EASING.EXPO}`,
    easing: {
        default: EASING.EXPO,
    },
    timeEasing: {
        default: `${DEFAULT_TIME}ms ${EASING.EXPO}`,
    },
}



// WEBPACK FOOTER //
// ./app/styles/themes/america/transitions.js