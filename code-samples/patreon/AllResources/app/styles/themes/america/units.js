import devError from 'utilities/dev-error'

const BASE_UNIT = 0.5 // rem
const UNIT_MIN = -128
const UNIT_MAX = 128
export const getRange = () => ({
    min: UNIT_MIN,
    max: UNIT_MAX
})

const getValue = (value) => {
    return BASE_UNIT * value + 'rem'
}

// Takes either a number or an array of numbers
const getValues = (value) => {
    if (typeof value === 'number') {
        return getValue(value)
    }

    if (Array.isArray(value)) {
        return value.map(v => getValue(v)).join(' ')
    }

    devError(`Not a number or array of numbers: ${value}`)
}


export default {
    getValue,
    getValues,
    getRange
}



// WEBPACK FOOTER //
// ./app/styles/themes/america/units.js