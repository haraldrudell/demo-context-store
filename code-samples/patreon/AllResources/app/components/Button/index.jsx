import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled, { css } from 'styled-components'

import LoadingSpinner from 'components/LoadingSpinner'

import { getThemePrimitives } from 'styles/themes'

const THEME = {
    buttons: getThemePrimitives().buttons,
}
export const BUTTON_COLORS = [
    // Functional color names.
    'primary',
    'secondary',
    'tertiary',
    'tertiary-inverse',
    'success',
    'error',
    // Not really colors, but another way of requesting specific variations on styles
    'pagination',
    'pagination:active',
    // Deprecated. Please use functional names instead of descriptive names.
    'gray',
    'darkGray',
    'orange',
    'blue',
    'whitestGray',
    'lightestGray',
    'subduedGray',
    'green',
    'white',
    // social colors
    'facebookBlue',
    'twitterBlue',
    'discordBlurple',
    'twitchPurple',
]

export const BUTTON_SIZES = ['xs', 'sm', 'mdsm', 'md', 'lg']

class Button extends Component {
    static propTypes = {
        /**
         * Applies `display: block;`
         */
        block: PropTypes.bool,

        /**
         * Content of button.
         */
        children: PropTypes.node,

        /**
         * @NOTE: in the America theme, `secondary` will default to the `primary` color.
         * `primary` `secondary` `tertiary` `tertiary-inverse` `success`
         */
        color: PropTypes.oneOf(BUTTON_COLORS),

        /**
         * Applies disabled styling to the button.
         */
        disabled: PropTypes.bool,

        /**
         * Render as an `<div>`.
         */
        div: PropTypes.bool,

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
         * Render as an `<input>`.
         */
        input: PropTypes.bool,
        /**
         * Renders loading spinner in place of the button label.
         */
        isLoading: PropTypes.bool,

        /**
         * Prevent button text from wrapping.
         */
        noWrap: PropTypes.bool,

        /**
         * Callback function for button click.
         */
        onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),

        /**
         * `xs` `sm` `mdsm` `md` `lg`
         */
        size: PropTypes.oneOfType([
            PropTypes.oneOf(BUTTON_SIZES),
            PropTypes.shape({
                xs: PropTypes.oneOf(BUTTON_SIZES),
                sm: PropTypes.oneOf(BUTTON_SIZES),
                md: PropTypes.oneOf(BUTTON_SIZES),
                lg: PropTypes.oneOf(BUTTON_SIZES),
                xl: PropTypes.oneOf(BUTTON_SIZES),
            }),
        ]),

        /**
         * Provide the `target` for your anchor.
         */
        target: PropTypes.string,

        /**
         * HTML `type` attribute. See [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes).
         */
        type: PropTypes.string,

        /**
         * In conjunction with the `input` prop, sets the button text.
         */
        value: PropTypes.string,

        'data-test-tag': PropTypes.string,
        'data-tag': PropTypes.string,

        name: PropTypes.string,
        id: PropTypes.string,
    }

    static defaultProps = {
        block: false,
        color: 'gray',
        disabled: false,
        fluid: false,
        size: 'md',
        isLoading: false,
    }

    preventDefault = e => {
        e.preventDefault()
    }

    handleClick = e => {
        /* css pointer-events handles this for most browsers, but need this for IE10 -gb */
        if (this.props.disabled) return
        if (this.props.onClick) this.props.onClick(e)
    }

    render() {
        const {
            block,
            children,
            color,
            disabled,
            div,
            download,
            fluid,
            href,
            id,
            input,
            isLoading,
            noWrap,
            onClick,
            size,
            target,
            type,
            value,
            name,
        } = this.props

        const isDisabled = isLoading || disabled
        const sizesByBreakpoint = typeof size === 'string' ? { xs: size } : size

        const commonProps = {
            block,
            color,
            disabled: isDisabled,
            id,
            fluid,
            noWrap,
            isClickable: !!(onClick || href || type === 'submit'),
            onClick: this.handleClick,
            sizesByBreakpoint,
            type: type || 'button',
            name,
            'data-test-tag': this.props['data-test-tag'],
            'data-tag': this.props['data-tag'],
        }

        const loaderColor = THEME.buttons.getLoadingSpinnerColorName(color)
        // TODO: make LoadingSpinner.size a responsive prop. For now, just use our size at the xs breakpoint
        let sizeForLoadingSpinner = sizesByBreakpoint.xs
        if (['xxs', 'xs', 'sm', 'mdsm'].indexOf(sizeForLoadingSpinner) !== -1) {
            sizeForLoadingSpinner = 'sm'
        }

        const loadingContents = (
            <LoadingWrapper>
                <LoadingSpinner
                    size={sizeForLoadingSpinner}
                    color={loaderColor}
                />
            </LoadingWrapper>
        )

        const content = (
            <ChildrenWrapper hide={isLoading}>{children}</ChildrenWrapper>
        )

        // Render an <a>

        if (href || target) {
            const anchorProps = {
                href: href || '#',
                role: 'button',
            }
            if (target) {
                anchorProps['target'] = target
            }
            return (
                <StyledAnchor
                    {...commonProps}
                    {...anchorProps}
                    download={download}
                >
                    {isLoading && loadingContents}
                    {content}
                </StyledAnchor>
            )
        }

        // Render an <input>
        if (input) {
            const inputProps = {
                onMouseDown: this.preventDefault,
                type: type,
                value: value,
            }
            return <StyledInput {...commonProps} {...inputProps} />
        }

        // Render a div
        if (div) {
            const inputProps = {
                onMouseDown: this.preventDefault,
                type: type,
                value: value,
            }
            return (
                <StyledDiv {...commonProps} {...inputProps}>
                    {isLoading && loadingContents}
                    {content}
                </StyledDiv>
            )
        }

        /**
         *  NOTE: preventDefault is being used on onMouseDown to prevent buttons
         *  focusing on a mouse click. This has not been tested with browsers
         *  other than Chrome (Mac) and may have unintended side effects.
         */

        return (
            <StyledButton {...commonProps} onMouseDown={this.preventDefault}>
                {isLoading && loadingContents}
                {content}
            </StyledButton>
        )
    }
}

// The z-index of the content in the loading spinner is relative to the styled-button, so it
// goes above the button content when isLoading is true
const LoadingWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: ${props => props.theme.zIndex.Z_INDEX_HIGHEST};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const ChildrenWrapper = styled.div`
    visibility: ${props => (props.hide ? 'hidden' : 'visible')};
`

const responsiveFontSize = ({ sizesByBreakpoint, theme }) => {
    const fontSizesByBreakpoint = theme.responsive.transformValues(
        sizesByBreakpoint,
        size => theme.text.getSize(theme.buttons.textSize[size]),
    )
    return theme.responsive.cssPropsForBreakpointValues(
        fontSizesByBreakpoint,
        'font-size',
    )
}

const responsivePadding = ({ sizesByBreakpoint, theme }) => {
    const paddingByBreakpoint = theme.responsive.transformValues(
        sizesByBreakpoint,
        size => theme.units.getValues(theme.buttons.padding[size]),
    )
    return theme.responsive.cssPropsForBreakpointValues(
        paddingByBreakpoint,
        'padding',
    )
}

const commonStyles = css`
    backface-visibility: hidden;
    background-color: ${props =>
        props.theme.buttons.getBackgroundColor(props.color)};
    border: ${props => props.theme.buttons.getBorderStyle(props.color)};
    border-radius: ${props => props.theme.cornerRadii.default};
    box-sizing: border-box;
    color: ${props => props.theme.buttons.getTextColor(props.color)} !important;
    display: ${props => (props.block ? 'block' : 'inline-block')};
    ${props => (props.disabled ? 'opacity: 0.33;' : '')} ${props =>
            responsiveFontSize(props)};
    font-weight: ${props => props.theme.buttons.fontWeight};
    ${props => responsivePadding(props)};
    ${props =>
        props.disabled ? 'pointer-events: none;' : ''} position: relative;
    text-align: center;
    text-decoration: none;
    text-transform: ${props => props.theme.buttons.textTransform};
    transition: ${props => props.theme.transitions.default};
    user-select: none;
    white-space: ${props => (props.noWrap ? 'nowrap' : 'inherit')};
    cursor: ${props => (props.isClickable ? 'pointer' : 'default')};
    ${props => (props.fluid ? 'width: 100%;' : '')} &:focus {
        ${props => props.theme.buttons.getFocusStyles(props.color)};
    }

    &:hover {
        ${props =>
            !props.disabled && props.isClickable
                ? props.theme.buttons.getHoverStyles(props.color)
                : ''};
    }

    &:active {
        ${props =>
            !props.disabled
                ? props.theme.buttons.getActiveStyles(props.color)
                : ''};
    }

    ${props => props.theme.buttons.getAdditionalStyles(props.color)};
`

const StyledAnchor = styled.a`
    ${commonStyles};
`
const StyledButton = styled.button`
    ${commonStyles};
`
const StyledDiv = styled.div`
    ${commonStyles};
`
const StyledInput = styled.input`
    ${commonStyles};
`

export default Button



// WEBPACK FOOTER //
// ./app/components/Button/index.jsx