import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles.less'
import classNames from 'classnames'

export default class extends React.Component {
    static propTypes = {
        value: PropTypes.string,
        placeholder: PropTypes.string,
        isValid: PropTypes.bool,
        isInvalid: PropTypes.bool,
        label: PropTypes.string,
        keyCode: PropTypes.string,
        postLabel: PropTypes.string,
        dispatchChange: PropTypes.func,
        readonly: PropTypes.bool,
    }

    static defaultProps = {
        value: null,
        placeholder: null,
        isValid: false,
        isInvalid: false,
        label: null,
        postLabel: null,
        keyCode: null,
        readOnly: false,
    }

    handleChange = e => {
        return this.props.dispatchChange({
            key: this.props.keyCode,
            value: e.target.value,
        })
    }

    render() {
        const {
            placeholder,
            isValid,
            isInvalid,
            label,
            postLabel,
            keyCode,
            readonly,
        } = this.props

        let { value } = this.props

        const classes = classNames(
            styles.input,
            isValid ? styles.isValid : null,
            isInvalid ? styles.isInvalid : null,
            readonly ? styles.isReadOnly : null,
        )

        let labelElement =
            label !== null
                ? <span className={styles.label}>
                      {label}
                  </span>
                : null

        let postLabelElement =
            postLabel !== null
                ? <div className={styles.label}>
                      {postLabel}
                  </div>
                : null

        return (
            <div className={styles.container}>
                {labelElement}
                <input
                    className={classes}
                    key={keyCode}
                    type="text"
                    defaultValue={value}
                    onBlur={this.handleChange}
                    autoComplete="off"
                    readOnly={readonly}
                    placeholder={placeholder}
                />
                {postLabelElement}
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/PaymentFormInput/index.jsx