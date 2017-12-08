import React from 'react'
import { Link } from 'react-router'
import { NavDropdown, MenuItem } from 'react-bootstrap'
import AppStorage from '../AppStorage/AppStorage'
import css from './AppPageHeader.css'
import Utils from '../Utils/Utils.js'
import CompUtils from '../Utils/CompUtils'
import AppSetupStatus from './AppSetupStatus'

export default class AppPageHeader extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    ...Utils.getDefaultContextTypes()
  }
  state = {
    mainKey: Date.now()
  }
  allApps = []
  selectedApp = null
  selectedEnv = { name: '' }
  paddingLeft = 0

  componentWillMount () {
    Utils.loadChildContextToState(this, 'apps')
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  hasNoPageHeader () {
    return Utils.isFullScreen(this.props.routerProps.location.pathname)
  }

  selectApp = app => {
    this.matchAndSelectEnv(app)
    const pageName = window.location.href.split('/').slice(-1)
    if (this.props.routerProps.location.pathname.indexOf('env/') > 0) {
      Utils.redirect({ appId: app.uuid, envId: this.selectedEnv.uuid, page: pageName })
    } else {
      Utils.redirect({ appId: app.uuid, page: pageName })
    }
    this.props.refreshCurrentApp()
  }

  selectEnv = env => {
    // this.setState({ env })
    AppStorage.set('env', env.uuid)
    const pageName = window.location.href.split('/').slice(-1)
    Utils.redirect({ appId: true, envId: env.uuid, page: pageName })
  }

  renderAppDropdown () {
    return (
      <span className="__pageDropDown">
        {/* <div className="__header">Application </div>*/}
        <NavDropdown
          title={this.selectedApp ? this.selectedApp.name : ''}
          id="wings-sidebar-dropdown"
          className="wings-sidebar-dropdown"
        >
          <MenuItem className="__menuLabel" key="select" href="javascript:;">
            Select Application
          </MenuItem>
          {this.allApps.map(app => {
            return (
              <MenuItem key={app.uuid} href="javascript:;" onClick={this.selectApp.bind(this, app)}>
                {app.name}
              </MenuItem>
            )
          })}
        </NavDropdown>
      </span>
    )
  }

  matchAndSelectEnv (selectedApp) {
    if (selectedApp && selectedApp.environments) {
      const selectedAppEnvs = selectedApp.environments
      let matchedEnv = selectedAppEnvs.find(env => env.uuid === Utils.envIdFromUrl())
      if (!matchedEnv) {
        // couldn't match with any env uuid => match by previous env name, or default to the 1st env
        matchedEnv = selectedAppEnvs.find(env => env.name === this.selectedEnv.name) || selectedAppEnvs[0]
      }
      this.selectedEnv = matchedEnv
      AppStorage.set('env', this.selectedEnv.uuid)
    }
  }

  renderEnvDropdown () {
    let selectedAppEnvs = []
    if (this.selectedApp && this.selectedApp.environments) {
      selectedAppEnvs = this.selectedApp.environments
      this.matchAndSelectEnv(this.selectedApp)
    }

    const path = this.props.routerProps.location.pathname
    if (!Utils.hasEnvDropdown(path)) {
      return null
    }

    return (
      <span className="__pageDropDown">
        {/* <div className="__header">Environment</div>*/}
        <NavDropdown title={this.selectedEnv.name} id="wings-sidebar-dropdown" className="wings-sidebar-dropdown">
          <MenuItem className="__menuLabel" key="select" href="javascript:;">
            Select Environment
          </MenuItem>
          {selectedAppEnvs.map(env => {
            return (
              <MenuItem key={env.uuid} href="javascript:;" onClick={this.selectEnv.bind(this, env)}>
                {env.name}
              </MenuItem>
            )
          })}
        </NavDropdown>
      </span>
    )
  }

  renderHeaderContent () {
    this.allApps = this.state.apps || []
    this.selectedApp = this.allApps.find(app => app.uuid === Utils.appIdFromUrl())
    const path = this.props.routerProps.location.pathname

    if (path.indexOf('governance/') >= 0) {
      return (
        <h3 className="__setupHeader appContextHeader">
          <span>Governance</span>
        </h3>
      )
    }
    if (path.indexOf('app/') >= 0) {
      const appIdFromUrl = Utils.appIdFromUrl()
      if (Utils.hasSetupSideBar(path)) {
        return (
          <h3 className="__setupHeader appContextHeader">
            <Link to={`/app/${appIdFromUrl}/setup`} title="Back to Application">
              {this.selectedApp ? this.selectedApp.name : ''}
            </Link>
            <span>&nbsp; &#8250; </span>
            <span className="iconHeading">Setup</span>
          </h3>
        )
      }
    }
    return (
      <h3 className="appContextHeader">
        {this.renderAppDropdown()}
        {this.renderEnvDropdown()}
      </h3>
    )
  }

  render () {
    if (this.hasNoPageHeader()) {
      return <div />
    }
    const className = this.props.isSticky ? css.sticky : css.main

    return (
      <section key={this.state.mainKey}>
        <div className={css.common + ' ' + className}>
          {/* Sidebar toggle button*/}
          <a
            href="javascript:;"
            className="sidebar-toggle"
            data-toggle="offcanvas"
            role="button"
            onClick={CompUtils.toggleSidebar}
          >
            <span className="sr-only">Toggle navigation</span>
          </a>
          {this.renderHeaderContent()}
        </div>
        <AppSetupStatus routerProps={this.props.routerProps} refreshCurrentApp={this.props.refreshCurrentApp} />
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/AppPageHeader/AppPageHeader.js