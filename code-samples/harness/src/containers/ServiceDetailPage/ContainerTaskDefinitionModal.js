import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { WingsModal, WingsForm, Utils } from 'components'
import WingsTagInput from '../../components/WingsTagsInput/WingsTagsInput'
import LogOptionsModal from './LogOptionsModal'
import AdvancedSettings from './AdvancedSettings'
import css from './ContainerTaskDefinitionModal.css'
import apis from 'apis/apis'

const MODE_DEFAULT = 'MODE_DEFAULT'
const MODE_ADVANCED = 'MODE_ADVANCED'

const schema = {}
const containerDefinitions = {
  classNames: '__container',
  items: {
    commands: {
      classNames: '__main-control',
      'ui:placeholder': 'command param1 param2 etc.',
      title: 'Container Command(s)'
    },
    cpu: { classNames: '__child-control __first-control', 'ui:placeholder': 'CPU (cores) Count' },
    memory: { classNames: '__child-control __memory-control', 'ui:placeholder': 'Memory (MB)', title: 'Memory' },
    portMappings: {
      classNames: '__array-list-control __port-mappings-array',
      items: {
        containerPort: {
          'ui:placeholder': 'Container Port',
          classNames: '__nested-child-control',
          title: 'Container Port'
        },
        hostPort: {
          'ui:placeholder': 'Host Port',
          classNames: '__nested-child-control __host-port-control',
          title: 'Host Port'
        }
      }
    },
    storageConfigurations: {
      classNames: '__array-list-control __storage-configs-array',
      items: {
        hostSourcePath: { 'ui:placeholder': 'Path', classNames: '__nested-child-control __host-port-control' },
        containerPath: { 'ui:placeholder': 'Path', classNames: '__nested-child-control _' }
      }
    },
    logConfiguration: {
      classNames: '__parent-control  __log-config',

      logDriver: { classNames: '__logdriver-control', 'ui:placeholder': 'Driver Name' },
      options: { classNames: '', 'ui:placeholder': 'Name' }
    }
  }
}

const uiSchema = {
  deploymentType: { 'ui:widget': 'hidden' },
  artifactName: { 'ui:widget': 'hidden' },
  advancedType: { 'ui:widget': 'hidden' },
  advancedConfig: { 'ui:widget': 'hidden' }
}
const defaultFormData = {
  uuid: '',
  deploymentType: '',
  containerDefinitions: [
    {
      commands: '',
      portMappings: [],
      storageConfigurations: [],
      logConfiguration: {
        options: [],
        logDriver: ''
      }
    }
  ]
}
const defaultLogData = { key: '', value: '' }
export default class ContainerTaskDefinitionModal extends React.Component {
  state = {
    key: Math.random() * 999999,
    mode: MODE_DEFAULT,
    formData: defaultFormData,
    schema: schema,
    showOverLay: false,
    uiSchema: uiSchema,
    activeKey: '1',
    expanded: { container1: true },
    showLogOptions: false,
    tags: [],
    tag: 1,
    overLayClass: '__hide',
    bottom: '',
    left: '',
    top: '',
    right: '',
    logOptionsData: defaultLogData,
    savedtagIndex: -1 // #FIXME: refactor for multiple containers, don't use 'container1'
  }
  componentDidMount () {
    // document.body.addEventListener('click', this.hideLogOptions)
  }

  hideLogOptions = () => {
    this.setState({ showOverLay: false, overLayClass: '__hide', logOptionsData: defaultLogData })
  }

  componentWillReceiveProps (newProps) {
    if (newProps.serviceContainerTaskStencils && newProps.serviceContainerTaskStencils.length > 0 && newProps.show) {
      // #FIXME: remove [0] index
      const tempSchema = newProps.serviceContainerTaskStencils[0].jsonSchema
      defaultFormData.deploymentType = newProps.deploymentType
      // #FIXME: remove hard coded 'ECS'
      const ecsData = newProps.serviceContainerTasks.find(
        t => t.deploymentType === newProps.deploymentType && t.containerDefinitions
      )
      if (ecsData && Array.isArray(ecsData.containerDefinitions[0].commands)) {
        ecsData.containerDefinitions[0].commands = ecsData.containerDefinitions[0].commands
          ? ecsData.containerDefinitions[0].commands.join(',')
          : ''
        if (ecsData.containerDefinitions[0].portMappings === null) {
          ecsData.containerDefinitions[0].portMappings = []
        }
        if (ecsData.containerDefinitions[0].storageConfigurations === null) {
          ecsData.containerDefinitions[0].storageConfigurations = []
        }
        if (ecsData.containerDefinitions[0].logConfiguration === null) {
          ecsData.containerDefinitions[0].logConfiguration = {
            options: [],
            logDriver: ''
          }
        }
      }
      if (defaultFormData.deploymentType === newProps.deploymentType) {
        this.customizeSchema(tempSchema, ecsData || defaultFormData, newProps.logDriverOptions)
      }
    }
    if (newProps.show) {
      this.updateUISchema(newProps)
      // this.multiCommandSelect(newProps)
    }
  }

  getLogDriverOptions (options) {
    return options.map(option => option.displayText)
  }

  getLogDriverOptionValues (options) {
    return options.map(option => option.value)
  }

  customizeSchema = (tempSchema, formData, logDriverOptions) => {
    const tempContainer = tempSchema.properties['containerDefinitions']
    if (tempContainer.items.properties.hasOwnProperty('commands')) {
      const logdrvNames = this.getLogDriverOptions(logDriverOptions)
      const logdriveValues = this.getLogDriverOptionValues(logDriverOptions)
      tempContainer.items.properties['commands'] = { type: 'string', title: 'Container Command' }
      tempContainer.items.properties['memory'].title = 'Memory'

      // tempContainer.items.properties.logConfiguration.properties.options = { type: 'string', title: 'Options(s)' }
      tempContainer.items.properties.storageConfigurations.items.properties.readonly = {
        type: 'boolean',
        title: 'Options',
        enum: [true, false],
        enumNames: ['Read-only', 'Read-Write']
      }
      tempContainer.items.properties.logConfiguration.title = ''
      tempContainer.items.properties.logConfiguration.properties.logDriver = {
        type: 'string',
        title: 'Log Driver',
        enum: logdriveValues,
        enumNames: logdrvNames
      }
      tempContainer.items.properties.logConfiguration.properties.options = {
        type: 'string',
        title: 'Options'
      }
      tempSchema.properties['advancedType'] = { type: 'string' }
      tempSchema.properties['advancedConfig'] = { type: 'string' }

      this.updateUISchema()
      uiSchema['containerDefinitions']['items']['ui:order'] = [
        'commands',
        'cpu',
        'memory',
        'logConfiguration',
        'portMappings',
        'storageConfigurations'
      ]
      uiSchema.containerDefinitions.items['commands'] = { 'ui:placeholder': 'command param1 param2 etc.' }

      //  const logDriverUiWidget = (formData.deploymentType === 'ECS') ? '' : 'hidden'

      if (formData.deploymentType === 'KUBERNETES') {
        uiSchema.containerDefinitions.items.logConfiguration.logDriver = {
          'ui:widget': 'hidden',
          classNames: '__logdriver-control'
        }
        uiSchema.containerDefinitions.items.logConfiguration.options = {
          classNames: '__hide'
        }
      } else {
        uiSchema.containerDefinitions.items.logConfiguration.logDriver = {
          classNames: '__logdriver-control'
        }
        uiSchema.containerDefinitions.items.logConfiguration.options = {
          'ui:placeholder': '',
          classNames: this.renderLogOptionCls(formData),
          'ui:widget': this.renderLogOptionsComponent
        }
      }
      uiSchema.containerDefinitions.items.storageConfigurations.items.readonly = {
        'ui:widget': 'radio',
        'ui:options': { inline: true },
        classNames: '__radio-control',
        title: 'options'
      }
      const mode = formData.advancedConfig ? MODE_ADVANCED : MODE_DEFAULT

      this.setState({ schema: tempSchema, uiSchema, key: Math.random() * 999999, formData: formData, mode })

      this.updateFormData(formData)
    }
  }

  renderLogOptionCls = formData => {
    if (!formData.containerDefinitions || !formData.containerDefinitions[0]) {
      return
    }

    if (formData.deploymentType === 'KUBERNETES') {
      return '__hide'
    }
    if (formData.containerDefinitions[0].logConfiguration !== null) {
      const logConfig = formData.containerDefinitions[0].logConfiguration
      const logOptions = logConfig.options
      if (logOptions === null && logConfig.logDriver === '') {
        return '__hide'
      } else if (logOptions !== null && logOptions.length <= 0) {
        return '__hide'
      } else {
        return '__options-control'
      }
    } else {
      return '__hide'
    }
  }

  onAddLogOptionClick = () => {
    const data = Utils.clone(this.state.formData)
    this.setState({
      showOverLay: true,
      showLogOptions: true,
      overLayClass: '__show',
      formData: data,
      style: this.getOverlayTarget(),
      logOptionsData: defaultLogData,
      savedtagIndex: -1
    })
  }

  renderLogOptionsComponent = props => {
    return (
      <WingsTagInput
        value={this.state.tags}
        addOption={this.onAddLogOptionClick}
        handleChange={this.modifyLogConfigOptions}
        stopPropogation={this.stopPropogation}
        onTagClick={this.onTagClick}
        hideLogOptions={this.hideLogOptions}
        editTag={this.updateTag}
        className={'form-control'}
      />
    )
  }

  onTagClick = event => {
    const currentTag = event.currentTarget.textContent
    const tagIdx = this.state.tags.findIndex(tag => tag === currentTag)
    const keyIdx = currentTag.indexOf(':')
    // const obj = { 'key': tag.substr(0, keyIdx), 'value': tag.substr(keyIdx + 1, tag.length ) }
    const data = {}
    data.key = currentTag.substr(0, keyIdx)
    data.value = currentTag.substr(keyIdx + 1, currentTag.length)
    this.setState({
      showOverLay: true,
      showLogOptions: true,
      overLayClass: '__show',
      style: this.getOverlayTarget(),
      logOptionsData: data,
      savedtagIndex: tagIdx
    })
  }

  updateFormData (formData) {
    const data = formData
    let tags = []
    for (const definitionId in data.containerDefinitions) {
      const logConfiguration = data.containerDefinitions[definitionId].logConfiguration
      if (logConfiguration !== null && logConfiguration !== undefined) {
        const logOptions = logConfiguration.options
        if (logOptions !== '' && logOptions !== undefined && logOptions !== null) {
          tags = this.reArangeOptions(logOptions)
        }
      }
    }
    this.setState({ tags })
    // this.setState({ formData: data })
  }

  reArangeOptions (options) {
    const result = []
    for (const option of options) {
      const str = option.key + ':' + option.value
      result.push(str)
    }
    return result
  }
  // updates ui schema with container defintions
  updateUISchema () {
    uiSchema.containerDefinitions = containerDefinitions
    uiSchema['ui:order'] = []
    const orderArray = uiSchema['ui:order']
    orderArray.push('artifactName')
    orderArray.push('deploymentType')
    orderArray.push('containerDefinitions')
    orderArray.push('advancedType')
    orderArray.push('advancedConfig')
  }

  onChange = ({ formData }) => {
    const data = Utils.clone(this.state.formData)
    const uiSchema = Utils.clone(this.state.uiSchema)
    formData.uuid = data.uuid

    const prevLogDriver = data.containerDefinitions[0].logConfiguration.logDriver
    const currentlogDriver = formData.containerDefinitions[0].logConfiguration.logDriver
    if (prevLogDriver !== currentlogDriver && currentlogDriver !== '' && currentlogDriver) {
      uiSchema.containerDefinitions.items.logConfiguration.options = {
        classNames: '__options-control',
        'ui:widget': this.renderLogOptionsComponent
      }
    } else if (currentlogDriver === '' || !currentlogDriver) {
      uiSchema.containerDefinitions.items.logConfiguration.options = { 'ui:widget': 'hidden' }
    } else if (currentlogDriver !== '' && currentlogDriver) {
      uiSchema.containerDefinitions.items.logConfiguration.options = {
        classNames: '__options-control',
        'ui:widget': this.renderLogOptionsComponent
      }
    }

    this.setState({ formData, uiSchema })
    if (formData.deploymentType === 'ECS') {
      this.updateFormData(this.state.formData)
    }
  }

  onSubmit = ({ formData }) => {
    this.submitData(formData)
  }

  modifyLogConfigOptions = tags => {
    const formData = Utils.clone(this.state.formData)
    if (!formData.containerDefinitions || !formData.containerDefinitions[0] || tags === undefined) {
      return
    }

    // right now it is only one definition --- should be modified later

    const logConfigOptions = []
    if (tags.length > 0) {
      for (const tag of tags) {
        const keyIdx = tag.indexOf(':')
        const obj = { key: tag.substr(0, keyIdx), value: tag.substr(keyIdx + 1, tag.length) }

        logConfigOptions.push(obj)
      }
      // should be modified later
      formData.containerDefinitions[0].logConfiguration.options = logConfigOptions
    } else {
      formData.containerDefinitions[0].logConfiguration.options = null
    }
    this.setState({ formData, tags })
  }

  stopPropogation (event) {
    // alert('in this')
    event.stopPropogation()
  }

  submitData = (formData, advanced = false, callback) => {
    const data = Utils.clone(formData)
    const taskId = data.hasOwnProperty('uuid') ? data.uuid : ''
    const appId = this.props.appIdFromUrl // Utils.appIdFromUrl()
    const serviceId = this.props.serviceId // Utils.getIdFromUrl()

    const commandsStr = data.containerDefinitions[0] ? data.containerDefinitions[0].commands || '' : ''
    data.containerDefinitions[0].commands = commandsStr.split(',')
    if (taskId !== '') {
      apis.service
        .replace(apis.updateContainerTasks(appId, serviceId, taskId, advanced), {
          body: JSON.stringify(data)
        })
        .then(response => {
          const updatedServiceContainerTasks = response.resource
          if (callback) {
            callback(updatedServiceContainerTasks)
          } else {
            this.props.onHide()
            this.props.onSubmit(updatedServiceContainerTasks)
          }
        })
        .catch(error => {
          this.props.setCurrentStepStatus('paused')
        })
    } else {
      delete data.uuid
      data.containerDefinitions[0].name = 'DEFAULT_NAME' // #FIXME: remove this.
      apis.service
        .create(apis.getServiceContainerEndpoint(appId, serviceId, 'tasks', advanced), {
          body: JSON.stringify(data)
        })
        .then(response => {
          const updatedServiceContainerTasks = response.resource
          if (callback) {
            callback(updatedServiceContainerTasks)
          } else {
            this.props.onHide()
            this.props.onSubmit(updatedServiceContainerTasks)
          }
        })
        .catch(error => {
          this.props.setCurrentStepStatus('paused')
        })
    }
  }

  handleSelect (activeKey) {
    if (activeKey === '1') {
      this.state.expanded.container1 = this.state.expanded.container1 === true ? false : true
      activeKey = this.state.expanded.container1 === true ? '1' : '0'
    }
    this.setState({ activeKey })
  }

  showAdvancedSettings = () => {
    this.submitData(this.state.formData, true, updatedData => {
      this.setState({ mode: MODE_ADVANCED, formData: updatedData })
    })
  }

  renderAdvancedSettingsBtn () {
    return (
      <span className={'wings-text-link ' + css.advancedLink} onClick={this.showAdvancedSettings}>
        Advanced Settings
      </span>
    )
  }

  onHide = () => {
    const data = Utils.clone(this.state.formData)
    if (data.logConfiguration !== null && data.logConfiguration !== undefined) {
      this.modifyLogConfigOptions(data)
    }
    this.setState({ showLogOptions: false, overLayClass: '__hide' })
    this.props.onHide()
  }

  getOverlayTarget = () => {
    const target = Utils.queryRef(this.refs.form, '.__options-control')
    const targetRect = target.getBoundingClientRect()
    this.setState({ bottom: targetRect.bottom, left: targetRect.left, top: targetRect.top, right: targetRect.right })
  }

  setTags = (tags, optionObj) => {
    const data = Utils.clone(this.state.formData)
    if (!data.containerDefinitions[0] || !data.containerDefinitions) {
      return
    } else {
      const logConfig = data.containerDefinitions[0].logConfiguration
      if (logConfig !== null) {
        const logOptions = logConfig.options
        if (logOptions !== null) {
          logOptions.push(optionObj)
          data.containerDefinitions[0].logConfiguration.options = logOptions
        } else {
          data.containerDefinitions[0].logConfiguration.options = this.setLogOptions(optionObj)
        }
      } else {
        data.containerDefinitions[0].logConfiguration = {}
        data.containerDefinitions[0].logConfiguration.options = this.setLogOptions(optionObj)
      }
    }
    this.setState({ tags, key: Math.random() * 999999, formData: data })
  }

  setLogOptions = optionObj => {
    const options = []
    options.push(optionObj)
    return options
  }

  updateTags = tags => {
    this.modifyLogConfigOptions(tags)
  }

  updateTag = (tagIndex, updatedTag) => {
    const tags = this.state.tags
    tags[tagIndex] = updatedTag
    this.modifyLogConfigOptions(tags)
  }

  renderLogOptionsModal () {
    return (
      <LogOptionsModal
        show={this.state.showLogOptions}
        tags={this.state.tags}
        setTags={this.setTags}
        hideLogOptions={this.hideLogOptions}
        logData={this.state.logOptionsData}
        savedtagIndex={this.state.savedtagIndex}
        editTag={this.updateTag}
      />
    )
  }

  onOverLayHide = () => {
    !this.isClicked && this.setState({ showOverLay: false, showLogOptions: false })
  }

  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.deploymentType} - Container Definition</Modal.Title>
        </Modal.Header>

        <div key={this.state.key}>
          {this.state.mode !== MODE_ADVANCED ? (
            <div className={css.form}>
              <div className={'__image-name'}>
                Image Name:{' '}
                {this.state.schema.properties ? (
                  this.state.schema.properties.artifactName.enumNames[0] || 'none selected'
                ) : (
                  ''
                )}
              </div>
              <WingsForm
                name="Settings"
                ref="form"
                schema={this.state.schema}
                key={this.state.key}
                uiSchema={this.state.uiSchema}
                onSubmit={this.onSubmit}
                onChange={this.onChange}
                formData={this.state.formData}
                showErrorList={false}
                noValidate={true}
              >
                <Button bsStyle="default" type="submit" className="submit-button">
                  SUBMIT
                </Button>
              </WingsForm>

              {this.renderAdvancedSettingsBtn()}
            </div>
          ) : (
            <div>
              <AdvancedSettings
                {...this.props}
                containerTaskData={this.state.formData}
                onHide={this.props.onHide}
                onReset={this.props.onReset}
              />
            </div>
          )}
        </div>
        <div
          className={this.state.overLayClass}
          style={{ position: 'absolute', top: this.state.top + 50 + 'px', left: '100' + 'px' }}
        >
          <div className="__arrow_box"> </div>
          {this.state.overLayClass !== '__hide ' && this.renderLogOptionsModal()}
        </div>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceDetailPage/ContainerTaskDefinitionModal.js