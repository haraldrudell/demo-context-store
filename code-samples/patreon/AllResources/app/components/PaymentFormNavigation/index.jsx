import React from 'react'
import styles from './styles.less'
import Icon from 'components/Icon'

export default class extends React.Component {
    render() {
        return (
            <div className={styles.navigation}>
                <a href="//www.patreon.com">
                    <div className={styles.navigationIconContainer}>
                        <Icon
                            type="patreonLogo"
                            size="md"
                            color="highlightPrimary"
                        />
                    </div>
                </a>

                <a className={styles.navigation_link} href="/paymentSettings">
                    Go back to Payment Settings
                </a>
            </div>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/PaymentFormNavigation/index.jsx