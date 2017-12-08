import React from 'react'
import { Link } from 'react-router'

export default class AccountCloudProviderView extends React.Component {

  render () {
    return (
      <div data-name="Cloud Providers" className="box-solid wings-card ">
        <div className="box-body __accountBody">
          <Link to={'/account/cloud-providers'}>
            <div className="row">
              <div className="col-md-2 __accountIcon">
                <div>
                  <span className="wings-text-link">
                    <i className="icons8-cloud" />
                  </span>
                </div>
              </div>
              <div className="col-md-10 __accountContent" data-name="account-providers-link">
                <div><h3>
                  <span className="wings-text-link">
                      Cloud Providers
                  </span>
                </h3></div>
                <div>
                  <span className="light"> Cloud Providers can be modeled here </span>
                </div>
                <div>
                  <span className="__normalText"></span>
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
// ../src/containers/AccountPage/views/AccountCloudProviderView.js