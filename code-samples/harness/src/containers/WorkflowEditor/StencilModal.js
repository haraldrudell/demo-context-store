import React from 'react'
import { Modal } from 'react-bootstrap'
import { observer } from 'mobx-react'
import {
  InlineEditableText,
  WingsForm,
  AutoComplete,
  Utils,
  WingsModal,
  CustomFieldTemplate,
  Confirm
} from 'components'
import { Logger } from 'utils'
import ServicesCommands from './ServicesCommands'
import CloudWatchModal from './custom/CloudWatchModal'
import NodeSelectModal from './custom/NodeSelectModal'
import KubernetesRepCtrlSetup from './custom/KubernetesRepCtrlSetup'
import ECSLoadBalancerModal from './custom/ECSLoadBalancerModal'
import AppDynamicsVerificationModal from './custom/AppDynamicsVerificationModal'
import AWSLambdaVerificationModal from './custom/AWSLambdaVerificationModal'
import JenkinsVerificationModal from './custom/JenkinsVerificationModal'
import NewRelicVerificationModal from './custom/NewRelicVerificationModal'
import AwsCodeDeployStepModal from './custom/AwsCodeDeployStepModal'
import AwsLambdaStepModal from './custom/AWSLambdaStepModal'
import BambooVerificationModal from './custom/BambooVerificationModal'
import ElkVerificationModal from './custom/ElkVerificationModal'
import AcctConnectorModal from '../AcctConnectorPage/AcctConnectorModal'
import apis from 'apis/apis'
import css from './StencilModal.css'
import { MentionsType } from '../../utils/Constants'
import { MentionUtils } from 'utils'

/*
  this enum is used to control on which steps
  you want to show the templatize options
 */
const templatizeModals = {
  HTTP: false,
  EMAIL: false,
  JENKINS: false,
  BAMBOO: false,
  ELK: false,
  APP_DYNAMICS: false,
  SPLUNK: false,
  ELASTIC_LOAD_BALANCER: false,
  ECS_SERVICE_SETUP: false
}
const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    uuid: { type: 'string', title: 'uuid', default: '' },
    name: { type: 'string', title: 'Name', default: 'Application Name' },
    description: { type: 'string', title: 'Description', default: 'Description' }
  }
}

const uiSchema = {
  stateType: { 'ui:widget': 'hidden' }
}
const log = type => {} // console.log.bind(console, type)

/* --- AutoComplete for Repeat Element Expression --- */
const autoCompleteData = [
  {
    name: '${hosts}',
    value: '${hosts}'
  },
  {
    name: '${instances}',
    value: '${instances}'
  },
  {
    name: '${services}',
    value: '${services}'
  }
]
function getSuggestions (value) {
  const inputValue = value ? value.trim().toLowerCase() : ''
  const inputLength = inputValue.length
  return inputLength === 0
    ? autoCompleteData
    : autoCompleteData.filter(lang => lang.name.toLowerCase().indexOf(inputValue) >= 0)
}
class repeatElementExpressionAutoComplete extends React.Component {
  onChange = (event, { newValue }) => {
    this.props.onChange(newValue)
  }
  render () {
    return <AutoComplete value={this.props.value} getSuggestions={getSuggestions} onChange={this.onChange} />
  }
}

@observer
class StencilModal extends React.Component {
  state = {
    title: '',
    schema,
    uiSchema,
    moreDetailsData: null, // params for additional rendering (depend on the selected Stencil)
    acctConnectorModalShow: false,
    submitting: false,
    dialogCls: css.main,
    hideConfirmShow: false
  }
  stencilData = null
  pluginSchemas = null
  plugins = null
  computeProviderId = null
  newName = ''
  isEdit = false
  hideMode = false
  initialized = false
  originalFormData = null

  getCustomPropsOrderJsonSchema = (stencilData, customObj) => {
    for (const propPath in customObj) {
      const orderArr = customObj[propPath]
      const obj = Utils.getJsonValue(stencilData, 'jsonSchema.' + propPath)
      const newObj = {}
      // follow the orderArr to recreate obj with the new order of properties
      for (const key of orderArr) {
        newObj[key] = obj[key]
      }
      // update the stencilData with newObj
      Utils.setJsonValue(stencilData.jsonSchema, propPath, newObj)
    }
    return stencilData
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show) {
      this.initialized = true
      this.init(newProps)
    }
  }

  init = newProps => {
    // this.computeProviderId = newProps.computeProvider.uuid
    if (!newProps.data) {
      return
    }

    const nodeData = newProps.data.nodeData

    if (nodeData) {
      let stencilData = newProps.data.stencilData

      if (!stencilData) {
        stencilData = newProps.stencils.find(s => s.type === nodeData.type)
      }

      // customize jsonSchema
      if (stencilData && JSON.stringify(stencilData).indexOf('custom:') >= 0) {
        const uiSchema = stencilData.uiSchemaFo
        for (const key in uiSchema) {
          if (key === 'custom:propsOrder:jsonSchema') {
            stencilData = this.getCustomPropsOrderJsonSchema(stencilData, uiSchema[key])
            break
          }
        }
      }

      // disable commandName field
      if (stencilData && stencilData.jsonSchema && stencilData.jsonSchema.properties.commandName) {
        uiSchema.commandName = { 'ui:disabled': true }
      }

      stencilData = this.customizeStencilData(stencilData)
      this.stencilData = stencilData

      // const title = (stencilData.name === nodeData.name ? stencilData.name
      // : stencilData.name + (nodeData.name ? ' - ' + nodeData.name : ''))
      const title = nodeData.name || stencilData.name

      this.setState({ title, schema: stencilData.jsonSchema })

      // merge with uiSchema from backend
      let newUiSchema = uiSchema

      if (stencilData.uiSchema && JSON.stringify(stencilData.uiSchema) !== '{}') {
        newUiSchema = {
          ...uiSchema,
          ...stencilData.uiSchema
        }
      }

      if (Utils.getJsonValue(stencilData, 'jsonSchema.properties.repeatElementExpression')) {
        newUiSchema['repeatElementExpression'] = { 'ui:widget': repeatElementExpressionAutoComplete }
      }
      this.isEdit = this.isEditMode(newProps.data)
      /*
      hiding this for now=> as we are not templatizing wprkflow steps yet

      Calling common methods to set the templatize options on step modal
      if (this.isEdit && this.props.templateWorkflow) {
        FormUtils.setDefaultTemplateFieldValue(stencilData.jsonSchema, nodeData.name)
        FormUtils.addTemplateFieldsToSchema(stencilData.jsonSchema, newProps.data)
      }*/
      const propsData = newProps.data
      if (newProps.atRunTime) {
        const properties = propsData.nodeData.properties
        this.copyPropertiesToFormData(properties, propsData)
      }
      this.originalFormData = propsData
      this.setState({ uiSchema: newUiSchema, formData: propsData, moreDetailsData: null })

      if (newProps.show) {
        this.onChange(newProps.data)

        if (newProps.enableExpressionBuilder) {
          this.setupMentions(newProps, newUiSchema)
        }
      }
    }
  }

  copyPropertiesToFormData = (properties, data) => {
    Object.keys(properties).map(property => {
      data[property] = properties[property]
    })
  }

  isEditMode = formData => {
    const nodeData = formData.nodeData
    const nodeLength = Object.keys(nodeData).length
    return nodeLength === 0 ? false : true
  }

  isTypeSupportedWithMentions (stencilType) {
    const typeArray = [
      'HTTP',
      'EMAIL',
      'JENKINS',
      'BAMBOO',
      'ELK',
      'SPLUNK',
      'SPLUNKV2',
      'CLOUD_WATCH',
      'SCP',
      'COPY_CONFIGS',
      'EXEC',
      'SETUP_ENV',
      'DOCKER_START',
      'DOCKER_STOP',
      'PROCESS_CHECK_RUNNING',
      'PROCESS_CHECK_STOPPED',
      'PORT_CHECK_CLEARED',
      'PORT_CHECK_LISTENING',
      'ECS_SERVICE_SETUP',
      'AWS_LAMBDA_STATE',
      'AWS_CODEDEPLOY_STATE'
    ]

    return stencilType && typeArray.indexOf(stencilType) !== -1
  }

  componentDidMount () {
    this.setupMentions()
  }

  componentDidUpdate () {
    this.setupMentions()
  }

  setupMentions () {
    const { props, props: { appId, serviceId, entityId, entityType, context, show } } = this

    const stateType =
      props.stateType ||
      Utils.getJsonValue(this, 'stencilData.type') ||
      Utils.getJsonValue(this, 'state.formDta.nodeData.type')

    if (!stateType) {
      return
    }

    if (!show) {
      return MentionUtils.unregister(MentionsType.COMMANDS)
    }

    if (this.isTypeSupportedWithMentions(stateType)) {
      MentionUtils.registerForType({
        type: MentionsType.COMMANDS,
        args: {
          appId,
          entityType,
          entityId,
          stateType: context === 'SERVICE-COMMAND-EDITOR' ? 'COMMAND' : stateType,
          serviceId
        },
        reuse: true
      })

      this.enableMentions(stateType, MentionsType.COMMANDS)
    } else {
      const message = `ExpressionBuilder currently not supported stateType: ${stateType}`
      Logger.error({ source: 'StencilModal', message })
    }
  }

  enableMentions (stateType, mentionsType) {
    switch (stateType) {
      case 'HTTP':
        MentionUtils.enableMentionsForFields(['url', 'header', 'body', 'assertion'], mentionsType)
        break

      case 'EMAIL':
        MentionUtils.enableMentionsForFields(['toAddress', 'ccAddress', 'body', 'subject'], mentionsType)
        break

      case 'SPLUNKV2':
      case 'SPLUNK':
        MentionUtils.enableMentionsForFields(['query', 'assertion'], mentionsType)
        break

      // processed by JenkinsVerificationModal.js (TODO still not able to support dynamic array for params)
      // processed by BambooVerificationModal.js (TODO still not able to support dynamic array for params)
      case 'ELK':
      case 'JENKINS':
      case 'NEW_RELIC':
      case 'BAMBOO':
      case 'CLOUD_WATCH': // processed by CloudWatchModal.js
        break

      case 'SCP':
        MentionUtils.enableMentionsForFields(['destinationDirectoryPath'], mentionsType)
        break

      case 'COPY_CONFIGS':
        MentionUtils.enableMentionsForFields(['destinationParentPath'], mentionsType)
        break

      case 'EXEC': // TODO still not able to support dynamic array for "Files and Patterns"
      case 'SETUP_ENV':
        MentionUtils.enableMentionsForFields(['commandPath', 'commandString'], mentionsType)
        break

      case 'DOCKER_START':
      case 'DOCKER_STOP':
      case 'PROCESS_CHECK_RUNNING':
      case 'PROCESS_CHECK_STOPPED':
      case 'PORT_CHECK_CLEARED':
      case 'PORT_CHECK_LISTENING':
        MentionUtils.enableMentionsForFields(['commandString'], mentionsType)
        break

      case 'ECS_SERVICE_SETUP':
        MentionUtils.enableMentionsForFields(['ecsServiceName'], mentionsType)
        break

      case 'AWS_LAMBDA_STATE':
        MentionUtils.enableMentionsForFields(['aliases'], mentionsType)
        break

      case 'AWS_CODEDEPLOY_STATE':
        MentionUtils.enableMentionsForFields(['key', 'bucket'], mentionsType)
        break
    }
  }

  customizeStencilData = stencilData => {
    try {
      const data = Utils.clone(stencilData)
      if (data.type === 'ELASTIC_LOAD_BALANCER') {
        data.jsonSchema.properties = {
          loadBalancerId: { type: 'string', title: 'Load Balancer', default: this.props.custom.loadBalancerId },
          ...data.jsonSchema.properties
        }
        data.uiSchema.loadBalancerId = { 'ui:readonly': true }
      }
      return data
    } catch (e) {
      return {} // failed to clone
    }
  }

  // to show New Load Balancer Modal, we need to load pluginSchemas for it.
  fetchForLoadBalancerModal = () => {
    apis.fetchPlugins().then(pluginsRes => {
      this.plugins = pluginsRes.resource
      apis.fetchInstalledSettingSchema().then(pluginSchemasRes => {
        this.pluginSchemas = pluginSchemasRes.resource
      })
    })
  }

  onLoadBalancerModalSubmit = () => {
    this.setState({ acctConnectorModalShow: false })
    if (this.props.parentFetchData) {
      this.props.parentFetchData(r => {
        const data = this.props.data
        data.stencilData = r.stencils.resource.find(s => s.type === 'ECS_SERVICE_SETUP')
        this.componentWillReceiveProps({ ...this.props, data })
      })
    }
  }

  onSubmit = ({ formData }) => {
    // const isEditing = (this.props.data ? true : false)

    delete formData['nodeData']
    delete formData['params']
    if (this.newName) {
      formData.newName = this.newName
      this.newName = ''
    }
    /* hiding as we are not templatizing yet on steps
    if (this.props.templateWorkflow && this.isEdit && !formData.templateExpressions) {
      FormUtils.transformDataForTemplatization(formData, schema)
    }*/
    this.props.onSubmit(this.props.data.nodeData.id, formData, this.props.data.params)
    this.hideMode = true
  }

  onChange = params => {
    let formData
    if (params.formData) {
      // eventObject.formData
      formData = params.formData
    } else {
      formData = params
    }

    if (this.stencilData.type === 'COMMAND') {
      const selectedCommand = formData.commandName || params.stencilData.name || formData.referenceId
      this.setState({
        moreDetailsData: {
          commandName: selectedCommand
        },
        formData
      })
    }

    if (this.stencilData.type === 'ECS_SERVICE_SETUP') {
      if (formData.loadBalancerSettingId === 'NEW') {
        this.setState({ acctConnectorModalShow: true })
      }
    }
    this.setState({ formData })
  }

  onTitleChange = newName => {
    this.newName = newName
  }
  /*
    Showing templatize options only on the specific templatizeModals
    in edit mode

  */
  getFieldTemplate = () => {
    if (this.state.formData && this.isEdit) {
      const type = this.state.formData.nodeData.type || this.stencilData.type
      const canTemplatizeStencilStep = templatizeModals[type] ? templatizeModals[type] : false
      if (canTemplatizeStencilStep && this.props.templateWorkflow) {
        return CustomFieldTemplate
      } else {
        return undefined
      }
    }
  }

  hideModal = (confirmed = false) => {
    if (confirmed === false) {
      if (JSON.stringify(this.state.formData) !== JSON.stringify(this.originalFormData)) {
        this.setState({ hideConfirmShow: true })
        return
      }
    } else if (confirmed === true) {
      this.setState({ hideConfirmShow: false })
    }

    this.initialized = false
    this.setState({ submitting: false, schema, uiSchema })
    this.props.onHide()
  }

  render () {
    let renderFormDetails = null

    if (this.state.moreDetailsData) {
      renderFormDetails = (
        <ServicesCommands commandName={this.state.moreDetailsData.commandName} service={this.props.service} />
      )
    }

    if (this.state.formData && this.state.formData.nodeData) {
      const type = this.state.formData.nodeData.type || this.stencilData.type

      // console.log('Stencil type:', type)

      if (type === 'CLOUD_WATCH') {
        return (
          <CloudWatchModal
            {...this.props}
            {...this.state}
            onSubmit={this.onSubmit}
            mentionsType={MentionsType.COMMANDS}
            templateWorkflow={this.props.templateWorkflow}
            onHide={this.hideModal}
          />
        )
      }
      if (type === 'DC_NODE_SELECT') {
        return (
          <NodeSelectModal
            {...this.props}
            {...this.state}
            onSubmit={this.onSubmit}
            templateWorkflow={this.props.templateWorkflow}
            onHide={this.hideModal}
          />
        )
      }
      if (type === 'AWS_NODE_SELECT') {
        return (
          <NodeSelectModal
            {...this.props}
            {...this.state}
            onSubmit={this.onSubmit}
            templateWorkflow={this.props.templateWorkflow}
            onHide={this.hideModal}
            isEdit={this.isEdit}
          />
        )
      }
      if (type === 'KUBERNETES_REPLICATION_CONTROLLER_SETUP') {
        return (
          <KubernetesRepCtrlSetup
            {...this.props}
            {...this.state}
            onSubmit={this.onSubmit}
            templateWorkflow={this.props.templateWorkflow}
            onHide={this.hideModal}
          />
        )
      }
      if (type === 'ECS_SERVICE_SETUP') {
        return (
          <ECSLoadBalancerModal
            {...this.props}
            {...this.state}
            onSubmit={this.onSubmit}
            templateWorkflow={this.props.templateWorkflow}
            onHide={this.hideModal}
          />
        )
      }
      if (type === 'APP_DYNAMICS') {
        return (
          <AppDynamicsVerificationModal
            {...this.props}
            {...this.state}
            onSubmit={this.onSubmit}
            templateWorkflow={false}
            onHide={this.hideModal}
          />
        )
      }
      if (type === 'BAMBOO') {
        return (
          <BambooVerificationModal
            {...this.props}
            {...this.state}
            onSubmit={this.onSubmit}
            onTitleChange={this.onTitleChange}
            templateWorkflow={false}
            onHide={this.hideModal}
          />
        )
      }
      if (type === 'ELK') {
        return (
          <ElkVerificationModal
            {...this.props}
            {...this.state}
            onSubmit={this.onSubmit}
            onTitleChange={this.onTitleChange}
            templateWorkflow={false}
            onHide={this.hideModal}
          />
        )
      }
      if (type === 'JENKINS') {
        return (
          <JenkinsVerificationModal
            {...this.props}
            {...this.state}
            onSubmit={this.onSubmit}
            onTitleChange={this.onTitleChange}
            templateWorkflow={false}
            onHide={this.hideModal}
          />
        )
      }
      if (type === 'AWS_CODEDEPLOY_STATE') {
        return (
          <AwsCodeDeployStepModal
            {...this.props}
            {...this.state}
            onSubmit={this.onSubmit}
            onTitleChange={this.onTitleChange}
            templateWorkflow={false}
            onHide={this.hideModal}
          />
        )
      }
      if (type === 'AWS_LAMBDA_STATE') {
        return (
          <AwsLambdaStepModal
            {...this.props}
            {...this.state}
            onSubmit={this.onSubmit}
            onTitleChange={this.onTitleChange}
            templateWorkflow={false}
            onHide={this.hideModal}
          />
        )
      }
      if (type === 'NEW_RELIC') {
        return (
          <NewRelicVerificationModal
            {...this.props}
            {...this.state}
            onSubmit={this.onSubmit}
            onTitleChange={this.onTitleChange}
            templateWorkflow={false}
            onHide={this.hideModal}
          />
        )
      }
      if (type === 'AWS_LAMBDA_VERIFICATION') {
        return (
          <AWSLambdaVerificationModal
            {...this.props}
            {...this.state}
            onSubmit={this.onSubmit}
            onTitleChange={this.onTitleChange}
            templateWorkflow={false}
            onHide={this.hideModal}
          />
        )
      }
    }

    {
      const className = (this.state.dialogCls || '') + ' stencil-modal'

      return (
        <WingsModal
          className={className}
          show={this.props.show}
          onHide={this.hideModal}
          submitting={this.state.submitting}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <InlineEditableText onChange={this.onTitleChange}>{this.state.title}</InlineEditableText>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <WingsForm
              name="Stencil Modal"
              schema={this.state.schema}
              uiSchema={this.state.uiSchema}
              formData={this.state.formData}
              onChange={this.onChange}
              onSubmit={this.onSubmit}
              onError={log('errors')}
            >
              <div>{renderFormDetails}</div>
              <div>
                <button type="submit" className="btn btn-primary" disabled={this.state.submitting}>
                  Submit
                </button>
              </div>
            </WingsForm>
          </Modal.Body>

          <AcctConnectorModal
            plugins={this.plugins}
            categoryType={'ALB'}
            schema={this.pluginSchemas}
            data={{ value: { type: 'ALB' } }}
            show={this.state.acctConnectorModalShow}
            onHide={Utils.hideModal.bind(this)}
            onSubmit={this.onLoadBalancerModalSubmit}
            catalogs={this.props.catalogs}
          />

          <Confirm
            visible={this.state.hideConfirmShow}
            onConfirm={() => this.hideModal(true)}
            onClose={() => this.setState({ hideConfirmShow: false })}
            body="Data has been changed. Do you want to discard changes and cancel this dialog?"
            cancelText="Stay"
            confirmText="Discard changes"
            title="Confirm"
          >
            <button style={{ display: 'none' }} />
          </Confirm>
        </WingsModal>
      )
    }
  }
}

export default StencilModal



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/StencilModal.js