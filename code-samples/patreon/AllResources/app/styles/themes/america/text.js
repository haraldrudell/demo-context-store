import colors from './colors'
import units from './units'
import devError from 'utilities/dev-error'
import { TEXT_SIZES } from 'styles/shared/text'

const getColor = (textColor) => {
    // Legacy handling of default theme colors
    switch (textColor) {
        case 'orange':
            return colors.highlightPrimary
        case 'dark':
            return colors.gray1
        case 'subduedGray':
        case 'gray':
        case 'lightestGray':
            return colors.gray3
        case 'red':
        case 'errorOrange':
            return colors.error
        default:
            return colors[textColor] || colors.navy
    }
}

const getLineHeight = (size) => {
    return size < 2 ? 1.5 : 1.25
}

const getMargin = (el) => {
    switch (el) {
        case 'p':
            return `${units.getValues([1, 0])} !important`
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            return '1em 0 !important'
        default:
            return '0'
    }
}

const getSize = (i) => {
    const TYPE_RATIO = 1.618
    const TYPE_BASE1 = 1 // rem
    const TYPE_BASE2 = TYPE_BASE1 * (1 + TYPE_RATIO) / 2

    if (!TEXT_SIZES.includes(i)) {
        devError(
            `Invalid text size. Expected an integer between ${TEXT_SIZES[0]} and
 ${TEXT_SIZES[TEXT_SIZES.length - 1]}, got: ${i}`)
        return
    }
    const base = Math.abs(i % 2) === 1
        ? TYPE_BASE1
        : TYPE_BASE2
    return `${base * Math.pow(TYPE_RATIO, Math.ceil(i / 2.0) - 1)}rem !important;`
}

const weights = {
    normal: 400,
    bold: 700,
}

const getWeight = (weightName) => {
    switch (weightName) {
        case 'bold':
        case 'ultrabold':
            return weights.bold
        case 'thin':
        case 'light':
        case 'normal':
        default:
            return weights.normal
    }
}

const tracking = {
    normal: 'normal',
    wide: '0.1em',
}

export default {
    getColor,
    getLineHeight,
    getMargin,
    getSize,
    getWeight,
    tracking,
}



// WEBPACK FOOTER //
// ./app/styles/themes/america/text.js