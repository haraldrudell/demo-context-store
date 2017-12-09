import React from 'react'
import { observer } from 'mobx-react'
import { PopoverInteractionKind } from '@blueprintjs/core'
import { Link } from 'react-router'
import { Position } from '@blueprintjs/core'
import AppStorage from '../AppStorage/AppStorage'
import Utils from '../Utils/Utils'
import UIButton from '../UIButton/UIButton'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import WindowEventHandler from '../WindowEventHandler/WindowEventHandler'
import { logout } from '../../services/UsersService'
import * as Icons from 'styles/icons'
import css from './AppHeader.css'

const CONTENT_WIDTH = 1230 // same as --content-width
const USER_DROPODWN_GAP = 150 // same as css: aside right

@observer
class AppHeader extends React.Component {
  state = {
    innerWidth: window.innerWidth
  }
  handleResize = () => {
    this.setState({ innerWidth: window.innerWidth })
  }

  onAccountSelect = account => {
    // TODO: refactor this (don't use reload), just redirect to /dashboard/accountId once Dashboard is done.
    AppStorage.set('acctId', account.uuid)
    AppStorage.set('appId', '')
    // this.context.router.replace(this.props.routerProps.location)
    window.location.href = '/#/dashboard'
    window.location.reload()
  }

  onSignOut = async () => {
    await logout()
    this.props.routerProps.router.push('/login')
  }

  renderUserDropdown () {
    const currentAccountId = localStorage.acctId
    const accounts = Utils.getJsonValue(this, 'props.dataStore.userData.accounts') || []
    const email = Utils.getJsonValue(this, 'props.dataStore.userData.email') || ''
    const userMenuOptions = [{ label: email }]
    for (const account of accounts) {
      const option = { label: 'Account: ' + account.accountName, onClick: () => this.onAccountSelect(account) }
      if (account.uuid === currentAccountId) {
        option.className = 'bold' // highligh current Account
      }
      userMenuOptions.push(option)
    }
    userMenuOptions.push({ label: 'Sign out', onClick: this.onSignOut, className: 'nav-signout' })
    return (
      <DropdownMenu
        options={userMenuOptions}
        title={<UIButton icon="Account" medium style={{ marginRight: -5 }} />}
        buttonClassName={`nav-profile-action ${css.userBtn}`}
        position={Position.BOTTOM_RIGHT}
        popoverProps={{ popoverClassName: '__lowerPopover', interactionKind: PopoverInteractionKind.HOVER }}
      />
    )
  }

  render () {
    const { routerProps, path, urlParams } = this.props
    const { router } = routerProps
    const dashboardActiveCss = path.isDashboard(urlParams) || path.isServiceDashboard(urlParams) ? css.active : ''
    const securityActiveCss =
      path.isAuditTrail(urlParams) || path.isUsersAndPermissions(urlParams) || path.isSecretManagement(urlParams)
        ? css.active
        : ''

    const dashboardMenuOptions = [
      {
        label: 'Main',
        onClick: () => {
          router.push('/dashboard')
        },
        className: (path.isDashboard(urlParams) ? 'bold' : '') + ' nav-dashboard-main'
      },
      {
        label: 'Services',
        onClick: () => {
          router.push(path.toServiceDashboard(urlParams))
        },
        className: (path.isServiceDashboard(urlParams) ? 'bold' : '') + ' nav-dashboard-services'
      }
    ]
    const securityMenuOptions = [
      {
        label: 'Audit Trail',
        onClick: () => {
          router.push(`/account/${urlParams.accountId}/history`)
        },
        className: (path.isAuditTrail(urlParams) ? 'bold' : '') + ' nav-audit-trail'
      },
      {
        label: 'Users and Permissions',
        onClick: () => {
          router.push(`/account/${urlParams.accountId}/user-role`)
        },
        className: (path.isUsersAndPermissions(urlParams) ? 'bold' : '') + ' nav-users-and-permissions'
      },
      {
        label: 'Secrets Management',
        onClick: () => {
          router.push(`/account/${urlParams.accountId}/secrets-management`)
        },
        className: path.isSecretManagement(urlParams) ? 'bold' : ''
      }
    ]

    // for small screens OR full-width screen: render user dropdown inside <nav>
    const renderUserInsideNav =
      (this.state.innerWidth < CONTENT_WIDTH + USER_DROPODWN_GAP ||
        document.body.className.includes('full-width-header')) &&
      this.renderUserDropdown()
    // for regular screen: render it to the right of <nav> (in <aside>)
    const renderUserOutsideNav = this.state.innerWidth >= CONTENT_WIDTH + USER_DROPODWN_GAP && this.renderUserDropdown()

    return (
      <header className={css.main}>
        <main className={css.content}>
          <Link className={css.logo} title="Harness.io">
            {/* <img src="https://app.harness.io//img/HARNESS_LOGO_MAIN.jpg" alt="Harness.io" /> */}
            <Icons.HarnessLogo className={css.svgLogo} alt="Harness.io" onClick={() => router.push('/dashboard')} />
          </Link>
          <nav>
            <DropdownMenu
              options={dashboardMenuOptions}
              title="Dashboards"
              buttonClassName={`nav-dashboard ${dashboardActiveCss}`}
              popoverProps={{ popoverClassName: '__lowerPopover', interactionKind: PopoverInteractionKind.HOVER }}
            />
            <Link
              className={((path.isDeployments(urlParams) && css.active) || '') + ' nav-deployments'}
              to={path.toDeployments(urlParams)}
            >
              <span data-name="deployments-menu">Continuous Deployment</span>
            </Link>
            <Link
              className={((path.isContinuousVerification(urlParams) && css.active) || '') + ' nav-verification'}
              to={path.toContinuousVerification(urlParams)}
            >
              <span data-name="verification-menu">Continuous Verification</span>
            </Link>
            <DropdownMenu
              options={securityMenuOptions}
              title="Continuous Security"
              buttonClassName={`nav-continuous-security ${securityActiveCss}`}
              popoverProps={{ popoverClassName: '__lowerPopover', interactionKind: PopoverInteractionKind.HOVER }}
            />
            <Link
              className={css.setup + ' nav-setup ' + (path.isSetup(urlParams) && css.active)}
              to={path.toSetup(urlParams)}
            >
              <span data-name="setup-menu">
                <UIButton icon="Setup">Setup</UIButton>
              </span>
            </Link>
            {renderUserInsideNav}
          </nav>
          <aside>{renderUserOutsideNav}</aside>
        </main>
        <div className={css.title}>
          <div className={css.titleContent}>{this.props.pageTitle}</div>
        </div>
        <WindowEventHandler handleResize={this.handleResize} />

        {
          // eslint-disable-next-line no-undef
          __DEV__ && (
          <Link className="ui-btn left-gap __dev" to={path.toDevWiki(urlParams)}>
            Dev
          </Link>
        )}
      </header>
    )
  }
}

export default AppHeader



// WEBPACK FOOTER //
// ../src/components/AppHeader/AppHeader.js