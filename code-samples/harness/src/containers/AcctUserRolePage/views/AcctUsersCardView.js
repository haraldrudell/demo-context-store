import React from 'react'
import css from './AcctUsersCardView.css'
import { TooltipOverlay } from 'components'

export default class AcctUsersCardView extends React.Component {
  userObject = {}
  componentWillMount () {}
  componentWillReceiveProps (newProps) {}

  getUniqueRoles (roles) {
    const roleTypesSet = new Set(roles.map(role => role.name))
    return Array.from(roleTypesSet)
  }

  /*
    Grouping user roles based on the role name
    User roles would have a different uuid for each application of the same role
    grouping all the application id's for a role and showing all applications
    for each  role as comma separated list
   */
  groupRoles (roleMappings) {
    const roleTypes = this.getUniqueRoles(roleMappings)
    if (roleMappings.length > 0 && roleTypes !== undefined) {
      const result = {}
      for (const type of roleTypes) {
        const mappings = roleMappings.filter(mapping => mapping.name === type)
        if (!result.hasOwnProperty(type)) {
          result[type] = { apps: '' }
          result[type].apps = this.fetchApplications(mappings)
        }
      }
      return result
    }
  }
  fetchApplications (mappingObject) {
    const response = mappingObject.reduce(function callback (res, key, index) {
      if (key.appName === null) {
        res.push('All Applications')
      } else {
        res.push(key.appName)
      }
      return res
    }, [])
    return response.join(', ')
  }
  convertUserRoleObject (roles) {}
  render () {
    if (this.props.data !== undefined) {
      this.userObject = this.props.data
      for (const user of this.userObject) {
        user.applications = this.groupRoles(user.roles)
      }
    }

    return (
      <div className={`row wings-card-row ${css.main}`}>
        {this.userObject &&
          this.userObject.map((item, index) =>
            <div key={item.uuid} className="row" data-name={item.email}>
              {index > 0 && <hr />}
              <div className="col-md-2">
                {item.emailVerified === false &&
                  <TooltipOverlay tooltip="Registration is not complete.Please check your email">
                    <div className="__notRegistered">
                      {item.name}
                    </div>
                  </TooltipOverlay>}
                {item.emailVerified !== false &&
                  <div className="__largeText">
                    {item.name}
                  </div>}
              </div>
              <div className="col-md-8">
                <dl className="dl-horizontal wings-dl __dl">
                  <dt>Email</dt>
                  <dd>
                    {item.email}
                  </dd>
                  <dt>Roles</dt>

                  <dd>
                    {item.applications &&
                      Object.keys(item.applications).map((key, index) =>
                        <div>
                          {' '}{key} ({item.applications[key].apps})
                        </div>
                      )}
                  </dd>
                </dl>
              </div>
              <div className="col-md-2">
                <div className="wings-card-actions">
                  <span>
                    <i
                      className="icons8-pencil-tip"
                      data-name="edit-account-user"
                      onClick={this.props.onEditUser.bind(this, item)}
                    />
                  </span>
                  <span>
                    <i
                      className="icons8-waste"
                      data-name="delete-account-user"
                      onClick={this.props.onDeleteUser.bind(this, item)}
                    />
                  </span>
                </div>
              </div>
            </div>
          )}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/AcctUserRolePage/views/AcctUsersCardView.js