import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'
import Icon from 'components/Icon'
import styles from './styles.less'

export default class extends React.Component {
    static propTypes = {
        options: PropTypes.array,
        disabled: PropTypes.bool,
        name: PropTypes.string,
        size: PropTypes.string,
        color: PropTypes.string,
        className: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func,
    }

    static defaultProps = {
        options: [],
        disabled: false,
        color: 'gray',
        size: 'md',
    }

    render() {
        const className = classnames(
            {
                [styles.disabled]: this.props.disabled,
            },
            styles.button,
            styles[this.props.color],
            styles[this.props.size],
            styles.wrapper,
            this.props.className,
        )

        const selectClassName = classnames(
            styles.select,
            styles[this.props.size],
            `native-select-${this.props.name}`,
        )

        const iconClasses = classnames(styles.icon, styles[this.props.size])

        return (
            <div className={className}>
                <select
                    name={this.props.name}
                    value={this.props.value}
                    disabled={this.props.disabled}
                    className={selectClassName}
                    onChange={this.props.onChange}
                >
                    {this.props.options.map(option => {
                        return (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        )
                    })}
                </select>
                <div className={iconClasses}>
                    <Icon type="caretDown" color="currentColor" size="xxs" />
                </div>
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/ButtonNativeSelect/index.jsx