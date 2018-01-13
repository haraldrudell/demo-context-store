import { css } from 'styled-components'

import SIZE_TO_UNITS, { ICON_SIZE_TO_UNITS } from 'constants/sizes'

import colors from '../colors'
import strokeWidths from '../stroke-widths'
import text from '../text'
import units from '../units'

const MARGIN_BOTTOM = 1

const getSize = size => SIZE_TO_UNITS[size] - 1
const border = color => `${strokeWidths.default} solid ${color}`
const leftPadding = (iconSize, paddingSize) =>
    units.getValue(iconSize + paddingSize + 1)
const bottomPaddingUnits = paddingSize => (paddingSize === 1 ? 1 : 1.25)

const getLabelStyle = (iconSize, paddingSize) => {
    return css`
        bottom: ${units.getValue(
            bottomPaddingUnits(paddingSize) + MARGIN_BOTTOM,
        )};
        left: ${iconSize ? leftPadding(iconSize, paddingSize) : 0};
        & + input::placeholder {
            opacity: 0;
            transition: opacity 0.1s ease-in;
        }
    `
}
const getMessageStyle = (iconSize, paddingSize) => css`
    margin-bottom: ${units.getValue(1)};
    margin-left: ${iconSize ? leftPadding(iconSize, paddingSize) : 0};
`

const getIconStyle = size => css`
    position: absolute;
    bottom: ${units.getValue(
        bottomPaddingUnits(SIZE_TO_UNITS[size]) + MARGIN_BOTTOM,
    )};
    left: ${units.getValue(1.5)};
    height: ${units.getValue(ICON_SIZE_TO_UNITS[size])}
`

const getPaddingStyle = (size, hasLabel) => {
    const paddingSize = getSize(size)
    const topPadding = hasLabel ? units.getValue(paddingSize) : 0
    return css`
        padding: ${topPadding} 0 ${units.getValue(
        bottomPaddingUnits(paddingSize),
    )};
    `
}
const getWithIconStyle = (iconSize, paddingSize) => css`
    margin-left: ${leftPadding(iconSize, paddingSize)};
`

export default {
    activeLabelStyle: css`
        top: -${units.getValue(1.25)};
        font-size: ${text.getSize(0)};
        & + input::placeholder {
            opacity: 1;
        }
    `,
    disabledStyle: css`
        opacity: 0.33;
    `,
    errorStyle: css`
        input {
            border-color: ${colors.error};
        }
    `,
    focusedStyle: css`
        input, textarea {
            border-color: ${colors.highlightSecondary};
            outline: none;
        }
    `,
    focusedLabelStyle: css`
        color: ${colors.highlightSecondary};
    `,
    inputContainerStyle: null,
    inputStyle: css`
        transition: border 0.2s ease-in;
        border-bottom: ${border(colors.gray5)};
        margin-bottom: ${units.getValue(MARGIN_BOTTOM)};
        outline: none;
    `,
    prefixStyle: css`
        margin-right: ${units.getValue(1)};
    `,
    getMessageStyle,
    getIconStyle,
    getLabelStyle,
    getPaddingStyle,
    getWithIconStyle,
}



// WEBPACK FOOTER //
// ./app/styles/themes/america/components/input.js