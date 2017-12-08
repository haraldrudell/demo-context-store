import React from 'react'
import { createPageContainer, Widget, PageBreadCrumbs } from 'components'
import css from './ServiceInstancesSummaryPage.css'
import ServiceInstancesSummaryDetail from './ServiceInstancesSummaryDetail'
import { InstancesSummary } from 'components'
import { InstancesService, ArtifactService } from 'services'

class ServiceInstancesSummaryPage extends React.Component {
  state = {
    serviceName: '',
    instanceStats: {},
    serviceInstancesLists: {},
    serviceName: ''
  }

  pageName = 'Services > Instances Summary'

  instancesByAppFilterInfo = [
    {
      type: 'ARTIFACT',
      label: 'By Artifact Version'
    },
    {
      type: 'ENVIRONMENT',
      label: 'By Environment'
    },
    {
      type: 'INFRASTRUCTURE',
      label: 'By Service Infrastructure'
    }
  ]

  instancesByAppFilterTypes = this.instancesByAppFilterInfo.map(filter => filter.type)

  instancesByAppFilterTypesStr = '&groupBy=' + this.instancesByAppFilterTypes.join('&groupBy=')

  fetchData = async () => {
    this.props.spinner.show()
    const { accountId, serviceId, appId } = this.props.urlParams
    const fetchKey = +new Date()
    this.fetchKey = fetchKey

    const getInstanceStats = InstancesService.getInstancesByService({
      instancesByAppFilterTypes: this.instancesByAppFilterTypesStr,
      accountId,
      serviceId
    })

    const getServiceInstancesLists = InstancesService.getServiceInstancesLists({
      accountId,
      serviceId,
      appId
    })

    const getArtifacts = ArtifactService.fetchArtifacts(appId, null, [serviceId])

    const { artifacts, error: artifactsError } = await getArtifacts
    const { instanceStats, error: instanceStatsError } = await getInstanceStats
    const { serviceInstancesLists, error: serviceInstancesListsError } = await getServiceInstancesLists

    if (this.fetchKey === fetchKey) {
      if (instanceStatsError) {
      } else if (serviceInstancesListsError) {
      } else if (artifactsError) {
      } else {
        this.setState({
          instanceStats,
          artifacts,
          serviceInstancesLists,
          serviceName: serviceInstancesLists.serviceSummary.name
        })
      }
    }
    this.props.onPageWillMount(this.renderTitleBreadCrumbs())
    this.props.spinner.hide()
  }

  redirectToEnvironment = envId => {
    const { appId, accountId } = this.props.urlParams
    this.props.router.push(this.props.path.toEnvironmentsDetails({ accountId, appId, envId }))
  }

  redirectToEnvironments = () => {
    const { appId, accountId } = this.props.urlParams
    this.props.router.push(this.props.path.toSetupEnvironments({ accountId, appId }))
  }

  redirectToServiceItem = () => {
    const { accountId, appId, serviceId } = this.props.urlParams
    this.props.router.push(this.props.path.toSetupServiceDetails({ accountId, appId, serviceId }))
  }

  redirectToPipeline = () => {
    const { accountId, appId } = this.props.urlParams
    this.props.router.push(this.props.path.toSetupPipeLines({ accountId, appId }))
  }

  redirectToWorkflow = workflowId => {
    const { accountId, appId } = this.props.urlParams
    this.props.router.push(this.props.path.toSetupWorkflow({ accountId, appId }))
  }

  renderTitleBreadCrumbs = () => {
    const path = this.props.path
    const bData = [
      { label: 'Services', link: path.toServiceDashboard(this.props.urlParams) },
      {
        label: this.state.serviceName,
        nonHeader: true,
        link: path.toSetupServiceDetails(this.props.urlParams)
      }
    ]

    return <PageBreadCrumbs data={bData} />
  }

  render () {
    this.props.spinner.hide()

    const widgetHeaderParams = {
      hideHeader: true
    }

    const widgetComponentParams = {
      redirectToEnvironment: this.redirectToEnvironment,
      redirectToEnvironments: this.redirectToEnvironments,
      redirectToPipeline: this.redirectToPipeline,
      redirectToWorkflow: this.redirectToWorkflow,
      redirectToServiceItem: this.redirectToServiceItem,
      data: this.state.serviceInstancesLists,
      noDataMessage: (
        <main className="no-data-box">
          <span>There is no Instance Data.</span>
        </main>
      )
    }

    return (
      <section className={css.main}>
        <InstancesSummary
          instancesByAppFilterInfo={this.instancesByAppFilterInfo}
          instanceStats={this.state.instanceStats}
        />
        <Widget
          {...this.props}
          headerParams={widgetHeaderParams}
          component={ServiceInstancesSummaryDetail}
          params={widgetComponentParams}
        />
      </section>
    )
  }
}

export default createPageContainer()(ServiceInstancesSummaryPage)



// WEBPACK FOOTER //
// ../src/containers/ServiceInstancesSummaryPage/ServiceInstancesSummaryPage.js