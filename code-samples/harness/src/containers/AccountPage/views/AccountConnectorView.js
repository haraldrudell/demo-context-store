import React from 'react'
import { Link } from 'react-router'

export default class AccountConnectorsView extends React.Component {

  render () {
    return (
      <div data-name="Connectors" className="box-solid wings-card ">
        <div className="box-body __accountBody">
          <Link to={'/account/connector'}>
            <div className="row">
              <div className="col-md-2 __accountIcon">
                <div>
                  <span className="wings-text-link">
                    <i className="icons8-connection-status-on" />
                  </span>
                </div>
              </div>
              <div className="col-md-10 __accountContent" data-name="connectors-link">
                <div><h3>
                  <span className="wings-text-link">
                      Connectors
                  </span>
                </h3></div>
                <div>
                  <span className="light"> Connectors can be modeled here </span>
                </div>
                <div>
                  <span className="__normalText"> Jenkins, SMTP, Splunk, AppDynamics etc. </span>
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
// ../src/containers/AccountPage/views/AccountConnectorView.js