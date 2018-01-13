import React, { Component } from 'react'
import t from 'prop-types'
import Analytics from 'analytics'
import access from 'safe-access'

import AlertView from './view.jsx'

class Alert extends Component {
    static propTypes = {
        // Set this to make the alert dismissible
        onDismiss: t.func,

        // Set this if clicks should be logged
        analyticsDomain: t.string,
    }

    static defaultProps = {
        buttonsPosition: 'right',
        thinStyle: false,
        border: 'default',
        backgroundColor: 'white',
    }

    onDismiss = () => {
        if (this.props.analyticsDomain) {
            Analytics.logEvent({
                domain: this.props.analyticsDomain,
                title: access(Analytics, 'GENERIC_ALERT_EVENTS.DISMISS'),
            })
        }
        this.props.onDismiss()
    }

    trackClick = (
        analyticsEventTitle = access(
            Analytics,
            'GENERIC_ALERT_EVENTS.CLICK_BUTTON_OR_LINK',
        ),
    ) => {
        if (this.props.analyticsDomain) {
            Analytics.logEvent({
                domain: this.props.analyticsDomain,
                title: analyticsEventTitle,
            })
        }
    }

    _makeClickHandler = analyticsEventTitle => {
        return analyticsEventTitle
            ? () => this.trackClick(analyticsEventTitle)
            : this.trackClick
    }

    render() {
        const nextProps = {
            ...this.props,
            hasDismiss: !!this.props.onDismiss,
            trackClick: this.trackClick,
            onDismiss: this.onDismiss,
        }
        return <AlertView {...nextProps} />
    }
}

export default Alert



// WEBPACK FOOTER //
// ./app/components/Alert/index.jsx