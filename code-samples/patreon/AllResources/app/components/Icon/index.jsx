// For single-color, square icons. Paths should fit into a ~'0 0 8 8' viewbox.
// Use https://jakearchibald.github.io/svgomg/ to minify and get path data.
import PropTypes from 'prop-types'

import React, { Component } from 'react'
import styled from 'styled-components'

import { getThemePrimitives } from 'styles/themes'
import { ICON_SIZE_TO_UNITS } from 'constants/sizes'

import exists from 'utilities/exists'
import shallowCompare from 'utilities/shallow-compare'

import SvgImage from 'components/SvgImage'

// @TODO: remove
const LABEL_SIZES = {
    xxs: '0.75rem',
    xs: '1rem',
    sm: '1.5rem',
    md: '2rem',
    lg: '2.5rem',
    xl: '3rem',
    xxl: '5rem',
    xxxl: '8rem',
}

// @TODO: remove
const DEFAULT_LABEL_MARGINS = {
    xxs: 0.5, // units
    xs: 1,
    sm: 1.5,
    md: 2,
    lg: 3,
    xl: 3,
    xxl: 5,
    xxxl: 8,
    fluid: 1,
}

const THEME = {
    colors: getThemePrimitives().colors,
    units: getThemePrimitives().units,
}

const iconOnlyColors = {
    patronGold: '#f9aa5a',
    nonPatronBrass: '#c98e52',
    currentColor: 'currentColor',
}

// Icons that require a slightly different viewbox.
const FIX_VIEWBOX = {
    cancel: y,
    close: x,
    reload: y,
    socialRoundedPinterest: x,
    socialRoundedGoogleplus: x,
    download: x,
    block: x,
    // TODO: custom viewbox for Play icon
}

class Icon extends Component {
    shouldComponentUpdate = shallowCompare

    static propTypes = {
        /**
         * @DEPRECATED
         */
        children: PropTypes.element,
        color: PropTypes.oneOfType([
            // for 1-color icons
            PropTypes.string,
            // for multi-color icons (only works in America)
            PropTypes.arrayOf(PropTypes.string),
        ]),
        /**
         * @DEPRECATED – use <Text> instead
         */
        label: PropTypes.string,
        /**
         * @DEPRECATED – use <Text> instead
         */
        labelBold: PropTypes.bool,
        /**
         * @DEPRECATED – use <Text> instead
         */
        labelMargin: PropTypes.string,
        onClick: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        padding: PropTypes.number,
        size: PropTypes.oneOf(Object.keys(ICON_SIZE_TO_UNITS)),
        type: PropTypes.string.isRequired,
    }

    static defaultProps = {
        color: 'gray2',
        size: 'xs',
    }

    // @TODO: remove instances of labels, then remove this function
    renderLabelElement() {
        const { color, label, labelBold, labelMargin, size } = this.props
        if (exists(label)) {
            let margin
            if (labelMargin) {
                margin = labelMargin
            }

            const labelProps = {
                color,
                labelBold,
                margin,
                size,
            }

            return (
                <StyledLabel {...labelProps}>
                    {label}
                </StyledLabel>
            )
        } else {
            return null
        }
    }

    // @TODO: port old icons to new system
    renderSvg() {
        const { color, size, type } = this.props

        let fills = []
        if (typeof color === 'string') {
            fills = [color]
        } else if (Array.isArray(color)) {
            fills = color
        }

        let svg
        try {
            svg = require('./america_svg_paths/' + type + '.jsx').default
            return (
                <SvgImage
                    el={svg}
                    svgHeight={ICON_SIZE_TO_UNITS[size]}
                    svgWidth={ICON_SIZE_TO_UNITS[size]}
                    fills={fills}
                />
            )
        } catch (e) {
            svg = require('./default_svg_paths/' + type + '.html').trim()
        }

        const sizeValue =
            typeof ICON_SIZE_TO_UNITS[size] === 'number'
                ? THEME.units.getValue(ICON_SIZE_TO_UNITS[size])
                : '100%' // covers 'fluid' case

        const oneColor = typeof color === 'string' ? color : color[0]

        /* wrap svg in a div as a quick fix so it doesn't resize when flexing */
        return (
            <div>
                <StyledSVG
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={`${_getXYCoordinates(this.props.type)} 8 8`}
                    svgWidth={sizeValue}
                    svgHeight={sizeValue}
                    dangerouslySetInnerHTML={{ __html: svg }}
                    key={type}
                    color={oneColor}
                />
            </div>
        )
    }

    render() {
        const {
            onClick,
            onMouseEnter,
            onMouseLeave,
            padding,
            size,
        } = this.props

        // `key` attr required to force safari to re-render when icon type changes
        // https://github.com/facebook/react/issues/2863
        return (
            <IconWrapper
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                fluid={size === 'fluid'}
                padding={padding}
            >
                {this.renderSvg()}
                {this.renderLabelElement()}
                {this.props.children}
            </IconWrapper>
        )
    }
}

function _getXYCoordinates(iconType) {
    return FIX_VIEWBOX[iconType] ? FIX_VIEWBOX[iconType]() : '0 0'
}

function x() {
    return '0.5 0'
}

function y() {
    return '0 0.5'
}

// @TODO: clean out custom colors and remove
function getColor(color) {
    return THEME.colors[color] || iconOnlyColors[color] || color
}

const IconWrapper = styled.div`
    align-self: center;
    align-items: center;
    display: inline-flex !important;
    padding: ${props => props.theme.units.getValue(props.padding)};
    ${props => (!!props.onClick ? 'cursor: pointer' : '')} ${props =>
            props.fluid
                ? `
        height: 100%;
        width: 100%;
    `
                : ''};
`

const StyledSVG = styled.svg`
    display: block;
    fill: ${props => getColor(props.color)};
    transition: ${props => props.theme.transitions.default};
    width: ${props => props.svgWidth};
    height: ${props => props.svgHeight};

    path {
        fill: ${props => getColor(props.color)};
    }
`

const StyledLabel = styled.label`
    color: ${props => getColor(props.color)};
    font-size: ${props => LABEL_SIZES[props.size]};
    font-weight: ${props => (props.labelBold ? 'bold' : 'normal')};
    margin-left: ${props =>
        props.margin ||
        props.theme.units.getValue(DEFAULT_LABEL_MARGINS[props.size])};
`

export default Icon



// WEBPACK FOOTER //
// ./app/components/Icon/index.jsx