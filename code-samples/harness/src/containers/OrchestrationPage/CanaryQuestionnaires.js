import React from 'react'
import {
  OverviewCard,
  createPageContainer,
  PageBreadCrumbs,
  StencilConfigs,
  StencilSelect,
  Utils,
  AppStorage
} from 'components'
import { Dropdown } from 'react-bootstrap'
import StencilModal from '../WorkflowEditor/StencilModal'
import apis from 'apis/apis'
import css from './CanaryQuestionnaires.css'
import DeploymentPhases from './DeploymentPhases'
import NotificationStrategyPanel from './views/NotificationStrategyPanel'
import NotificationStrategyModal from './NotificationStrategyModal'
import FailureStrategyPanel from './views/FailureStrategyPanel'
import FailureStrategyModal from './FailureStrategyModal'
import WorkflowVariablesModal from './WorkflowVariablesModal'
import WorkflowVariablesPanel from './views/WorkflowVariablesPanel'
import { updateWorkflowVariables } from '../../services/WorkflowVariablesService'
import NewWorkflowModal from '../OrchestrationPage/NewWorkflowModal'
import CloneWorkflowModal from '../OrchestrationPage/CloneWorkflowModal'
import { observer } from 'mobx-react'

const fragmentArr = [{ data: [] }, { stencils: [] }, { notificationGroups: [] }]

@observer
class CanaryQuestionnaires extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  state = {
    data: {},

    stencilModalShow: false,
    stencilModalData: null,

    preDep: null,
    postDep: null,

    notificationRules: [],
    showNotifStrategyModal: false,
    notifStrategyModalEditingItem: null,

    failureStrategies: [],
    showFailureStrategyModal: false,
    failureStrategyModalEditingItem: null,

    shouldShowWorkflowVariableModal: false,
    workflowVariables: []
  }
  title = this.renderBreadCrumbs()
  pageName = 'Setup Workflow Details'
  appIdFromUrl = this.props.urlParams.appId // Utils.appIdFromUrl()
  idFromUrl = this.props.urlParams.workflowId // Utils.getIdFromUrl()
  accountIdFromUrl = this.props.urlParams.accountId // Utils.accountIdFromUrl()
  editingSection = ''

  componentWillMount () {
    // this.props.onPageWillMount(<h3>{this.renderBreadCrumbs()}</h3>, 'Setup Workflow Details')
    // this.fetchData()
    Utils.loadCatalogsToState(this)
    Utils.loadChildContextToState(this, 'apps')
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

  renderOverviewCard = () => {
    const workflow = this.state.data.resource

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

    const getWorkflowType = () => {
      const catalogs = Utils.getJsonValue(this, 'state.catalogs') || {}

      const workflowType = Utils.getJsonValue(workflow, 'orchestrationWorkflow.orchestrationWorkflowType') || 'CANARY'
      const workflowTypeText = Utils.getCatalogDisplayText(catalogs, 'WORKFLOW_ORCHESTRATION_TYPE', workflowType)

      return {
        key: 'Workflow Type',
        value: workflowTypeText
      }
    }

    const getServices = () => ({
      key: 'Services',
      value: Utils.getServiceNames(workflow)
    })

    const getEnvironment = () => {
      const currentApp = Utils.findByUuid(this.props.dataStore.apps, this.appIdFromUrl)
      const environments = currentApp.environments
      const env = currentApp ? environments.find(env => env.uuid === workflow.envId) : {}

      return {
        key: 'Environment',
        value: Utils.getEnvironmentName(workflow, env)
      }
    }

    const kvPairs = [getName(workflow), getDescription(), getWorkflowType(), getServices(), getEnvironment()]

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

  onEditWorkflow = item => this.setState({ showWorkflowModal: true, workflowModalData: item })

  renderBreadCrumbs () {
    const { path, urlParams } = this.props
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    const accountId = AppStorage.get('acctId')
    const bData = [
      { label: 'Setup', link: `/account/${accountId}/setup` },
      { label: this.props.appName, link: path.toAppDetails(urlParams), dropdown: 'applications' },
      { label: 'Workflows', link: path.toSetupWorkflow(urlParams), dropdown: 'application-children' },
      { label: workflow.name }
    ]
    return <PageBreadCrumbs {...this.props} data={bData} />
  }

  fetchData = async () => {
    const queryParams = this.props.location.query
    fragmentArr[0].data = [apis.fetchWorkflowById, this.appIdFromUrl, this.idFromUrl, queryParams.version]
    fragmentArr[1].stencils = [apis.fetchOrchestrationStencils, this.appIdFromUrl, this.idFromUrl]
    fragmentArr[2].notificationGroups = [apis.fetchNotificationGroups, this.appIdFromUrl]

    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this, null, allData => {
        const workflowNotifRules =
          Utils.getJsonValue(allData, 'data.resource.orchestrationWorkflow.notificationRules') || []
        const workflowFailureStrategies =
          Utils.getJsonValue(allData, 'data.resource.orchestrationWorkflow.failureStrategies') || []
        const workflowVariables = Utils.getJsonValue(allData, 'data.resource.orchestrationWorkflow.userVariables') || []
        for (let i = 0; i < workflowFailureStrategies.length; i++) {
          workflowFailureStrategies[i].id = i
        }
        this.setState({
          notificationRules: workflowNotifRules,
          failureStrategies: workflowFailureStrategies,
          workflowVariables: workflowVariables
        })
        this.props.onPageWillMount(this.renderBreadCrumbs())
      })
    } else {
      this.setState(this.props)
    }
  }

  onDepStepAdded = (item, editingSection) => {
    this.editingSection = editingSection
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    const stencilData = stencils.find(s => s.name === item.data.name)
    if (stencilData.jsonSchema.properties) {
      const stencilModalData = { stencilData, nodeData: {} }
      this.setState({ stencilModalShow: true, stencilModalData })
    }
  }

  onStencilModalSubmit = (nodeId, formData) => {
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}

    let stepsData
    if (this.editingSection === 'PRE') {
      stepsData = workflow.orchestrationWorkflow['preDeploymentSteps']
    } else {
      stepsData = workflow.orchestrationWorkflow['postDeploymentSteps']
    }
    const stepProps = { ...formData }
    delete stepProps['stencilData']

    if (!nodeId) {
      const newNodeId = Utils.generateNodeId() // NEW step
      let stepName = Utils.generateStepName(formData.stencilData, formData, stepsData.steps)
      if (stepProps.newName) {
        stepName = stepProps.newName
        delete stepProps['newName']
      }
      stepsData.steps.push({
        id: newNodeId,
        name: stepName,
        x: 40 + 150 * stepsData.steps.length,
        y: 40,
        type: formData.stencilData.type,
        properties: { ...stepProps }
      })
    } else {
      for (const step of stepsData.steps) {
        // UPDATE step properties
        if (step.id === nodeId) {
          if (stepProps.newName) {
            step.name = stepProps.newName
            delete stepProps['newName']
          }
          // step.name = Utils.generateStepName(formData.stencilData, formData)
          step.properties = { ...stepProps }
          break
        }
      }
    }
    if (this.editingSection === 'PRE') {
      apis.updateWorkflowPreDeploy(this.appIdFromUrl, this.idFromUrl, stepsData)
    } else {
      apis.updateWorkflowPostDeploy(this.appIdFromUrl, this.idFromUrl, stepsData)
    }
    this.setState({ data: { resource: workflow } })

    Utils.hideModal.bind(this, 'stencilModalShow')()
  }

  onDeleteClick = (node, removeFrom) => {
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    if (removeFrom === 'PRE') {
      const stepsData = workflow.orchestrationWorkflow['preDeploymentSteps']
      stepsData.steps = Utils.deleteArrayItemById(stepsData.steps, node)
      apis.updateWorkflowPreDeploy(this.appIdFromUrl, this.idFromUrl, stepsData)
    } else {
      const stepsData = workflow.orchestrationWorkflow['postDeploymentSteps']
      stepsData.steps = Utils.deleteArrayItemById(stepsData.steps, node)
      apis.updateWorkflowPostDeploy(this.appIdFromUrl, this.idFromUrl, stepsData)
    }
    this.setState({ data: { resource: workflow } })
  }

  onEditClick = (ev, node, editingSection) => {
    if (ev.nativeEvent.target.className.indexOf('__step') < 0) {
      return
    }
    this.editingSection = editingSection
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    const stencilData = stencils.find(s => s.type === node.type)
    const stencilModalData = { stencilData, nodeData: node, ...node.properties }
    this.setState({ stencilModalShow: true, stencilModalData })
  }

  onNotifEdit = item => {
    this.setState({
      showNotifStrategyModal: true,
      notifStrategyModalEditingItem: item
    })
  }

  onFailureEdit = item => {
    this.setState({
      showFailureStrategyModal: true,
      failureStrategyModalEditingItem: item
    })
  }

  updateWorkflowNotifications = notificationRulesArr => {
    apis.updateWorkflowNotifications(this.appIdFromUrl, this.idFromUrl, notificationRulesArr)
    this.setState({
      showNotifStrategyModal: false,
      notifStrategyModalEditingItem: null
    })
  }

  updateWorkflowFailureStrategies = failureStrategiesArr => {
    const arr = Utils.clone(failureStrategiesArr).map(item => {
      delete item['id']
      return item
    })
    apis.updateWorkflowFailureStrategies(this.appIdFromUrl, this.idFromUrl, arr)
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

  resetOrigin = nodesArr => {
    for (const node of nodesArr) {
      node.origin = false
    }
    nodesArr[0].origin = true
  }

  onMoveUp = (node, idx, editingSection) => {
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    let stepsData
    if (editingSection === 'PRE') {
      stepsData = workflow.orchestrationWorkflow['preDeploymentSteps']
      if (idx > 0) {
        Utils.moveArrayItem(stepsData.steps, idx, idx - 1)
        this.resetOrigin(stepsData.steps)
        apis.updateWorkflowPreDeploy(this.appIdFromUrl, this.idFromUrl, stepsData)
      }
    } else {
      stepsData = workflow.orchestrationWorkflow['postDeploymentSteps']
      if (idx > 0) {
        Utils.moveArrayItem(stepsData.steps, idx, idx - 1)
        this.resetOrigin(stepsData.steps)
        apis.updateWorkflowPostDeploy(this.appIdFromUrl, this.idFromUrl, stepsData)
      }
    }
    this.setState({ data: { resource: workflow } })
  }

  onMoveDown = (node, idx, editingSection) => {
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    let stepsData
    if (editingSection === 'PRE') {
      stepsData = workflow.orchestrationWorkflow['preDeploymentSteps']
      if (idx < stepsData.steps.length - 1) {
        Utils.moveArrayItem(stepsData.steps, idx, idx + 1)
        this.resetOrigin(stepsData.steps)
        apis.updateWorkflowPreDeploy(this.appIdFromUrl, this.idFromUrl, stepsData)
      }
    } else {
      stepsData = workflow.orchestrationWorkflow['postDeploymentSteps']
      if (idx < stepsData.steps.length - 1) {
        Utils.moveArrayItem(stepsData.steps, idx, idx + 1)
        this.resetOrigin(stepsData.steps)
        apis.updateWorkflowPostDeploy(this.appIdFromUrl, this.idFromUrl, stepsData)
      }
    }
    this.setState({ data: { resource: workflow } })
  }

  updateParallelStatus = (newValue, editingSection) => {
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    let stepsData
    if (editingSection === 'PRE') {
      stepsData = workflow.orchestrationWorkflow['preDeploymentSteps']
      stepsData.stepsInParallel = newValue
      apis.updateWorkflowPreDeploy(this.appIdFromUrl, this.idFromUrl, stepsData)
    } else {
      stepsData = workflow.orchestrationWorkflow['postDeploymentSteps']
      stepsData.stepsInParallel = newValue
      apis.updateWorkflowPostDeploy(this.appIdFromUrl, this.idFromUrl, stepsData)
    }
    this.setState({ data: { resource: workflow } })
  }

  renderMenu (editingSection) {
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    if (!workflow || !workflow.orchestrationWorkflow) {
      return null
    }

    const stepsData =
      editingSection === 'PRE'
        ? workflow.orchestrationWorkflow['preDeploymentSteps']
        : workflow.orchestrationWorkflow['postDeploymentSteps']
    if (!stepsData) {
      return null
    }
    return (
      <Dropdown id="_deploymentCardOverviewMenu" className="wings-threedots" role="button">
        <span className="light __stepMenu" bsRole="toggle">
          <i className="fa fa-ellipsis-v" />
        </span>
        <Dropdown.Menu bsRole="menu">
          <div className="checkbox __rightMenu">
            <label>
              <input
                type="checkbox"
                name="parallel"
                checked={stepsData.stepsInParallel}
                onChange={e => this.updateParallelStatus(e.nativeEvent.target.checked, editingSection)}
              />
              Execute steps in Parallel
            </label>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  editorLinkClick = () => {
    Utils.redirect({
      appId: this.appIdFromUrl,
      workflowId: this.idFromUrl,
      page: 'editor'
    })
  }

  getAppServices = () => {
    const app = Utils.findByUuid(this.props.dataStore.apps, this.appIdFromUrl)
    return (app && app.services) || []
  }

  render () {
    const catalogs = Utils.getJsonValue(this, 'state.catalogs') || {}
    const notificationGroups = Utils.getJsonValue(this, 'state.notificationGroups.resource.response') || {}
    const workflow = Utils.getJsonValue(this, 'state.data.resource') || {}
    const preDepNodes = Utils.getJsonValue(workflow, 'orchestrationWorkflow.preDeploymentSteps.steps') || []
    const postDepNodes = Utils.getJsonValue(workflow, 'orchestrationWorkflow.postDeploymentSteps.steps') || []
    const stencils = Utils.getJsonValue(this, 'state.stencils.resource') || []
    const commonStencils = stencils.filter(stc => stc.stencilCategory.name === 'OTHERS')

    // const currentApp = (this.state.apps ? this.state.apps.find(app => app.uuid === Utils.appIdFromUrl()) : null)
    const currentApp = Utils.findByUuid(this.props.dataStore.apps, this.appIdFromUrl)
    const environments = currentApp.environments
    const userVariables = Utils.getJsonValue(workflow, 'orchestrationWorkflow.userVariables') || []
    const appServices = this.getAppServices()

    return (
      <section className={css.main}>
        {workflow.uuid && this.renderOverviewCard()}
        {/* false && (
          <section className="content-header">
            <div className="__viewsLink">
              <span className="__link" onClick={this.editorLinkClick}>
                Preview
              </span>
            </div>
          </section>
        )*/}
        <div className=" wings-card">
          <div className="box-header">
            <div className="wings-card-header">
              <div>{workflow.name}</div>
            </div>
          </div>
          <div className="box-body wings-card-body">
            <div className="col-md-6 wings-card-col">
              <div className="__section">
                <h4>
                  Pre-deployment Steps
                  {this.renderMenu('PRE')}
                </h4>

                {preDepNodes.map((node, idx) => {
                  let arrowEl = null
                  if (idx < preDepNodes.length - 1) {
                    arrowEl = <img className="__arrowDown" src="/img/workflow/arrow-down.png" />
                  }
                  return (
                    <div key={'PRE_' + idx} className="__step" onClick={ev => this.onEditClick(ev, node, 'PRE')}>
                      <span className="badge">
                        <i className={StencilConfigs.getNodeIconClass(node.type, node.name)} />
                      </span>
                      {arrowEl}
                      {node.name}
                      {idx > 0 && (
                        <span className="__itemActionIcon">
                          <i className="icons8-sort-up icon" onClick={() => this.onMoveUp(node, idx, 'PRE')} />
                        </span>
                      )}
                      {idx < preDepNodes.length - 1 && (
                        <span className="__itemActionIcon">
                          <i className="icons8-sort-down icon" onClick={() => this.onMoveDown(node, idx, 'PRE')} />
                        </span>
                      )}
                      <span className="__itemActionIcon" onClick={() => this.onDeleteClick(node, 'PRE')}>
                        <i className="icons8-delete" />
                      </span>
                    </div>
                  )
                })}
                <div className="__step">
                  <StencilSelect
                    stencils={commonStencils}
                    placeholder="Add Step"
                    onChange={item => this.onDepStepAdded(item, 'PRE')}
                  />
                </div>
              </div>
              <div className="__section">
                <h4>Deployment Phases</h4>
                <DeploymentPhases
                  {...this.props}
                  catalogs={catalogs}
                  fetchData={this.fetchData}
                  templateWorkflow={workflow.templatized}
                  userVariables={userVariables}
                />
              </div>

              <div className="__section">
                <h4>
                  Post-deployment Steps
                  {this.renderMenu('POST')}
                </h4>

                {postDepNodes.map((node, idx) => {
                  let arrowEl = null
                  if (idx < postDepNodes.length - 1) {
                    arrowEl = <img className="__arrowDown" src="/img/workflow/arrow-down.png" />
                  }
                  return (
                    <div key={'POST_' + idx} className="__step" onClick={ev => this.onEditClick(ev, node, 'POST')}>
                      <span className="badge">
                        <i className={StencilConfigs.getNodeIconClass(node.type, node.name)} />
                      </span>
                      {arrowEl}
                      {node.name}
                      {idx > 0 && (
                        <span className="__itemActionIcon">
                          <i className="icons8-sort-up icon" onClick={() => this.onMoveUp(node, idx, 'POST')} />
                        </span>
                      )}
                      {idx < postDepNodes.length - 1 && (
                        <span className="__itemActionIcon">
                          <i className="icons8-sort-down icon" onClick={() => this.onMoveDown(node, idx, 'POST')} />
                        </span>
                      )}
                      <span className="__itemActionIcon" onClick={() => this.onDeleteClick(node, 'POST')}>
                        <i className="icons8-delete" />
                      </span>
                    </div>
                  )
                })}
                <div className="__step">
                  <StencilSelect
                    stencils={commonStencils}
                    placeholder="Add Step"
                    onChange={item => this.onDepStepAdded(item, 'POST')}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6 wings-card-col __settingCol">
              <NotificationStrategyPanel
                showSummary={true}
                loadingStatus={this.state.loadingStatus}
                dataStore={this.props.dataStore}
                notificationRules={this.state.notificationRules}
                notificationGroups={notificationGroups}
                onEdit={this.onNotifEdit}
                onChange={this.updateWorkflowNotifications}
                onManage={() =>
                  this.setState({
                    showNotifStrategyModal: true,
                    notifStrategyModalEditingItem: null
                  })
                }
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
              />
              <FailureStrategyPanel
                showSummary={true}
                loadingStatus={this.state.loadingStatus}
                failureStrategies={this.state.failureStrategies}
                notificationGroups={notificationGroups}
                onEdit={this.onFailureEdit}
                onChange={this.updateWorkflowFailureStrategies}
                onManage={() =>
                  this.setState({
                    showFailureStrategyModal: true,
                    failureStrategyModalEditingItem: null
                  })
                }
              />
              <FailureStrategyModal
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
              />

              <WorkflowVariablesPanel
                showSummary={true}
                loadingStatus={this.state.loadingStatus}
                variables={this.state.workflowVariables}
                onManage={() =>
                  this.setState({
                    shouldShowWorkflowVariableModal: true
                  })
                }
              />
              <WorkflowVariablesModal
                show={this.state.shouldShowWorkflowVariableModal}
                onHide={() => {
                  this.setState({
                    shouldShowWorkflowVariableModal: false
                  })
                  this.fetchData()
                }}
                data={{ variables: this.state.workflowVariables }}
                appId={this.appIdFromUrl}
                // serviceId={} // not sending service id for canary workflow
                workflowId={this.idFromUrl}
                onSave={this.saveWorkflowVariables}
              />
            </div>
          </div>
        </div>

        <StencilModal
          {...this.props}
          data={this.state.stencilModalData}
          stencils={this.props.stencils}
          show={this.state.stencilModalShow}
          onHide={Utils.hideModal.bind(this, 'stencilModalShow')}
          onSubmit={this.onStencilModalSubmit}
          templateWorkflow={workflow.templatized}
          enableExpressionBuilder={true}
          appId={this.appIdFromUrl}
          // serviceId={} // not sending service id for canary workflow
          entityId={this.idFromUrl}
          entityType="WORKFLOW"
          context="WORKFLOW-DETAILS-CANARY"
          stateType={Utils.getJsonValue(this, 'state.stencilModalData.stencilData.type') || ''}
        />
        {this.state.cloneModalActive && (
          <CloneWorkflowModal
            onHide={_ => this.hideWorkflowModal()}
            cloneData={this.state.cloneData}
            dataStore={this.props.dataStore}
            type="Workflow"
          />
        )}
        <NewWorkflowModal
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

const WrappedPage = createPageContainer()(CanaryQuestionnaires)
export default Utils.createTransmitContainer(WrappedPage, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/CanaryQuestionnaires.js