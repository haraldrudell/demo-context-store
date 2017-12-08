import React from 'react'
import { CompUtils, Utils, PageBreadCrumbs, ConfirmDelete, createPageContainer } from 'components'

import css from './AcctUserRolePage.css'
import apis from 'apis/apis'
import AcctUsersCardView from './views/AcctUsersCardView'
import AcctRolesCardView from './views/AcctRolesCardView'
import AddUserModal from './AddUserModal'

const fragmentArr = [{ users: [] }, { roles: [] }]
// ---------------------------------------- //

class AcctUserRolePage extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  // TODO: propTypes
  state = {
    users: {},
    roles: {},
    showUserModal: false,
    userModalData: null,
    showConfirm: false
  }
  acctId = Utils.accountIdFromUrl()
  title = this.renderTitleBreadCrumbs()
  pageName = 'Users and Permissions'

  componentWillMount () {
    this.fetchData()
    Utils.loadChildContextToState(this, 'apps')
    Utils.loadCatalogsToState(this)
  }

  fetchData = () => {
    fragmentArr[0].users = [apis.fetchUsers, this.acctId]
    fragmentArr[1].roles = [apis.fetchRoles, this.acctId]
    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this)
    } else {
      this.setState(this.props)
    }
  }

  renderTitleBreadCrumbs () {
    const bData = [{ label: 'Users and Permissions', nonHeader: true }]
    return <PageBreadCrumbs data={bData} />
  }

  onSubmitUser = (data, accountId, isEditing) => {
    // Manually trigger the spinner so that it starts spinning after the modal closes, and before the fetch starts.
    this.setState({ loadingStatus: 1 })
    if (isEditing) {
      delete data.emails
      apis.service
        .replace(apis.getEditUserEndPoint(data.uuid), {
          body: JSON.stringify(data)
        })
        .then(resp => this.fetchData())
        .catch('error => { throw error }')
    } else {
      delete data['uuid']
      apis.service
        .create(apis.getUserInviteEndPoint(accountId), {
          body: JSON.stringify(data)
        })
        .then(resp => {
          this.fetchData()
        })
        .catch(error => {
          throw error
        })
    }
    Utils.hideModal.call(this, 'showUserModal')
  }

  onAddUser = () => {
    this.setState({ showUserModal: true, userModalData: null })
  }

  onEditUser = item => {
    this.setState({ showUserModal: true, userModalData: item })
  }

  onDeleteUser = item => {
    this.setState({ showConfirm: true, deletingId: item.uuid })
  }

  onDeleteUserConfirmed = () => {
    apis.service
      .destroy(apis.getDeleteUserEndPoint(this.state.deletingId, this.acctId))
      .then(() => this.fetchData())
      .catch(error => {
        throw error
      })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  render () {
    const users = Utils.getJsonValue(this, 'state.users.resource.response') || []
    const roles = Utils.getJsonValue(this, 'state.roles.resource.response') || []
    const roleTypes = (this.state.catalogs && this.state.catalogs.ROLE_TYPE) || []
    return (
      <section className={css.main}>
        {/* Show spinner while loading. */}
        {CompUtils.renderLoadingStatus(this, users, '', 'spinnerLeftMargin32')}
        <section className="content">
          <div className="row wings-card-row">
            <div className="col-md-12 wings-card-col">
              <div data-name="account-users" className="box-solid wings-card">
                <div className="box-header with-border">
                  Users
                  <div className="wings-card-actions">
                    <span data-name="add-new-user" onClick={this.onAddUser.bind(this)} className="wings-text-link">
                      <i className="icons8-plus-math" /> Add User
                    </span>
                  </div>
                </div>
                <div className="box-body wings-card-body">
                  <AcctUsersCardView
                    data={users}
                    onEditUser={this.onEditUser}
                    onDeleteUser={this.onDeleteUser}
                    roleTypes={roleTypes}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 wings-card-col">
              <div className="box-solid wings-card">
                <div className="box-header with-border">Roles</div>
                <div className="box-body wings-card-body">
                  <AcctRolesCardView roles={roles} roleTypes={roleTypes} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <AddUserModal
          show={this.state.showUserModal}
          onHide={Utils.hideModal.bind(this, 'showUserModal')}
          data={this.state.userModalData}
          onSubmit={this.onSubmitUser}
          roles={roles}
          roletypes={this.state.catalogs && this.state.catalogs.ROLE_TYPE}
        />
        <ConfirmDelete
          visible={this.state.showConfirm}
          onConfirm={this.onDeleteUserConfirmed}
          onClose={Utils.hideModal.bind(this, 'showConfirm')}
        />
      </section>
    )
  }
}

export default createPageContainer()(AcctUserRolePage)



// WEBPACK FOOTER //
// ../src/containers/AcctUserRolePage/AcctUserRolePage.js