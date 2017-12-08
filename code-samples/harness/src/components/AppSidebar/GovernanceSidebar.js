import React from 'react'
import { Link } from 'react-router'

export default class GovernanceSidebar extends React.Component {
  state = {}

  activeClassIf = (menuName) => {
    const lastUrlPart = this.props.routerProps.location.pathname.split('/').slice(-1).toString()
    return (lastUrlPart === menuName ? 'active' : '')
  }

  render () {
    return (
      <aside className="main-sidebar">
        <section className="sidebar">
          <ul className="sidebar-menu">

            <li className={this.activeClassIf('rules')}>
              <Link to={'/governance/rules'}>
                <i className="icon icons8-ok menuItem" />
                <span>Rules</span>
              </Link>
            </li>

            <li className={this.activeClassIf('roles')}>
              <Link to={'/governance/roles'}>
                <i className="icon icons8-ok menuItem" />
                <span>Roles</span>
              </Link>
            </li>

            <li className={this.activeClassIf('users')}>
              <Link to={'/governance/users'}>
                <i className="icon icons8-ok menuItem" />
                <span>Users</span>
              </Link>
            </li>

          </ul>
        </section>
      </aside>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/AppSidebar/GovernanceSidebar.js