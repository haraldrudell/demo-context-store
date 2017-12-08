import React from 'react'
import { AppNotificationBar, InstancesSummary, Utils, createPageContainer, PageBreadCrumbs } from 'components'
import DeploymentActivitiesCardView from './views/DeploymentActivitiesCardView'
import DeploymentsByDateModal from './DeploymentsByDateModal'
import apis from 'apis/apis'
import css from './Dashboard.css'
import WingsTour from '../../components/WingsTour/WingsTour'
import { TourStage } from 'utils'
import ApplicationModal from '../ApplicationPage/ApplicationModal.js'
import { InstancesService, ExecutionService } from 'services'
import DashboardServiceInstancesTables from './DashboardServiceInstancesTables'

const fragmentArr = [{ deploymentStats: [] }, { topServices: [] }]

class Dashboard extends React.Component {
  static contextTypes = { router: React.PropTypes.object.isRequired, ...Utils.getDefaultContextTypes() }

  state = {
    data: {},
    showModal: false,
    modalStartTime: Date.now(),
    userName: '',
    appBarCls: '__hide',
    tourType: '',
    showTourModal: false,
    showDashBoard: '__hide',
    dataLoaded: false,
    showAppModal: false
  }
  title = 'test'
  pageName = 'Main Dashboard'
  accountId = Utils.accountIdFromUrl()

  instancesByAppFilterInfo = [
    {
      type: 'SERVICE',
      label: 'By Service'
    },
    {
      type: 'CLOUD_PROVIDER',
      label: 'By Cloud Provider'
    },
    {
      type: 'ENVIRONMENT',
      label: 'By Production/Non-Production'
    }
  ]

  instancesByAppFilterTypes = this.instancesByAppFilterInfo.map(filter => filter.type)
  instancesByAppFilterTypesStr = '&groupBy=' + this.instancesByAppFilterTypes.join('&groupBy=')

  componentWillReceiveProps (newProps) {
    if (newProps.dataStore.userData.name !== undefined) {
      if (this.context.apps.length === 0) {
        this.setState({ userName: newProps.dataStore.userData.name, appBarCls: '', showDashBoard: '__hide' })
      } else {
        this.setState({ userName: newProps.dataStore.userData.name, appBarCls: '__hide', showDashBoard: '' })
      }
    }
  }

  componentWillMount () {
    this.fetchData()
  }

  componentDidMount () {
    if (!this.props.isTourOn) {
      this.setState({ showTourModal: true })
    }
  }

  componentWillUnmount = () => Utils.unsubscribeAllPubSub(this)

  fetchData = async () => {
    this.props.spinner.show()
    const { accountId } = this.props.urlParams

    const fetchKey = +new Date()
    this.fetchKey = fetchKey

    const getInstanceStats = InstancesService.getInstancesByApp({
      instancesByAppFilterTypes: this.instancesByAppFilterTypesStr,
      accountId
    })

    const getServiceCardData = InstancesService.getInstancesByServiceEnvBuild({ accountId })

    const { instanceStats, error: instanceStatsError } = await getInstanceStats
    const { serviceCardData, error: serviceCardDataError } = await getServiceCardData

    // Traverse all env objects and tally the instances.
    const servicesDict = {}
    serviceCardData.map(envList => {
      const service = envList.serviceSummary
      service.numProdInstances = 0
      service.numNonProdInstances = 0

      // For each service, add object to dictionary, based on serviceId.
      servicesDict[service.id] = { service }

      // Traverse each artifactList in each env and add any instances to the count in the dictionary.
      envList.instanceStatsByEnvList.forEach(env => {
        env.instanceStatsByArtifactList.forEach(artList => {
          const numInstances = Utils.getJsonValue(artList, 'instanceStats.entitySummaryList.length') || 0
          if (env.environmentSummary.prod) {
            servicesDict[service.id]['service']['numProdInstances'] += numInstances
          } else {
            servicesDict[service.id]['service']['numNonProdInstances'] += numInstances
          }
        })
      })
    })

    // Convert services dictionary back to a list.
    const services = Object.keys(servicesDict).map(key => servicesDict[key].service)

    // replace envType with friendlier string
    if (Utils.getJsonValue(instanceStats, 'countMap.ENVIRONMENT')) {
      instanceStats.countMap.ENVIRONMENT.forEach(
        env => (env.entitySummary.name = Utils.expandEnvType({ envType: env.entitySummary.name }))
      )
    }

    if (this.fetchKey === fetchKey) {
      if (instanceStatsError) {
      } else if (serviceCardDataError) {
      } else {
        this.setState({
          instanceStats,
          serviceCardData: { currentActiveInstancesList: services }
        })
      }
    }

    this.props.spinner.hide()

    fragmentArr[0].deploymentStats = [apis.fetchStatistics, 'deployment-stats']
    fragmentArr[1].topServices = [apis.fetchStatistics, 'service-instance-stats']

    if (!this.props.apps) {
      Utils.fetchFragmentsToState(fragmentArr, this)
      this.state.data.resource = this.state.data.resource || { response: [] } // make sure we have 'response'
      this.setState({ dataLoaded: true })
    } else {
      this.setState(this.props)
    }

    const { executions: pipelineExecutions } = await ExecutionService.fetchExecutions({
      accountId,
      includeWorkflow: false
    })
    this.setState({ pipelineExecutions })
  }

  onNameClick = uuid => Utils.redirect({ appId: uuid, page: 'overview' })
  onDateClick = item => this.setState({ showModal: true, modalStartTime: item.date })

  renderAppInfo = () => {
    if (true) {
      // if (this.context.apps.length === 0 && this.state.userName !== '') {
      return (
        <div className={` ${this.state.appBarCls}`}>
          <a onClick={this.showApplicationModal}>Add an Application</a>
          {/* &nbsp; or open the &nbsp;
          <a onClick={(e) => this.startTour(e, 'product')}>Setup Guide.</a>*/}
        </div>
      )
    }
  }

  startTour = (e, tourType) => {
    e.preventDefault()
    this.props.onTourPause()
    const redirectToSetup = stage => {
      this.props.setTourStage(stage)
      this.props.onTourStart()
      Utils.redirect({ appId: Utils.appIdFromUrl(), page: 'setup' })
    }
    switch (tourType) {
      case 'service':
        redirectToSetup(TourStage.SERVICE)
        break
      case 'environment':
        redirectToSetup(TourStage.ENVIRONMENT)
        break
      case 'artifact':
        redirectToSetup(TourStage.ARTIFACT)
        break
      default:
        this.setState({ tourType, showTourModal: true })
    }
  }

  showApplicationModal = () => {
    this.setState({ showAppModal: true })
    // Utils.showModal.call(this, null)
  }

  onHideModal = () => {
    this.setState({ showAppModal: false })
    /* if (!(this.props.isTourOn && this.props.tourStage === TourStage.APPLICATION)) {*/
    // Utils.hideModal.call(this)
    // }
  }

  afterAppCreated = () => (window.location.href = Utils.buildUrl(this.accountId, '', 'setup'))

  afterCreateApplication = async () => {
    await this.props.dataStore.fetchAllApps()
    this.afterAppCreated()
  }

  renderTitleBreadCrumbs = () => <PageBreadCrumbs data={[{ label: 'Main Dashboard' }]} />
  title = this.renderTitleBreadCrumbs()

  // redirectToApplicationSetup = appId => {
  //   const path = this.props.path
  //   const { accountId } = this.props.urlParams
  //   const urlObj = { accountId, appId }
  //   const appSetupPage = `#${path.toSetupServices(urlObj)}`
  //   Utils.redirectToUrl(appSetupPage)
  // }

  renderInstancesSummary = () => {
    const { path, urlParams } = this.props
    const instancesSummaryProps = {
      title: 'Service Instances',
      showSubListInPopover: true,
      subTitle: 'currently active',
      titleClickRedirectPath: path.toServiceDashboard({ ...urlParams }),
      instancesByAppFilterInfo: this.instancesByAppFilterInfo,
      instanceStats: this.state.instanceStats
    }

    return (
      <instances-summary>
        <InstancesSummary {...instancesSummaryProps} />
      </instances-summary>
    )
  }

  renderDashboardServiceInstancesTables = () => {
    const tableProps = {
      data: this.state.serviceCardData,
      urlParams: this.props.urlParams,
      path: this.props.path
    }

    return (
      <service-instances-table-container>
        <DashboardServiceInstancesTables {...tableProps} />
      </service-instances-table-container>
    )
  }

  renderDeploymentsByDateModal = () => (
    <DeploymentsByDateModal
      {...this.props}
      show={this.state.showModal}
      onHide={Utils.hideModal.bind(this)}
      startTime={this.state.modalStartTime}
      noDataCls={this.state.noDataCls}
    />
  )

  renderWingsTourModal = () => (
    <WingsTour
      show={this.state.showTourModal}
      onHide={Utils.hideModal.bind(this, 'showTourModal')}
      tourType={this.state.tourType}
      {...this.props}
    />
  )

  renderApplicationModal = () => (
    <ApplicationModal
      isTourOn={this.props.isTourOn}
      data={this.state.modalData}
      show={this.state.showAppModal}
      onHide={this.onHideModal}
      afterSubmit={this.afterCreateApplication}
    />
  )

  renderDeploymentActivitiesCardView = () => {
    if (this.state.dataLoaded) {
      const chartSelection = 'ALL'
      const topServices = Utils.getJsonValue(this, 'state.topServices.resource.statsMap')
      const filteredTopServices = topServices && topServices[chartSelection] ? topServices[chartSelection] : []
      const deploymentActivityCardViewParams = {
        deploymentStats: Utils.getJsonValue(this, 'state.deploymentStats.resource.statsMap') || {},
        topServices: filteredTopServices,
        onNameClick: this.onNameClick,
        fetchData: this.fetchData
      }

      return (
        <DeploymentActivitiesCardView
          {...this.props}
          params={deploymentActivityCardViewParams}
          onDateClick={this.onDateClick}
        />
      )
    } else {
      return ''
    }
  }

  render () {
    return (
      <section className={css.home}>
        {this.renderAppInfo()}
        {this.state.showDashBoard !== '__hide' && (
          <div>
            <AppNotificationBar {...this.props} />

            {this.renderDeploymentActivitiesCardView()}
            {this.renderInstancesSummary()}
            {this.renderDashboardServiceInstancesTables()}
            {this.renderDeploymentsByDateModal()}
          </div>
        )}

        {this.renderWingsTourModal()}
        {this.renderApplicationModal()}
      </section>
    )
  }
}

export default createPageContainer()(Dashboard)



// WEBPACK FOOTER //
// ../src/containers/Dashboard/Dashboard.js