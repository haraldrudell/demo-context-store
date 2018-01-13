import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles.less'
import classNames from 'classnames'

export default class extends React.Component {
    static propTypes = {
        checked: PropTypes.bool,
        value: PropTypes.string,
        text: PropTypes.string,
        keyCode: PropTypes.string,
        isHidden: PropTypes.bool,
        isValid: PropTypes.bool,
        isInvalid: PropTypes.bool,
        dispatchChange: PropTypes.func,
    }

    static defaultProps = {
        value: null,
        checked: false,
        text: null,
        keyCode: null,
        isHidden: false,
        isValid: false,
        isInvalid: false,
    }

    handleChange = e => {
        return this.props.dispatchChange({
            key: this.props.keyCode,
            value: String(e.target.checked),
        })
    }

    render() {
        const {
            text,
            keyCode,
            value,
            isHidden,
            isValid,
            isInvalid,
        } = this.props
        let { checked } = this.props

        checked =
            checked === 'true' || value === 'true' || value === true
                ? true
                : false

        const classes = classNames(
            styles.container,
            isHidden ? styles.isHidden : null,
            isValid ? styles.isValid : null,
            isInvalid ? styles.isInvalid : null,
        )

        return (
            <div className={classes}>
                <input
                    type="checkbox"
                    key={keyCode}
                    checked={checked}
                    onChange={this.handleChange}
                    className={styles.checkBox}
                />
                <span className={styles.description}>
                    {text}
                </span>
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/PaymentFormCheckbox/index.jsx