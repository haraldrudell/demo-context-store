import t from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const unitsOrFluid = (props, propName, componentName) => {
    if (typeof props[propName] !== 'number' && props[propName] === 'fluid') {
        return new Error(
            'Invalid prop `' +
                propName +
                '` supplied to' +
                ' `' +
                componentName +
                '`. Expected a number of units or `fluid`,' +
                ' received `' +
                props[propName] +
                '`',
        )
    }
}

const SvgImage = ({ el, fills, width, height, ...props }) => {
    const Component = el
    return (
        <StyledSvgImage
            fills={fills}
            svgWidth={width}
            svgHeight={height}
            {...props}
        >
            <Component height="100" width="100%" />
        </StyledSvgImage>
    )
}
SvgImage.propTypes = {
    // React stateless component to render within this SvgImage
    el: t.oneOfType([t.node, t.func]).isRequired,
    // Fill for entire image.
    // Multiple fills will be distributed across <g>s within the svg
    fills: t.arrayOf(t.string),
    width: unitsOrFluid,
    height: unitsOrFluid,
    onClick: t.func,
}

const _getColor = (color, theme) => {
    return theme.colors[color] || color
}

const _fill = ({ theme, fills }) => {
    if (!fills) {
        return ''
    }
    if (fills.length > 1) {
        let fillsStr = ''
        fills.forEach((fill, i) => {
            fillsStr += `
                *[data-color='${(i + 1).toString()}'] {
                    fill: ${_getColor(fill, theme)};
                    transition: ${theme.transitions.default};
                }`
        })
        return fillsStr
    }
    return `
    g {
        fill: ${_getColor(fills[0], theme)};
    }`
}

const getDimensionValue = (theme, dimension) => {
    if (dimension === 'fluid') return '100%'
    return theme.units.getValue(dimension)
}

const StyledSvgImage = styled.span`
    ${props => `
    display: flex;
    svg {
        align-self: center;
        ${props.svgHeight
            ? `height: ${getDimensionValue(props.theme, props.svgHeight)};`
            : ''}
        ${props.svgWidth
            ? `width: ${getDimensionValue(props.theme, props.svgWidth)};`
            : ''}
        ${_fill(props)}
    }
    ${props.onClick ? 'cursor: pointer;' : ''}
`};
`

export default SvgImage



// WEBPACK FOOTER //
// ./app/components/SvgImage/index.jsx