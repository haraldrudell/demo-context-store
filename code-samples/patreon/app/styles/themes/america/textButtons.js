import Color from 'color'
import colors from './colors'
import text from './text'

const textButtonColorToColor = {
    default: 'coral',
    dark: 'navy',
    subdued: 'gray3',
    light: 'white',
}

const getColor = (textButtonColor) => {
    if (textButtonColorToColor[textButtonColor]) {
        return colors[textButtonColorToColor[textButtonColor]]
    }

    // Legacy handling of default theme colors
    switch (textButtonColor) {
        case 'dark':
            return colors.gray1
        case 'subduedGray':
        case 'subdued':
        case 'gray':
            return colors.gray3
        case 'white':
            return colors.light
        case 'facebookBlue':
            return colors[textButtonColor]
        case 'orange':
        case 'blue':
        default:
            return colors.highlightPrimary
    }
}

const getHoverStyles = (colorName) => {
    return `
        text-decoration: underline;
    `
}

const getVisitedStyles = (colorName) => {
    return `
        color: ${Color(getColor(colorName)).darken(0.05).string()};
    `
}

export default {
    getColor: getColor,
    getHoverStyles: getHoverStyles,
    getVisitedStyles: getVisitedStyles,
    underline: false,
    weight: text.getWeight('bold'),
}



// WEBPACK FOOTER //
// ./app/styles/themes/america/textButtons.js