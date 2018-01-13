import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { withPreset } from 'libs/with-preset'

import NeedsReform from './components/NeedsReform'
import PaymentsPaused from './components/PaymentsPaused'

@withPreset('currentBanners')
class BannerManager extends Component {
    static propTypes = {
        currentBanners: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object,
        ]),
    }

    getAlert = alert => {
        switch (alert) {
            case 'payments_paused':
                return <PaymentsPaused />
            case 'needs_reform':
                return <NeedsReform />
            default:
                return null
        }
    }

    render() {
        const { currentBanners } = this.props

        // @TODO: Update this as we figure out how to test existence in nion
        // especially for non-JSON API array values
        if (!currentBanners || !currentBanners.length) {
            return null
        }

        return (
            <BannerWrapper>{currentBanners.map(this.getAlert)}</BannerWrapper>
        )
    }
}

const BannerWrapper = styled.div`
    text-align: center;
`

export default BannerManager



// WEBPACK FOOTER //
// ./app/features/BannerManager/index.jsx