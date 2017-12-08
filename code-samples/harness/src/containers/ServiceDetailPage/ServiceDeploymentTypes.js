import React from 'react'
import { PanelGroup, Panel, Checkbox } from 'react-bootstrap'
// import ECSTaskDefinitionModal from './ECSTaskDefinitionModal'
// import KubernetesDefinitionModal from './KubernetesDefinitionModal'
import ContainerTaskDefinitionModal from './ContainerTaskDefinitionModal'
import AWSLambdaFunctionSpec from './AWSLambdaFunctionSpec.js'
import CommandPage from '../CommandPage/CommandPage'
// import ECSCommandList from './views/ECSCommandList'
import { Utils } from 'components'
import css from './ServiceDeploymentTypes.css'
const defaultAWSSpecData = {}
export default class ServiceDeploymentTypes extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  state = {
    activeKey: 1,
    showECSModal: false,
    showKubernetesModal: false,
    showLambdaModal: false,
    expanded: {
      ecs: true,
      ssh: true,
      kubernetes: true,
      codedeploy: true,
      awslambda: true,
      chef: false,
      puppet: false
    },
    selected: {
      ecs: true,
      ssh: true,
      kubernetes: true,
      codedeploy: true,
      awslambda: true,
      chef: false,
      puppet: false
    }
  }

  componentWillMount () {
    Utils.loadCatalogsToState(this)
  }

  onSelectPanel = panelName => {
    const boolValue = this.state.expanded[panelName]
    const expanded = this.state.expanded
    expanded[panelName] = !boolValue
    this.setState({ expanded })
  }

  onCheckBoxSelect = panelName => {
    const boolValue = this.state.selected[panelName]
    const selected = this.state.selected
    selected[panelName] = !boolValue
    this.state.expanded[panelName] = !boolValue
    this.removeExpanded(panelName)
    this.setState({ selected })
  }

  removeExpanded (paneName) {
    const expandedObject = this.state.expanded
    const selectedObject = this.state.selected
    Object.keys(expandedObject).forEach(function remove (key) {
      if (key !== paneName) {
        expandedObject[key] = false
        // selectedObject[key] = false
      }
    })
    this.setState({ expanded: expandedObject })
    this.setState({ selected: selectedObject })
  }

  header = (panelName, title) => {
    const disabled = panelName === 'chef' || panelName === 'puppet' ? true : false
    return (
      <div>
        <Checkbox
          checked={this.state.selected[panelName]}
          onChange={this.onCheckBoxSelect.bind(this, panelName)}
          disabled={disabled}
        />
        <span className={css.panelTitle + ' ' + (this.state.selected[panelName] ? '__selected' : 'light')}>
          {title}
        </span>
      </div>
    )
  }

  ecsTaskDefinitionModalSubmit = updatedServiceContainerTasks => {
    const editedItemIdx = this.props.serviceContainerTasks.findIndex(o => o.deploymentType === 'ECS')
    if (editedItemIdx < 0) {
      this.props.serviceContainerTasks.push(updatedServiceContainerTasks)
    } else {
      this.props.serviceContainerTasks[editedItemIdx] = updatedServiceContainerTasks
    }
    this.addStep()
  }

  kubenetesTaskDefinitionModalSubmit = updatedServiceContainerTasks => {
    const editedItemIdx = this.props.serviceContainerTasks.findIndex(o => o.deploymentType === 'KUBERNETES')
    if (editedItemIdx < 0) {
      this.props.serviceContainerTasks.push(updatedServiceContainerTasks)
    } else {
      this.props.serviceContainerTasks[editedItemIdx] = updatedServiceContainerTasks
    }
    this.addStep()
  }

  addStep = () => {
    if (this.props.isTourOn) {
      this.props.goToStep(this.props.serviceTourStep5, this.props.tourStepName, this.props.stepNumber)
      this.props.setCurrentStepStatus('inprogress')
    }
  }

  closeModal = () => {
    this.setState({
      showECSModal: false,
      showKubernetesModal: false,
      showLambdaModal: false
    })
    this.props.fetchService()
  }

  onReset = () => {
    // on Reset settings, close the current Modal & refresh data & re-open it again
    const { showECSModal, showKubernetesModal } = this.state
    this.setState({ showECSModal: false, showKubernetesModal: false })

    this.props.fetchService(false, () => {
      if (showECSModal) {
        this.setState({ showECSModal: true })
      } else if (showKubernetesModal) {
        this.setState({ showKubernetesModal: true })
      }
    })
  }

  render () {
    /*
    let showClass = ''
    if (this.props.data) {
      showClass = (this.props.data.length > 0) ? '__dep-types-show' : '__dep-types-hide'
    } */
    const service = this.props.serviceData
    /*
    let sshCommandsEl = null
    if (service.serviceCommands && service.serviceCommands.length > 0) {
      for (const svCommand of service.serviceCommands) {
        if (svCommand.command && svCommand.command.deploymentType === 'SSH') {
          sshCommandsEl = (
            <CommandPage serviceData={service}
              fetchData={this.props.fetchService}
              isTourOn={this.props.isTourOn}
              onTourPause={this.props.onTourPause}></CommandPage>
          )
          break
        }
      }
    }*/
    const sshCommandsEl = (
      <CommandPage
        {...this.props}
        serviceData={service}
        fetchData={this.props.fetchService}
        isTourOn={this.props.isTourOn}
        onTourPause={this.props.onTourPause}
        appIdFromUrl={this.props.appIdFromUrl}
        serviceId={this.props.serviceId}
      />
    )

    // let ecsCommandsEl = null
    // if (service.serviceCommands && service.serviceCommands.length > 0) {
    //   for (const svCommand of service.serviceCommands) {
    //     if (svCommand.command && svCommand.command.deploymentType === 'ECS') {
    //       ecsCommandsEl = (
    //         <ECSCommandList serviceData={this.props.serviceData}></ECSCommandList>
    //       )
    //       break
    //     }
    //   }
    // }
    // let kubernetesCommandsEl = null
    // if (service.serviceCommands && service.serviceCommands.length > 0) {
    //   for (const svCommand of service.serviceCommands) {
    //     if (svCommand.command && svCommand.command.deploymentType === 'KUBERNETES') {
    //       kubernetesCommandsEl = (
    //         <ECSCommandList serviceData={this.props.serviceData}></ECSCommandList>
    //       )
    //       break
    //     }
    //   }
    // }
    const isDocker = service && service.artifactType === 'DOCKER'
    const hasCodeDeploy = service && service.artifactType === 'AWS_CODEDEPLOY'
    const hasAwsLambda = service && service.artifactType === 'AWS_LAMBDA'

    return (
      <div className={`box-solid wings-card ${css.main}`}>
        <div className="box-header with-border">
          <div className="wings-card-header">
            <div>Deployment Specification</div>
          </div>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-md-12 __service-specifications">
              <PanelGroup activeKey="1">
                {!isDocker &&
                  !hasAwsLambda &&
                  !hasCodeDeploy &&
                  <Panel
                    header={this.header('ssh', 'SSH Script')}
                    eventKey="1"
                    className={this.state.expanded.ssh ? 'expanded' : ''}
                    onSelect={this.onSelectPanel.bind(this, 'ssh')}
                    collapsible
                    expanded={this.state.expanded.ssh}
                  >
                    {sshCommandsEl}
                  </Panel>}

                {hasCodeDeploy &&
                  <Panel
                    header={this.header('codedeploy', 'AWS CodeDeploy')}
                    eventKey="2"
                    collapsible
                    className={css.ecsPanel + ' ' + (this.state.expanded.codedeploy ? 'expanded' : '')}
                    onSelect={this.onSelectPanel.bind(this, 'codedeploy')}
                    expanded={this.state.expanded.codedeploy}
                  >
                    <div className="col-md-6">
                      <div className={css.panelHeader}>AWS CodeDeploy</div>
                    </div>
                  </Panel>}

                {hasAwsLambda &&
                  <Panel
                    header={this.header('awslambda', 'AWS Lambda')}
                    eventKey="2"
                    collapsible
                    className={css.ecsPanel + ' ' + (this.state.expanded.awslambda ? 'expanded' : '')}
                    onSelect={this.onSelectPanel.bind(this, 'awslambda')}
                    expanded={this.state.expanded.awslambda}
                  >
                    <div className="col-md-6">
                      <div className={css.panelHeader}>AWS Lambda Templates</div>
                      <div className="wings-text-link" onClick={() => this.setState({ showLambdaModal: true })}>
                        Lambda Function Specification
                      </div>
                    </div>
                  </Panel>}

                {!isDocker &&
                  !hasAwsLambda &&
                  !hasCodeDeploy &&
                  <Panel
                    header={this.header('chef', 'Chef')}
                    eventKey="4"
                    className={this.state.expanded.chef ? 'expanded' : ''}
                    onSelect={this.onSelectPanel.bind(this, 'chef')}
                    collapsible
                    expanded={this.state.expanded.chef}
                  />}

                {!isDocker &&
                  !hasAwsLambda &&
                  !hasCodeDeploy &&
                  <Panel
                    header={this.header('puppet', 'Puppet')}
                    eventKey="5"
                    className={this.state.expanded.puppet ? 'expanded' : ''}
                    onSelect={this.onSelectPanel.bind(this, 'puppet')}
                    collapsible
                    expanded={this.state.expanded.puppet}
                  />}

                {isDocker &&
                  <Panel
                    header={this.header('ecs', 'ECS')}
                    eventKey="2"
                    collapsible
                    className={css.ecsPanel + ' ' + (this.state.expanded.ecs ? 'expanded' : '')}
                    onSelect={this.onSelectPanel.bind(this, 'ecs')}
                    expanded={this.state.expanded.ecs}
                  >
                    <div className="col-md-6">
                      <div className={css.panelHeader}>ECS Templates</div>
                      <div className="wings-text-link" onClick={() => this.setState({ showECSModal: true })}>
                        Container Specification
                      </div>
                    </div>
                  </Panel>}

                {isDocker &&
                  <Panel
                    header={this.header('kubernetes', 'Kubernetes')}
                    eventKey="3"
                    collapsible
                    className={this.state.expanded.kubernetes ? 'expanded' : ''}
                    onSelect={this.onSelectPanel.bind(this, 'kubernetes')}
                    expanded={this.state.expanded.kubernetes}
                  >
                    {/* <div className="col-md-6">
                    <div className={css.panelHeader}>Commands</div>
                    {kubernetesCommandsEl}
                  </div> */}
                    <div className="col-md-6">
                      <div className={css.panelHeader}>Kubernetes Templates</div>
                      <div className="wings-text-link" onClick={() => this.setState({ showKubernetesModal: true })}>
                        Container Specification
                      </div>
                    </div>
                  </Panel>}
              </PanelGroup>
            </div>
          </div>
        </div>

        <ContainerTaskDefinitionModal
          {...this.props}
          serviceContainerTasks={this.props.serviceContainerTasks}
          serviceContainerTaskStencils={this.props.serviceContainerTaskStencils}
          show={this.state.showECSModal}
          onHide={this.closeModal}
          onSubmit={this.ecsTaskDefinitionModalSubmit}
          onReset={this.onReset}
          logDriverOptions={this.state.catalogs && this.state.catalogs.LOG_DRIVER}
          deploymentType={'ECS'}
          appIdFromUrl={this.props.appIdFromUrl}
          serviceId={this.props.serviceId}
        />
        <ContainerTaskDefinitionModal
          {...this.props}
          serviceContainerTasks={this.props.serviceContainerTasks}
          serviceContainerTaskStencils={this.props.serviceContainerTaskStencils}
          show={this.state.showKubernetesModal}
          onHide={this.closeModal}
          onSubmit={this.kubenetesTaskDefinitionModalSubmit}
          onReset={this.onReset}
          logDriverOptions={this.state.catalogs && this.state.catalogs.LOG_DRIVER}
          deploymentType={'KUBERNETES'}
          appIdFromUrl={this.props.appIdFromUrl}
          serviceId={this.props.serviceId}
        />
        {this.state.showLambdaModal &&
          <AWSLambdaFunctionSpec
            {...this.props}
            show={this.state.showLambdaModal}
            onHide={this.closeModal}
            formData={defaultAWSSpecData}
            appIdFromUrl={this.props.appIdFromUrl}
            serviceId={this.props.serviceId}
            // do the lambda
          />}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceDetailPage/ServiceDeploymentTypes.js