import React from 'react'
import Utils from '../Utils/Utils.js'

export default class AppContent extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  isSameLoc = false
  lastAppId = ''

  componentWillReceiveProps (newProps) {
    if (this.props.routerProps.location.pathname === newProps.routerProps.location.pathname) {
      this.isSameLoc = true
    } else {
      this.isSameLoc = false
    }
  }

  componentDidUpdate () {
    if (!this.isSameLoc) {
      window.scrollTo(0, 0)
    }

    this.setBodyClass()
  }

  setBodyClass = () => {
    const path = this.props.routerProps.location.pathname
    const body = document.querySelector('body')

    if (Utils.isFullScreen(path)) {
      body.className = Utils.addClassName(body.className, 'full-screen')
    } else {
      body.className = Utils.removeClassName(body.className, 'full-screen')

      const newAppId = Utils.appIdFromUrl()
      if (newAppId !== this.lastAppId) {
        this.props.refreshCurrentApp()
      }
    }

    this.lastAppId = Utils.appIdFromUrl()
  }

  render () {
    const pageClass = Utils.getPageClass()

    return (
      <div className={`content-wrapper ${pageClass}`}>
        {this.props.children}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/AppContent/AppContent.js