import React from 'react'
import Utils from '../Utils/Utils.js'
import apis from 'apis/apis'


const NOTIFICATION_EVENT = 'UpdateSetupMessage'

export default class AppSetupStatus extends React.Component {
  state = {}

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    ...Utils.getDefaultContextTypes()
  }

  componentWillMount () {
    Utils.loadChildContextToState(this, 'app')
    this.subscribeNotifications()
    this.getAppFeedback()
  }

  subscribeNotifications () {
    if (this.context.pubsub) {
      const _pubsubToken = this.context.pubsub.subscribe(NOTIFICATION_EVENT, (msg, n) => this.recieveNotification())

      if (!this.context.pubsubToken) {
        this.context.pubsubToken = []
      }

      this.context.pubsubToken.push(_pubsubToken)
    }
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  componentDidUpdate (newProps) {
    if (this.props.routerProps.location.pathname !== newProps.routerProps.location.pathname) {
      this.getAppFeedback()
    }
  }

  recieveNotification () {
    setTimeout(() => {
      this.getAppFeedback()
    }, 500)
  }

  getAppFeedback () {
    const appIdFromUrl = Utils.appIdFromUrl()
    if (appIdFromUrl && appIdFromUrl.length > 0) {
      apis.service.list('setup/applications/' + appIdFromUrl )
        .then((resp) => {
          const setupResource = resp.resource
          if (setupResource && setupResource.actions && (setupResource.actions.length <= 0)) {
            Utils.showNotification(this, { type: 'SETUP', hideNotification: true })
          } else {
            const _type = (setupResource.setupStatus === 'INCOMPLETE') ? 'warn' : 'info'
            setupResource.actions.map((item) => {
              Utils.showNotification(this, {
                code: item.code, alertStyle: _type, url: item.url, type: 'SETUP', message: item.displayText
              })
            })
          }
        })
        .catch(error => { throw error })
    }
  }


  render () {
    return (
      <span />
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/AppPageHeader/AppSetupStatus.js