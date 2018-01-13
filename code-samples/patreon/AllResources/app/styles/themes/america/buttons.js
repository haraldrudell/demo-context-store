import Color from 'color'
import colors from './colors'
import strokeWidths from './stroke-widths'
import units from './units'

const getBackgroundColor = colorName => {
    switch (colorName) {
        case 'primary':
        case 'secondary':
        case 'orange':
        case 'blue':
            return colors.coral
        case 'tertiary':
        case 'gray':
        case 'lightestGray':
        case 'subduedGray':
            return colors.gray5
        case 'pagination':
            return colors.white
        case 'pagination:active':
            return colors.sky
        case 'tertiary-inverse':
            return 'transparent'
        default:
            return colors[colorName]
    }
}

const getBorderColor = colorName => {
    switch (colorName) {
        case 'pagination':
        case 'pagination:active':
            return colors.gray5

        case 'tertiary-inverse':
            return colors.white

        default:
            return getBackgroundColor(colorName)
    }
}

const getBorderWidth = colorName => {
    switch (colorName) {
        case 'pagination':
        case 'pagination:active':
            return '2px'

        default:
            return strokeWidths.default
    }
}

const getBorderStyle = colorName => {
    return `${getBorderWidth(colorName)} solid ${getBorderColor(colorName)}`
}

const getTextColorName = colorName => {
    switch (colorName) {
        case 'tertiary':
        case 'gray':
        case 'lightestGray':
        case 'subduedGray':
        case 'whitestGray':
            return 'gray2'
        case 'white':
        case 'light':
        case 'pagination':
        case 'pagination:active':
            return 'navy'
        default:
            return 'light'
    }
}

const getLoadingSpinnerColorName = colorName => {
    switch (colorName) {
        case 'tertiary':
        case 'gray':
        case 'lightestGray':
        case 'subduedGray':
        case 'whitestGray':
            return 'highlightSecondary'
        case 'white':
        case 'light':
        case 'pagination':
        case 'pagination:active':
            return 'dark'
        default:
            return 'light'
    }
}

const getTextColor = colorName => {
    return colors[getTextColorName(colorName)]
}

const getFocusStyles = colorName => {
    return `
        box-shadow: 0 0 8px 0 ${colors.blue};
        outline: none;
    `
}

const getHoverStyles = colorName => {
    let lightenFactor
    switch (colorName) {
        case 'pagination':
            const backgroundColor = Color(
                getBackgroundColor('pagination:active'),
            )
                .lighten(0.02)
                .hex()
            return `
                background-color: ${backgroundColor};
            `
        case 'tertiary-inverse':
            return `
                background-color: ${Color(getBorderColor(colorName))
                    .fade(0.8)
                    .string()};
            `
        case 'tertiary':
        case 'gray':
        case 'lightestGray':
        case 'subduedGray':
        case 'whitestGray':
        case 'white':
        case 'light':
            lightenFactor = 0.01
            break
        default:
            lightenFactor = 0.05
            break
    }
    const lightenedColor = Color(getBackgroundColor(colorName))
        .lighten(lightenFactor)
        .hex()
    return `
        background-color: ${lightenedColor};
        border-color: ${lightenedColor};
        box-shadow: 0
            ${units.getValues([0.5, 1.5])}
            ${Color(colors.dark).fade(0.9).string()}
        ;
    `
}

const getActiveStyles = colorName => {
    switch (colorName) {
        case 'pagination':
        case 'pagination:active':
            return 'background-color: ' + colors.sky

        default:
            return `
                box-shadow: none;
                transform: translateY(0);
            `
    }
}

const getAdditionalStyles = colorName => {
    switch (colorName) {
        case 'pagination':
        case 'pagination:active':
            return `
                min-width: ${units.getValue(5)};
                border-left-width: 0;

                &:first-child {
                    border-left-width: ${getBorderWidth(colorName)};
                }
            `

        default:
            return ''
    }
}

export default {
    fontWeight: 700,
    getActiveStyles,
    getBackgroundColor,
    getBorderStyle,
    getTextColor,
    getTextColorName,
    getLoadingSpinnerColorName,
    getFocusStyles,
    getHoverStyles,
    getAdditionalStyles,

    padding: {
        xs: [0.5, 1],
        sm: [1, 1.5],
        mdsm: [1.5, 2],
        md: [2, 3],
        lg: [3, 4],
    },

    textSize: {
        xs: 0,
        sm: 0,
        mdsm: 1,
        md: 1,
        lg: 1,
    },

    textTransform: 'uppercase',
}



// WEBPACK FOOTER //
// ./app/styles/themes/america/buttons.js