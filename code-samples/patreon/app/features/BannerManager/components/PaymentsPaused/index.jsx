import React from 'react'

import Alert from 'components/Alert'
import Text from 'components/Text'

const PaymentsPaused = () => (
    <Alert>
        <Text el="h3" color="error" size={2} weight="bold" noMargin>
            Payout and payment processing may be delayed.
        </Text>
        <Text el="p">
            We are working to resolve the matter, sorry for the inconvenience.
        </Text>
    </Alert>
)

export default PaymentsPaused



// WEBPACK FOOTER //
// ./app/features/BannerManager/components/PaymentsPaused/index.jsx