import React from 'react'
import ReactDOM from 'react-dom'
import { Modal } from 'react-bootstrap'
import { WingsForm, MultiSelect, CompUtils, Utils } from 'components'
import InstanceSelectModal from '../ServiceInstancePage/InstanceSelectModal'
// import Form from 'react-jsonschema-form'
import apis from 'apis/apis'
import css from './SimpleExecModal.css'

const schema = {
  type: 'object',
  required: ['serviceInstanceSelect', 'commandName'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },
    environment: { type: 'string', title: 'Environment', enum: [], enumNames: [] },
    service: { type: 'string', title: 'Service', enum: [], enumNames: [] },
    commandName: { type: 'string', title: 'Command', enum: [], enumNames: [] },
    executionStrategyRadios: {
      type: 'object',
      title: '',
      required: ['executionStrategyValue'],
      properties: {
        executionStrategyValue: {
          type: 'string',
          title: 'Execution Strategy',
          default: 'SERIAL',
          enum: ['SERIAL', 'PARALLEL'],
          enumNames: ['Serial', 'Parallel']
        }
      }
    },
    artifactSelect: {
      type: 'string',
      title: 'Artifacts',
      data: { enum: [], enumNames: [] }
    },
    serviceInstanceSelect: {
      type: 'string',
      title: 'Select Service Instance(s)',
      data: { enum: [], enumNames: [] }
    },
    executionCredential: {
      type: 'object',
      title: 'Host\'s Credentials',
      properties: {
        sshUser: { type: 'string', title: 'SSH User', default: '', description: '' },
        sshPassword: { type: 'string', title: 'SSH Password', default: '', description: '' }
      }
    }
  }
}

const ServiceInstanceSelect = props => {
  const multiSelectData = Utils.enumArrToSelectArr(props.schema.data.enum, props.schema.data.enumNames)
  return <MultiSelect description="Service Instance(s)" data={multiSelectData} {...props} />
}

export default class SimpleExecModal extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    ...Utils.getDefaultContextTypes()
  }
  ArtifactSelect = props => {
    const optionRenderer = option => {
      return (
        <span data-value={option.value}>
          <span className="bold">{option.serviceNames.join(', ')}</span>: {option.label}
        </span>
      )
    }
    // const multiSelectData = Utils.enumArrToSelectArr(props.schema.data.enum, props.schema.data.enumNames)
    const options = []
    const selectedApp = Utils.findApp(this)
    for (const artifact of this.artifacts) {
      const serviceNames = []
      try {
        if (selectedApp && Array.isArray(selectedApp.services)) {
          for (const serviceId of artifact.serviceIds) {
            const service = selectedApp.services.find(s => s.uuid === serviceId)(
              service ? serviceNames.push(service.name) : ''
            )
          }
        }
      } catch (e) {}
      options.push({
        label: artifact.displayName,
        value: artifact.uuid,
        serviceNames: serviceNames,
        serviceIds: artifact.serviceIds
      })
    }
    return (
      <MultiSelect
        description="Select Artifact(s)"
        value={props.value}
        data={options}
        required={props.required}
        optionRenderer={optionRenderer}
        disabled={props.disabled}
        onChange={val => {
          val = val || ''
          CompUtils.removeSameBuildSourceArtifacts(this.artifacts, val)
          props.onChange(val)
          setTimeout(() => CompUtils.toggleArtifactDropdownItems(this.refs.form, this.artifacts), 0)
        }}
      />
    )
  }
  uiSchema = {
    uuid: { 'ui:widget': 'hidden' },
    commandName: { classNames: '__command' },
    executionStrategyRadios: { executionStrategyValue: { 'ui:widget': 'radio' }, classNames: '__strategy' },
    // release: { classNames: '__release' },
    executionCredential: {
      sshUser: { classNames: '__sshUser' },
      sshPassword: { 'ui:widget': 'password', classNames: '__sshPassword' },
      appAccount: { classNames: '__appAccount' },
      appAccountPassword: { 'ui:widget': 'password', className: '__appAccountPassword' },
      classNames: '__executionCredential __hidden'
    },
    artifactSelect: { 'ui:widget': this.ArtifactSelect, classNames: '__artifactSelect', 'ui:disabled': true },
    serviceInstanceSelect: { 'ui:widget': ServiceInstanceSelect, classNames: '__serviceInstanceSelect' }
  }
  state = {
    key: '',
    formSchema: schema,
    uiSchema: this.uiSchema,
    formData: {},
    modalData: { instances: [] }
  }
  initialModalLoading = true
  skipOnchange = true
  expanded = false
  artifacts = []
  selectedServiceData = null

  componentWillMount () {
    Utils.loadChildContextToState(this, 'app')
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  componentWillReceiveProps (newProps) {
    this.onReceivingProps(newProps)
  }

  getSelectedEnv = envId => {
    const selectedApp = Utils.findApp(this)
    let selectedEnv = null
    if (selectedApp) {
      if (typeof envId === 'string') {
        selectedEnv = selectedApp.environments.find(env => env.uuid === envId)
      } else {
        selectedEnv = selectedApp.environments[0]
      }
    }
    return selectedEnv
  }

  onReceivingProps = newProps => {
    const formUiSchema = Utils.clone(this.uiSchema)
    formUiSchema.artifactSelect['ui:widget'] = this.ArtifactSelect
    formUiSchema.serviceInstanceSelect['ui:widget'] = ServiceInstanceSelect

    this.setState({
      formSchema: Utils.clone(schema),
      uiSchema: formUiSchema
    })

    if (newProps.data && newProps.data.refreshSimpleExecModal) {
      newProps.data.refreshSimpleExecModal = false
      // const defaultEnv = this.getSelectedEnv()
      // default to first Service or props.data.service
      const defaultServiceId = newProps.data.service || newProps.services[0].uuid
      const formData = {
        ...newProps.data,
        service: defaultServiceId,
        environment: Utils.envIdFromUrl()
      }
      this.onChange({ formData })
    } else {
      this.updateSchema(newProps)
    }
    this.setState({
      formData: {
        uuid: Utils.getJsonValue(newProps, 'data.uuid') || '',
        ...newProps.data
      }
    })
  }

  updateSchema = (params, formData) => {
    const formSchema = this.state.formSchema
    const formUiSchema = this.state.uiSchema

    const selectedApp = Utils.findApp(this)
    const selectedEnv = this.getSelectedEnv(Utils.envIdFromUrl())
    if (selectedEnv) {
      formSchema.properties.environment.enum = selectedApp.environments.map(item => item.uuid)
      formSchema.properties.environment.enumNames = selectedApp.environments.map(item => item.name)
    } else if (selectedApp && selectedApp.environments && selectedApp.environments.length > 0) {
      formSchema.properties.environment.enum = selectedApp.environments.map(item => item.uuid)
      formSchema.properties.environment.enumNames = selectedApp.environments.map(item => item.name)
      formSchema.properties.environment.default = selectedApp.environments[0].uuid
    }

    let commands = params.commands
    if (params.services && params.services.length > 0) {
      formSchema.properties.service.enum = params.services.map(item => item.uuid)
      formSchema.properties.service.enumNames = params.services.map(item => item.name)
      const firstService = params.services[0]
      commands = firstService.serviceCommands
    }

    if (commands) {
      formSchema.properties.commandName.enum = ['', ...commands.map(item => item.name)]
      formSchema.properties.commandName.enumNames = ['', ...commands.map(item => item.name)]
    }

    if (params.commandData) {
      // base on command's 'artifactNeeded' flag, enable/disable Artifact dropdown
      formUiSchema.artifactSelect['ui:disabled'] = !params.commandData.command.artifactNeeded
      Utils.setFormRequired(formSchema, 'artifactSelect', params.commandData.command.artifactNeeded)
    }

    if (params.artifacts) {
      formSchema.properties.artifactSelect.data.enum = params.artifacts.map(item => item.uuid)
      formSchema.properties.artifactSelect.data.enumNames = params.artifacts.map(item => item.displayName)
    }
    if (params.serviceInstances) {
      formSchema.properties.serviceInstanceSelect.data.enum = params.serviceInstances.map(item => item.uuid)
      formSchema.properties.serviceInstanceSelect.data.enumNames = params.serviceInstances.map(item => item.displayName)
    }

    formUiSchema['executionCredential'].classNames = '__executionCredential __hidden'
    Utils.setFormRequired(formSchema, 'executionCredential', false)

    const entityTypes = params.requiredEntityTypes
    if (entityTypes && Array.isArray(entityTypes)) {
      if (entityTypes.indexOf('SSH_USER') >= 0) {
        formUiSchema['executionCredential'].classNames = '__executionCredential'
        Utils.setFormRequired(formSchema, 'executionCredential', true)
      }
    }

    this.setState({ formSchema, uiSchema: formUiSchema, data: params.data, key: Math.random() })
    this.setState({ formData })

    setTimeout(() => {
      const selectEl = Utils.queryRef(this.refs.form, '.__artifactSelect', '.Select')
      if (selectEl) {
        selectEl.onclick = () => CompUtils.toggleArtifactDropdownItems(this.refs.form, this.artifacts)
      }

      const labelEl = Utils.queryRef(this.refs.form, '.__serviceInstanceSelect', 'label')
      if (labelEl) {
        ReactDOM.render(
          <span>
            <a onClick={this.showInstanceSelectModal}>Select Service Instance(s)*</a>
          </span>,
          labelEl
        )
      }

      // const credentialEl = Utils.queryRef(this.refs.form, '.__executionCredential')
      // if (credentialEl) {
      //   const legendEl = credentialEl.querySelector('legend')
      //   legendEl.innerHTML = '<i class="icons8-forward"></i> Credentials'
      //   legendEl.onclick = () => {
      //     this.expanded = !this.expanded
      //     const divEls = credentialEl.querySelectorAll('.field')
      //     for (const el of divEls) {
      //       el.style.display = (this.expanded ? 'block' : 'none')
      //       legendEl.innerHTML = (this.expanded ? '<i class="icons8-expand-arrow"></i> Credentials'
      //         : '<i class="icons8-forward"></i> Credentials')
      //     }
      //   }
      // }
    }, 50)
  }

  onSubmit = ({ formData }) => {
    const isEditing = this.props.data ? true : false
    formData.executionStrategy = formData.executionStrategyRadios.executionStrategyValue
    formData.artifacts = []
    if (formData.artifactSelect) {
      formData.artifacts = Utils.mapToUuidArray(formData.artifactSelect.split(','))
    }
    formData.serviceInstances = []
    if (formData.serviceInstanceSelect) {
      formData.serviceInstances = Utils.mapToUuidArray(formData.serviceInstanceSelect.split(','))
    }
    // TODO: get from 'is required' endpoint
    formData.executionCredential.executionType = 'SSH'
    this.props.onSubmit(formData, isEditing)
  }

  onChange = ({ formData }) => {
    const prevEnv = Utils.getJsonValue(this, 'state.formData.environment') || ''
    const prevService = Utils.getJsonValue(this, 'state.formData.service') || ''

    const envId = formData.environment || Utils.envIdFromUrl()
    if (envId !== prevEnv || formData.service !== prevService) {
      this.props
        .fetchArtifacts(Utils.appIdFromUrl(), envId, this.getSelectedEnv(envId), formData.service)
        .then(data => {
          this.artifacts = data.resource.response || []
          this.props.fetchInstances(Utils.appIdFromUrl(), envId, formData.service).then(data => {
            if (!this.initialModalLoading) {
              formData.serviceInstanceSelect = null // reset serviceInstanceSelect
            }
            const serviceInstances = data.resource.response || []
            this.setState({ modalData: { serviceInstances } })

            const serviceData = this.props.services.find(s => s.uuid === formData.service)
            if (serviceData && serviceData.serviceCommands) {
              this.updateSchema(
                {
                  artifacts: this.artifacts,
                  serviceInstances,
                  commands: serviceData.serviceCommands
                },
                formData
              )
              this.initialModalLoading = false
            }
          })
        })
    }

    if (formData.service !== prevService) {
      this.props.fetchService(Utils.appIdFromUrl(), formData.service).then(data => {
        this.selectedServiceData = data.resource
        this.updateSchema({ commands: data.resource.serviceCommands }, formData)
      })
    }

    let isCommandChanged = false
    const prevCommand = Utils.getJsonValue(this, 'state.formData.commandName') || ''
    if (formData.commandName !== prevCommand) {
      this.enableArtifact(formData)
      isCommandChanged = true
    }

    const prevInstances = Utils.getJsonValue(this, 'state.formData.serviceInstanceSelect') || ''
    const currentInstances = formData.serviceInstanceSelect || ''
    if (currentInstances !== prevInstances || isCommandChanged) {
      if (currentInstances.length > 0) {
        this.checkRequiredArgs(formData)
          .then(res => {
            this.updateSchema({ requiredEntityTypes: res.resource.entityTypes }, formData)
          })
          .catch(error => {
            throw error
          })
      } else {
        this.updateSchema({}, formData)
      }
    }

    this.setState({ formData })
  }

  checkRequiredArgs = formData => {
    const instancesArr = Utils.mapToUuidArray(formData.serviceInstanceSelect.split(','))
    const envId = formData.environment || Utils.envIdFromUrl()

    return apis.service.fetch(`executions/required-args?appId=${Utils.appIdFromUrl()}&envId=${envId}`, {
      method: 'POST',
      body: {
        workflowType: 'SIMPLE',
        serviceId: formData.service,
        serviceInstances: instancesArr,
        commandName: formData.commandName,
        executionStrategy: formData.executionStrategy
      }
    })
  }

  enableArtifact = formData => {
    if (this.selectedServiceData && this.selectedServiceData.serviceCommands) {
      const commandData = this.selectedServiceData.serviceCommands.find(c => c.name === formData.commandName)
      this.updateSchema({ commandData }, formData)
    }
  }

  showInstanceSelectModal = () => {
    this.setState({ showModal: true })
  }

  onInstanceSelectSubmit = selectedItems => {
    const formData = this.state.formData || {}
    const idArr = selectedItems.map(item => item['uuid'])
    formData.serviceInstanceSelect = idArr.join(',')
    this.setState({ formData })
    Utils.hideModal.bind(this)()

    this.checkRequiredArgs(formData)
      .then(res => {
        this.updateSchema({ requiredEntityTypes: res.resource.entityTypes }, formData)
      })
      .catch(error => {
        throw error
      })
  }

  validate = (formData, errors) => {
    const requiredArr = this.state.formSchema.required
    if (
      requiredArr.indexOf('artifactSelect') >= 0 &&
      (!formData.artifactSelect || formData.artifactSelect.length <= 0)
    ) {
      errors.artifactSelect.addError('Please select one or more Artifacts')
    }
    if (!formData.serviceInstanceSelect || formData.serviceInstanceSelect.length <= 0) {
      errors.serviceInstanceSelect.addError('Please select one or more Service Instances')
    }
    if (
      requiredArr.indexOf('executionCredential') >= 0 &&
      (formData.executionCredential.sshUser.length <= 0 || formData.executionCredential.sshPassword.length <= 0)
    ) {
      errors.executionCredential.sshUser.addError('Please enter username')
      errors.executionCredential.sshPassword.addError('Please enter password')
    }
    return errors
  }

  onError = errors => {
    const formGroupEl = Utils.queryRef(this.refs.form, '.form-group')
    formGroupEl.className = formGroupEl.className.replace(/has\-error/g, '')
  }

  onHide = () => {
    this.initialModalLoading = true // reset
    this.props.onHide()
  }

  render () {
    return (
      <Modal className={css.main} show={this.props.show} onHide={this.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Execute Command</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <WingsForm
            name="Execute Command"
            key={this.state.key}
            ref="form"
            schema={this.state.formSchema}
            uiSchema={this.state.uiSchema}
            formData={this.state.formData}
            onChange={this.onChange.bind(this)}
            onSubmit={this.onSubmit}
            validate={this.validate}
            onError={this.onError}
          />
        </Modal.Body>

        <InstanceSelectModal
          data={this.state.modalData}
          show={this.state.showModal}
          onHide={Utils.hideModal.bind(this)}
          onSubmit={this.onInstanceSelectSubmit}
        />
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/DeploymentPage/SimpleExecModal.js