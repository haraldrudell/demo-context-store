import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles.less'

export default class extends React.Component {
    static propTypes = {
        description: PropTypes.string,
        title: PropTypes.string,
    }

    static defaultProps = {
        description: null,
        title: null,
    }

    render() {
        const { title, description } = this.props

        return (
            <div className={styles.header}>
                <div className={styles.title}>
                    {title}
                </div>

                <div className={styles.description}>
                    {description}
                </div>
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/PaymentFormHeader/index.jsx