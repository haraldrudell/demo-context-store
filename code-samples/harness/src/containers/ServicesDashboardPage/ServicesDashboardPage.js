import React from 'react'
import { PageBreadCrumbs, InstancesSummary, AppsDropdown, createPageContainer, Utils, Widget } from 'components'
import { DataStore } from 'utils'
import css from './ServicesDashboardPage.css'
import ServiceSummaryCardList from './ServiceSummaryCardList'
import { InstancesService } from 'services'

class ServicesDashboardPage extends React.Component {
  state = {
    instanceStats: {},
    serviceCardData: [],
    sortingFunction: Utils.sortServiceSummaryCardsByServiceName
  }
  title = <PageBreadCrumbs data={[{ label: 'Service Dashboard' }]} />
  pageName = 'Services'

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
      label: 'By Environment Type'
    }
  ]

  instancesByAppFilterTypes = this.instancesByAppFilterInfo.map(filter => filter.type)
  instancesByAppFilterTypesStr = '&groupBy=' + this.instancesByAppFilterTypes.join('&groupBy=')

  fetchData = async () => {
    this.props.spinner.show()
    const { accountId } = this.props.urlParams
    const queryParams = Utils.buildSelectedAppIdsQueryParams()
    const fetchKey = +new Date()
    this.fetchKey = fetchKey

    const getInstanceStats = InstancesService.getInstancesByApp({
      instancesByAppFilterTypes: this.instancesByAppFilterTypesStr,
      accountId,
      queryParams
    })
    const getServiceCardData = InstancesService.getInstancesByServiceEnvBuild({
      accountId,
      queryParams
    })
    const { instanceStats, error: instanceStatsError } = await getInstanceStats
    const { serviceCardData, error: serviceCardDataError } = await getServiceCardData

    // replace envType with friendlier string
    if (Utils.getJsonValue('instanceStats.countMap.ENVIRONMENT')) {
      instanceStats.countMap.ENVIRONMENT.forEach(
        env => (env.entitySummary.name = Utils.expandEnvType({ envType: env.entitySummary.name }))
      )
    }

    if (this.fetchKey === fetchKey) {
      if (instanceStatsError) {
      } else if (serviceCardDataError) {
      } else {
        this.setState({ instanceStats, serviceCardData })
      }
    }

    this.props.spinner.hide()
  }

  onAppsSelected = () => this.fetchData()

  setSortFunction = sortMenuDataItem => {
    this.setState({ sortingFunction: sortMenuDataItem.sortingFunction })
  }

  sortMenuData = [
    {
      title: 'Service Name',
      sortingFunction: Utils.sortServiceSummaryCardsByServiceName
    },
    {
      title: 'Application Name',
      sortingFunction: Utils.sortServiceSummaryCardsByApplicationName
    }
  ]

  redirectToServiceItem = (serviceId, appId) => {
    const { accountId } = this.props.urlParams
    this.props.router.push(this.props.path.toSetupServiceDetails({ accountId, appId, serviceId }))
  }

  redirectToServiceInstancesSummaryPage = (serviceId, appId) => {
    const { accountId } = this.props.urlParams
    this.props.router.push(
      this.props.path.toServiceInstancesSummary({
        accountId,
        appId,
        serviceId
      })
    )
  }

  redirectToEnvironment = (envId, appId) => {
    const { accountId } = this.props.urlParams
    this.props.router.push(this.props.path.toEnvironmentsDetails({ accountId, appId, envId }))
  }

  render () {
    this.props.spinner.hide()
    const serviceCardData = this.state.serviceCardData || []
    this.sortedServiceCardData = this.state.sortingFunction(serviceCardData)

    const widgetHeaderParams = {
      sortMenuFunction: this.setSortFunction,
      sortMenuData: this.sortMenuData,
      headerClass: css.headerClass,
      showSort: true,
      showSearch: false,
      leftItem: <AppsDropdown store={DataStore} onSelected={this.onAppsSelected} />
    }

    // TODO: fix console.log below
    const widgetComponentParams = {
      data: this.sortedServiceCardData,
      onServiceClick: this.redirectToServiceInstancesSummaryPage,
      onArtifactClick: this.redirectToServiceItem,
      onEnvironmentClick: this.redirectToEnvironment,
      noDataMessage: (
        <main className="no-data-box">
          <span>There is no Service Data.</span>
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
          component={ServiceSummaryCardList}
          params={widgetComponentParams}
        />
      </section>
    )
  }
}

export default createPageContainer()(ServicesDashboardPage)



// WEBPACK FOOTER //
// ../src/containers/ServicesDashboardPage/ServicesDashboardPage.js