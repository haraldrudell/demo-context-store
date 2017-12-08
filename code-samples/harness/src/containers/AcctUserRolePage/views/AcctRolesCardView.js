import React from 'react'
import css from './AcctUsersCardView.css'

export default class AcctRolesCardView extends React.Component {

  renderFilter (permission) {
    let str = ''
    if (permission.permissionScope === 'APP') {
      str = 'Application:'
      str += (permission.appId === '__GLOBAL_APP_ID__') ? '*' : permission.appId
    }

    if (permission.permissionScope === 'ENV') {
      str = 'Environment:'
      str += (permission.environmentType === 'ALL') ? '*' : permission.envId
    }
    return str
  }

  groupRoles (roleMappings, roleTypes) {
    if (roleMappings.length > 0 && roleTypes !== undefined) {
      const result = {}
      for (const type of roleTypes) {
        const roleName = type.displayText
        // const roleResponseObj = {}
        const mappings = roleMappings.find ((mapping) => mapping.name === roleName)
        if (!result.hasOwnProperty(roleName) && mappings !== undefined) {
          result[roleName] = { 'description': '' }
          result[roleName].description = mappings.description
        }
      }
      return result
    }
  }

  render () {
    const roles = this.props.roles
    const roleTypes = this.props.roleTypes
    const groupedRoles = this.groupRoles(roles, roleTypes)
    return (
      <div className={`row wings-card-row ${css.main}`}>
        {groupedRoles && Object.keys(groupedRoles).map((item, index) =>
          <div className="row">
            {index > 0 && <hr />}
            <div className="col-md-2">
              <div className="__largeText">{item}</div>
            </div>
            <div className="col-md-8">
              <dl className="dl-horizontal wings-dl __dl">
                <dt>Description</dt>
                <dd>{groupedRoles[item].description}</dd>
              </dl>
            </div>
          </div>
        )}
      </div>
    )

  }
}



// WEBPACK FOOTER //
// ../src/containers/AcctUserRolePage/views/AcctRolesCardView.js