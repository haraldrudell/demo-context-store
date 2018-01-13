import PropTypes from 'prop-types'
import React, { Component } from 'react'
import shallowCompare from 'utilities/shallow-compare'
import styled, { css } from 'styled-components'

const unitsForSize = {
    xs: 4,
    sm: 6,
    md: 10,
    lg: 14,
    xl: 16,
    xxl: 20,
}

export default class RoundedCornersImage extends Component {
    shouldComponentUpdate = shallowCompare

    static propTypes = {
        src: PropTypes.string.isRequired,
        size: PropTypes.oneOf(Object.keys(unitsForSize)).isRequired,
    }

    static defaultProps = {
        size: 'sm',
    }

    render() {
        return (
            <RoundedCornersImageEl
                src={this.props.src}
                size={this.props.size}
            />
        )
    }
}

export const cssForRoundedCornersImageSize = (size, theme) => {
    const numUnits = unitsForSize[size]
    const cssValue = theme.units.getValue(numUnits)
    return css`
    border-radius: 5px;
    width: ${cssValue};
    min-width: ${cssValue};
    height: ${cssValue};
`
}

const RoundedCornersImageEl = styled.img`
    object-fit: cover;
    background-clip: padding-box;

    ${props => cssForRoundedCornersImageSize(props.size, props.theme)};
`



// WEBPACK FOOTER //
// ./app/components/RoundedCornersImage/index.jsx