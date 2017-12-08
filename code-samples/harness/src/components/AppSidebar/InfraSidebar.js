import React from 'react'
import { Link } from 'react-router'

export default class InfraSidebar extends React.Component {
  state = {}

  activeClassIf = (menuName) => {
    const lastUrlPart = this.props.routerProps.location.pathname.split('/').slice(-1).toString()
    return (lastUrlPart === menuName ? 'active' : '')
  }

  render () {
    return (
      <aside className="main-sidebar">
        <div className="sidebar-icon-box">
        </div>
        <section className="sidebar">
          <ul className="sidebar-menu">

            <li className={this.activeClassIf('compute-providers')}>
              <Link to={'/infrastructure/compute-providers'}>
                <i className="icon icons8-ok menuItem" />
                <span>Cloud Providers</span>
              </Link>
            </li>

            <li className={this.activeClassIf('frameworks')}>
              <Link to={'/infrastructure/frameworks'}>
                <i className="icon icons8-ok menuItem" />
                <span>Execution Frameworks</span>
              </Link>
            </li>

            <li className={this.activeClassIf('verification')}>
              <Link to={'/infrastructure/verification'}>
                <i className="icon icons8-ok menuItem" />
                <span>Verification</span>
              </Link>
            </li>

            <li className={this.activeClassIf('build-artifact')}>
              <Link to={'/infrastructure/build-artifact'}>
                <i className="icon icons8-ok menuItem" />
                <span>Build and Artifact</span>
              </Link>
            </li>

            <li className={this.activeClassIf('collaboration')}>
              <Link to={'/infrastructure/collaboration'}>
                <i className="icon icons8-ok menuItem" />
                <span>Collaboration</span>
              </Link>
            </li>

            <li className={this.activeClassIf('organization')}>
              <Link to={'/infrastructure/organization'}>
                <i className="icon icons8-ok menuItem" />
                <span>Organization Settings</span>
              </Link>
            </li>

          </ul>
        </section>
      </aside>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/AppSidebar/InfraSidebar.js