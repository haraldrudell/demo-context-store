import PropTypes from 'prop-types'
import React from 'react'
import createReactClass from 'create-react-class'
import responsiveHelper from 'styles/shared/responsive'
import shallowCompare from 'utilities/shallow-compare'

import { StyledAvatar } from './styled-components'

export const SIZES = {
    xs: 4,
    sm: 6,
    smmd: 8,
    md: 10,
    lg: 14,
    xl: 16,
    xxl: 20,
    fluid: 'fluid',
}

const sizeType = PropTypes.oneOf(Object.keys(SIZES))

export const PROP_TYPES = {
    border: PropTypes.bool,
    borderStrokeWidth: PropTypes.string,
    children: PropTypes.object,
    display: PropTypes.oneOf(['inline', 'block', 'inline-block', 'inherit']),
    /**
     * `xs`, `sm`, `smmd`, `md`, `lg`, `xl`, `xxl`, 'fluid'
     */
    size: PropTypes.oneOfType([
        sizeType,
        PropTypes.shape({
            xs: sizeType,
            sm: sizeType,
            smmd: sizeType,
            md: sizeType,
            lg: sizeType,
            xl: sizeType,
        }),
    ]),
    /**
     * Avatar image source.
     */
    src: PropTypes.string,
    style: PropTypes.object,
}

export default createReactClass({
    displayName: 'Avatar',

    shouldComponentUpdate: shallowCompare,

    propTypes: PROP_TYPES,

    getDefaultProps() {
        return {
            borderStrokeWidth: '4px',
            src: 'https://www.patreon.com/images/profile_default.png',
            size: 'sm',
        }
    },

    render() {
        const { border, borderStrokeWidth, display, size, src } = this.props
        const avatarInlineStyle = this.props.style || {}
        avatarInlineStyle.backgroundImage = `url(${src})`
        let sizesByBreakpoint = typeof size === 'string' ? { xs: size } : size
        sizesByBreakpoint = responsiveHelper.transformValues(
            sizesByBreakpoint,
            avatarSize => SIZES[avatarSize],
        )

        return (
            <StyledAvatar
                b={border}
                borderColor="light"
                borderStrokeWidth={borderStrokeWidth}
                cornerRadius="circle"
                display={display}
                sizesByBreakpoint={sizesByBreakpoint}
                style={avatarInlineStyle}
            >
                {this.props.children}
            </StyledAvatar>
        )
    },
})



// WEBPACK FOOTER //
// ./app/components/Avatar/index.jsx