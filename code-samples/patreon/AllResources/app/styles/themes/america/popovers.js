import colors from './colors'
import shadows from './shadows'

const backgroundColorMap = {
    default: 'blue',
    tertiary: 'white',
    secondary: 'blue',
    dark: 'dark',
}

const borderColorMap = {
    default: 'blue',
    tertiary: 'gray4',
    secondary: 'blue',
    dark: 'dark',
}

const colorMap = {
    default: 'dark',
    tertiary: 'dark',
    secondary: 'white',
    dark: 'white',
}

const shadowMap = {
    default: 'none',
    tertiary: '2',
}

const getBackgroundColor = color => {
    const backgroundColor =
        backgroundColorMap[color] || backgroundColorMap['default']
    return colors[backgroundColor]
}

const getBorderColor = color => {
    const borderColor = borderColorMap[color] || borderColorMap['default']
    return colors[borderColor]
}

const getShadow = color => {
    const shadow = shadows[shadowMap[color]] || shadowMap['default']
    return shadow
}

const getTriangleColor = color => {
    if (color === 'tertiary') {
        return colors['white']
    } else {
        return getBorderColor(color)
    }
}

const getColor = color => {
    const highlightColor = colorMap[color] || colorMap['default']
    return colors[highlightColor]
}

export default {
    getColor,
    getBackgroundColor,
    getBorderColor,
    getTriangleColor,
    getShadow,
}



// WEBPACK FOOTER //
// ./app/styles/themes/america/popovers.js