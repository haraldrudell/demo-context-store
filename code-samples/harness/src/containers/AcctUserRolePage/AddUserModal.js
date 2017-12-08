import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsModal, WingsForm, AppStorage, Utils } from 'components'
import css from './AddUserModal.css'
import RoleComponent from './RoleComponent.js'

const schema = {
  type: 'object',
  required: ['email'],
  properties: {
    uuid: { type: 'string' },
    email: { type: 'string', title: '', default: '' },
    roleTypes: { type: 'array', title: 'Role', uniqueItems: true,
      items: {
        type: 'string',
        enum: [],
        enumNames: []
      }
    }
  }
}

const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  'ui:order': ['*']
}

const data = {
  email: '',
  roles: [],
  roleTypes: []
}

export default class AddUserModal extends React.Component {
  state = { formData: {}, schema, uiSchema, selectedRoles: [], multiSelectData: [] }
  acctId = AppStorage.get('acctId')
  editingResponse= {}
  isEdit = false

  /* To load up the role component */
  RolesWithApps = (props) => {
    const isEditing = (this.props.data ? true : false)
    return (
      <RoleComponent
        roleProps={props}
        roleMapping ={this.props.roles}
        formData = {this.state.formData}
        setFormData= {this.setFormData}
        reset= {this.resetFormData}
        isEditing ={isEditing}
      />
    )
  }

  /* updating formData with roles/applications and unique roleTypes */
  setFormData = (newFormData) => {
    const formData = Utils.clone(this.state.formData)
    formData.roles = newFormData.roles
    formData.roleTypes = this.getUniqueRoleTypes(formData.roles)
    formData.applications = newFormData.applications
    this.setState ({ formData })
  }

  onChange = ({ formData }) => {
    const data = Utils.clone(this.state.formData)
    formData.email = formData.email
    formData.roles = data.roles
    formData.roleTypes = this.getUniqueRoleTypes(formData.roles)
    this.setState({ formData })
  }

  /* For submission of invite user -deleting email as we need list of emails
    for edit we need to update name
    as we just need role object -deleting roletypes and applications of formData
  */
  onSubmit = ({ formData }) => {
    const isEditing = (this.props.data ? true : false)
    const data = (!isEditing) ? Utils.clone(formData) : this.editingResponse
    if (!isEditing ) {
      data.emails = data.email.split(/[\n,]/)
      data.emails = data.emails.map(email => email.trim()) // trim spaces around emails
      delete data.email
    } else {
      data.name = formData.name
    }
    delete data.roleTypes
    delete data.applications
    data.roles = formData.roles
    this.props.onSubmit(data, this.acctId, isEditing)
  }

  /* Validating email
    customising error messages when no role is selected or
    when any role is selected with no application data
  */
  validate = ( formData, errors ) => {
    // splitting emails either by comma or new line
    const emails = formData.email.split(/[\n,]/)
    const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    for (const email of emails) {
      if (!regExp.test(email.trim()) ) {
        errors.email.addError('Email not in valid format')
        return errors
      }
    }

    const roleTypes = formData.roleTypes

    if (roleTypes.length <= 0) {
      errors.roleTypes.addError('Select at least one role' )
    }
    if ( formData.hasOwnProperty('applications' )) {
      const emptyAppRoles = this.validateEmptyApps(roleTypes, formData.applications)

      for ( const appmapping of emptyAppRoles) {
        errors.roleTypes.addError('Enter at least one application for ' + appmapping.role)
      }
    }
    errors.email = {}
    return errors
  }

  getUniqueRoleTypes (roles) {
    const roleTypesSet = new Set(roles.map ((role) => role.name))
    return Array.from(roleTypesSet)
  }

  validateEmptyApps (roles, applications) {
    const result = applications.filter ( (mapping) => mapping.apps.length < 1)
    return result
  }
  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      const isEditing = (newProps.data !== null) ? true : false
      this.isEdit = isEditing
      if (newProps.data !== null && newProps.data.roles !== null) {
        const data = newProps.data
        this.editingResponse = data
        this.updateFormData(isEditing, data)
      } else {
        this.updateFormData(false, data)
      }
      if (Array.isArray(newProps.roletypes)) {
        this.updateForm(newProps.roletypes, isEditing)
      }

    }
  }
  /* updating formData - If it is on edit mode update formData with selected user information
    if it is new -update with empty data
   */
  updateFormData =(isEditing, prevFormData) => {
    const formData = Utils.clone(this.state.formData)
    if (isEditing) {
      formData.uuid = prevFormData.uuid
      formData.name = prevFormData.name
      formData.email = prevFormData.email
      formData.roles = prevFormData.roles
      formData.roleTypes = this.getUniqueRoleTypes(prevFormData.roles)
      formData.applications = []
      formData.applications = this.fillApplications(formData.roles, formData.roleTypes)
      this.setState({ formData })
    } else {
      this.setState({ formData: data })
    }
  }

  getAppsForRole (roleObject) {
    const apps = roleObject.reduce (function callback (result, key, index) {
      result.push( { 'label': roleObject[index].appName, 'value': roleObject[index].appId })
      return result
    }, [])
    return apps
  }
  /*
   Groups each role and fills application
   result strucuture would be
   result :[{"role1":{role:rolename,apps:[app1,app2]}}]
   each app would be of strucure {'label':appname, 'value':appid}
   */
  fillApplications (roles, roleTypes) {
    const result = []
    for (const type of roleTypes) {
      const mappings = roles.filter ((mapping) => mapping.name === type)
      const savedAppIdx = result.findIndex ((application) => application.role === type)
      if (savedAppIdx === -1) {
        result.push({ 'role': type, 'apps': this.getAppsForRole(mappings) })
      } else {
        result[savedAppIdx].apps = this.getAppsForRole(mappings)
      }
    }
    return result
  }
  /* updating form
   If it is on edit mode -Show name field on the form and email should be disabled
   if it is new user invite--- show email as textarea to enter multiple emails and remove disability
   and dont show name field
   */
  updateForm (roles, isEditing) {
    const _schema = Utils.clone(this.state.schema)
    const _uiSchema = Utils.clone(this.state.uiSchema)
    if (roles) {
      _schema.properties.roleTypes.items.enum = roles.map(role => role.displayText)// this.filterRoleMapping(roles)
      _schema.properties.roleTypes.items.enumNames = roles.map(role => role.displayText)
    }
    _uiSchema.roleTypes = { 'ui:widget': this.RolesWithApps }
    if (isEditing) {
      _schema.properties.name = { 'type': 'string', title: 'Full Name' }
      _schema.required.push('name')
      _uiSchema.name = {}
      const uiOrder = _uiSchema['ui:order']
      const nameIdx = uiOrder.indexOf('name')
      if ( nameIdx < 0 ) {
        uiOrder.unshift('name')
      }
      _schema.properties.email.title = 'Email Address'
      _uiSchema.email = { type: 'string', 'ui:disabled': true }
    } else {
      delete _schema.properties.name
      delete _uiSchema.name
      const uiOrder = _uiSchema['ui:order']
      const nameIdx = uiOrder.indexOf('name')
      const requiredNameIdx = _schema.required.indexOf('name')
      if ( nameIdx >= 0 ) {
        uiOrder.splice(nameIdx, 1)
      } if (requiredNameIdx >= 0) {
        _schema.required.splice(requiredNameIdx)
      }
      _schema.properties.email.title = 'Email Address(es)'
      _uiSchema.email = { 'ui:widget': 'textarea', 'ui:placeholder': 'email1\nemail2' }
    }
    this.setState({ schema: _schema, uiSchema: _uiSchema })
  }

  render () {
    const title = (this.isEdit) ? 'Edit User' : 'Add User'
    return (
      <WingsModal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <WingsForm name="Add User" schema={this.state.schema} uiSchema={this.state.uiSchema}
            className={css.main}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            showErrorList={false}
            validate={this.validate}
          />
          <span className={this.state.errorMessage}>{this.state.errorMessage}</span>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/AcctUserRolePage/AddUserModal.js