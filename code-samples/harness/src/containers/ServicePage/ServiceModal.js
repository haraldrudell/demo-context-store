import React from 'react'
import { observer } from 'mobx-react'
import { Modal } from 'react-bootstrap'
import { WingsForm, FormFieldTemplate, Utils, AppStorage, SearchableSelect, WingsModal } from 'components'
import AppContainerModal from '../AppContainerPage/AppContainerModal'
import css from './ServiceModal.css'

import { ServicesService } from 'services'
// import Form from 'react-jsonschema-form'

let appStackHelp = 'Choose an Application Stack (e.g. Tomcat/JBoss) you uploaded in Setup -> Catalogs'
appStackHelp +=
  ' Harness will add steps to configure this application stack for you as part of the deployment of the service'

const widgets = {
  SearchableSelect
}
const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },
    name: { type: 'string', title: 'Name' },
    artifactType: { type: 'string', title: 'Artifact Type', default: 'DOCKER', enum: [] },
    description: { type: 'string', title: 'Description', default: '' }
  }
}

const uiSchema = {
  uuid: { 'ui:widget': 'hidden' },
  name: { 'ui:placeholder': 'Service Name', 'ui:help': 'Please enter a Service Name. Service name should be unique.' },
  artifactType: {
    'ui:help': 'Artifact Type is usually the file extension of the artifact.',
    'ui:widget': 'SearchableSelect',
    'ui:placeholder': 'Select Artifact Type'
  },
  appContainerUuid: {
    'ui:widget': 'hidden',
    'ui:help': `${appStackHelp}`
  },
  description: { 'ui:placeholder': 'Description' }
}
const log = type => {} // console.log.bind(console, type)

@observer
class ServiceModal extends React.Component {
  static contextTypes = {
    catalogs: React.PropTypes.object
  }
  state = {
    key: Math.random() * 999999,
    schema: Utils.clone(schema),
    formData: {},
    showModal: false,
    initialized: false,
    widgets
  }
  acctId = AppStorage.get('acctId')

  componentDidMount () {
    if (this.props.dataStore) {
      this.props.dataStore.fetchAppContainers(this.acctId)
    }
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show && !this.state.initialized) {
      this.addAppContainers(newProps)
      this.setState({ formData: newProps.data, initialized: true })
    }
  }
  addAppContainers (props = this.props) {
    if (props.appContainers) {
      const appContainerArr = props.appContainers || []
      const idArr = appContainerArr.map(o => o['uuid'])
      const nameArr = appContainerArr.map(o => o['name'])
      idArr.unshift('')
      nameArr.unshift('Select Application Stack (optional)')
      idArr.push('__NEW__')
      nameArr.push('+ New Application Stack')

      schema.properties.appContainerUuid = {
        type: 'string',
        title: 'Application Stack',
        enum: idArr,
        enumNames: nameArr
      }
    }
    if (this.context.catalogs) {
      schema.properties.artifactType.enum = this.context.catalogs.ARTIFACT_TYPE.map(item => item.value)
      schema.properties.artifactType.enumNames = this.context.catalogs.ARTIFACT_TYPE.map(item => item.name)
    }
    if (props.data !== null) {
      uiSchema.artifactType = { 'ui:disabled': true }
      if (
        props.data.artifactType === 'DOCKER' ||
        props.data.artifactType === 'RPM' ||
        props.data.artifactType === 'AWS_CODEDEPLOY' ||
        props.data.artifactType === 'AWS_LAMBDA'
      ) {
        uiSchema.appContainerUuid = { 'ui:widget': 'hidden' }
      } else {
        uiSchema.appContainerUuid = { 'ui:disabled': true, 'ui:help': `${appStackHelp}` }
      }
    } else {
      uiSchema.artifactType = {
        'ui:disabled': false,
        'ui:widget': 'SearchableSelect',
        'ui:placeholder': 'Select Artifact Type'
      }
      uiSchema.appContainerUuid = { 'ui:widget': 'hidden' }
    }

    this.setState({ schema: Utils.clone(schema), uiSchema, key: Math.random() * 999999 })
  }

  onSubmit = async ({ formData }) => {
    const isEditing = this.props.data ? true : false
    this.setState({ formSubmitted: true })

    if (!isEditing) {
      await this.createNewService(formData)
    } else {
      await this.editService(formData)
    }
  }

  createNewService = async data => {
    const { appId } = this.props
    delete data['uuid']
    const body = Utils.getJsonFields(data, 'name, description, artifactType')
    if (data.appContainerUuid) {
      body.appContainer = {
        uuid: data.appContainerUuid
      }
    }

    const { resource, error } = await ServicesService.createService({ appId, body })
    if (error) {
      return
    }
    this.props.onSubmit(resource, false)
    this.setState({ formSubmitted: false })
  }

  editService = async data => {
    const body = {
      appContainer: {
        uuid: data.appContainerUuid
      },
      ...Utils.getJsonFields(data, 'name, description, artifactType')
    }
    const serviceId = data.uuid
    const { appId } = this.props
    const { resource, error } = await ServicesService.editService({ serviceId, appId, body })

    if (error) {
      return
    }
    this.props.onSubmit(resource, true)
    this.setState({ formSubmitted: false })
  }

  renderButton () {
    if (this.state.formSubmitted) {
      return (
        <div className={css.buttonBar}>
          <button type="submit" disabled className="btn btn-info disabled">
            SUBMITTING...
          </button>
          <span className="wings-spinner" />
        </div>
      )
    }
    return (
      <div className={css.main + ' ' + 'buttonBar'}>
        <button type="submit" className="btn btn-info">
          Submit
        </button>
      </div>
    )
  }

  setAppStackOnSchema (ev) {
    const schema = Utils.clone(this.state.schema)
    const appContainerArr = this.props.appContainers || []
    const idArr = appContainerArr.map(o => o['uuid'])
    const nameArr = appContainerArr.map(o => o['name'])
    idArr.unshift('')
    nameArr.unshift('Select Application Stack (optional)')
    idArr.push('__NEW__')
    nameArr.push('+ New Application Stack')

    schema.properties.appContainerUuid = {
      type: 'string',
      title: 'Application Stack',
      enum: idArr,
      enumNames: nameArr
    }
    this.setState({ schema, formData: ev.formData })
  }
  onChange = ev => {
    const artifactType = ev.formData.artifactType
    const __schema = this.state.schema
    const uiSchema = Utils.clone(this.state.uiSchema)

    const prevFormData = Utils.clone(this.state.formData)

    if (
      artifactType === 'DOCKER' ||
      artifactType === 'RPM' ||
      artifactType === 'AWS_CODEDEPLOY' ||
      artifactType === 'AWS_LAMBDA'
    ) {
      delete __schema.properties.appContainerUuid
      uiSchema.appContainerUuid = { 'ui:widget': 'hidden' }
      this.setState({ schema: __schema, formData: ev.formData })
    } else if (!__schema.properties.appContainerUuid) {
      this.setState({ schema: Utils.clone(schema), formData: ev.formData })
      uiSchema.appContainerUuid = { 'ui:help': `${appStackHelp}` }
    } else if (!prevFormData || prevFormData.artifactType !== artifactType) {
      this.setAppStackOnSchema(ev)

      if (this.props.data === null) {
        uiSchema.appContainerUuid = { 'ui:help': `${appStackHelp}` }
      }

      ev.formData.appContainerUuid = ''
    }
    this.setState({ uiSchema, formData: ev.formData })
    const appContainerUuid = ev.formData.appContainerUuid
    if (appContainerUuid && appContainerUuid === '__NEW__') {
      this.setState({ showModal: true })
    }
  }

  onAppContainerModalSubmit = newAppContainer => {
    const formData = Utils.clone(this.state.formData)
    if (newAppContainer) {
      formData.appContainerUuid = newAppContainer.uuid
      this.props.dataStore.appContainers.push(newAppContainer)
      this.addAppContainers()
      const schema = Utils.clone(this.state.schema)
      const uiSchema = Utils.clone(this.state.uiSchema)
      uiSchema.appContainerUuid = { 'ui:help': `${appStackHelp}` }
      this.setState({ showModal: false, formData, schema, uiSchema })
    }
  }

  hideModal = () => {
    this.setState({ initialized: false, schema: schema, uiSchema: uiSchema, formSubmitted: false })
    this.props.onHide()
  }

  render () {
    // transform data
    if (this.props.data && this.props.data.appContainer) {
      this.props.data.appContainerUuid = this.props.data.appContainer.uuid
    }

    return (
      <WingsModal key={this.state.key} show={this.props.show} onHide={this.hideModal} className="__serviceModal">
        <Modal.Header closeButton>
          <Modal.Title>Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Service"
            schema={this.state.schema}
            uiSchema={this.state.uiSchema}
            FieldTemplate={FormFieldTemplate}
            formData={this.state.formData}
            onChange={this.onChange}
            onSubmit={this.onSubmit}
            onError={log('errors')}
            widgets={this.state.widgets}
            submitting={this.state.submitting}
          >
            {this.renderButton()}
          </WingsForm>
        </Modal.Body>

        <AppContainerModal
          data={this.state.modalData}
          dataStore={this.props.dataStore}
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          onSubmit={this.onAppContainerModalSubmit}
        />
      </WingsModal>
    )
  }
}

export default ServiceModal



// WEBPACK FOOTER //
// ../src/containers/ServicePage/ServiceModal.js