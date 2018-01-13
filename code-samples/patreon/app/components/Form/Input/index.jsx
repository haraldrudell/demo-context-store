import t from 'prop-types'
import React, { Component } from 'react'

import keyCodes from 'constants/key-codes'

import LoadingSpinner from 'components/LoadingSpinner'
import Text from 'components/Text'
import Icon from 'components/Icon'

import { SIZE_KEYS } from 'constants/sizes'

import {
    InputContainer,
    InputIconContainer,
    Label,
    Message,
    Prefix,
    StyledInput,
    Wrapper,
} from './styled-components'

class Input extends Component {
    static propTypes = {
        //Focuses input after first render of input
        autoFocus: t.bool,
        //Focuses and selects text after first render of input
        autoSelect: t.bool,
        disabled: t.bool,
        error: t.oneOfType([t.bool, t.string]),
        fluid: t.bool,
        helper: t.string,
        icon: t.shape({
            // This props shape takes all props that an Icon can take
            type: t.string,
            size: t.string,
        }),
        id: t.string,
        initialValue: t.oneOfType([t.string, t.number]),
        // Label to display
        // In default style, this will appear above the text field
        // while in America it will show as the placeholder and move above after focus
        label: t.string,
        loading: t.bool,
        name: t.string,
        onBlur: t.func,
        onChange: t.func,
        onFocus: t.func,
        onSubmit: t.func,
        placeholder: t.string,
        prefix: t.node,
        readOnly: t.bool,
        showsError: t.bool,
        size: t.oneOf(SIZE_KEYS),
        success: t.string,
        type: t.string,
        value: t.oneOfType([t.string, t.number]),
        noStyle: t.bool,
        'data-tag': t.string,
    }

    static defaultProps = {
        type: 'text',
        size: 'md',
        onSubmit: value => {},
    }

    state = {
        focused: false,
        isActive: false,
    }

    componentDidMount() {
        const { autoFocus, autoSelect, initialValue } = this.props

        if (initialValue) {
            if (this.input) {
                this.input['value'] = initialValue
            }
            this._handleToggleActive(true)
        }

        if (autoFocus || autoSelect) {
            setTimeout(() => {
                this.input.focus()
                if (autoSelect) {
                    this.input.select()
                } else {
                    const oldValue = this.input.value
                    this.input.value = ''
                    this.input.value = oldValue
                }
            }, 0)
        }
    }

    _handleFocusChange = (e, isFocused) => {
        // e.persist() needed to bubble up the focus change for multiple interested parties
        // else it stops propagation at one party
        // E.g. dirty tracker & the Input's passing of onFocus, onBlur to parent
        e.persist()
        this.setState(
            {
                focused: !this.state.focused,
            },
            () => {
                if (isFocused && this.props.onFocus) {
                    this.props.onFocus(e)
                } else if (!isFocused && this.props.onBlur) {
                    this.props.onBlur(e)
                }
            },
        )
    }

    _handleToggleActive = isActive => {
        this.setState({
            active: isActive,
        })
    }

    _handleKeyDown = e => {
        const { disabled, onSubmit } = this.props

        if (e.keyCode === keyCodes.ENTER && !disabled && onSubmit) {
            onSubmit(e.target.value)
        }
    }

    _handleChange = e => {
        const { onChange } = this.props
        if (onChange) {
            onChange(e)
        }
    }

    render() {
        const {
            autoFocus,
            autoSelect,
            disabled,
            error,
            helper,
            fluid,
            icon,
            id,
            label,
            loading,
            name,
            noStyle,
            placeholder,
            prefix,
            readOnly,
            showsError,
            size,
            success,
            type,
            value,
        } = this.props
        const { focused, isActive } = this.state
        const hasValue = value || (this.input && this.input.value) || isActive

        const wrapperProps = {
            disabled,
            fluid,
            showsError,
        }

        const inputContainerProps = {
            error: !disabled && error,
            focused,
            icon,
            label,
            noStyle,
        }

        const labelProps = {
            active: !!(focused || hasValue),
            error: !disabled && error,
            focused: !!focused,
            hasIcon: !!icon,
            size,
            noStyle,
        }

        const inputProps = {
            hasIcon: !!icon,
            hasLabel: !!label,
            size,
        }

        if (value !== undefined) {
            inputProps['value'] = value
        }

        const messageProps = {
            hasIcon: !!icon,
            size,
        }

        const hasError = typeof error === 'string' && !!error.length
        const hasHelper = typeof helper === 'string' && !!helper.length
        const hasSuccess = typeof success === 'string' && !!success.length

        return (
            <Wrapper {...wrapperProps}>
                <InputContainer
                    {...inputContainerProps}
                    direction="row"
                    alignItems="baseline"
                >
                    {icon && (
                        <InputIconContainer size={size} {...icon}>
                            <Icon size={size} hasLabel={!!label} {...icon} />
                        </InputIconContainer>
                    )}
                    {prefix && (
                        <Prefix error={!disabled && error}>{prefix}</Prefix>
                    )}
                    {label && (
                        <Label {...labelProps} onClick={this.focus}>
                            {label}
                        </Label>
                    )}
                    <StyledInput
                        {...inputProps}
                        name={name || id}
                        innerRef={ref => (this.input = ref)}
                        id={id}
                        type={type}
                        select={autoSelect}
                        noStyle={noStyle}
                        autoComplete="off"
                        disabled={disabled}
                        placeholder={placeholder}
                        autoFocus={autoFocus}
                        readOnly={readOnly}
                        onFocus={e => this._handleFocusChange(e, true)}
                        onBlur={e => this._handleFocusChange(e, false)}
                        onChange={this._handleChange}
                        onKeyDown={this._handleKeyDown}
                        data-tag={this.props['data-tag']}
                    />
                    {loading && (
                        <span className="mr-md">
                            <LoadingSpinner size="md" />
                        </span>
                    )}
                </InputContainer>
                {hasError && (
                    <Message {...messageProps}>
                        <Text color="error" size={0} data-tag="input-error">
                            {error}
                        </Text>
                    </Message>
                )}
                {!hasError &&
                    hasSuccess && (
                        <Message {...messageProps}>
                            <Text color="success" size={0}>
                                {success}
                            </Text>
                        </Message>
                    )}
                {!hasError &&
                    !hasSuccess &&
                    hasHelper && (
                        <Message {...messageProps}>
                            <Text color="gray3" size={0}>
                                {helper}
                            </Text>
                        </Message>
                    )}
            </Wrapper>
        )
    }
}

export default Input



// WEBPACK FOOTER //
// ./app/components/Form/Input/index.jsx