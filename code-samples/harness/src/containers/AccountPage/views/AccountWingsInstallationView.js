import React from 'react'
import { Link } from 'react-router'

export default class AccountWingsInstallationView extends React.Component {

  render () {
    return (
      <div data-name="Harness Installation" className="box-solid wings-card ">
        <div className="box-body __accountBody">
          <Link to={'/account/installation'}>
            <div className="row">
              <div className="col-md-2 __accountIcon">
                <div>
                  <span className="wings-text-link">
                    <i className="icons8-software-installer" />
                  </span>
                </div>
              </div>
              <div className="col-md-10 __accountContent">
                <div><h3>
                  <span className="wings-text-link">
                      Harness Installation
                  </span>
                </h3></div>
                <div>
                  <span className="light"> Setup Harness Manager & Delegates</span>
                </div>
                <div>
                  <span className="__normalText"> &nbsp; </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/AccountPage/views/AccountWingsInstallationView.js