import React from 'react'
import Text from 'components/Text'
import PropTypes from 'prop-types'

import { HURTING_SELF } from '../../constants/core'

const SuccessPage = ({ reason }) => (
    <Text>
        Thank you for your report.{' '}
        {reason === HURTING_SELF && (
            <Text weight="bold">
                If you, someone you know, or a loved one is in danger please
                consider contacting law enforcement.{' '}
            </Text>
        )}
        Our Trust and Safety team will review your report and take any action
        necessary.
    </Text>
)

SuccessPage.propTypes = {
    reason: PropTypes.string,
}

export default SuccessPage



// WEBPACK FOOTER //
// ./app/components/ContentReport/components/SuccessPage/index.jsx