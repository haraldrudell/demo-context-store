import React from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router'
import AppStorage from '../AppStorage/AppStorage'
import Utils from '../Utils/Utils'
import ABTest from '../../utils/ABTest'
import css from './AppContextSidebar.css'

@observer
class AppContextSidebar extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    ...Utils.getDefaultContextTypes()
  }
  state = {
    env: { uuid: '', name: '' }
  }

  activeClassIf = menuName => {
    const lastUrlPart = this.props.routerProps.location.pathname
      .split('/')
      .slice(-1)
      .toString()
    return lastUrlPart === menuName ? 'active' : ''
  }

  setupActiveClassIf = () => {
    const hasSetup = Utils.hasSetupSideBar(this.props.routerProps.location.pathname)
    return hasSetup ? 'active' : ''
  }

  accountActiveClassIf = () => {
    const hasAccount = Utils.hasAccountSideBar(this.props.routerProps.location.pathname)
    return hasAccount ? 'active' : ''
  }

  getActiveClass = menuNameArr => {
    const path = this.props.routerProps.location.pathname
    for (const name of menuNameArr) {
      if (path.indexOf(name) >= 0) {
        return 'active'
      }
    }
    return ''
  }

  componentWillMount () {
    Utils.loadChildContextToState(this, 'apps')
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  saveEnv () {
    AppStorage.set('env', Utils.envIdFromUrl())
  }

  onAppNameClick = app => {
    AppStorage.set('appId', app.uuid)
    if (this.props.isTourOn && this.props.showServiceDialog) {
      this.context.router.push(`/app/${app.uuid}/setup`)
      this.props.setServiceTourStage('step2', 2)
    } else {
      this.context.router.push(`/app/${app.uuid}/overview`)
    }
  }

  onLinkClick = (event, appId) => {
    if (!appId) {
      event.preventDefault()
    }
  }

  onSetupLinkClick = (event, appId) => {
    if (!appId) {
      event.preventDefault()
    } else {
      this.props.refreshCurrentApp()
    }
  }

  render () {
    const accountId = AppStorage.get('acctId')

    return (
      <aside className={`main-sidebar ${css.main}`}>
        {/* <div className="sidebar-icon-box" /> */}

        <section className="sidebar">
          {/* /.search form */}
          <ul className="sidebar-menu">
            <li data-name="dashboard-menu" className={this.activeClassIf('dashboard')}>
              <Link to="/dashboard">
                <i className="icons8-dashboard" /> <span>DASHBOARD</span>
              </Link>
            </li>
            {!ABTest.isDeploymentV2Enabled &&
            <li data-name="pipelines-menu" className={this.activeClassIf('pipelines')}>
              <Link to={`/account/${accountId}/pipelines`}>
                <i className="icons8-module" /> <span>PIPELINES</span>
              </Link>
            </li>
            }
            <li data-name="deployments-menu" className={this.activeClassIf('deployments')}>
              <Link to={`/account/${accountId}/deployments`}>
                {' '}
                <i className="icons8-workflow-2" /> <span>DEPLOYMENTS</span>
              </Link>
            </li>

            <li data-name="services-menu" className={this.activeClassIf('services')}>
              <Link to={`/account/${accountId}/services`}>
                {' '}
                <i className="icons8-workflow-2" /> <span>SERVICES</span>
              </Link>
            </li>

            <li data-name="history-menu" className={this.activeClassIf('history')}>
              <Link to={`/account/${accountId}/history`}>
                <i className="icons8-past-2" />
                <span>HISTORY</span>
              </Link>
            </li>

            <li data-name="setup-menu" className={this.activeClassIf('setup')}>
              <Link to={`/account/${accountId}/setup`}>
                <i className="icons8-settings-2" />
                <span>SETUP</span>
              </Link>
            </li>

            {__DEV__ && (
              <li data-name="Dev Wiki">
                <Link to={`/account/${accountId}/dev-wiki?foo=bar`}>
                  <i className="icons8-error-filled" />
                  <span>DEV WIKI</span>
                </Link>
              </li>
            )}
          </ul>
        </section>
      </aside>
    )
  }
}

export default AppContextSidebar



// WEBPACK FOOTER //
// ../src/components/AppSidebar/AppContextSidebar.js