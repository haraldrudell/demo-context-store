import t from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import SvgImage from 'components/SvgImage'

import { TRADEMARK_SVGS, TYPES } from './constants'

const Logo = ({ color, colors, type, width, height, ...props }) => {
    const Trademark = TRADEMARK_SVGS[type]
    if (typeof Trademark === 'function') {
        return (
            <SvgImage
                el={Trademark}
                fills={colors || [color]}
                width={width}
                height={height}
                {...props}
            />
        )
    }

    return (
        <StyledImg
            src={Trademark}
            alt="Patreon trademark"
            width={width}
            height={height}
        />
    )
}
Logo.propTypes = {
    /**
     * Color of logo, will be ignored for `default` theme
     */
    color: t.oneOf(['highlightPrimary', 'gray1', 'gray3', 'white']),
    /**
     * Array of colors for two+ tone logos, will be ignored for `default` theme
     */
    colors: t.arrayOf(t.oneOf(['highlightPrimary', 'gray1', 'gray3', 'white'])),
    /**
     * Type of image, should be `logo` `logoOutline` `wordmark` or `wordmarkOutline`
     */
    type: t.oneOf(TYPES).isRequired,
    /**
     * Width of Logo (in units)
     */
    width: t.number.isRequired,
    /**
     * Height (in units)
     */
    height: t.number,
}

const StyledImg = styled.img`
    width: ${props =>
        props.width ? props.theme.units.getValue(props.width) : '100%'};
    ${props =>
        props.height
            ? `height: ${props.theme.units.getValue(props.height)}`
            : ''};
`

export default Logo



// WEBPACK FOOTER //
// ./app/components/Logo/index.jsx