import styled, { css } from 'styled-components'

import helpers from 'styles/themes/helpers'
import SIZE_TO_UNITS from 'constants/sizes'
const { colors, components, cornerRadii, text, units } = helpers

const ICON_SIZE = 3
const LABEL_SIZE = 1

const {
    activeLabelStyle,
    disabledStyle,
    errorStyle,
    focusedStyle,
    focusedLabelStyle,
    inputContainerStyle,
    inputStyle,
    getMessageStyle,
    getIconStyle,
    getLabelStyle,
    getPaddingStyle,
    getWithIconStyle,
    prefixStyle,
} = components.input

export const Message = styled.div`
    ${props =>
        getMessageStyle(
            props.hasIcon ? ICON_SIZE : 0,
            SIZE_TO_UNITS[props.size],
        )};
`

const disabled = props => props.disabled && disabledStyle
const error = props => props.error && errorStyle
const focused = props => props.focused && !props.noStyle && focusedStyle

const withLabel = props =>
    props.label &&
    css`
    margin-top: ${units.getValue(LABEL_SIZE)};
`
export const sharedInputContainerStyles = css`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    border-radius: ${cornerRadii.default()};
    transition: border 0.2s ease-in;
    ${props => !props.noStyle && inputContainerStyle}

    ${disabled}
    ${focused}

    ${withLabel}
    ${error}
`

const activeLabel = props => props.active && !props.noStyle && activeLabelStyle
const focusedLabel = props =>
    props.focused && !props.noStyle && focusedLabelStyle
const errorLabel = props => props.error && `color: ${props.theme.colors.error};`
export const sharedLabelStyles = css`
    position: absolute;
    cursor: text;
    color: ${props => colors[props.color] || colors.gray4()};
    transition: all 0.2s ease-in;
    pointer-events: none;

    ${props =>
        getLabelStyle(props.hasIcon ? ICON_SIZE : 0, SIZE_TO_UNITS[props.size])}
    ${activeLabel}
    ${focusedLabel}
    ${errorLabel}
`

const withIcon = props =>
    props.hasIcon && getWithIconStyle(ICON_SIZE, SIZE_TO_UNITS[props.size])
const fontStyle = props => {
    const sizeUnits = SIZE_TO_UNITS[props.size]
    return css`
        font-size: ${sizeUnits > 2 ? text.getSize(sizeUnits) : text.getSize(1)};
        font-weight: ${sizeUnits > 2 ? 'bold' : 'normal'};
    `
}
export const sharedInputStyles = css`
    border-radius: 0;
    ${props => (props.innerInputNotFluid ? '' : 'width: 100%;')}
    background: none;
    border: none;
    outline: none;
    resize: none;
    ${props => !props.noStyle && getPaddingStyle(props.size, props.hasLabel)}
    ${props => !props.noStyle && inputStyle}
    ${fontStyle}
    ${withIcon}
    &::placeholder {
        color: ${colors.gray4()};
    }
    &:focus {
        outline: none;
    }
`

const showsError = props =>
    props.showsError &&
    css`
    margin-top: ${units.getValue(2)}
`
export const Wrapper = styled.div`
    position: relative;
    ${showsError};
    ${props => (props.fluid ? 'width: 100%' : ' ')};
    ${disabled};
`

export const InputContainer = styled.div`${sharedInputContainerStyles};`
export const InputIconContainer = styled.span`
    ${props => getIconStyle(props.size)};
`
export const StyledInput = styled.input`${sharedInputStyles};`
export const Label = styled.label`${sharedLabelStyles};`

const errorPrefix = props =>
    props.error &&
    css`
    border-color: ${colors.error()};
    color: ${colors.error()};
`
export const Prefix = styled.div`${prefixStyle} ${errorPrefix};`



// WEBPACK FOOTER //
// ./app/components/Form/Input/styled-components/index.js