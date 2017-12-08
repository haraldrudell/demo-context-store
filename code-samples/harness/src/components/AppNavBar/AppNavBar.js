import React from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router'
import { NavDropdown, MenuItem } from 'react-bootstrap'
import { TourStage, ServiceTourSteps } from 'utils'
import Utils from '../Utils/Utils.js'
import CompUtils from '../Utils/CompUtils.js'
import css from './AppNavBar.css'
import AppStorage from '../AppStorage/AppStorage'
import WingsTour from '../WingsTour/WingsTour'
import AddAccountModal from './AddAccountModal'
import { logout } from '../../services/UsersService'
import { Position, Tooltip } from '@blueprintjs/core'
import { DelegatesService } from 'services'

const STATUS_CHECK_SUCCESS_INTERVAL = 1000 * 30 // When everything is ok, check status every 30 secs
const STATUS_CHECK_FAILURE_INTERVAL = 1000 * 10 // When failure happens, check status every 5 secs

@observer
class AppNavBar extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    ...Utils.getDefaultContextTypes()
  }
  state = {
    mainKey: Date.now(),
    tourType: '',
    showTourModal: false,
    shouldShowAddAccountModal: false
  }
  allApps = []
  selectedApp = null
  selectedEnv = { name: '' }
  showDropdowns = false
  checkDelegateStatusTimeoutId

  componentWillMount () {
    Utils.loadChildContextToState(this, 'apps')
    this.checkDelegateStatus()
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
    clearTimeout(this.checkDelegateStatusTimeoutId)
    delete this.fetchKey
  }

  getUser () {
    return this.props.userData && this.props.userData.resource ? this.props.userData.resource.name : 'User'
  }

  getEmail () {
    return this.props.userData && this.props.userData.resource ? this.props.userData.resource.email : ''
  }

  selectApp = app => {
    this.matchAndSelectEnv(app)
    AppStorage.set('appId', app.uuid)

    const pageName = window.location.href.split('/').slice(-1)
    if (this.props.routerProps.location.pathname.indexOf('env/') > 0) {
      Utils.redirect({ appId: app.uuid, envId: this.selectedEnv.uuid, page: pageName })
    } else {
      const accountId = this.props.urlParams.accountId // AppStorage.get('acctId')
      const appId = app.uuid
      const url = Utils.buildUrl(accountId, [appId], pageName)
      window.location.href = url

      /* Utils.redirect({ appId: app.uuid, page: pageName })*/
    }
    this.props.refreshCurrentApp()
  }

  selectEnv = env => {
    // this.setState({ env })
    AppStorage.set('env', env.uuid)
    const pageName = window.location.href.split('/').slice(-1)
    Utils.redirect({ appId: true, envId: env.uuid, page: pageName })
  }

  selectAcct = acct => {
    AppStorage.set('acctId', acct.uuid)
    AppStorage.set('appId', '')
    // this.context.router.replace(this.props.routerProps.location)
    window.location.href = '/#/dashboard'
    window.location.reload()
  }

  startTour = (e, tourType, hasApp, fromSideBar = false) => {
    const appId = AppStorage.get('appId')
    sessionStorage.setItem('tourAppId', appId)
    e.preventDefault()

    const redirectToSetup = stage => {
      this.props.setTourStage(stage)
      this.props.setServiceTourStage('step2', 2)
      this.context.router.push(`/app/${appId}/setup`)
      Utils.hideBugMuncher()
    }
    const redirectToApplications = () => {
      this.props.setTourStage(TourStage.APPLICATION)
      this.props.onTourStart(true)
      window.location = '/#/applications'
    }
    switch (tourType) {
      case 'service':
        if (appId && fromSideBar) {
          this.props.setServiceDialog(true)
          this.props.onTourStart(true)

          window.setTimeout(redirectToSetup(TourStage.SERVICE), 1000)
        } else if (fromSideBar && !appId) {
          /* this.props.onTourStart(true, () => {
            this.props.onTourPause()
            this.props.setServiceDialog(true)
            this.setApplicationStep()
          })*/
          this.props.onTourStart(true)
          this.props.setServiceDialog(true)
          this.setApplicationStep()
        }
        break
      case 'environment':
        if (hasApp) {
          redirectToSetup(TourStage.ENVIRONMENT)
        } else {
          redirectToApplications()
        }
        break
      case 'artifact':
        if (hasApp) {
          redirectToSetup(TourStage.ARTIFACT)
        } else {
          redirectToApplications()
        }
        break
      case 'pipeline':
        if (hasApp) {
          redirectToSetup(TourStage.PIPELINE)
        } else {
          redirectToApplications()
        }
        break
      default:
        this.setState({ tourType, showTourModal: true })
    }
  }

  signOut = async e => {
    await logout()
  }

  setApplicationStep = () => {
    window.setTimeout(() => {
      if (this.props.isTourOn) {
        this.props.setTourStage(TourStage.SERVICE)
        const step1 = ServiceTourSteps.step1(
          '#sidebarAppDropDown',
          'Please select Application to setup Service for',
          'right',
          this.props.renderEndTour
        )
        this.props.goToStep(step1)
        this.props.setServiceTourStage('step1', 1)
        this.props.onTourStart(true)
        Utils.hideBugMuncher()
      }
    }, 1000)
  }

  showApplicationsDropDown () {
    const url = window.location.href
    if (url) {
      if (url.indexOf('/pipelines') >= 0 || url.indexOf('/deployments') >= 0) {
        return true
      } else {
        return false
      }
    }
  }

  renderAppDropdown () {
    const apps = this.props.dataStore.apps.toJS()
    return (
      <NavDropdown
        title={this.selectedApp ? this.selectedApp.name : 'Select Application'}
        id="wings-sidebar-dropdown"
        className="dropDownHarness appDropDown"
      >
        <MenuItem className="dropDownHeaderRow" key="select" href="javascript:;">
          Select Application
        </MenuItem>
        {apps.map(app => {
          {
            /* Apply class to selected menu item */
          }
          let selectedAppClassName = ''
          if (this.selectedApp && this.selectedApp.uuid && app && app.uuid && this.selectedApp.uuid === app.uuid) {
            selectedAppClassName = 'selectedItem'
          }

          return (
            <MenuItem
              className={'__menuItem' + ' ' + selectedAppClassName}
              key={app.uuid}
              href="javascript:;"
              onClick={this.selectApp.bind(this, app)}
            >
              {app.name}
            </MenuItem>
          )
        })}
      </NavDropdown>
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
      <NavDropdown title={this.selectedEnv.name} id="wings-sidebar-dropdown" className="dropDownHarness envDropDown">
        <MenuItem className="dropDownHeaderRow" key="select" href="javascript:;">
          Select Environment
        </MenuItem>
        {selectedAppEnvs.map(env => {
          {
            /* Apply class to selected menu item */
          }
          let selectedEnvClassName = ''
          if (this.selectedEnv && this.selectedEnv.uuid && env && env.uuid && this.selectedEnv.uuid === env.uuid) {
            selectedEnvClassName = 'selectedItem'
          }

          return (
            <MenuItem
              className={'__menuItem' + ' ' + selectedEnvClassName}
              key={env.uuid}
              href="javascript:;"
              onClick={this.selectEnv.bind(this, env)}
            >
              {env.name}
            </MenuItem>
          )
        })}
      </NavDropdown>
    )
  }

  showAddNewAccountModal = () => {
    this.setState({ shouldShowAddAccountModal: true })
  }

  hideAddNewAccountModal = () => {
    this.setState({ shouldShowAddAccountModal: false })
  }

  onAccountAdded = newAccount => {
    this.hideAddNewAccountModal()
    this.selectAcct(newAccount)
  }

  getSelectedAccountInfo = () => {
    const accounts = (this.props.dataStore.userData && this.props.dataStore.userData.accounts) || []
    let selectedAcctId = this.props.urlParams.accountId // AppStorage.get('acctId')
    let selectedAcctName = ''

    if (accounts.length > 0) {
      const selectedAccount = accounts.find(acct => acct.uuid === selectedAcctId)
      if (!selectedAccount) {
        // user has not selected an Account => default to the 1st one:
        selectedAcctId = accounts[0].uuid
        selectedAcctName = accounts[0].companyName
        AppStorage.set('acctId', selectedAcctId)
      } else {
        selectedAcctName = selectedAccount ? selectedAccount.accountName : ''
      }
    }
    return { selectedAcctName, selectedAcctId }
  }

  renderUserAccounts () {
    const accounts = (this.props.dataStore.userData && this.props.dataStore.userData.accounts) || []
    const { selectedAcctName, selectedAcctId } = this.getSelectedAccountInfo()

    if (selectedAcctName.length > 0) {
      return (
        <div className="accountListContainer">
          <div className="accountListHeader listRow"> Account: </div>
          <ul className="accountList">
            {accounts.map(acct => {
              const selectedCss = acct.uuid === selectedAcctId ? 'selectedItem' : ''
              return (
                <li key={acct.uuid} className={selectedCss} onClick={this.selectAcct.bind(this, acct)}>
                  <a className="listRow"> {acct.accountName} </a>
                </li>
              )
            })}
          </ul>
        </div>
      )
    }

    return (
      <MenuItem href="javascript:;" data-toggle="control-sidebar" title="Account">
        <a>
          <div> Account: </div>
          <span> {selectedAcctName} </span>
        </a>
      </MenuItem>
    )
  }

  renderUserInfo () {
    return (
      <NavDropdown
        title={this.getUser()}
        id="nav-dropdown"
        className="hidden-sm hidden-xs dropDownHarness accountDropDown"
      >
        <MenuItem href="#" data-toggle="control-sidebar" title="Profile" id="emailBlock">
          <span> {this.getEmail()} </span>
        </MenuItem>

        {this.renderUserAccounts()}

        <MenuItem
          className="add-account"
          data-toggle="dropdown"
          onClick={this.showAddNewAccountModal}
          title="Add Account"
        >
          + Add Account
        </MenuItem>

        <MenuItem href="#/login" data-toggle="control-sidebar" onClick={e => this.signOut(e)} title="Sign Out">
          Sign out
        </MenuItem>
      </NavDropdown>
    )
  }

  renderHelpInfo () {
    // const path = this.props.routerProps.location.pathname
    // const hasApp = (path.indexOf('/app/') >= 0)
    // const disabledCls = (hasApp) ? 'disabled' : ''

    return (
      <NavDropdown
        title={<i className="fa fa-question-circle" />}
        id="help-nav-dropdown"
        pullRight
        className="dropDownHarness hidden-sm hidden-xs"
      >
        {/* MenuItem had href="javascript;;"*/}
        <MenuItem
          onClick={e => {
            /* this.startTour(e, 'product', hasApp)*/
          }}
          data-toggle="control-sidebar"
        >
          Application Setup Guide
        </MenuItem>

        <MenuItem
          onClick={e => {
            /* this.startTour(e, 'service', hasApp, true)*/
          }}
          data-toggle="control-sidebar"
        >
          Service Setup Guide
        </MenuItem>

        <MenuItem
          onClick={e => {
            /* this.startTour(e, 'environment', hasApp)*/
          }}
          data-toggle="control-sidebar"
        >
          Environment Setup Guide
        </MenuItem>

        <MenuItem
          onClick={e => {
            /* this.startTour(e, 'artifact', hasApp)*/
          }}
          data-toggle="control-sidebar"
        >
          Artifact Stream Setup Guide
        </MenuItem>

        <MenuItem
          onClick={e => {
            /* this.startTour(e, 'pipeline', hasApp)*/
          }}
          data-toggle="control-sidebar"
        >
          Pipeline Setup Guide
        </MenuItem>
      </NavDropdown>
    )
  }

  renderHeaderContent () {
    // this.allApps = this.state.apps || []
    const apps = this.props.dataStore.apps.toJS()
    this.selectedApp = apps.find(app => app.uuid === Utils.appIdFromUrl())
    const path = this.props.routerProps.location.pathname
    // const showAppDropDown = this.showApplicationsDropDown()
    if (path.indexOf('governance/') >= 0) {
      return (
        <h3 className="__setupHeader appContextHeader">
          <span>Governance</span>
        </h3>
      )
    }
    if (this.showDropdowns) {
      let pageTitle = this.props.pageTitle
      if (Utils.hasSetupSideBar(path)) {
        pageTitle = <h3>Setup</h3>
      }

      return (
        <span className="appContextHeader">
          {/* showAppDropDown && this.renderAppDropdown() */}
          {/* this.renderEnvDropdown() */}
          {/* showAppDropDown && <span className="__pipe"></span> */}
          {pageTitle}
        </span>
      )
    }
  }

  /*
   * Check delegate status and show red status dot in header if it's not installed or down.
   */
  checkDelegateStatus = async () => {
    const fetchKey = +new Date()
    /*
     There was an issue reported of delegates being fetched
     when accountid is null ->
     removing the logic of fetching accountId from AppStorage
     instead getting it from url and adding a null check
    */
    const accountId = this.props.urlParams.accountId

    clearTimeout(this.checkDelegateStatusTimeoutId)

    if (accountId) {
      this.fetchKey = fetchKey
      const { error, delegates } = await DelegatesService.getDelegatesByAccount({ accountId })

      if (fetchKey !== this.fetchKey) {
        return
      }

      if (!error) {
        // No delegate install
        if (!delegates || delegates.total === 0) {
          this.setState({
            statusCheckError: 'No delegate installed.',
            statusCheckFailed: true
          })
        } else {
          // All delegates are not online
          if (delegates.every(delegate => delegate.connected === false)) {
            this.setState({
              statusCheckError: 'No delegate online.',
              statusCheckFailed: true
            })
          } else if (this.state.statusCheckFailed) {
            this.setState({
              statusCheckFailed: false
            })
          }
        }
      } else {
        this.setState({
          statusCheckError: 'Harness server is unreachable.',
          statusCheckFailed: true
        })
      }

      this.checkDelegateStatusTimeoutId = setTimeout(
        this.checkDelegateStatus,
        this.state.statusCheckFailed ? STATUS_CHECK_FAILURE_INTERVAL : STATUS_CHECK_SUCCESS_INTERVAL
      )
    }
  }

  isAppSideDropDownVisbile = path => {
    if (path.indexOf('account/') >= 0) {
      return true
    } else if (path.indexOf('app/') >= 0) {
      // TODO => this is to suppprt old design
      return true
    } else {
      return false
    }
  }

  render () {
    const path = this.props.routerProps.location.pathname
    // this.showDropdowns = (path.indexOf('app/') >= 0 ? true : false)
    this.showDropdowns = this.isAppSideDropDownVisbile(path)
    const { selectedAcctName } = this.getSelectedAccountInfo()
    const accountId = this.props.urlParams.accountId // Utils.accountIdFromUrl() || AppStorage.get('acctId')
    AppStorage.set('acctId', accountId)

    return (
      <header className={'main-header ' + css.main}>
        <div className="__leftMenuDiv">
          <a
            href="javascript:;"
            className="sidebar-toggle"
            data-toggle="offcanvas"
            role="button"
            onClick={CompUtils.toggleSidebar}
          >
            <span className="sr-only">Toggle navigation</span>
          </a>
          <Link to="/dashboard" className="logo">
            <span className="logo-mini">Harness</span>
            <span className="logo-lg">Harness</span>
          </Link>
        </div>

        <nav
          className={'navbar navbar-static-top ' + (this.props.fullscreen ? '' : 'fixed-page-width ') + css['mainNav']}
          role="navigation"
        >
          {/* Header Navbar: style can be found in header.less */}

          {/* this.renderHeaderContent()*/}

          {/* Navbar Right Menu */}
          <div className={' navbar-custom-menu'}>
            <ul className="nav navbar-nav">
              <span className="__pageTitle">{this.props.pageTitle}</span>

              {/* hiding notifications    <NotificationBar className="__notificationBar" /> */}

              {this.state.statusCheckFailed && (
                <Tooltip inline={true} position={Position.BOTTOM} content={<span>{this.state.statusCheckError}</span>}>
                  <Link to={`/account/${accountId}/installation`}>
                    <a>
                      <status-indicator negative pulse />
                    </a>
                  </Link>
                </Tooltip>
              )}
              <span className="__topAcctName">{selectedAcctName}</span>

              <img className="__avatar" src="/img/anon-user.jpg" />

              {/* User Account: style can be found in dropdown.less */}
              {this.renderUserInfo()}

              {/* Control Sidebar Toggle Button */}
              {this.renderHelpInfo()}
            </ul>
          </div>
        </nav>

        <WingsTour
          show={this.state.showTourModal}
          onHide={Utils.hideModal.bind(this, 'showTourModal')}
          tourType={this.state.tourType}
          {...this.props}
        />

        <AddAccountModal
          show={this.state.shouldShowAddAccountModal}
          onHide={this.hideAddNewAccountModal}
          onAccountAdded={this.onAccountAdded}
        />
      </header>
    )
  }
}

export default AppNavBar



// WEBPACK FOOTER //
// ../src/components/AppNavBar/AppNavBar.js