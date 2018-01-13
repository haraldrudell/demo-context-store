import t from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import styled from 'styled-components'

import LoadingSpinner from 'components/LoadingSpinner'
import Text from 'components/Text'
import keyCodes from 'constants/key-codes'
import formatNumber from 'utilities/format-number-comma'

import sharedStyles from '../sharedInputStyles.less'
import styles from './styles.less'

import { Label } from '../Input/styled-components'
import HTMLEntities from 'utilities/html-entities'

export default class TextArea extends React.Component {
    static propTypes = {
        /**
         * Automatically focus on textarea on mount.
         */
        autoFocus: t.bool,

        /**
         * Overwrite the value of the `<textarea>`.
         */
        value: t.string,

        /**
         * Applies disabled styling and prevents input
         */
        disabled: t.bool,

        /**
         * Include as a bool to give the `<textarea>` the error styling.
         * Specify as a string to include an error message above the field.
         * (note: if there is potential for an error string, include the
         * `showsError` prop)
         */
        error: t.oneOfType([t.bool, t.string]),

        /**
         * The maximum number of characters of the `<textarea>`.
         */
        hardMaxLength: t.number,

        /**
         * Initial value of the `<textarea>`.
         */
        initialValue: t.string,

        /**
         * Display a loading spinner on top of the `<textarea>`.
         */
        loading: t.bool,

        /**
         * Assign the `<textarea>` a name.
         */
        name: t.string,

        /**
         * Assign the `<textarea>` a name.
         */
        label: t.string,

        /**
         * Function called when the `<textarea>` loses focus.
         */
        onBlur: t.func,

        /**
         * Function called on any change in the `<textarea>`.
         */
        onChange: t.func,

        /**
         * Function called when `<textarea>` gains focus.
         */
        onFocus: t.func,

        /**
         * Function called when the user presses the metakey (command key on Mac,
         * windows key on Windows) and the ENTER key.
         */
        onSubmit: t.func,

        /**
         * Placeholder text.
         */
        placeholder: t.string,

        /**
         * Prevent interaction with `<textarea>`.
         */
        readOnly: t.bool,

        /**
         * Make the field required.
         */
        required: t.bool,

        /**
         * Allow vertical resizing of the `<textarea>`.
         */
        resizable: t.bool,

        /**
         * The maximum number of rows the `<textarea>` will display.
         */
        rows: t.number,

        /**
         * Include to add some whitespace above the `<textarea>` in anticipation
         * of an error message.
         */
        showsError: t.bool,

        /**
         * Size of the padding.
         */
        size: t.oneOf(['sm', 'md']),

        /**
         * If present, show a counter with the difference between `softMaxLength`
         * and the number of characters in the bottom-right corner.
         */
        softMaxLength: t.number,

        /**
         * Allows passing in a function as a callback which receives our
         * <TextArea> ref.
         */
        getTextAreaRef: t.func,
    }

    static defaultProps = {
        rows: 3,
        size: 'md',
    }

    state = {
        focused: false,
        length: 0,
    }

    setLength = length => {
        this.setState({ length: length })
    }

    componentDidMount() {
        if (this.props.value) {
            this.setLength(this.props.value.length)
        }
    }

    handleChange = e => {
        this.setLength(e.target.value.length)
        this.props.onChange && this.props.onChange(e)
    }

    onFocusChange = (e, isFocused) => {
        this.setState({
            focused: isFocused,
        })
        if (isFocused && this.props.onFocus) {
            this.props.onFocus(e)
        } else if (!isFocused && this.props.onBlur) {
            this.props.onBlur(e)
        }
    }

    onKeyDown = e => {
        if (
            e.keyCode === keyCodes.ENTER &&
            (e.metaKey || e.ctrlKey) &&
            !this.props.disabled
        ) {
            this.props.onSubmit && this.props.onSubmit(e.target.value)
        }
    }

    setTextAreaRef = ref => {
        const { getTextAreaRef } = this.props

        if (getTextAreaRef) {
            getTextAreaRef(ref)
        }
    }

    render() {
        const {
            autoFocus,
            value,
            disabled,
            error,
            hardMaxLength,
            initialValue,
            label,
            loading,
            name,
            placeholder,
            readOnly,
            required,
            resizable,
            rows,
            showsError,
            size,
            softMaxLength,
        } = this.props

        const { focused } = this.state

        const containerClasses = classNames(
            'mt-lg',
            { [sharedStyles.showsError]: showsError },
            { [sharedStyles.disabled]: disabled },
            { [sharedStyles.error]: !disabled && error },
        )

        const textAreaClasses = classNames(sharedStyles.input, {
            [styles.resize]: resizable,
        })

        const lengthLeft = softMaxLength && softMaxLength - this.state.length
        const counterColor = lengthLeft > 0 ? 'gray3' : 'error'

        const isFocused = !!focused

        const labelProps = {
            active: !!(focused || value || initialValue),
            error: !disabled && error,
            focused: isFocused,
            size,
        }

        return (
            <div>
                {typeof error === 'string' ? (
                    <span className={sharedStyles.errorDescription}>
                        {this.props.error}
                    </span>
                ) : null}
                <div
                    className={containerClasses}
                    style={{ position: 'relative' }}
                >
                    {label && (
                        <TextareaLabelContainer>
                            <Label
                                {...labelProps}
                                color="navy"
                                onClick={e => this.onFocusChange(e, true)}
                                noStyle
                            >
                                {label}
                            </Label>
                        </TextareaLabelContainer>
                    )}
                    <StyledTextArea
                        autoComplete="off"
                        autoFocus={autoFocus}
                        className={textAreaClasses}
                        defaultValue={initialValue}
                        disabled={disabled}
                        focused={isFocused}
                        maxLength={hardMaxLength}
                        name={name}
                        onBlur={e => this.onFocusChange(e, false)}
                        onChange={e => this.handleChange(e)}
                        onFocus={e => this.onFocusChange(e, true)}
                        onKeyDown={this.onKeyDown}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        ref={this.setTextAreaRef}
                        required={required}
                        resizable={!!resizable}
                        rows={rows}
                        value={HTMLEntities.decode(value)}
                    />
                    {lengthLeft && (
                        <Text
                            align="right"
                            color={counterColor}
                            el="div"
                            scale="0"
                        >
                            {formatNumber(lengthLeft)}
                        </Text>
                    )}
                    {loading && (
                        <span className={styles.spinnerContainer}>
                            <LoadingSpinner size="md" color="lightGray" />
                        </span>
                    )}
                </div>
            </div>
        )
    }
}

const TextareaLabelContainer = styled.div`
    width: 100%;
    position: absolute;
    top: 0.5rem;
    left: 0;
    width: 100%;
    font-weight: bold;
`

const StyledTextArea = styled.textarea`
    ${props =>
        props.resizable ? 'resize: vertical !important;' : ''} padding: 1rem;
    border: 2px solid
        ${props =>
            props.theme.colors[props.focused ? 'blue' : 'gray5']} !important;
    box-sizing: border-box !important;
    &:hover {
        border-color: ${props => props.theme.colors.navy} !important;

        &:focus {
            border: 2px solid
                ${props =>
                    props.theme.colors[
                        props.focused ? 'blue' : 'gray5'
                    ]} !important;
        }
    }
    &::placeholder {
        color: ${props => props.theme.colors.gray4};
    }
    &[disabled] {
        border: 0;
    }
`



// WEBPACK FOOTER //
// ./app/components/Form/TextArea/index.jsx