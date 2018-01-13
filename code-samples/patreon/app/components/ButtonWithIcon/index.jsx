import PropTypes from 'prop-types'
import React, { Component } from 'react'

import styled from 'styled-components'
import { getThemePrimitives } from 'styles/themes'

import Button from 'components/Button'
import Flexy from 'components/Layout/Flexy'
import Icon from 'components/Icon'
import { BUTTON_COLORS, BUTTON_SIZES } from 'components/Button'
import { ICON_SIZE_TO_UNITS as ICON_SIZES } from 'constants/sizes'

const buttonToIconSize = {
    xs: 'xxxs',
    sm: 'xxs',
    md: 'xxs',
    lg: 'xs',
}
const THEME = {
    buttons: getThemePrimitives().buttons,
}

const iconSizes = Object.keys(ICON_SIZES)

class ButtonWithIcon extends Component {
    static propTypes = {
        /**
         * Applies `display: block;`
         */
        block: PropTypes.bool,

        /**
         * Custon button content
         */
        children: PropTypes.node,

        /**
         * `primary` `secondary` `tertiary` `tertiary-inverse` `success`,
         * `facebookBlue`, `twitterBlue`, `discordBlurple`
         */
        color: PropTypes.oneOf(BUTTON_COLORS).isRequired,

        /**
         * Applies disabled styling to the button.
         */
        disabled: PropTypes.bool,

        /**
         * Treat links as downloadable content (rather than redirecting the tab or opening a new tab)
         */
        download: PropTypes.bool,

        /**
         * Render the button w/ 100% width.
         */
        fluid: PropTypes.bool,

        /**
         * When provided, an `<a>` is rendered in place of `<button>`.
         */
        href: PropTypes.string,

        /**
         * Icon to use
         */
        icon: PropTypes.string.isRequired,

        /**
         * Override icon color. Should only be needed in special circumstances.
         */
        iconColor: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
        ]),

        /**
         * Overrides the button-size-based icon size
         */
        iconSize: PropTypes.oneOf(iconSizes),

        /**
         * Renders loading spinner in place of the button label.
         */
        isLoading: PropTypes.bool,

        /**
         * Callback function for button click.
         */
        onClick: PropTypes.func,

        /**
         * `xs` `sm` `md` `lg`
         */
        size: PropTypes.oneOf(BUTTON_SIZES),

        /**
         * Provide the `target` for your anchor.
         */
        target: PropTypes.string,

        /**
         * HTML `type` attribute. See [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes).
         */
        type: PropTypes.string,
    }

    static defaultProps = {
        size: 'md',
    }

    render() {
        const {
            block,
            children,
            color,
            disabled,
            download,
            fluid,
            href,
            icon,
            iconColor,
            iconSize,
            isLoading,
            onClick,
            size,
            target,
            type,
        } = this.props

        const buttonProps = {
            block,
            color,
            disabled,
            download,
            fluid,
            href,
            isLoading,
            noWrap: true,
            onClick,
            size,
            target,
            type,
        }

        const iSize = iconSize || buttonToIconSize[size]
        const paddingUnits = iSize === 'xs' || iSize === 'sm' ? 1 : 1.5

        return (
            <Button {...buttonProps}>
                <Flexy alignItems="center" justifyContent="center">
                    <Icon
                        type={icon}
                        size={iSize}
                        color={
                            iconColor || THEME.buttons.getTextColorName(color)
                        }
                    />
                    <Spacer width={paddingUnits} />
                    {children}
                </Flexy>
            </Button>
        )
    }
}

const Spacer = styled.div`
    width: ${props => props.theme.units.getValue(props.width)};
    height: 1px;
`

export default ButtonWithIcon



// WEBPACK FOOTER //
// ./app/components/ButtonWithIcon/index.jsx