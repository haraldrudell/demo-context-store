import React from 'react'
import { Modal } from 'react-bootstrap'

import { Utils, WingsForm, WingsModal, FormUtils } from 'components'
import { EncryptService } from 'services'
import EncryptVariablesModal from '../SecretsManagementPage/EncryptResources/EncryptVariablesModal'

import { MentionsType } from '../../utils/Constants'
import { MentionUtils } from 'utils'
// import { FORM_CONTENT } from '@blueprintjs/core/dist/common/classes'

const types = {
  TEXT: 'TEXT',
  ENCRYPTED: 'ENCRYPTED_TEXT',
  LB: 'LB'
}

const schema = {
  type: 'object',
  required: ['name', 'value'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },
    name: { type: 'string', title: 'Name' },
    value: { type: 'string', title: 'Value', default: '' },
    type: {
      type: 'string',
      title: 'Type',
      default: 'TEXT',
      enum: ['TEXT', 'ENCRYPTED_TEXT', 'LB'],
      enumNames: ['TEXT', 'ENCRYPTED_TEXT', 'LB']
    },
    entityType: { type: 'string', title: 'entityType', default: '' },
    entityId: { type: 'string', title: 'entityId', default: '' }
  }
}

const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  entityId: { 'ui:widget': 'hidden' },
  entityType: { 'ui:widget': 'hidden' },
  name: { 'ui:placeholder': 'Name' },
  value: { 'ui:placeholder': 'Value' },
  type: {},
  'ui:order': ['name', 'type', 'value', 'uuid', 'entityId', 'entityType']
}

const log = type => {} // console.log.bind(console, type)
const secretKeys = ['value']

export default class ConfigVarsModal extends React.Component {
  state = { schema, uiSchema, formData: {} }
  isEdit = false

  componentWillReceiveProps (newProps) {
    this.initModal(newProps)
  }

  componentWillMount () {
    this.initModal(this.props)
  }

  componentDidMount () {
    this.setupMentions()
  }

  componentDidUpdate () {
    this.setupMentions()
  }

  setupMentions () {
    const { enableOnlySecretKeys: readOnly, show, config } = this.props

    if (show && !readOnly) {
      const { appId, entityType, entityId } = config

      MentionUtils.registerForField({
        field: 'value',
        type: MentionsType.SERVICES,
        args: { appId, entityType, entityId }
      })
    }
  }

  initModal = props => {
    if (props.show) {
      this.isEdit = props.ConfigData ? true : false
      this.setState({ formData: props.ConfigData || {} })

      if (props.ConfigData && props.ConfigData.type === 'ENCRYPTED_TEXT') {
        const d2 = Utils.clone(props.ConfigData)
        d2.value = ''
        this.setState({ formData: d2 || {} })
      }
      const { ConfigData, serviceVariableTypes } = props
      this.updateSchema(serviceVariableTypes, ConfigData)
    }
  }

  updateSchema (serviceVariableTypes, ConfigData) {
    const schema = Utils.clone(this.state.schema)
    const uiSchema = FormUtils.clone(this.state.uiSchema)

    schema.properties.type.enum = serviceVariableTypes.map(type => type.value)
    schema.properties.type.enumNames = serviceVariableTypes.map(type => type.name)

    if (this.isEdit) {
      this.modifySchemaOnEdit({ schema, uiSchema, formData: ConfigData })
    }

    this.setState({ schema, uiSchema })
  }

  modifySchemaOnEdit = ({ schema, uiSchema, formData }) => {
    const { enableOnlySecretKeys } = this.props
    if (enableOnlySecretKeys) {
      uiSchema = Utils.disableNonSecretKeysOnSchema({ schema, uiSchema, secretKeys })
    } else {
      if (formData.type === types.ENCRYPTED) {
        return this.updateValuePropertyWithEnums({ formData })
      } else {
        return this.updateValuePropertyWithMentions({ formData })
      }
    }
  }

  onSubmit = ({ formData }) => {
    this.props.onSubmit(formData, this.isEdit)
  }

  onChange = ({ formData }) => {
    const prevData = FormUtils.clone(this.state.formData)

    if (prevData.type !== formData.type) {
      formData.value = ''
      if (formData.type === types.ENCRYPTED) {
        this.updateValuePropertyWithEnums({ formData })
      } else {
        this.updateValuePropertyWithMentions({ formData })
      }
    } else if (formData.value === 'New') {
      this.setState({ showEncryptModal: true })
    }
  }

  updateValuePropertyWithEnums = async ({ formData }) => {
    const resource = await this.fetchEncryptVariables()
    formData.value = formData.encryptedValue ? formData.encryptedValue : ''
    const formObject = { formData }
    Utils.updateValuePropertyWithEnums({ formObject, result: resource, context: this })
  }

  fetchEncryptVariables = async () => {
    const { accountId } = this.props.urlParams
    const { error, resource } = await EncryptService.listEncryptedVariables({
      accountId,
      type: Utils.encryptTypes.TEXT
    })

    if (error) {
      return
    }
    return resource
  }

  updateValuePropertyWithMentions = ({ formData }) => {
    const schema = FormUtils.clone(this.state.schema)
    const uiSchema = FormUtils.clone(this.state.uiSchema)

    uiSchema.value['ui:placeholder'] = 'Value'
    delete schema.properties.value.enum
    delete schema.properties.value.enumNames
    this.setState({ formData, schema, uiSchema })

    setTimeout(_ => this.setupMentions(), 0)
  }

  hideModal = () => {
    this.setState({ schema, uiSchema })
    this.props.onHide()
  }

  addMoreConfigs = () => {}

  renderEncryptVarModal = () => {
    const { accountId } = this.props.urlParams

    if (this.state.showEncryptModal) {
      return (
        <EncryptVariablesModal
          show={this.state.showEncryptModal}
          accountId={accountId}
          onHide={this.hideEncryptModal}
          onSubmit={this.onSubmitOfNewKey}
        />
      )
    } else {
      return null
    }
  }

  onSubmitOfNewKey = async result => {
    const resource = await this.fetchEncryptVariables()
    const formData = FormUtils.clone(this.state.formData)
    formData.encryptedValue = result
    const formObject = { formData }
    Utils.updateValuePropertyWithEnums({ formObject, result: resource, context: this })
  }

  hideEncryptModal = () => {
    this.setState({ showEncryptModal: false })
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Config Variable</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Tag"
            ref="form"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')}
          />
        </Modal.Body>
        {this.renderEncryptVarModal()}
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ConfigPage/ConfigVarsModal.js