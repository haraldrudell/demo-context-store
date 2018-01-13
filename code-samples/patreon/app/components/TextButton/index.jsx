import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import { textSizeType } from 'components/Text'
import {
    sizeValuesByBreakpoint,
    responsiveSize,
    responsiveLineHeight,
} from 'components/Text/responsive-utils'

class TextButton extends Component {
    static propTypes = {
        /**
         * `left` `center` `right`
         */
        align: PropTypes.oneOf(['left', 'center', 'right']),
        /**
         * TextButton copy.
         */
        children: PropTypes.node.isRequired,

        /**
         * America options: `default` `dark` `subdued` `light` `primary`
         */
        color: PropTypes.oneOf([
            'default',
            'dark',
            'subdued',
            'light',
            'primary',

            // @DEPRECATED legacy colors
            'orange',
            'blue',
            'dark',
            'subduedGray',
            'gray',
            'white',
            'facebookBlue',
        ]),

        /**
         * Applies disabled styling to the TextButton.
         */
        disabled: PropTypes.bool,

        /**
         * Link destination.
         */
        href: PropTypes.string,

        /**
         * Italicizes the text – only for very special cases!
         */
        italic: PropTypes.bool,

        /**
         * @DEPRECATED: use `target` prop instead.
         */
        newWindow: PropTypes.bool,

        /**
         * Executes on click.
         */
        onClick: PropTypes.func,

        /**
         * @DEPRECATED: Use `size` prop instead.
         */
        scale: PropTypes.oneOf(['00', '0', '1', '2', '3', '4', '5', '6']),

        /**
         * Integer between `-1` and `6`.
         */
        size: textSizeType,

        /**
         * `target` attribute of the rendered `<a>`
         */
        target: PropTypes.oneOf(['_self', '_blank', '_parent', '_top']),

        /**
         * The title or a description of the linked document.
         * [MDN article](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title)
         */
        title: PropTypes.string,

        /**
         * Boolean. If true, the component will fill 100% width.
         */
        fluid: PropTypes.bool,

        /**
         * Boolean. If true, the component will be display: inline (vs display: inline-block).
         */
        inline: PropTypes.bool,

        /**
         * Convert all characters to uppercase.
         */
        uppercase: PropTypes.bool,

        /**
         * @DEPRECATED with America theme.
         */
        underline: PropTypes.bool,

        /**
         * @DEPRECATED with America theme.
         */
        weight: PropTypes.oneOf([
            'thin',
            'light',
            'normal',
            'medium',
            'bold',
            'ultrabold',
        ]),
    }

    static defaultProps = {
        color: 'blue',
        disabled: false,
        size: 1,
        weight: 'bold',
    }

    handleClick = e => {
        /* css pointer-events handles this for most browsers, but need this for IE10 -gb */
        if (this.props.disabled) {
            e.preventDefault()
            return
        }
        if (this.props.onClick) this.props.onClick(e)
    }

    render() {
        const {
            align,
            children,
            color,
            href,
            italic,
            newWindow,
            scale,
            size,
            target,
            title,
            underline,
            uppercase,
            weight,
            fluid,
            inline,
        } = this.props

        // @TODO migrate off usage of `newWindow`
        const anchorTarget = target || (newWindow ? '_blank' : '_self')

        const props = {
            align,
            color,
            href,
            italic,
            onClick: this.handleClick,
            sizeValuesByBreakpoint: sizeValuesByBreakpoint(size, scale),
            target: anchorTarget,
            title,
            underline,
            uppercase,
            weight,
            fluid,
            inline,
        }

        return (
            <Anchor {...this.props} {...props}>
                {children}
            </Anchor>
        )
    }
}

const Anchor = styled.a`
    color: ${props => props.theme.textButtons.getColor(props.color)};
    cursor: pointer;
    display: ${props => (props.inline ? 'inline' : 'inline-block')};
    ${props => (props.disabled ? 'opacity: 0.33' : '')};
    ${props => (props.italic ? 'font-styles: italic' : '')};
    ${props => (props.fluid ? 'width: 100%' : '')};
    font-weight: ${props =>
        props.theme.textButtons.weight ||
        props.theme.text.getWeight(props.weight)};
    max-width: 100%;
    ${props =>
        props.disabled ? 'pointer-events: none;' : ''} overflow: hidden;
    ${'' /* @TODO: remove !important once base styles are resolved */} ${props => {
            return (
                props.theme.textButtons.underline ||
                (props.underline
                    ? 'text-decoration: underline !important;'
                    : 'text-decoration: none;')
            )
        }} text-decoration-skip: ink;
    text-align: ${props => props.align || 'inherit'};
    text-overflow: ellipsis;
    text-transform: ${props => (props.uppercase ? 'uppercase' : 'inherit')};
    transition: ${props => props.theme.transitions.default};
    vertical-align: bottom;

    ${props => responsiveSize(props.sizeValuesByBreakpoint, props.theme)};
    ${props =>
        responsiveLineHeight(
            props.lineHeight,
            props.sizeValuesByBreakpoint,
            props.theme,
        )};

    &:visited {
        ${props => props.theme.textButtons.getVisitedStyles(props.color)};
    }

    &:hover {
        ${props =>
            !props.disabled
                ? props.theme.textButtons.getHoverStyles(props.color)
                : ''};
    }
`

export default TextButton



// WEBPACK FOOTER //
// ./app/components/TextButton/index.jsx