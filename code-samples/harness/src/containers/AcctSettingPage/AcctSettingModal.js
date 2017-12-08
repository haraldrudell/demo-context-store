import React from 'react'
import { Modal } from 'react-bootstrap'
import apis from 'apis/apis'
import css from './AcctSettingModal.css'
import { WingsForm, WingsModal, AppStorage, Utils } from 'components'

export default class AcctSettingModal extends React.Component {
  schema = {
    type: 'object',
    required: ['name'],
    properties: {
      uuid: { type: 'string', title: 'uuid' },

      value: {
        type: 'object',
        title: 'Value',
        properties: { type: { type: 'string' } }
      },
      name: { type: 'string', title: 'Display Name', default: '' }
    }
  }
  uiSchema = {
    uuid: { 'ui:widget': 'hidden' },

    value: { type: { 'ui:widget': 'hidden' }, classNames: '' },
    name: {}
  }
  state = { formData: {}, schema: this.schema, uiSchema: this.uiSchema, error: false }
  settingsSchema = {}
  settingsUiSchema = {}

  componentWillMount () {
    if (this.props.show && !this.state.error) {
      this.onLoad(this.props)
    } else if (this.state.error) {
      this.debouncedInit(this.props)
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show && !this.state.error) {
      this.onLoad(newProps)
    } else if (this.state.error) {
      this.debouncedInit(newProps)
    }
  }
  onLoad = newProps => {
    const isNew = newProps.data ? false : true
    this.initFormData(newProps, isNew)
  }
  debouncedInit = Utils.debounce(props => this.onLoad.bind(this, props), 500)

  initFormData (newProps, isNew) {
    const formData = !isNew ? newProps.data : { value: {} }
    this.setState({ formData: formData })
    if (newProps.show) {
      this.schema.properties.value = this.props.jsonSchema
      this.uiSchema.value = this.props.uiSchema
      if (!newProps.hasOwnProperty('SshKey')) {
        this.schema.properties.value.title = 'Value'
      } else {
        this.uiSchema.value.classNames = 'SSHkey_legend'
      }
      const customProperties = this.uiSchema.value['custom:encryptedFields']
      Utils.modifyEncryptedFieldsOnSchema(this.schema.properties.value, customProperties)
      this.setState({ uiSchema: this.uiSchema, schema: this.schema })

      if (newProps.data) {
        const accessType = newProps.data.value.accessType
        const pwdIdx = this.checkPwdAccessType(accessType)
        const keyAccessIdx = this.checkKeyAccessType(accessType)
        this.customizeSchema(keyAccessIdx, pwdIdx, newProps.data)
      } else {
        this.initFormSchema(isNew, formData)
      }
    }
  }

  // checks if the selectedAccessType has USER_PASSWORD or not
  checkPwdAccessType (selectedAccessType) {
    if (selectedAccessType.includes('USER_PASSWORD')) {
      return true
    }
    return false
  }
  // checks if the selectedAccessType has KEY or not
  checkKeyAccessType (selectedAccessType) {
    if (selectedAccessType.includes('KEY')) {
      return true
    }
    return false
  }

  // By default the accesstype is "USER_PASSWORD"
  // If accesstype contains "USER_PASSWORD", it should not have
  // Username and key form controls.So hiding the controls for default
  // accesstype
  initFormSchema (isNew, formData) {
    const uiSchemaObj = this.uiSchema
    const uiValObj = this.uiSchema.value
    const hiddenObj = { 'ui-widget': 'hidden' }
    const uiOrderArr = uiValObj['ui:order']
    const usrNameIdx = uiOrderArr !== undefined ? uiOrderArr.indexOf('userName') : -1
    const keyIdx = uiOrderArr !== undefined ? uiOrderArr.indexOf('key') : -1
    const fromInfraMapping = this.props.hasOwnProperty('SshKey')
    const schemaObj = this.schema.properties.value
    if (usrNameIdx >= 0 && keyIdx >= 0 && !fromInfraMapping) {
      delete schemaObj.properties.userName
      delete schemaObj.properties.key
      this.schema.properties.value = schemaObj
      this.setState({ schema: this.schema })
      uiSchemaObj.userName = hiddenObj
      uiOrderArr.splice(usrNameIdx, 1)
      const keyIdx = uiOrderArr.indexOf('key')
      uiSchemaObj.key = hiddenObj
      uiOrderArr.splice(keyIdx, 1)
    } else if (fromInfraMapping) {
      if (!formData.value) {
        formData.value = {}
      }
      uiSchemaObj.value.connectionType = { 'ui:widget': 'hidden' }
      uiSchemaObj.value.accessType = { 'ui:widget': 'hidden' }
      formData.value.connectionType = 'SSH'
      formData.value.accessType = 'KEY'
    } else {
      uiSchemaObj.value.connectionType = {}
      uiSchemaObj.value.accessType = {}
    }
    this.setState({ uiSchema: this.uiSchema, formData })
  }
  onSubmit = ({ formData }) => {
    // const isEditing = (formData.uuid === undefined) ? false : true
    this.submitData(formData)
  }

  onChange = ({ formData }) => {
    const data = Utils.clone(this.state.formData)
    const accessType = formData.value.accessType
    if (data && data.value && formData.value.userName !== data.value.userName) {
      data.value.userName = formData.value.userName
      data.name = formData.value.userName
      this.setState({ formData: data })
    } else if (data && formData.name !== data.name) {
      data.name = formData.name
      this.setState({ formData: data })
    } else if (accessType) {
      const isKeyAcccessType = this.checkKeyAccessType(accessType)
      const isPwdType = this.checkPwdAccessType(accessType)
      if (isPwdType) {
        this.removeFormProp(formData)
      }
      this.customizeUiSchema(isKeyAcccessType, isPwdType)
      this.customizeSchema(isKeyAcccessType, isPwdType)
      this.setState({ formData: formData })
    }
  }

  // if accessTypes are of "USER_PASSWORD" type
  // remove username and key properties on formdata.
  removeFormProp (formData) {
    delete formData.value.userName
    delete formData.value.key
  }

  customizeSchema (isKeyType, isPwdType, data) {
    const schemaObj = this.schema.properties.value
    const userNameObj = { type: 'string', title: 'User Name', default: '' }
    const keyObj = { type: 'string', title: 'Key', default: '' }
    // If it is of "USER_PASSWORD" type,delete properties of userName
    // and key on schema object
    // if accessTypes are of "KEY" type
    // add username and key properties to the schema object.
    if (isPwdType) {
      delete schemaObj.properties.userName
      delete schemaObj.properties.key
    } else if (
      isKeyType &&
      !schemaObj.properties.hasOwnProperty('userName') &&
      !schemaObj.properties.hasOwnProperty('key')
    ) {
      schemaObj.properties.userName = userNameObj
      schemaObj.properties.key = keyObj
    }
    this.schema.properties.value = schemaObj
    this.customizeUiSchema(isKeyType, isPwdType)
    // const formData = this.modifyFormData(data)
    this.setState({ schema: this.schema, uiSchema: this.uiSchema, formData: data })
  }

  modifyFormData = data => {
    const formData = data
    return formData
  }

  hideKeyPropertiesOnSchema = (uiSchemaObj, usrNameIdx, uiOrderArr, hiddenObj) => {
    uiSchemaObj.userName = hiddenObj
    uiOrderArr.splice(usrNameIdx, 1)
    const keyIdx = uiOrderArr.indexOf('key')
    uiSchemaObj.key = hiddenObj
    uiOrderArr.splice(keyIdx, 1)
  }

  customizeUiSchema (isKeyType, isPwdType) {
    const uiSchemaObj = this.uiSchema
    const uiValObj = this.uiSchema.value
    const hiddenObj = { 'ui-widget': 'hidden' }
    const uiOrderArr = uiValObj['ui:order']
    const usrNameIdx = uiOrderArr !== undefined ? uiOrderArr.indexOf('userName') : -1
    const keyIdx = uiOrderArr !== undefined ? uiOrderArr.indexOf('key') : -1
    // If it is of "USER_PASSWORD" type,remove properties of userName
    // and key on uischema object
    // if accessTypes are of "KEY" type
    // add username and key properties to the uischema object.
    if (usrNameIdx >= 0 && keyIdx >= 0 && isPwdType) {
      this.hideKeyPropertiesOnSchema(uiSchemaObj, usrNameIdx, uiOrderArr, hiddenObj)
    } else if (
      isKeyType &&
      uiSchemaObj.hasOwnProperty('userName') &&
      uiSchemaObj.hasOwnProperty('key') &&
      usrNameIdx === -1 &&
      keyIdx === -1
    ) {
      uiOrderArr.push('userName')
      uiOrderArr.push('key')
      delete uiSchemaObj.userName
      delete uiSchemaObj.key
    }
    this.uiSchema = uiSchemaObj

    // this.setState({ uiSchema: this.uiSchema })
  }

  submitData = data => {
    const acctId = AppStorage.get('acctId')
    data.value.type = 'HOST_CONNECTION_ATTRIBUTES'
    // data.pluginSetting = false
    data.category = 'SETTING'
    const response = apis.onSubmitForSettingsEndPoint(acctId, data)
    this.processResponse(response, this.props.onSubmit)
  }

  processResponse = (response, onSubmit) => {
    response
      .then(data => {
        onSubmit(data)
      })
      .catch(error => {
        this.setState({ error: true })
      })
  }

  hideModal = () => {
    this.schema.value = {
      type: 'object',
      title: 'Value',
      properties: { type: { type: 'string' } }
    }
    this.setState({ schema: this.schema, uiSchema: this.uiSchema })
    this.props.onHide()
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.hideModal} className={css.main} data-name="new-user-key-modal">
        <Modal.Header closeButton>
          <Modal.Title id="ModalHeader">
            {this.props.SshKey && 'SSH Key'}

            {!this.props.SshKey && 'Settings'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Settings"
            ref="form"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            onSubmit={this.onSubmit}
            onChange={this.onChange}
            formData={this.state.formData || {}}
          />
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/AcctSettingPage/AcctSettingModal.js