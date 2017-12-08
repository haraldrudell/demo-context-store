import React from 'react'
import ReactDOM from 'react-dom'
import { Modal } from 'react-bootstrap'
import { WingsForm, Utils, TargetEnvsFormWidget, ManageVersionsModal } from 'components'
import apis from 'apis/apis'
import css from './ConfigModal.css'
import FormUtils from '../../components/Utils/FormUtils'
import EncryptFilesModal from '../SecretsManagementPage/EncryptResources/EncryptFilesModal'

import { EncryptService } from 'services'
import { MentionsType } from '../../utils/Constants'
import { MentionUtils } from 'utils'

const schema = {
  type: 'object',
  required: ['file', 'relativeFilePath'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },

    md5: { type: 'string', title: 'MD5 (checksum)', default: '' },
    relativeFilePath: { type: 'string', title: 'Relative File Path' },
    description: { type: 'string', title: 'Description', default: '' },
    encrypted: { type: 'boolean', title: '  ', default: false },
    file: { type: 'string', title: 'File' },
    targetToAllEnv: { type: 'boolean', title: '  ', default: true },
    envIdVersionMap: { type: 'object', title: '  ', properties: {}, default: {} },
    setAsDefault: { type: 'boolean' }
  }
}

const FileWidget = props => {
  return (
    <input
      type="file"
      id="root_file"
      required={props.required}
      onChange={event => {
        props.onChange(event.target.value)
      }}
    />
  )
}

const log = type => {} // console.log.bind(console, type)

const secretKeys = ['file']

export default class ConfigModal extends React.Component {
  state = { showManageVersions: false, schema }
  errText = ''

  targetEnvWidget = props => {
    return <TargetEnvsFormWidget params={props} onShowTargetModal={this.onShowTargetModal.bind(this)} />
  }

  uiSchema = {
    uuid: { 'ui:widget': 'hidden' },
    file: { 'ui:widget': FileWidget },
    md5: {
      classNames: 'wings-short-input',
      'ui:placeholder': 'to ensure data integrity of the file uploaded',
      'ui:widget': 'hidden'
    },
    description: { 'ui:placeholder': 'Description' },
    encrypted: { 'ui:widget': 'checkbox' },
    relativeFilePath: { 'ui:placeholder': 'Relative File Path Including File Name' },
    targetToAllEnv: { 'ui:widget': this.targetEnvWidget, classNames: 'config' },
    envIdVersionMap: { classNames: '__envIdVersionMap' },
    notes: { 'ui:widget': 'textarea' },
    setAsDefault: { 'ui:widget': 'hidden' },
    'ui:order': ['uuid', 'md5', 'description', 'relativeFilePath', 'encrypted', 'file', '*']
  }

  componentWillReceiveProps (newProps) {
    this.initModal(newProps)
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
        field: 'relativeFilePath',
        type: MentionsType.SERVICES,
        args: { appId, entityType, entityId }
      })
    }
  }

  componentWillMount () {
    const { enableOnlySecretKeys: readOnly } = this.props

    if (readOnly) {
      this.uiSchema.relativeFilePath['ui:readonly'] = true
    } else {
      delete this.uiSchema.relativeFilePath['ui:readonly']
    }

    this.initModal()
  }

  initModal = (props = this.props) => {
    if (props.show) {
      this.errText = ''
      this.isEditing = props.ConfigData ? true : false
      this.formData = props.ConfigData || {
        encrypted: false
      }

      if (this.isEditing) {
        schema.required = ['file', 'relativeFilePath']
        this.formData.description = this.formData.description || ''
        this.formData.envIdVersionMap = this.formData.envIdVersionMap || {}
      } else {
        schema.required = ['file', 'relativeFilePath']
      }

      this.updateSchema(this.isEditing)
    }
  }

  updateSchema (isEdit) {
    let uiSchema = this.uiSchema
    const { enableOnlySecretKeys } = this.props

    if (isEdit) {
      delete schema.properties.encrypted
      delete schema.properties.targetToAllEnv
      delete schema.properties.envIdVersionMap
      schema.properties.setAsDefault = { type: 'boolean', title: 'Set As Default', default: true }
      schema.properties.notes = { type: 'string', title: 'Notes', default: '' }
      schema.properties.encrypted = { type: 'boolean', title: 'Encrypt File', default: false }
      this.formData.setAsDefault = true
      this.formData.notes = ''
      const encrypted = this.formData.encrypted

      if (isEdit && enableOnlySecretKeys) {
        uiSchema = Utils.disableNonSecretKeysOnSchema({ schema, uiSchema, secretKeys })
      } else if (encrypted) {
        this.formData.file = this.formData.encryptedFileId
        return this.modifyFileWidget({ formData: this.formData, schema, uiSchema })
      }
    } else {
      delete schema.properties.setAsDefault
      delete schema.properties.notes
      schema.properties.targetToAllEnv = { type: 'boolean', title: '  ', default: true }
      schema.properties.envIdVersionMap = { type: 'object', title: '  ', properties: {}, default: {} }
      schema.properties.encrypted = { type: 'boolean', title: 'Encrypt File', default: false }
      this.formData.targetToAllEnv = true
    }
    this.setState({ schema, uiSchema, _update: Date.now() })
  }

  onSubmit = ({ formData }) => {
    if (!formData.encrypted) {
      const el = ReactDOM.findDOMNode(this.refs.form)
      formData.configFile = el.querySelector('input[type="file"]').files[0]
    }
    this.submitForm(formData, this.isEditing)
  }

  onChange = ({ formData }) => {
    const prevData = FormUtils.clone(this.formData)

    if (!formData.relativeFilePath && formData.file && formData.file.length > 0 && !formData.encrypted) {
      const k = formData.file.split('\\')
      formData.relativeFilePath = k && k.length > 0 ? k[k.length - 1] : ''

      this.formData = formData
      this.setState({ key: Math.random() })
    } else if (formData.encrypted !== prevData.encrypted) {
      formData.file = ''
      this.modifyFileWidget({ formData })
    } else if (formData.file === 'New') {
      this.setState({ showEncryptModal: true })
    } else {
      this.formData = formData
    }

    this.setupMentions()
  }

  modifyFileWidget = async ({ formData, schema = this.state.schema, uiSchema = this.uiSchema }) => {
    const { encrypted } = formData

    if (encrypted) {
      return this.updateFileWithEnums({ formData, schema, uiSchema })
    } else {
      return this.updateFileWidget({ formData, schema, uiSchema })
    }
  }

  updateFileWithEnums = async ({ formData, schema = this.state.schema, uiSchema = this.uiSchema }) => {
    const resource = await this.fetchEncryptedFiles()
    const sortedContent = Utils.sortDataByKey(resource, 'name', 'ASC')
    schema.properties.file['enum'] = sortedContent.map(item => item.uuid).concat(['New'])
    schema.properties.file['enumNames'] = sortedContent.map(item => item.name).concat(['+ Add New Encrypt File'])
    uiSchema.file = { 'ui:placeholder': 'Select Encrypt file' }
    this.uiSchema = uiSchema
    this.formData = formData
    this.setState({ schema, key: Math.random() })
  }

  updateFileWidget = async ({ formData, schema = this.state.schema, uiSchema = this.uiSchema }) => {
    delete schema.properties.file.enum
    delete schema.properties.file.enumNames
    uiSchema.file = { 'ui:widget': FileWidget }
    this.uiSchema = uiSchema
    this.formData = formData
    this.setState({ schema, key: Math.random() })
  }

  fetchEncryptedFiles = async () => {
    const { accountId } = this.props.urlParams
    const { error, resource } = await EncryptService.listEncryptedVariables({
      accountId,
      type: Utils.encryptTypes.FILE
    })

    if (error) {
      return
    }
    this.encryptFiles = resource
    return resource
  }

  onShowTargetModal = () => {
    this.setState({ showManageVersions: true })
  }

  onUpdateEnvIdVersionMap = data => {
    this.formData = data
    this.formData.targetToAllEnv = false
    this.setState({ showManageVersions: false })
  }
  renderConfigFileStepText = () => {}

  submitForm = (data, isEditing) => {
    const handleResp = resp => {
      if (resp.ok) {
        this.props.onSubmit()
        // this.props.onTourStop()
      } else {
        resp.json().then(content => {
          if (Array.isArray(content.responseMessages)) {
            this.errText = content.responseMessages[0].message
            console.log(this.errText)
            this.setState({ __update: Date.now() })
          }
        })
      }
    }
    const formData = new FormData()
    formData.append('relativeFilePath', data.relativeFilePath)
    formData.append('encrypted', data.encrypted)
    if (data.description && data.description.length > 0) {
      formData.append('description', data.description)
    }
    if (data.configFile && !data.encrypted) {
      formData.append('file', data.configFile)
      formData.append('fileName', data.configFile.name)
    } else {
      const fileName = Utils.getEncryptFileName(this.encryptFiles, data.file)
      /* data.configFile = {
        encryptedFileId: data.file
      }*/

      formData.append('encryptedFileId', data.file)
      delete data.file
      formData.append('fileName', fileName)
    }

    if (isEditing) {
      formData.append('setAsDefault', data.setAsDefault)
      formData.append('notes', data.notes)
    } else {
      formData.append('targetToAllEnv', data.targetToAllEnv)
      if (!data.targetToAllEnv) {
        formData.append('envIdVersionMapString', JSON.stringify(data.envIdVersionMap))
      }
    }

    if (isEditing) {
      apis.service
        .fetch(apis.getConfigEndpoint(this.props.appIdFromUrl, this.props.idFromUrl, data.uuid), {
          method: 'PUT',
          body: formData
        })
        .then(handleResp)
    } else {
      apis.service
        .fetch(apis.getConfigEndpoint(this.props.appIdFromUrl, this.props.idFromUrl), {
          method: 'POST',
          body: formData
        })
        .then(handleResp)
    }
  }

  hideModal = () => {
    delete schema.properties.file.enum
    delete schema.properties.file.enumNames
    this.uiSchema.file = { 'ui:widget': FileWidget }
    this.setState({ schema: schema })
    this.props.onHide()
  }

  renderEncryptFileModal = () => {
    const { accountId } = this.props.urlParams

    if (this.state.showEncryptModal) {
      return (
        <EncryptFilesModal
          show={this.state.showEncryptModal}
          accountId={accountId}
          onHide={this.hideEncryptModal}
          onSubmit={this.onSubmitOfNewFile}
        />
      )
    } else {
      return null
    }
  }

  hideEncryptModal = () => {
    this.setState({ showEncryptModal: false })
  }

  onSubmitOfNewFile = async result => {
    const formData = FormUtils.clone(this.formData)
    formData.encryptedValue = result
    formData.file = result

    await this.updateFileWithEnums({ formData })
  }

  render () {
    return (
      <Modal show={this.props.show} onHide={this.hideModal} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span style={{ color: 'red' }}>{this.errText}</span>
          <WingsForm
            name="Configuration"
            ref="form"
            schema={this.state.schema}
            uiSchema={this.uiSchema}
            formData={this.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')}
            key={this.state.key}
          />
        </Modal.Body>

        {this.state.showManageVersions && (
          <ManageVersionsModal
            show={this.state.showManageVersions}
            data={this.formData}
            environments={this.props.environments}
            showVersion={false}
            modalTitle={'Configuration'}
            onSubmit={this.onUpdateEnvIdVersionMap}
            onHide={Utils.hideModal.bind(this, 'showManageVersions')}
          />
        )}
        {this.renderEncryptFileModal()}
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ConfigPage/ConfigModal.js