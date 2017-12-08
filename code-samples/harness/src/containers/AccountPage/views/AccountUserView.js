import React from 'react'
import { Link } from 'react-router'

export default class AccountUserView extends React.Component {

  render () {
    return (
      <div data-name="Users and Roles" className="box-solid wings-card ">
        <div className="box-body __accountBody">
          <Link to={'/account/user-role'}>
            <div className="row">
              <div className="col-md-2 __accountIcon">
                <div>
                  <span className="wings-text-link">
                    <i className="icons8-user" />
                  </span>
                </div>
              </div>
              <div className="col-md-10 __accountContent" data-name="users-and-roles-link">
                <div><h3>
                  <span className="wings-text-link">
                    Users and Roles
                  </span>
                </h3></div>
                <div>
                  <span className="light"> Users and Roles can be managed here </span>
                </div>
                <div>
                  <span className="__normalText"> Users, Roles, Authentication </span>
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
// ../src/containers/AccountPage/views/AccountUserView.js