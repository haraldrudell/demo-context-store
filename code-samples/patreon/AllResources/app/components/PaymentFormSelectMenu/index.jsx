import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles.less'
import classNames from 'classnames'

export default class extends React.Component {
    static propTypes = {
        isValid: PropTypes.bool,
        isInvalid: PropTypes.bool,
        label: PropTypes.string,
        options: PropTypes.array,
        value: PropTypes.string,
        keyCode: PropTypes.string,
        dispatchChange: PropTypes.func,
    }

    static defaultProps = {
        isValid: false,
        isInvalid: false,
        label: null,
        options: null,
        value: null,
        keyCode: null,
    }

    handleChange = e => {
        return this.props.dispatchChange({
            key: this.props.keyCode,
            value: e.target.value,
        })
    }

    render() {
        const {
            isValid,
            isInvalid,
            label,
            options,
            value,
            keyCode,
        } = this.props

        const classes = classNames(
            styles.selectMenu,
            isValid ? styles.isValid : null,
            isInvalid ? styles.isInvalid : null,
        )

        let labelElement =
            label !== null
                ? <span className={styles.label}>
                      {label}
                  </span>
                : null

        options.unshift({ key: 0, readableName: 'None Selected', value: '' })

        const selectMenuOptions =
            options !== null
                ? options.map(function(item) {
                      return (
                          <option key={item.key} value={item.value}>
                              {item.readableName}
                          </option>
                      )
                  })
                : null

        return (
            <div className={styles.container}>
                {labelElement}
                <select
                    value={value}
                    className={classes}
                    onChange={this.handleChange}
                    key={keyCode}
                >
                    {selectMenuOptions}
                </select>
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/PaymentFormSelectMenu/index.jsx