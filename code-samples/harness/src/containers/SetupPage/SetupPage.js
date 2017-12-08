import React from 'react'
import { observer } from 'mobx-react'
import { PageBreadCrumbs, Utils, createPageContainer } from 'components'
import { TourStage, TourSteps, ServiceTourSteps } from 'utils'
import apis from 'apis/apis'
import css from './SetupPage.css'
import SetupCard from './SetupCard'
import ApplicationDefaultsModal from './ApplicationDefaultsModal'
import ABTest from '../../utils/ABTest'

const fragmentArr = [{ pipelines: [] }, { artifactStream: [] }, { workflows: [] }]

@observer
class SetupPage extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()

  state = {
    environments: {},
    appContainers: {},
    pipelines: {},
    showMore: true
  }

  title = this.renderBreadCrumbs()
  pageName = 'Application Setup'
  appIdFromUrl = this.props.urlParams.appId // Utils.appIdFromUrl()

  componentWillMount () {
    Utils.loadChildContextToState(this, 'app')
    this.fetchData()
    this.props.onPageWillMount(<h3>Setup</h3>, 'Setup')
  }

  renderBreadCrumbs () {
    const app = Utils.findByUuid(this.props.dataStore.apps, this.props.urlParams.appId)

    const path = this.props.path
    const urlParams = this.props.urlParams
    const bData = [
      { label: 'Setup', link: path.toSetup(urlParams) },
      { label: app.name, link: path.toAppDetails(urlParams), dropdown: 'applications' }
    ]
    return <PageBreadCrumbs {...this.props} data={bData} />
  }

  fetchData = () => {
    fragmentArr[0].pipelines = [apis.fetchPipelines, this.appIdFromUrl]
    fragmentArr[1].artifactStream = [apis.fetchTriggers, this.appIdFromUrl]
    fragmentArr[2].workflows = [apis.fetchWorkflows, this.appIdFromUrl]
    if (__CLIENT__ && !this.props.environments) {
      Utils.fetchFragmentsToState(fragmentArr, this)
    } else {
      this.setState(this.props)
    }
  }

  componentDidMount () {
    setTimeout(() => {
      if (this.props.isTourOn) {
        switch (this.props.tourStage) {
          case TourStage.SERVICE:
            const step2 = ServiceTourSteps.step2('.__setupServices a', 'bottom-left', this.props.renderEndTour, true)
            // this.props.setResume(false)
            this.props.onTourPause()
            this.props.addSteps(step2)
            break
          case TourStage.ENVIRONMENT:
            this.props.addSteps(TourSteps.SETUP_ENVIRONMENT)
            break
          case TourStage.ARTIFACT:
            this.props.addSteps(TourSteps.SETUP_ARTIFACT_STREAM)
            break
        }

        this.props.onTourStart(true)
      }
    }, 1000)
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  renderTriggers = artifactStream => {
    if (artifactStream.length > 0) {
      // const filteredObj = artifactStream.filter(ac => ac.streamActions.length > 0)
      // if (filteredObj) {
      //   const sourceNames = filteredObj.map(item => {
      //     return { name: item.sourceName }
      //   })
      //   return sourceNames
      // }
      const sourceNames = artifactStream.map(item => {
        return { name: item.name }
      })
      return sourceNames
    }
    return []
  }

  openApplicationDefaults = () => {
    this.setState({ showApplicationDefaultsModal: true })
  }

  getWorkflowLink = ({ workflow }) => {
    if (!workflow) {
      return ''
    }

    const { path, urlParams } = this.props
    if (Utils.getJsonValue(workflow, 'orchestrationWorkflow.orchestrationWorkflowType') === 'CANARY') {
      return path.toSetupWorkflowDetails({ ...urlParams, workflowId: workflow.uuid })
    } else if (Utils.getJsonValue(workflow, 'orchestrationWorkflow.orchestrationWorkflowType') === 'MULTI_SERVICE') {
      return path.toSetupWorkflowDetails({ ...urlParams, workflowId: workflow.uuid })
    } else {
      const phases = Utils.getJsonValue(workflow, 'orchestrationWorkflow.workflowPhases')
      const phaseId = phases && phases[0] && phases[0].uuid
      return path.toSetupWorkflowPhaseDetails({ ...urlParams, workflowId: workflow.uuid, phaseId: phaseId })
    }
  }

  render () {
    const { path, urlParams } = this.props
    const app = Utils.findApp(this)

    if (!app || !app.name) {
      return <div />
    }

    const pipelines = Utils.getJsonValue(this, 'state.pipelines.resource.response') || []
    const artifactStream = Utils.getJsonValue(this, 'state.artifactStream.resource.response') || []
    const workflows = Utils.getJsonValue(this, 'state.workflows.resource.response') || []
    const setupCardBaseProps = {
      router: this.props.router,
      urlParams: this.props.urlParams,
      path: this.props.path
    }

    const serviceProps = {
      items: app.services,
      icon: <i className="icons8-services" />,
      title: 'Services',
      dataName: 'Services',
      onCardClickPath: path.toSetupServices(urlParams),
      onItemClickPath: ({ id }) => path.toSetupServiceDetails({ ...urlParams, serviceId: id })
    }

    const workflowProps = {
      items: workflows,
      icon: <i className="icons8-services" />,
      title: 'Workflows',
      dataName: 'Workflows',
      onCardClickPath: path.toSetupWorkflow(urlParams),
      onItemClickPath: ({ item }) => this.getWorkflowLink({ workflow: item })
    }

    const triggerProps = {
      items: this.renderTriggers(artifactStream),
      icon: <i className="icons8-services" />,
      title: 'Triggers',
      dataName: 'Triggers',
      onCardClickPath: path.toSetupTriggers(urlParams),
      // Triggers does not have a card view, so redirect to the setup triggers page
      onItemClickPath: ({}) => path.toSetupTriggers({ ...urlParams })
    }

    const environmentProps = {
      items: app.environments,
      icon: <i className="icons8-services" />,
      title: 'Environments',
      dataName: 'Environments',
      onCardClickPath: path.toSetupEnvironments(urlParams),
      onItemClickPath: ({ id }) => path.toSetupEnvironmentDetails({ ...urlParams, envId: id })
    }

    const pipelineProps = {
      items: pipelines,
      icon: <i className="icons8-services" />,
      title: 'Pipelines',
      dataName: 'Pipelines',
      onCardClickPath: path.toSetupPipeLines(urlParams),
      onItemClickPath: ({ id }) => path.toSetupPipeLinesEdit({ ...urlParams, pipelineId: id })
    }

    return (
      <section className={css.main}>
        <div className="setup-page">
          <ui-card>
            <ui-card-header>
              <span>{app.name}</span>
              {ABTest.isApplicationDefaultsEnabled && (
                <button onClick={this.openApplicationDefaults}>Application Defaults</button>
              )}
            </ui-card-header>
            <ui-card-main>
              <left-box class="card-container">
                <SetupCard {...setupCardBaseProps} {...serviceProps} />
                <SetupCard {...setupCardBaseProps} {...workflowProps} />
                <SetupCard {...setupCardBaseProps} {...triggerProps} />
              </left-box>
              <right-box class="card-container">
                <SetupCard {...setupCardBaseProps} {...environmentProps} />
                {<SetupCard {...setupCardBaseProps} {...pipelineProps} />}
              </right-box>
            </ui-card-main>
          </ui-card>
        </div>
        {this.state.showApplicationDefaultsModal && (
          <ApplicationDefaultsModal
            onHide={_ => this.setState({ showApplicationDefaultsModal: false })}
            accountId={urlParams.accountId}
            appId={urlParams.appId}
          />
        )}
      </section>
    )
  }
}

export default createPageContainer()(SetupPage)



// WEBPACK FOOTER //
// ../src/containers/SetupPage/SetupPage.js