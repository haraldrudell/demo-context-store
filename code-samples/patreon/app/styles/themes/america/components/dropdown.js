import { css } from 'styled-components'

import colors from '../colors'
import strokeWidths from '../stroke-widths'
import units from '../units'

// @TODO: Handle different handle styles
const getHandleStyle = (borderColor, isOpen) => css`
    border-bottom: ${strokeWidths.default} solid ${colors[borderColor]};
    padding: ${units.getValues([1, 1, 1, 0])};
`

const getContainerStyle = borderColor => css`
    box-shadow: 0 2px 3px 0 rgba(0,0,0,0.22);
    /* Adds margin to the bottom of the page if dropdown is at bottom */
    margin-bottom: ${units.getValue(4)};
`

const headerStyle = css`
    padding: ${units.getValue(2)};
`

export default {
    getContainerStyle,
    getHandleStyle,
    headerStyle: headerStyle,
}



// WEBPACK FOOTER //
// ./app/styles/themes/america/components/dropdown.js