import React from 'react'
import { observer } from 'mobx-react'
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Utils } from 'components'
import { Tabs, Tab } from 'react-bootstrap'
import ServicePage from '../ServicePage/ServicePage'
import EnvironmentPage from '../EnvironmentPage/EnvironmentPage'
import WorkflowListPage from '../OrchestrationPage/WorkflowListPage'
// import ArtifactStreamPage from '../ArtifactStreamPage/ArtifactStreamPage'
import TriggerPage from '../TriggerPage/TriggerPage'
import PipelinePage from '../PipelinePage/PipelinePage'
import ServiceDetailPage from '../ServiceDetailPage/ServiceDetailPage.js'
import EnvironmentDetailPage from '../EnvironmentDetailPage/EnvironmentDetailPage.js'
import CanaryQuestionnaires from '../OrchestrationPage/CanaryQuestionnaires.js'
import DeploymentPhaseDetail from '../OrchestrationPage/DeploymentPhaseDetail.js'
import css from './ApplicationDetail.css'

const TABKEYS = {
  SERVICES: 'SERVICES',
  ENVIRONMENTS: 'ENVIRONMENTS',
  WORKFLOWS: 'WORKFLOWS',
  PIPELINES: 'PIPELINES',
  TRIGGERS: 'TRIGGERS',
  WORKFLOW_DETAILS: 'WORKFLOW_DETAILS',
  WORKFLOW_PHASE_DETAILS: 'WORKFLOW_PHASE_DETAILS',
  PHASE_DETAIL: 'PHASE_DETAIL'
}

const routePaths = {
  SETUP_SERVICES: 'services',
  SETUP_ENVIRONMENTS: 'environments',
  SETUP_WORKFLOWS: 'workflows',
  SETUP_PIPELINES: 'pipelines',
  SETUP_TRIGGERS: 'triggers',
  WORKFLOW_DETAILS: '/details',
  WORKFLOW_PHASE_DETAILS: '/details',
  PHASE_DETAIL: '/deploy-phase'
}
const detailTypes = {
  SERVICES: 'SERVICE-DETAIL',
  ENVIRONMENTS: 'ENV-DETAIL',
  WORKFLOW_DETAILS: 'WORKFLOW_DETAILS',
  PHASE_DETAIL: 'DEPLOY-PHASE'
}
@observer
export default class ApplicationDetail extends React.Component {
  state = { activeKey: 0, selectedId: 0, detailType: null }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentDidMount () {
    this.setUrlParams()
    this.setTabs()
  }

  setTabs = queryObj => {
    const url = window.location.href
    let activeKey
    const { subPage } = this.props.urlParams

    if (url.indexOf(routePaths.SETUP_SERVICES) > -1) {
      activeKey = TABKEYS.SERVICES
      this.setState({ activeKey })
      this.setDetailKey(activeKey, subPage)
      this.getServiceName()
    } else if (url.indexOf(routePaths.SETUP_ENVIRONMENTS) > -1) {
      activeKey = TABKEYS.ENVIRONMENTS
      this.setState({ activeKey })
      this.setDetailKey(activeKey, subPage)
      this.getEnvironmentName()
    } else if (url.indexOf(routePaths.SETUP_TRIGGERS) > -1) {
      this.setState({ activeKey: TABKEYS.TRIGGERS })
    } else if (url.indexOf(routePaths.SETUP_PIPELINES) > -1) {
      this.setState({ activeKey: TABKEYS.PIPELINES })
    } else if (url.includes(routePaths.SETUP_WORKFLOWS)) {
      // Setup Workflows & Details
      this.selectedId = this.props.urlParams.workflowId
      if (url.includes(routePaths.WORKFLOW_DETAILS)) {
        // Multi-Service Details
        this.setState({ detailType: detailTypes[TABKEYS.WORKFLOW_DETAILS], activeKey: TABKEYS.WORKFLOWS })
      }
      if (url.includes(routePaths.WORKFLOW_PHASE_DETAILS)) {
        // Basic Details
        this.setState({ detailType: detailTypes[TABKEYS.WORKFLOW_PHASE_DETAILS], activeKey: TABKEYS.WORKFLOWS })
      } else {
        this.setState({ activeKey: TABKEYS.WORKFLOWS }) // Setup Workflow List
      }
    }

    /* For Workflows- URLS NOT MODIFIED YET  */
    if (url.indexOf(routePaths['SETUP_WORKFLOWS']) > -1) {
      // this.setState({ activeKey: TABKEYS.WORKFLOWS })
    } else if (url.includes(TABKEYS.SETUP_WORKFLOWS) && url.includes(routePaths['WORKFLOW_DETAILS'])) {
      // this.selectedId = this.props.urlParams.workflowId
      // this.setState({ detailType: detailTypes[ TABKEYS.WORKFLOW_DETAILS ], activeKey: TABKEYS.WORKFLOWS })
    } else if (url.indexOf(routePaths['PHASE_DETAIL']) > -1) {
      // this.selectedId = this.props.urlParams.workflowId
      // this.setState({ detailType: detailTypes[ TABKEYS.PHASE_DETAIL ], activeKey: TABKEYS.WORKFLOWS })
    }
  }

  setDetailKey = (key, subPage) => {
    if (subPage) {
      this.selectedId = this.props.urlParams.id
      this.setState({ activeKey: key, detailType: detailTypes[key] })
    }
  }

  setUrlParams = () => {
    const { accountId, appId } = this.props.urlParams
    this.accountId = accountId
    this.appId = appId
    this.filterAppById()
  }

  onTabSelect = key => {
    this.setUrlParams()
    this.setState({ activeKey: key })

    const accountId = this.accountId
    const appId = this.appId
    const path = this.props.path
    switch (key) {
      case TABKEYS.SERVICES:
        window.location = `#${path.toSetupServices({ accountId, appId })}` // TODO: use routePaths
        break
      case TABKEYS.ENVIRONMENTS:
        window.location = `#${path.toSetupEnvironments({ accountId, appId })}`
        break
      case TABKEYS.WORKFLOWS:
        window.location = `#${path.toSetupWorkflow({ accountId, appId })}`
        break
      case TABKEYS.PIPELINES:
        window.location = `#${path.toSetupPipeLines({ accountId, appId })}`
        break
      case TABKEYS.TRIGGERS:
        window.location = `#${path.toSetupTriggers({ accountId, appId })}`
        break
    }
  }

  filterAppById = () => {
    const app = this.props.dataStore.apps.find(app => app.uuid === this.appId)
    if (app) {
      this.app = app
    }
  }

  getServiceName = () => {
    if (this.app) {
      const service = this.app.services.find(service => service.uuid === this.selectedId)
      if (service) {
        this.entityName = service.name
      }
    }
  }

  getEnvironmentName = () => {
    if (this.app) {
      const environment = this.app.environments.find(env => env.uuid === this.selectedId)
      if (environment) {
        this.entityName = environment.name
      }
    }
  }

  render () {
    const accountId = Utils.accountIdFromUrl()
    const { appId, serviceId, envId } = this.props.urlParams
    const app = Utils.findByUuid(this.props.dataStore.apps, appId)
    const appName = app ? app.name : ''

    let tabContent = null
    switch (this.state.activeKey) {
      case TABKEYS.SERVICES:
        tabContent = (
          <ServicePage
            {...this.props}
            appId={this.appId}
            dataStore={this.props.dataStore}
            activeKey={this.state.activeKey}
            accountId={accountId}
            appName={appName}
          />
        )
        break
      case TABKEYS.ENVIRONMENTS:
        tabContent = (
          <EnvironmentPage
            {...this.props}
            appId={this.appId}
            dataStore={this.props.dataStore}
            activeKey={this.state.activeKey}
            accountId={accountId}
            appName={appName}
          />
        )
        break
      case TABKEYS.WORKFLOWS:
        tabContent = (
          <WorkflowListPage
            {...this.props}
            appId={appId}
            activeKey={this.state.activeKey}
            accountId={accountId}
            appName={appName}
          />
        )
        break
      case TABKEYS.PIPELINES:
        tabContent = (
          <PipelinePage
            {...this.props}
            appId={appId}
            activeKey={this.state.activeKey}
            accountId={accountId}
            appName={appName}
          />
        )
        break
      case TABKEYS.TRIGGERS:
        // tabContent = (
        //   <ArtifactStreamPage
        //     {...this.props}
        //     appId={appId}
        //     activeKey={this.state.activepagKey}
        //     accountId={accountId}
        //     dataStore={this.props.dataStore}
        //     appName={appName}
        //   />
        // )
        tabContent = (
          <TriggerPage
            {...this.props}
            appId={appId}
            activeKey={this.state.activepagKey}
            accountId={accountId}
            dataStore={this.props.dataStore}
            appName={appName}
          />
        )
        break
    }

    // DETAILS TABS:
    if (this.props.path.isSetupServiceDetails()) {
      const service = Utils.findByUuid(app.services, serviceId)
      const serviceName = service ? service.name : ''
      tabContent = (
        <ServiceDetailPage
          {...this.props}
          appId={appId}
          serviceId={this.state.selectedId}
          appName={appName}
          serviceName={serviceName}
        />
      )
    } else if (this.props.path.isEnvironmentsDetails()) {
      const env = Utils.findByUuid(app.environments, envId)
      const envName = env ? env.name : ''
      tabContent = (
        <EnvironmentDetailPage
          {...this.props}
          appId={appId}
          envId={this.state.selectedId}
          appName={appName}
          environmentName={envName}
        />
      )
    } else if (this.props.path.isSetupWorkflowDetails()) {
      tabContent = (
        <CanaryQuestionnaires {...this.props} appId={appId} workflowId={this.state.selectedId} appName={appName} />
      )
    } else if (this.props.path.isSetupWorkflowPhaseDetails()) {
      tabContent = (
        <DeploymentPhaseDetail {...this.props} appId={appId} workflowId={this.state.selectedId} appName={appName} />
      )
    }

    return (
      <section className={css.main}>
        {/* DEPRECATED --- HIDDEN SECTION --- REMOVE THIS - make sure UI Tests also work. */}
        <div className="hidden">
          <ui-tabs>
            <Tabs activeKey={this.state.activeKey} onSelect={this.onTabSelect} id="AppDetailTabs" bsStyle="pills">
              <Tab eventKey={TABKEYS.SERVICES} title="Services" className={css.tab} />
              <Tab eventKey={TABKEYS.ENVIRONMENTS} title="Environments" className={css.tab} />
              <Tab eventKey={TABKEYS.WORKFLOWS} title="Workflows" className={css.tab} />
              <Tab eventKey={TABKEYS.PIPELINES} title="Pipelines" className={css.tab} />
              <Tab eventKey={TABKEYS.TRIGGERS} title="Triggers" className={css.tab} />
            </Tabs>
          </ui-tabs>
        </div>

        <div className="tab-content">{tabContent}</div>
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ApplicationDetail/ApplicationDetail.js