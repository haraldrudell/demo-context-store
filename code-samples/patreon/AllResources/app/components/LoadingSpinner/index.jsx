import t from 'prop-types'
import React from 'react'

import styled, { keyframes } from 'styled-components'

export default function LoadingSpinner(props) {
    const { center, color, size } = props
    return (
        <Spinner
            center={center}
            color={color}
            size={size}
            data-tag={props['data-tag']}
        />
    )
}

LoadingSpinner.propTypes = {
    /**
     * Size: `sm` `md` `lg` or `fluid`
     **/
    size: t.oneOf(['sm', 'md', 'lg', 'fluid']),
    color: t.oneOf([
        'highlightPrimary',
        'highlightSecondary',
        'dark',
        'gray2',
        'light',
        'lightGray',
        'subduedGray',
        'white',
    ]),
    'data-tag': t.string,
    center: t.bool,
}

LoadingSpinner.defaultProps = {
    size: 'lg',
    color: 'highlightSecondary',
    center: true,
}

const animation = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`

const thicknessMap = {
    sm: '2px',
    md: '2px',
    lg: '4px',
    fluid: '4px',
}

const unitsMap = {
    sm: 2,
    md: 3,
    lg: 6,
}

const color = props => props.theme.colors[props.color]
const thickness = props => thicknessMap[props.size] || '2px'
const size = props => {
    if (props.size === 'fluid') {
        return '100%'
    }
    return props.theme.units.getValue(unitsMap[props.size] || 4)
}

const Spinner = styled.div`
    ${props => (props.center ? 'margin-left: auto; margin-right: auto' : '')};

    border: ${props => `${thickness(props)} solid ${color(props)}`};
    border-top: ${props => `${thickness(props)} solid transparent`};
    height: ${props => size(props)};
    width: ${props => size(props)};
    box-sizing: border-box;
    animation: ${animation} 1100ms infinite linear;
    border-radius: 50%;
`



// WEBPACK FOOTER //
// ./app/components/LoadingSpinner/index.jsx