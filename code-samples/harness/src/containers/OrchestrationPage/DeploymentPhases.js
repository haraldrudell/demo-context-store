import React from 'react'
import { observer } from 'mobx-react'
import { TooltipOverlay, Utils, Confirm, CompUtils } from 'components'
import DeploymentPhaseModal from './DeploymentPhaseModal'
import apis from 'apis/apis'
import { WorkflowService } from 'services'

const fragmentArr = [{ data: [] }]

@observer
class DeploymentPhases extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()

  appIdFromUrl = this.props.urlParams.appId // Utils.appIdFromUrl()
  idFromUrl = this.props.urlParams.workflowId // Utils.workflowIdFromUrl()
  accountId = this.props.urlParams.accountId // AppStorage.get('acctId')
  envId = null

  state = {
    showDPModal: false,
    showInfraModal: false
  }

  componentWillMount () {
    this.fetchData()
    Utils.loadChildContextToState(this, 'app')
  }

  fetchData = () => {
    CompUtils.fetchComputeProviders(this)

    const queryParams = this.props.location.query
    fragmentArr[0].data = [apis.fetchWorkflowById, this.appIdFromUrl, this.idFromUrl, queryParams.version]

    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this, (k, d) => this.fetchMoreData(k, d))
    } else {
      this.setState(this.props)
    }
  }

  fetchMoreData = (key, data) => {
    if (key === 'data') {
      this.envId = data.resource.envId
      apis.fetchEnv(this.appIdFromUrl, this.envId).then(r => {
        this.setState({ environmentdetails: r })
      })
    }
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  onDeleteClick = uuid => {
    this.setState({ showConfirm: true, deletingId: uuid })
  }

  onDeleteConfirmed = () => {
    apis.service
      .destroy(apis.getWorkflowPhaseEndpoint(this.appIdFromUrl, this.idFromUrl, this.state.deletingId))
      .then(() => this.fetchData())
      .catch(error => {
        this.fetchData()
        throw error
      })
    this.setState({ showConfirm: false, deletingId: '' })
  }

  onDPSubmit = data => {
    apis.service
      .create(apis.getWorkflowPhaseEndpoint(this.appIdFromUrl, this.idFromUrl), {
        body: JSON.stringify(data)
      })
      .then(res => {
        this.redirectToDeployPhaseView(res.resource.uuid)
      })
      .catch(error => {
        this.props.fetchData()
        throw error
      })
    Utils.hideModal.call(this, 'showDPModal')
  }
  onClonePhase = phase => {
    this.phase = phase
    this.setState({ showConfirmPhase: true })
  }
  onConfirmPhaseCopy = async () => {
    const data = { uuid: this.phase.uuid }
    const { resource } = await WorkflowService.cloneWorkflowPhases(
      {
        appId: this.appIdFromUrl,
        workflowId: this.idFromUrl,
        phaseId: this.phase.uuid
      },
      data
    )

    this.redirectToDeployPhaseView(resource.uuid)
  }
  onAddPhase = () => {
    this.setState({ showDPModal: true })
  }

  redirectToDeployPhaseView = uuid => {
    // const page = `deploy-phase/${uuid}/detail`
    // Utils.redirect({ appId: this.appIdFromUrl, workflowId: this.idFromUrl, page: page })
    this.props.router.push(
      this.props.path.toSetupWorkflowPhaseDetails({
        accountId: this.accountId,
        appId: this.appIdFromUrl,
        workflowId: this.idFromUrl,
        phaseId: uuid
      })
    )
  }

  render () {
    const app = Utils.findByUuid(this.props.dataStore.apps, this.appIdFromUrl)
    // const appServices = Utils.getJsonValue(this, 'state.app.services') || []
    const appServices = (app && app.services) || []
    const wfPhases = Utils.getJsonValue(this, 'state.data.resource.orchestrationWorkflow.workflowPhases') || []
    const computeProviders = Utils.getJsonValue(this, 'state.computeProviders.resource.response') || []
    const serviceTemplates = Utils.getJsonValue(this, 'state.environmentdetails.resource.serviceTemplates') || []
    const objComputeProviders = {}
    computeProviders.map(computeProvider => {
      objComputeProviders[computeProvider.uuid] = computeProvider
    })
    const catalogDepTypes = Utils.getJsonValue(this, 'props.catalogs.DEPLOYMENT_TYPE') || []
    return (
      <div>
        <div>
          {wfPhases.map((phase, index) => {
            let arrowEl = null
            if (index < wfPhases.length - 1) {
              arrowEl = <img className="__arrowDown" src="/img/workflow/arrow-down-phase.png" />
            }
            const service = appServices.find(svc => svc.uuid === phase.serviceId)
            return (
              <div className="__step" key={index}>
                <span onClick={this.redirectToDeployPhaseView.bind(this, phase.uuid)}>
                  {phase.valid === false && (
                    <TooltipOverlay tooltip={phase.validationMessage}>
                      <i className="icons8-info __invalidIcon" />
                    </TooltipOverlay>
                  )}
                  <span className={'__stepIcon ' + (phase.valid === false ? '__invalidStep' : '')}>
                    <i className="icons8-bring-forward-filled" />
                  </span>
                  {arrowEl}
                  Phase {index + 1}
                  <span className="wings-text-link">{service ? ': ' + service.name : ''}</span>
                  {phase.valid === false && <span className="__invalidText">(Incomplete)</span>}
                </span>
                <span className="__itemActionIcon" onClick={() => this.onClonePhase(phase)}>
                  <i className="icons8-copy-2" />
                </span>
                <span className="__itemActionIcon" onClick={() => this.onDeleteClick(phase.uuid)}>
                  <i className="icons8-delete" />
                </span>
                <div className="__stepDesc">{phase.infraMappingName ? phase.infraMappingName : ''}</div>
              </div>
            )
          })}
          <div className="__deploymentPhases __step">
            <span role="button" onClick={this.onAddPhase}>
              <span className="badge">
                <i className="icons8-plus-math" />
              </span>
              <span> Add Phase</span>
            </span>
          </div>
        </div>
        <DeploymentPhaseModal
          show={this.state.showDPModal}
          onHide={Utils.hideModal.bind(this, 'showDPModal')}
          onSubmit={this.onDPSubmit}
          services={appServices}
          objComputeProviders={objComputeProviders}
          serviceTemplates={serviceTemplates}
          envId={this.envId}
          fetchData={this.fetchData}
          catalogDepTypes={catalogDepTypes}
          catalogs={this.props.catalogs}
          templateWorkflow={this.props.templateWorkflow}
          userVariables={this.props.userVariables}
        />
        <Confirm
          visible={this.state.showConfirm}
          onConfirm={this.onDeleteConfirmed}
          onClose={Utils.hideModal.bind(this, 'showConfirm')}
          body="Are you sure you want to delete this?"
          confirmText="Confirm Delete"
          title="Deleting"
        >
          <button style={{ display: 'none' }} />
        </Confirm>
        <Confirm
          visible={this.state.showConfirmPhase}
          onConfirm={this.onConfirmPhaseCopy}
          onClose={Utils.hideModal.bind(this, 'showConfirmPhase')}
          body="Do you want to copy workflow phase?"
          confirmText="Confirm"
          title="Copying Phase"
        >
          <button style={{ display: 'none' }} />
        </Confirm>
      </div>
    )
  }
}

export default Utils.createTransmitContainer(DeploymentPhases, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/DeploymentPhases.js