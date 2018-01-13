import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { getThemeFont } from 'styles/themes'
import { TEXT_SIZES } from 'styles/shared/text'
import {
    sizeValuesByBreakpoint,
    responsiveSize,
    responsiveLineHeight,
} from './responsive-utils'

export const textSizeType = PropTypes.oneOfType([
    PropTypes.oneOf(TEXT_SIZES),
    PropTypes.shape({
        xs: PropTypes.oneOf(TEXT_SIZES),
        sm: PropTypes.oneOf(TEXT_SIZES),
        md: PropTypes.oneOf(TEXT_SIZES),
        lg: PropTypes.oneOf(TEXT_SIZES),
        xl: PropTypes.oneOf(TEXT_SIZES),
    }),
])

class Text extends Component {
    static propTypes = {
        /**
         * `left` `center` `right`
         */
        align: PropTypes.oneOf(['left', 'center', 'right']),

        /**
         * Text content.
         */
        children: PropTypes.node,

        /**
         * `highlightPrimary` `highlightSecondary` `gray1` `gray2` `gray3`
         * `gray4` `gray5` `gray6` `gray7` `gray8` `light` `success` `error`
         *
         * @DEPRECATED default colors:
         * `dark` `subduedGray` `orange` `white`, `green`, `red`, `lightestGray`, `gray`
         */
        color: PropTypes.oneOf([
            'highlightPrimary',
            'highlightSecondary',
            'gray1',
            'gray2',
            'gray3',
            'gray4',
            'gray5',
            'gray6',
            'gray7',
            'gray8',
            'light',
            'success',
            'error',

            // @DEPRECATED
            'dark',
            'subduedGray',
            'orange',
            'white',
            'green',
            'red',
            'lightestGray',
            'gray',
            'errorOrange',
            'milestoneBrown',
            'milestoneDarkGreen',
            'milestoneDarkBlue',
        ]),

        /**
         * `div`, `span` `p` `label` `h1` `h2` `h3` `h4` `h5` `h6`
         */
        el: PropTypes.oneOf([
            'div',
            'span',
            'p',
            'label',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
        ]),

        /**
         * Hide overflow and ellipsize.
         */
        ellipsis: PropTypes.bool,

        /**
         * Automatically set by the theme, but can be overridden if needed.
         */
        font: PropTypes.oneOf(['lato', 'america']),

        /**
         * Use a plain number to set line-height relative to the text’s size.
         */
        lineHeight: PropTypes.number,

        /**
         * Determines how whitespace inside an element is handled.
         * See the [MDN article](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
         */
        whiteSpace: PropTypes.oneOf([
            'normal',
            'nowrap',
            'pre',
            'pre-line',
            'pre-wrap',
        ]),

        /**
         * Specify whether a word can be broken if the line would otherwise be
         * wider than the container
         * See the [MDN article](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap)
         */
        overflowWrap: PropTypes.oneOf([
            'normal',
            'break-word',
            'inherit',
            'unset',
            'initial',
        ]),

        /**
         * If rendered as a paragraph or header tag, remove top and bottom margins.
         */
        noMargin: PropTypes.bool,

        /**
         * Prevent user selection of the text.
         */
        noSelect: PropTypes.bool,

        /**
         * `0.0` to `1.0`
         */
        opacity: PropTypes.number,

        /**
         * Text to appear on hover over the element.
         */
        title: PropTypes.string,

        /**
         * Boolean which enables/disables auto viewport scaling
         */
        autoScale: PropTypes.bool,

        /**
         * @DEPRECATED: use `size` prop instead.
         */
        scale: PropTypes.oneOf(['00', '0', '1', '2', '3', '4', '5', '6', '7']),

        /**
         * Integer between -1 and 6.
         */
        size: textSizeType,

        /**
         * `normal` `wide`
         */
        tracking: PropTypes.oneOf(['normal', 'wide']),

        /**
         * Convert all characters to uppercase.
         */
        uppercase: PropTypes.bool,

        /**
         * America: `normal` `bold`
         * Default: `thin` `light` `normal` `medium` `bold` `ultrabold`
         */
        weight: PropTypes.oneOf([
            'thin',
            'light',
            'normal',
            'medium',
            'bold',
            'ultrabold',
        ]),

        /**
         * Hooks for finding this element easily in tests
         */
        'data-tag': PropTypes.string,

        textShadow: PropTypes.string,
    }

    static defaultProps = {
        autoScale: true,
        color: 'gray1',
        el: 'span',
        font: getThemeFont(),
        size: 1,
    }

    render() {
        const {
            align,
            autoScale,
            children,
            color,
            el,
            ellipsis,
            font,
            lineHeight,
            noMargin,
            noSelect,
            opacity,
            scale,
            size,
            tracking,
            uppercase,
            weight,
            title,
            overflowWrap,
            whiteSpace,
            textShadow,
        } = this.props

        const props = {
            autoScale,
            align,
            children,
            color,
            el,
            ellipsis,
            font,
            lineHeight,
            noMargin,
            noSelect,
            opacity,
            sizeValuesByBreakpoint: sizeValuesByBreakpoint(
                size,
                scale,
                autoScale,
            ),
            tracking,
            uppercase,
            weight,
            title,
            whiteSpace,
            overflowWrap,
            textShadow,
            'data-tag': this.props['data-tag'],
        }

        switch (el) {
            case 'div':
                return <Div {...props} />
            case 'span':
                return <Span {...props} />
            case 'p':
                return <P {...props} />
            case 'label':
                return <Label {...props} />
            case 'h1':
                return <H1 {...props} />
            case 'h2':
                return <H2 {...props} />
            case 'h3':
                return <H3 {...props} />
            case 'h4':
                return <H4 {...props} />
            case 'h5':
                return <H5 {...props} />
            case 'h6':
                return <H6 {...props} />
        }
    }
}

const capitalizeFirstLetter = string => {
    if (!string) return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const ellipsisStyles = props =>
    props.ellipsis &&
    css`
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `

const styles = css`
    color: ${props => props.theme.text.getColor(props.color)};
    font-family: ${props => capitalizeFirstLetter(props.font)}, sans-serif;
    font-weight: ${props =>
        props.theme.text.getWeight(props.weight)} !important;
    letter-spacing: ${props =>
        props.tracking ? props.theme.text.tracking[props.tracking] : 'inherit'};
    margin: ${props =>
        props.noMargin ? '0' : props.theme.text.getMargin(props.el)};
    opacity: ${props => (props.opacity ? `${props.opacity}` : '1')};
    ${ellipsisStyles} position: relative;
    ${props =>
        props.whiteSpace ? `white-space: ${props.whiteSpace};` : ''} ${props =>
            props.overflowWrap
                ? `overflow-wrap: ${props.overflowWrap};`
                : ''} text-align: ${props => props.align || 'inherit'};
    text-transform: ${props => (props.uppercase ? 'uppercase' : 'inherit')};
    text-shadow: ${props => props.textShadow || 'none'};
    transition: ${props => props.theme.transitions.default};
    user-select: ${props => (props.noSelect ? 'none' : 'inherit')};

    ${props =>
        responsiveSize(
            props.sizeValuesByBreakpoint,
            props.theme,
            props.autoScale,
        )};
    ${props =>
        responsiveLineHeight(
            props.lineHeight,
            props.sizeValuesByBreakpoint,
            props.theme,
            props.autoScale,
        )};

    strong {
        font-weight: ${props => props.theme.text.getWeight('bold')};
    }

    small {
        font-size: ${props => props.theme.text.getSize(0)};
    }
`

const Div = styled.div`
    ${styles};
`
const Span = styled.span`
    ${styles};
`
const P = styled.p`
    ${styles};
`
const Label = styled.label`
    ${styles};
`
const H1 = styled.h1`
    ${styles};
`
const H2 = styled.h2`
    ${styles};
`
const H3 = styled.h3`
    ${styles};
`
const H4 = styled.h4`
    ${styles};
`
const H5 = styled.h5`
    ${styles};
`

const H6 = styled.h6`
    ${styles};
`

export default Text



// WEBPACK FOOTER //
// ./app/components/Text/index.jsx