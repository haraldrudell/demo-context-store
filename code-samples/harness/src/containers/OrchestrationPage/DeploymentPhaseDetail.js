import React from 'react'
import { observer } from 'mobx-react'
import { Dropdown, FormGroup, Radio, Checkbox } from 'react-bootstrap'
import {
  createPageContainer,
  TextInputModal,
  TooltipOverlay,
  PageBreadCrumbs,
  CompUtils,
  StencilConfigs,
  StencilSelect,
  Utils,
  OverviewCard,
  AppStorage
} from 'components'
import StencilModal from '../WorkflowEditor/StencilModal'
import DeploymentPhaseNodesModal from './DeploymentPhaseNodesModal'
import DeploymentPhaseModal from './DeploymentPhaseModal'
import PhaseRollbackStrategyPanel from './views/PhaseRollbackStrategyPanel'
import FailureStrategyPanel from './views/FailureStrategyPanel'
import FailureStrategyModal from './FailureStrategyModal'
import NotificationStrategyPanel from './views/NotificationStrategyPanel'
import NotificationStrategyModal from './NotificationStrategyModal'
import WorkflowVariablesModal from './WorkflowVariablesModal'
import WorkflowVariablesPanel from './views/WorkflowVariablesPanel'

import apis from 'apis/apis'
import { updateWorkflowVariables } from '../../services/WorkflowVariablesService'
import NewWorkflowModal from '../OrchestrationPage/NewWorkflowModal'
import CloneWorkflowModal from '../OrchestrationPage/CloneWorkflowModal'
import css from './DeploymentPhaseDetail.css'

const fragmentArr = [{ data: [] }, { stencils: [] }, { notificationGroups: [] }]

@observer
class DeploymentPhaseDetail extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  state = {
    showDPModal: false,
    phase: null,
    rollbackPhase: null,
    stencilModalShow: false,
    stencilModalData: null,
    nodeModalShow: false,
    showFlrStrModal: false,
    waitInput: false,
    loadBalancerId: null,
    infraMappingId: null,
    // for Workflow's Failure Strategies:
    notificationRules: [],
    failureStrategies: [],
    showFailureStrategyModal: false,
    failureStrategyModalEditingItem: null,
    shouldShowWorkflowVariableModal: false,
    workflowVariables: [],
    showWorkflowModal: false
  }
  title = this.renderBreadCrumbs()
  pageName = 'Setup Workflow Details'
  appIdFromUrl = this.props.urlParams.appId // Utils.appIdFromUrl()
  idFromUrl = this.props.urlParams.workflowId // Utils.workflowIdFromUrl()
  phaseIdFromUrl = this.props.urlParams.phaseId // Utils.getIdFromUrl()
  accountIdFromUrl = this.props.urlParams.accountId // Utils.accountIdFromUrl()
  envId = null
  addingTo = null
  editingSection = null
  isUsingAutoScalingGroup = false

  componentWillMount () {
    // this.props.onPageWillMount(<h3>{this.renderBreadCrumbs()}</h3>, 'Setup Workflow Phase Details')
    Utils.loadChildContextToState(this, 'app')
    Utils.loadCatalogsToState(this)
    // this.fetchData()
  }

  renderBreadCrumbs () {
    const { path, urlParams } = this.props
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {
      name: ''
    }
    const workflowType = Utils.getJsonValue(workflow, 'orchestrationWorkflow.orchestrationWorkflowType') || 'BASIC'
    const phaseName = this.state.phase ? this.state.phase.name : ''
    const accountId = AppStorage.get('acctId')
    const bData = [
      { label: 'Setup', link: `/account/${accountId}/setup` },
      { label: this.props.appName, link: path.toAppDetails(urlParams), dropdown: 'applications' },
      { label: 'Workflows', link: path.toSetupWorkflow(urlParams), dropdown: 'application-children' }
    ]
    if (workflowType === 'BASIC' || workflowType === Utils.workflowTypes.BUILD) {
      bData.push({ label: workflow.name })
    } else {
      // if not BASIC (has Multi Phases) => show Phase in Breadcrumb
      // bData.push({
      //   label: workflow.name,
      //   header: 'Workflow',
      //   link: this.props.path.toSetupWorkflowDetails(this.props.urlParams)
      // })
      bData.push({ label: workflow.name, link: path.toSetupWorkflowDetails(urlParams) })
      bData.push({ label: phaseName })
    }
    return <PageBreadCrumbs {...this.props} data={bData} />
  }

  fetchData = async callback => {
    const queryParams = this.props.location.query
    CompUtils.fetchComputeProviders(this)
    fragmentArr[0].data = [apis.fetchWorkflowById, this.appIdFromUrl, this.idFromUrl, queryParams.version]
    fragmentArr[1].stencils = [apis.fetchOrchestrationStencils, this.appIdFromUrl, this.idFromUrl, this.phaseIdFromUrl]
    fragmentArr[2].notificationGroups = [apis.fetchNotificationGroups, this.appIdFromUrl]

    const ctx = this

    if (__CLIENT__) {
      Utils.fetchFragmentsToState(fragmentArr, this, this.findPhase, allData => {
        if (allData && allData.stencils) {
          ctx.props.dataStore.orchestrationsStencils = allData.stencils.resource

          const workflowData = Utils.getJsonValue(allData, 'data.resource.orchestrationWorkflow') || {}

          const workflowNotificationRules = workflowData.notificationRules || []
          for (let i = 0; i < workflowNotificationRules.length; i++) {
            workflowNotificationRules[i].id = i
          }
          const workflowFailureStrategies = workflowData.failureStrategies || []
          for (let i = 0; i < workflowFailureStrategies.length; i++) {
            workflowFailureStrategies[i].id = i
          }
          if (ctx) {
            ctx.setState({
              notificationRules: workflowNotificationRules,
              failureStrategies: workflowFailureStrategies,
              workflowVariables: workflowData.userVariables || []
            })
          }
          if (typeof callback === 'function') {
            callback(allData)
          }
          this.props.onPageWillMount(this.renderBreadCrumbs())
        }
      })
    } else {
      this.setState(this.props)
    }
  }

  filterServiceTemplatesByInfraId = (infraMappingId, envData, envId) => {
    const { serviceTemplates } = envData.resource
    if (serviceTemplates && serviceTemplates.length > 0) {
      const filteredTemplate = serviceTemplates.filter(template => template.envId === envId)
      if (filteredTemplate) {
        const filteredMapping = this.filterTemplatesByInfraMappingId(filteredTemplate, infraMappingId)
        return filteredMapping
      }
    }
    return []
  }

  filterTemplatesByInfraMappingId = (templates, infraMappingId) => {
    if (templates && templates.length > 0) {
      for (const template of templates) {
        const { infrastructureMappings } = template
        const filteredMapping = this.filterInfraMappingsById(infrastructureMappings, infraMappingId)

        if (filteredMapping) {
          return filteredMapping
        }
      }
    }
    return
  }

  filterInfraMappingsById = (infrastructureMappings, infraMappingId) => {
    if (infrastructureMappings && infrastructureMappings.length > 0) {
      const filteredMapping = infrastructureMappings.find(mapping => mapping.uuid === infraMappingId)
      return filteredMapping
    }
    return
  }

  isInfraMappingUsingAutoScalingGroup = (infraMappingId, envData, envId) => {
    const filteredMappings = this.filterServiceTemplatesByInfraId(infraMappingId, envData, envId)
    const infraMappingType = (filteredMappings) ? filteredMappings.infraMappingType : ''

    if (infraMappingType === Utils.infraMappingTypes.AWS_SSH) {
      const isUsingAutoScalingGroup = filteredMappings.provisionInstances
      return isUsingAutoScalingGroup
    }
  }

  findPhase = (key, data) => {
    if (key === 'data' && data && data.resource) {
      const workflow = data.resource.orchestrationWorkflow
      const phase = workflow.workflowPhases.find(obj => obj.uuid === this.phaseIdFromUrl)
      const rollbackPhase = workflow.rollbackWorkflowPhaseIdMap[this.phaseIdFromUrl]
      this.setState({ phase, rollbackPhase })
      this.envId = data.resource.envId

      apis.fetchEnv(this.appIdFromUrl, this.envId).then(r => {
        this.envDetails = r
        this.setState({ environmentdetails: r })

        if (phase && phase.infraMappingId) {
          this.isUsingAutoScalingGroup = this.isInfraMappingUsingAutoScalingGroup(
            phase.infraMappingId,
            this.envDetails,
            this.envId
          )
        }
      })
      if (phase && phase.infraMappingId) {
        // console.log(phase, 'phase', phase.infraMappingId, 'phase.infraMappingId')

        this.setState({ infraMappingId: phase.infraMappingId })
        apis.service
          .list(apis.getInfrastructureMappingEndPoint(this.appIdFromUrl, null, null, phase.infraMappingId))
          .then(res => {
            this.setState({
              loadBalancerId: res.resource.loadBalancerName
                ? res.resource.loadBalancerName
                : res.resource.loadBalancerId
            })
          })
      }
    }
  }

  updatePhase = (phase, forRollbackPhase) => {
    let updatePhase = phase
    if (forRollbackPhase) {
      updatePhase = forRollbackPhase
    }
    if (forRollbackPhase) {
      this.setState({ rollbackPhase: forRollbackPhase })
    } else {
      this.setState({ phase })
    }
    apis.service
      .replace(
        apis.getWorkflowPhaseEndpoint(
          this.appIdFromUrl,
          this.idFromUrl,
          this.phaseIdFromUrl,
          forRollbackPhase ? 'rollback' : ''
        ), {
          body: JSON.stringify(updatePhase)
        })
      .then(() => {
        this.fetchData()
      })
      .catch(error => {
        this.fetchData()
        throw error
      })
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  onDepStepAdded = (item, addingTo, forRollbackPhase) => {
    let updatePhase = this.state.phase
    if (forRollbackPhase) {
      updatePhase = forRollbackPhase
    }

    this.addingTo = addingTo
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    const stencilData = stencils.find(s => s.type + '-' + s.name === item.value)

    if (stencilData.type === 'COMMAND') {
      this.onCommandAdded(updatePhase, item, addingTo, forRollbackPhase)
    } else {
      //  console.log('onDepStepAdded', stencilData)
      if (stencilData.jsonSchema.properties) {
        const stencilModalData = {
          stencilData,
          nodeData: {},
          params: { forRollbackPhase }
        }
        this.setState({ stencilModalShow: true, stencilModalData })
      }
    }
  }

  onCommandAdded = (phase, item, addingTo, forRollbackPhase) => {
    const index = phase.phaseSteps.findIndex(phaseStep => phaseStep.phaseStepType === addingTo.phaseStepType)
    if (!addingTo.steps) {
      addingTo.steps = []
    }
    // console.log('onCommandAdded-phaseStep', index, phase.phaseSteps[index])
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    const stencilData = stencils.find(s => s.type + '-' + s.name === item.value)
    const newNodeId = Utils.generateNodeId()
    addingTo.steps.push({
      id: newNodeId,
      name: Utils.generateStepName(stencilData, null, addingTo.steps),
      x: 40 + 150 * addingTo.steps.length,
      y: 40,
      type: stencilData.type,
      properties: {
        commandName: stencilData.name
      }
    })
    phase.phaseSteps[index] = addingTo
    this.updatePhase(phase, forRollbackPhase)
  }

  onStencilModalSubmit = (nodeId, formData, modalData) => {
    let updatePhase = this.state.phase
    if (modalData && modalData.params && modalData.params.forRollbackPhase) {
      updatePhase = modalData.params.forRollbackPhase
    }
    const addingTo = this.addingTo
    const index = updatePhase.phaseSteps.findIndex(phaseStep => phaseStep.phaseStepType === addingTo.phaseStepType)
    if (!addingTo.steps) {
      addingTo.steps = []
    }
    const stepProps = { ...formData }
    delete stepProps['stencilData']

    if (!nodeId) {
      // Adding New Step
      const newNodeId = Utils.generateNodeId()
      let stepName = Utils.generateStepName(formData.stencilData, formData, addingTo.steps)
      if (stepProps.newName) {
        stepName = stepProps.newName
        delete stepProps['newName']
      }
      addingTo.steps.push({
        id: newNodeId,
        name: stepName,
        x: 40 + 150 * addingTo.steps.length,
        y: 40,
        type: formData.stencilData.type,
        properties: {
          ...stepProps
        }
      })
    } else {
      // Updating Step
      const idx = addingTo.steps.findIndex(n => n.id === nodeId)
      if (idx >= 0) {
        if (stepProps.newName) {
          addingTo.steps[idx].name = stepProps.newName
          delete stepProps['newName']
        }
        // if (formData.stencilData && formData.stencilData.type === 'HTTP') {
        //   addingTo.steps[idx].name = Utils.generateStepName(formData.stencilData, formData, addingTo.steps)
        // }
        addingTo.steps[idx].properties = { ...stepProps }
      }
    }

    updatePhase.phaseSteps[index] = addingTo
    this.updatePhase(updatePhase, modalData.forRollbackPhase)
    Utils.hideModal.call(this, 'stencilModalShow')
  }

  onNodeModalSubmit = formData => {
    const addingTo = this.addingTo
    const index = this.state.phase.phaseSteps.findIndex(phaseStep => phaseStep.phaseStepType === addingTo.phaseStepType)
    addingTo.steps = []

    const props = { ...formData }
    const newNodeId = Utils.generateNodeId()
    addingTo.steps.push({
      id: newNodeId,
      name: 'HOSTS' + '_' + Math.floor(Math.random() * 9999 + 1),
      x: 40 + 150 * addingTo.steps.length,
      y: 40,
      type: 'HOSTS',
      properties: {
        ...props
      }
    })

    const phase = this.state.phase
    phase.phaseSteps[index] = addingTo
    this.updatePhase(phase)
    Utils.hideModal.call(this, 'nodeModalShow')
  }

  onUpdateNodeClick = (phaseStep, node, forRollbackPhase) => {
    this.addingTo = phaseStep
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    const stencilData = stencils.find(s => s.type === node.type)
    const stencilModalData = {
      stencilData,
      nodeData: node,
      params: { forRollbackPhase },
      ...node.properties
    }
    this.setState({ stencilModalShow: true, stencilModalData })
  }

  onEdit = () => {
    this.setState({ showDPModal: true })
  }

  renderServiceName = (service, artifactTypeName, serviceName, isTemplatized) => {
    if (isTemplatized && serviceName) {
      return serviceName
    }
    return service ? `${service.name} (${artifactTypeName})` : String.fromCharCode(65112)
  }

  renderCloudProvider = (resultObj, isTemplatized) => {
    const isInfraTemplatized = resultObj.isInfraTemplatized
    const computeProvider = resultObj.computeProvider
    if (isTemplatized && isInfraTemplatized) {
      return ''
    }
    return computeProvider ? computeProvider.name : ''
  }

  renderDeploymentType = (isInfraTemplatized, deploymentTypeText, isTemplatized) => {
    if (isTemplatized && isInfraTemplatized) {
      return ''
    }
    return deploymentTypeText ? deploymentTypeText : ''
  }

  renderNameDetails (resultObj, templatized = false) {

    // const computeProvider = resultObj.computeProvider
    if (!this.state.phase) {
      return null
    }
    const workflow = this.state.data.resource
    const workflowType = workflow.orchestrationWorkflow.orchestrationWorkflowType
    const phase = this.state.phase
    let title = phase.name
    if (workflowType === 'BASIC') {
      title = workflow.name
    }
    return (
      <div className="box-solid wings-card">
        <div className="box-header">
          <div className="wings-card-header">
            <div>
              {title}
            </div>
          </div>

          <div className="wings-card-actions">
            {/* <span className="__viewsLink">
              <span className="__link" onClick={this.editorLinkClick}>
                Preview
              </span>
            </span> */} {workflowType !== Utils.workflowTypes.BUILD && <span>
              <i className="icons8-pencil-tip" onClick={this.onEdit} />
            </span>}
          </div>
        </div>
      </div>
    )
  }

  updatePhaseStep (phaseStep, forRollbackPhase) {
    let updatePhase = this.state.phase
    if (forRollbackPhase) {
      updatePhase = forRollbackPhase
    }
    // phaseStep.waitInterval = 2

    const index = updatePhase.phaseSteps.findIndex(ps => ps.phaseStepType === phaseStep.phaseStepType)
    updatePhase.phaseSteps[index] = phaseStep
    this.updatePhase(updatePhase, forRollbackPhase)
  }

  onEditClick = (phaseStep, nodeIdx, forRollbackPhase) => {
    this.addingTo = phaseStep
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    const node = phaseStep.steps[nodeIdx]
    const stencilData = stencils.find(s => s.type === node.type)
    const stencilModalData = {
      stencilData,
      nodeData: node,
      params: { forRollbackPhase },
      ...node.properties
    }
    this.setState({ stencilModalShow: true, stencilModalData })
  }

  onDeleteClick = (phaseStep, nodeIdx, forRollbackPhase) => {
    if (nodeIdx > -1) {
      phaseStep.steps.splice(nodeIdx, 1)
    }
    this.updatePhaseStep(phaseStep, forRollbackPhase)
  }

  onMoveUp = (phaseStep, nodeIdx) => {
    if (nodeIdx <= 0) {
      return
    }
    Utils.moveArrayItem(phaseStep.steps, nodeIdx, nodeIdx - 1)
    this.updatePhaseStep(phaseStep)
  }

  onMoveDown = (phaseStep, nodeIdx) => {
    if (nodeIdx >= phaseStep.steps.length - 1) {
      return
    }
    Utils.moveArrayItem(phaseStep.steps, nodeIdx, nodeIdx + 1)
    this.updatePhaseStep(phaseStep)
  }

  updateStepFailureStrategies = data => {
    const phaseStep = this.state.selectedPhaseStep
    phaseStep.failureStrategies = data
    this.updatePhaseStep(phaseStep)
    this.setState({ showFlrStrModal: false })
  }

  updateWaitInterval = valueStr => {
    const phaseStep = this.state.selectedPhaseStep
    phaseStep.waitInterval = parseInt(valueStr, 10)
    this.updatePhaseStep(phaseStep)
    this.setState({
      showFlrStrModal: false,
      selectedPhaseStep: null,
      waitInput: false
    })
  }

  updateFailureStrategy = (checked, phaseStep) => {
    // console.log(phaseStep, checked)
    this.setState({ showFlrStrModal: true, selectedPhaseStep: phaseStep })
  }

  renderStencilLabel = stencil => {
    return (
      <span>
        <span className="badge">
          <i className={StencilConfigs.getNodeIconClass(stencil.type, stencil.name)} />
        </span>
        <span className="__accent">
          {stencil.name}
        </span>
      </span>
    )
  }

  renderAddCommand (step, service, forRollbackPhase) {
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    const commonStencils = stencils.filter(s => s.scopes.indexOf('COMMON') >= 0)
    // find Stencils for this Step (filter by phaseStepType) + Common Stencils

    const stencilsForStep = stencils.filter(s => s.phaseStepTypes.indexOf(step.phaseStepType) >= 0)
    for (const commonStencil of commonStencils) {
      const found = stencilsForStep.find(s => s.name === commonStencil.name) // make sure it has not been added.
      if (!found) {
        stencilsForStep.push(commonStencil)
      }
    }
    const placeholder = (
      <span role="button" className="__addIconElement">
        <span className="badge">
          <i className="icons8-plus-math" />
        </span>
        <span> Add Command</span>
      </span>
    )
    return (
      <span>
        <StencilSelect
          stencils={stencilsForStep}
          service={service}
          placeholder={placeholder}
          onChange={item => this.onDepStepAdded(item, step, forRollbackPhase)}
        />
      </span>
    )
  }

  renderAddVerification (step, service, forRollbackPhase) {
    /*
    const groupName = 'VERIFICATIONS'
    const options = []
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    for (const stencil of stencils) {
      if (stencil.stencilCategory.name === groupName) {
        options.push({ value: stencil.type + '-' + stencil.name, label: this.renderStencilLabel(stencil) })
      }
    }
    if (options.length > 0) {
      options.unshift({
        label: groupName,
        value: groupName,
        disabled: true
      })
    }
    const placeholder = (
              <span role="button" className="__addIconElement">
                 <span className="badge">
                  <i className="icons8-plus-math" />
                 </span>
                 <span> Add Verification</span>
              </span>
          )
    return (
        <span role="button">
          <Select
            name="form-field-name"
            placeholder={placeholder}
            value=""
            options={options}
            clearable={false} autosize={true} searchable={false}
            onChange={item => this.onDepStepAdded(item, step)}
          />
        </span>
      )
    */
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    const verificationStencils = stencils.filter(s => s.stencilCategory.name === 'VERIFICATIONS')
    const commonStencils = stencils.filter(s => s.scopes.indexOf('COMMON') >= 0)
    // find Stencils for VERIFICATIONS + Common Stencils
    const stencilsForStep = [...verificationStencils]
    for (const commonStencil of commonStencils) {
      const found = verificationStencils.find(s => s.name === commonStencil.name) // make sure it has not been added.
      if (!found) {
        stencilsForStep.push(commonStencil)
      }
    }
    const placeholder = (
      <span role="button" className="__addIconElement">
        <span className="badge">
          <i className="icons8-plus-math" />
        </span>
        <span> Add Verification</span>
      </span>
    )
    return (
      <span>
        <StencilSelect
          stencils={stencilsForStep}
          service={service}
          placeholder={placeholder}
          onChange={item => this.onDepStepAdded(item, step, forRollbackPhase)}
        />
      </span>
    )
  }

  renderPhaseSteps (service) {
    if (!this.state.phase) {
      return null
    }
    const workflow = this.state.data.resource
    const workflowType = Utils.getJsonValue(workflow, 'orchestrationWorkflow.orchestrationWorkflowType')
    const notificationGroups = Utils.getJsonValue(this, 'state.notificationGroups.resource.response') || {}
    const catalogPhaseStepTypes = Utils.getJsonValue(this, 'state.catalogs.PHASE_STEP_TYPE') || []
    const lookupCatalog = key => {
      const obj = catalogPhaseStepTypes.find(cat => cat.value === key)
      return obj ? obj.displayText : key
    }
    const phaseSteps = Utils.getJsonValue(this, 'state.phase.phaseSteps') || []
    return (
      <div className="box-solid wings-card __noTopBorder">
        <div className="box-body wings-card-body __deploymentStepsBody __addBotttomBufferForPullDownMenu">
          <div className="col-md-6 wings-card-col phase-column">
            {phaseSteps.map((step, index) => {
              const failureStrategies = step.failureStrategies
              const isDefault = failureStrategies && failureStrategies.length <= 0
              return (
                <div key={index} data-name={step.name}>
                  <div className="__stepHeading">
                    {index + 1}. {step.name}
                    <span className="custom-failure-strategy-label">
                      {isDefault ? '' : '(customized failure strategy)'}
                    </span>
                    <Dropdown
                      id="_deploymentCardOverviewMenu"
                      className="wings-threedots"
                      dropup={index === phaseSteps.length - 1}
                      role="button"
                    >
                      <span className="light __stepMenu" bsRole="toggle">
                        <i className="fa fa-ellipsis-v" />
                      </span>
                      <Dropdown.Menu bsRole="menu">
                        {this.renderMenu(step, index)}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="__stepDetails">
                    {this.renderStepDetails(step, service)}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="col-md-6 wings-card-col __settingCol">
            {workflowType !== 'BUILD' && (
              <PhaseRollbackStrategyPanel
                workflowData={workflow.orchestrationWorkflow}
                service={service}
                lookupCatalog={lookupCatalog}
                renderStepDetails={this.renderStepDetails.bind(this)}
              />
            )}

            {
              <div>
                <NotificationStrategyPanel
                  showSummary={true}
                  loadingStatus={this.state.loadingStatus}
                  dataStore={this.props.dataStore}
                  notificationRules={this.state.notificationRules}
                  notificationGroups={notificationGroups}
                  onEdit={this.onWorkflowNotifEdit}
                  onChange={this.updateWorkflowNotifications}
                  onManage={() =>
                    this.setState({
                      showNotifStrategyModal: true,
                      notifStrategyModalEditingItem: null
                    })}
                />
                <NotificationStrategyModal
                  dataStore={this.props.dataStore}
                  show={this.state.showNotifStrategyModal}
                  onHide={() => {
                    this.setState({ showNotifStrategyModal: false })
                    this.fetchData()
                  }}
                  data={{
                    notificationGroups: notificationGroups,
                    notificationRules: this.state.notificationRules,
                    notifStrategyModalEditingItem: this.state.notifStrategyModalEditingItem
                  }}
                  onChange={this.updateWorkflowNotifications}
                  onSubmit={this.updateWorkflowNotifications}
                />{ workflowType !== Utils.workflowTypes.BUILD && <FailureStrategyPanel
                  showSummary={true}
                  loadingStatus={this.state.loadingStatus}
                  failureStrategies={this.state.failureStrategies}
                  onEdit={this.onWorkflowFailureEdit}
                  onChange={this.updateWorkflowFailureStrategies}
                  onManage={() =>
                    this.setState({
                      showFailureStrategyModal: true,
                      failureStrategyModalEditingItem: null
                    })}
                />}
                { workflowType !== Utils.workflowTypes.BUILD && <FailureStrategyModal
                  show={this.state.showFailureStrategyModal}
                  onHide={() => {
                    this.setState({ showFailureStrategyModal: false })
                    this.fetchData()
                  }}
                  data={{
                    failureStrategies: this.state.failureStrategies,
                    failureStrategyModalEditingItem: this.state.failureStrategyModalEditingItem
                  }}
                  onChange={this.updateWorkflowFailureStrategies}
                  onSubmit={this.updateWorkflowFailureStrategies}
                />}

                <WorkflowVariablesPanel
                  showSummary={true}
                  loadingStatus={this.state.loadingStatus}
                  variables={this.state.workflowVariables}
                  onManage={() => this.setState({ shouldShowWorkflowVariableModal: true })}
                />
                <WorkflowVariablesModal
                  show={this.state.shouldShowWorkflowVariableModal}
                  onHide={() => {
                    this.setState({ shouldShowWorkflowVariableModal: false })
                    this.fetchData()
                  }}
                  data={{ variables: this.state.workflowVariables }}
                  appId={this.appIdFromUrl}
                  serviceId={Utils.getJsonValue(this, 'state.phase.serviceId') || ''}
                  workflowId={this.idFromUrl}
                  onSave={this.saveWorkflowVariables}
                />
              </div>}
          </div>
        </div>
      </div>
    )
  }

  renderMenu (phaseStep, index) {
    const updateParallel = (checked, phaseStep) => {
      phaseStep.stepsInParallel = checked
      this.updatePhaseStep(phaseStep)
    }

    const updateDefaultFailureStrategy = (checked, phaseStep) => {
      if (checked) {
        phaseStep.failureStrategies = []
        this.updatePhaseStep(phaseStep)
      }
    }

    const failureStrategies = phaseStep.failureStrategies
    const isDefault = failureStrategies && failureStrategies.length <= 0
    return (
      <li>
        <div className="__rightMenu">
          {phaseStep.phaseStepType !== 'PROVISION_NODE' &&
            <FormGroup>
              <Checkbox checked={phaseStep.stepsInParallel} onChange={e => updateParallel(e.target.checked, phaseStep)}>
                <div>Execute steps in Parallel</div>
              </Checkbox>
              <li role="separator" className="divider" />
            </FormGroup>}

          <FormGroup>
            <div className="__waitText">
              <span>Wait before execution: </span>
              <span
                className="__waitValue"
                onClick={ev =>
                  this.setState({
                    selectedPhaseStep: phaseStep,
                    waitInput: true
                  })}
              >
                {phaseStep.waitInterval ? phaseStep.waitInterval : 0} seconds
              </span>
            </div>
            <div> Failure Strategy: </div>
            <Radio checked={isDefault} onChange={e => updateDefaultFailureStrategy(e.target.checked, phaseStep)}>
              <div>Default</div>
            </Radio>
            <Radio
              checked={!isDefault}
              onChange={e => this.updateFailureStrategy(e.target.checked, phaseStep)}
              onClick={e => this.updateFailureStrategy(e.target.checked, phaseStep)}
            >
              <div className={!isDefault ? 'wings-text-link' : ''}>
                Custom {!isDefault ? `(${failureStrategies.length})` : ''}
                <span className={!isDefault ? '' : 'hidden'}>
                  &nbsp;<i className="icons8-pencil-tip" />
                </span>
              </div>
            </Radio>
          </FormGroup>
        </div>
      </li>
    )
  }

  // forRollbackPhase (optional)
  renderStepDetails (phaseStep, service, forRollbackPhase) {
    if (!phaseStep) {
      return null
    }

    if (phaseStep.phaseStepType === 'PROVISION_NODE') {
      // for "PROVISION NODE" step
      return (
        <div key={phaseStep.phaseStepType}>
          {phaseStep.steps &&
            phaseStep.steps.map((node, index) => {
              return (
                <div
                  key={index}
                  className="__listCommand"
                  onClick={() => this.onUpdateNodeClick(phaseStep, node, forRollbackPhase)}
                  role="button"
                >
                  <span className={'badge ' + (phaseStep.valid === false ? '__invalidStep' : '')}>
                    <i className={StencilConfigs.getNodeIconClass(node.type, node.name)} />
                  </span>
                  <strong className="__accent">
                    {node.name}
                  </strong>
                </div>
              )
            })}

          {(!phaseStep.steps || phaseStep.steps.length <= 0) &&
            <div
              key={phaseStep.phaseStepType}
              className="__listCommand"
              onClick={this.onUpdateNodeClick.bind(this, phaseStep, forRollbackPhase)}
              role="button"
            >
              <span className="badge">&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <strong className="__red">&lt;Unassigned&gt;</strong>
            </div>}
        </div>
      )
    }

    let addStep = ''
    if (phaseStep.phaseStepType === 'VERIFY_SERVICE') {
      // for "VERIFY SERVICE" step
      addStep = this.renderAddVerification(phaseStep, service, forRollbackPhase)
    } else {
      addStep = this.renderAddCommand(phaseStep, service, forRollbackPhase)
    }

    return (
      // for OTHER STEPS
      <div>
        {phaseStep.steps &&
          phaseStep.steps.map((node, stepIdx) => {
            return (
              <div key={stepIdx} className="__listCommand">
                <span>
                  {node.valid === false &&
                    <TooltipOverlay tooltip={node.validationMessage}>
                      <i className="icons8-info __invalidIcon" />
                    </TooltipOverlay>}
                  <span
                    className={'badge ' + (node.valid === false ? '__invalidStep' : '')}
                    onClick={() => this.onEditClick(phaseStep, stepIdx, forRollbackPhase)}
                  >
                    <i className={StencilConfigs.getNodeIconClass(node.type, node.name)} />
                  </span>
                  <strong className="__accent" onClick={() => this.onEditClick(phaseStep, stepIdx, forRollbackPhase)}>
                    {node.name}
                  </strong>
                  {node.valid === false && <span className="__invalidText">(Incomplete)</span>}
                  {stepIdx > 0 &&
                    <span className="__itemActionIcon">
                      <i className="icons8-sort-up icon" onClick={() => this.onMoveUp(phaseStep, stepIdx)} />
                    </span>}
                  {stepIdx < phaseStep.steps.length - 1 &&
                    <span className="__itemActionIcon">
                      <i className="icons8-sort-down icon" onClick={() => this.onMoveDown(phaseStep, stepIdx)} />
                    </span>}
                  <span
                    className="__itemActionIcon"
                    onClick={() => this.onDeleteClick(phaseStep, stepIdx, forRollbackPhase)}
                  >
                    <i className="icons8-delete" />
                  </span>
                </span>
              </div>
            )
          })}
        <div>
          {addStep}
        </div>
      </div>
    )
  }

  onDPSubmit = data => {
    apis.service
      .replace(apis.getWorkflowPhaseEndpoint(this.appIdFromUrl, this.idFromUrl, data.uuid), {
        body: JSON.stringify(data)
      })
      .then(res => {
        this.fetchData()
      })
      .catch(error => {
        this.fetchData()
        throw error
      })
    Utils.hideModal.call(this, 'showDPModal')
  }

  editorLinkClick = () => {
    Utils.redirect({
      appId: this.appIdFromUrl,
      workflowId: this.idFromUrl,
      page: 'editor'
    })
  }

  onWorkflowNotifEdit = item => {
    this.setState({
      showNotifStrategyModal: true,
      notifStrategyModalEditingItem: item
    })
  }

  onWorkflowFailureEdit = item => {
    this.setState({
      showFailureStrategyModal: true,
      failureStrategyModalEditingItem: item
    })
  }

  updateWorkflowNotifications = notificationRulesArr => {
    const workflow = this.state.data.resource
    apis.updateWorkflowNotifications(workflow.appId, workflow.uuid, notificationRulesArr)
    this.setState({
      showNotifStrategyModal: false,
      notifStrategyModalEditingItem: null
    })
  }

  updateWorkflowFailureStrategies = failureStrategiesArr => {
    const workflow = this.state.data.resource
    const arr = Utils.clone(failureStrategiesArr).map(item => {
      delete item['id']
      return item
    })
    apis.updateWorkflowFailureStrategies(workflow.appId, workflow.uuid, arr)
    this.setState({
      showFailureStrategyModal: false,
      failureStrategyModalEditingItem: null
    })
  }

  saveWorkflowVariables = async variables => {
    const workflow = this.state.data.resource
    this.setState({
      shouldShowWorkflowVariableModal: false,
      workflowVariables: variables
    })

    await updateWorkflowVariables(workflow.appId, workflow.uuid, variables)
    this.fetchData()
  }
  /*
  Traversing through the template expressions
    and fetching service entity type and showing those expressions as service name
    for template workflows
 */
  getServiceName = (workflow, computeProviders, appServices) => {
    if (workflow) {
      const result = {}
      if (workflow.templatized) {
        const templateExpressions = workflow.templateExpressions
        if (templateExpressions) {
          const tempExpObj = this.getServiceAndInfraDetailsFromTemplateExpressions(templateExpressions)
          result['serviceName'] = tempExpObj.serviceName
          result['isInfraTemplatized'] = tempExpObj.isInfraTemplatized
        }
      }

      if (this.state.phase) {
        const phase = this.state.phase
        if (appServices.length > 0) {
          const service = appServices.find(obj => obj.uuid === this.state.phase.serviceId)
          result['service'] = service
        }
        if (computeProviders.length > 0) {
          const computeProvider = computeProviders.find(obj => obj.uuid === this.state.phase.computeProviderId)
          result['computeProvider'] = computeProvider
        }
        if (phase.templateExpressions) {
          const tempExpObj = this.getServiceAndInfraDetailsFromTemplateExpressions(phase.templateExpressions)
          result['serviceName'] = tempExpObj ? tempExpObj.serviceName : ''
          result['isInfraTemplatized'] = tempExpObj ? tempExpObj.isInfraTemplatized : ''
        }
      }
      return result
    }
  }

  getServiceAndInfraDetailsFromTemplateExpressions = templateExpressions => {
    if (templateExpressions) {
      const result = {}
      const serviceVariable = Utils.filterWorkflowVariablesByEntityType(templateExpressions, Utils.entityTypes.service)
      const infraMappingEntity = Utils.filterWorkflowVariablesByEntityType(
        templateExpressions,
        Utils.entityTypes.infraMapping
      )
      result['serviceName'] = serviceVariable ? serviceVariable.expression : ''
      result['isInfraTemplatized'] = infraMappingEntity ? true : false
      return result
    }
  }

  onEditWorkflow = item => this.setState({ showWorkflowModal: true, workflowModalData: item })
  getWorkflowType = workflow =>
    Utils.getJsonValue(workflow, 'orchestrationWorkflow.orchestrationWorkflowType') || 'BASIC'

  renderOverviewCard = ({ resultObj }) => {
    const workflow = Utils.getJsonValue(this, 'state.data.resource')
    const workflowType = this.getWorkflowType(workflow)

    if (workflowType && workflowType === 'CANARY') {
      return ''
    }

    const getName = () => ({
      key: 'Name',
      value: workflow.name
    })

    const getDescription = () => {
      if (workflow.description) {
        return {
          key: 'Description',
          value: workflow.description
        }
      }
    }

    const getService = () => {
      const service = resultObj.service

      if (!service) {
        return
      }

      const templatizedServiceName = resultObj.serviceName
      const isTemplatized = workflow.templatized
      const artifactTypeName = Utils.getCatalogDisplayText(this.state.catalogs, 'ARTIFACT_TYPE', service.artifactType)
      const deploymentTypeText = Utils.getCatalogDisplayText(
        this.state.catalogs,
        'DEPLOYMENT_TYPE',
        this.state.phase.deploymentType
      )

      return [
        {
          key: 'Service',
          value: this.renderServiceName(service, artifactTypeName, templatizedServiceName, isTemplatized)
        },
        {
          key: 'Cloud Provider',
          value: this.renderCloudProvider(resultObj, isTemplatized)
        },
        {
          key: 'Deployment Type',
          value: this.renderDeploymentType(resultObj.isInfraTemplatized, deploymentTypeText, isTemplatized)
        }
      ]
    }

    const getLoadBalancer = () => {
      if (this.state.loadBalancerId) {
        return {
          key: 'Load Balancer',
          value: this.state.loadBalancerId
        }
      }
    }

    const getEnvironment = () => {
      const env = Utils.getJsonValue(this, 'state.environmentdetails.resource')
      return {
        key: 'Environment',
        value: Utils.getEnvironmentName(workflow, env)
      }
    }

    const getWorkflowType = () => {
      return {
        key: 'Workflow Type',
        value: workflowType
      }
    }

    const kvPairs = [
      getName(workflow),
      getDescription(workflow),
      ...(getService() || []),
      getLoadBalancer(),
      workflowType !== Utils.workflowTypes.BUILD ? getEnvironment() : '',
      getWorkflowType()
    ]

    const overviewCardProps = {
      header: {
        title: 'Workflow Overview',

        actionIconFunctions: {
          edit: this.onEditWorkflow.bind(this, workflow),
          clone: data => {
            this.setState({ cloneModalActive: true, cloneData: workflow })
          }
        }
      },
      kvPairs
    }

    return <OverviewCard {...overviewCardProps} />
  }

  hideWorkflowModal = () => {
    this.fetchData(true)
    this.setState({ cloneModalActive: false })
  }

  onNewWorkflowSubmit = data => {
    const updateData = {
      name: data.name,
      description: data.description,
      uuid: data.uuid,
      envId: data.envId,
      serviceId: data.serviceId,
      infraMappingId: data.infraMappingId
    }
    // this change should be for all workflows
    if (data.templateExpressions) {
      updateData.templateExpressions = data.templateExpressions
    }
    updateData.templatized = data.templatized

    // update 'basic information' only ('basic')
    apis.service
      .replace(apis.getWorkflowEndpoint(this.props.appId, data.uuid, 'basic'), {
        body: JSON.stringify(updateData)
      })
      .then(() => {
        this.fetchData()
        this.setState({ showWorkflowModal: false, workflowModalData: {} })
      })
      .catch(error => {
        // this.fetchData()
        throw error
      })
  }

  getAppServices = () => {
    const app = Utils.findByUuid(this.props.dataStore.apps, this.appIdFromUrl)
    return (app && app.services) || []
  }

  render () {
    const appServices = this.getAppServices()
    this.app = Utils.findByUuid(this.props.dataStore.apps, this.appIdFromUrl)
    const environments = this.app.environments || []
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || []

    const computeProviders = Utils.getJsonValue(this, 'state.computeProviders.resource.response') || []
    const serviceTemplates = Utils.getJsonValue(this, 'state.environmentdetails.resource.serviceTemplates') || []
    const objComputeProviders = {}
    computeProviders.map(computeProvider => {
      objComputeProviders[computeProvider.uuid] = computeProvider
    })
    const service = {}
    let computeProvider = {}

    if (this.state.phase) {
      // if (appServices.length > 0) {
      //   service = appServices.find(obj => obj.uuid === this.state.phase.serviceId)
      // }
      if (computeProviders.length > 0) {
        computeProvider = computeProviders.find(obj => obj.uuid === this.state.phase.computeProviderId)
      }
    }

    const resultObj = this.getServiceName(workflow, computeProviders, appServices)
    const catalogDepTypes = Utils.getJsonValue(this, 'state.catalogs.DEPLOYMENT_TYPE') || []
    const userVariables = Utils.getJsonValue(workflow, 'orchestrationWorkflow.userVariables') || []

    return (
      <section className={css.main}>
        <section className="content">
          {workflow.uuid && this.renderOverviewCard({ resultObj })}
          <div className="row wings-card-row" data-name={service.name}>
            <div className="col-md-12 wings-card-col">
              {this.renderNameDetails(resultObj, workflow.templatized)}
              {this.renderPhaseSteps(resultObj.service)}
            </div>
          </div>
        </section>
        <TextInputModal
          visible={this.state.waitInput}
          title="Wait before execution (seconds)"
          placeholder=""
          value={this.state.selectedPhaseStep ? this.state.selectedPhaseStep.waitInterval : ''}
          onConfirm={valueStr => this.updateWaitInterval(valueStr)}
          onClose={() => this.setState({ waitInput: false })}
          templateWorkflow={workflow.templatized}
        />

        <StencilModal
          {...this.props}
          computeProvider={computeProvider}
          envId={this.envId || ''}
          enableExpressionBuilder={true}
          appId={this.appIdFromUrl}
          serviceId={Utils.getJsonValue(this, 'state.phase.serviceId') || ''}
          entityId={this.idFromUrl}
          entityType="WORKFLOW"
          context="WORKFLOW-DETAILS"
          stateType={Utils.getJsonValue(this, 'state.stencilModalData.stencilData.type') || ''}
          data={this.state.stencilModalData}
          stencils={this.props.dataStore.orchestrationsStencils.toJS()}
          custom={{
            loadBalancerId: this.state.loadBalancerName ? this.state.loadBalancerName : this.state.loadBalancerId,
            infraMappingId: this.state.infraMappingId
          }}
          service={service}
          show={this.state.stencilModalShow}
          onHide={Utils.hideModal.bind(this, 'stencilModalShow')}
          onSubmit={this.onStencilModalSubmit}
          parentFetchData={this.fetchData}
          templateWorkflow={workflow.templatized}
          isUsingAutoScalingGroup={this.isUsingAutoScalingGroup}
        />
        <DeploymentPhaseNodesModal
          show={this.state.nodeModalShow}
          onHide={Utils.hideModal.bind(this, 'nodeModalShow')}
          onSubmit={this.onNodeModalSubmit}
          templateWorkflow={workflow.templatized}
        />
        <DeploymentPhaseModal
          userVariables={userVariables}
          data={this.state.phase}
          show={this.state.showDPModal}
          onHide={Utils.hideModal.bind(this, 'showDPModal')}
          onSubmit={this.onDPSubmit}
          services={appServices}
          objComputeProviders={objComputeProviders}
          serviceTemplates={serviceTemplates}
          envId={this.envId}
          fetchData={this.fetchData}
          catalogDepTypes={catalogDepTypes}
          catalogs={this.state.catalogs}
          templateWorkflow={workflow.templatized}
        />
        <FailureStrategyModal
          isCustomModal={true}
          show={this.state.showFlrStrModal}
          onHide={() => {
            this.setState({ showFlrStrModal: false })
            this.fetchData()
          }}
          data={{
            failureStrategies: this.state.selectedPhaseStep ? this.state.selectedPhaseStep.failureStrategies : [],
            selectedPhaseStep: this.state.selectedPhaseStep
          }}
          onChange={this.updateStepFailureStrategies}
          onSubmit={this.updateStepFailureStrategies}
        />

        {this.state.cloneModalActive &&
          <CloneWorkflowModal
            onHide={_ => this.hideWorkflowModal()}
            cloneData={this.state.cloneData}
            dataStore={this.props.dataStore}
            type="Workflow"
          />}
        <NewWorkflowModal
          formOnly={false}
          appId={this.props.appId}
          data={this.state.workflowModalData}
          environments={environments}
          services={appServices}
          show={this.state.showWorkflowModal}
          onHide={Utils.hideModal.bind(this, 'showWorkflowModal')}
          onSubmit={this.onNewWorkflowSubmit}
          catalogs={this.state.catalogs}
        />
      </section>
    )
  }
}

const WrappedPage = createPageContainer()(DeploymentPhaseDetail)
export default Utils.createTransmitContainer(WrappedPage, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/DeploymentPhaseDetail.js