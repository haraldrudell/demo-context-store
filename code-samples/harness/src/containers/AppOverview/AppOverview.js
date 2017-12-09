import React from 'react'
import { CompUtils, Utils } from 'components'
import DeploymentOverviewCardView from './views/DeploymentOverviewCardView'
import AppSummaryCardView from './views/AppSummaryCardView'
import AppTrendsCardView from './views/AppTrendsCardView'
import DeploymentsByDateModal from '../Dashboard/DeploymentsByDateModal'
import apis from 'apis/apis'
import css from './AppOverview.css'
import { Utils as Util } from 'components'

const fragmentArr = [{ executions: [] }, { deploymentStats: [] }]
// ---------------------------------------- //

class AppOverview extends React.Component {
  // TODO: propTypes
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    ...Utils.getDefaultContextTypes()
  }
  state = {
    data: {},
    showModal: false,
    modalStartTime: Date.now()
  }

  appIdFromUrl = Utils.appIdFromUrl()
  dataLoaded = {}

  componentWillMount () {
    Utils.loadChildContextToState(this, 'app')
    this.fetchData()
    this.props.onPageWillMount(<h3>Overview</h3>, 'App-Overview')
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  fetchData = () => {
    fragmentArr[0].executions = [apis.fetchExecutions, this.appIdFromUrl]
    fragmentArr[1].deploymentStats = [
      apis.fetchStatistics,
      'deployment-stats',
      'numOfDays=30',
      Util.buildSelectedAppIdsQueryParams()
    ]

    // after routing back to this component, manually fetch data:
    if (__CLIENT__ && !this.props.data) {
      Utils.fetchFragmentsToState(fragmentArr, this, (key, data) => (this.dataLoaded[key] = true))
      this.state.data.resource = this.state.data.resource || {} // make sure we have 'response'
    } else {
      this.setState(this.props)
    }
  }

  filterExecutions = filter => {
    let _searchFilter = ''
    const _statuses = Object.keys(filter.status)
    const _environments = Object.keys(filter.environments)

    if (_statuses.length > 0) {
      _searchFilter += '&status=' + _statuses.join('&status=')
    }

    if (_environments.length > 0) {
      _searchFilter += '&envId=' + _environments.join('&envId=')
    }

    if (filter.fromDate && filter.toDate) {
      _searchFilter += '&search[0][field]=createdAt'
      _searchFilter += `&search[0][op]=GT&search[0][value]=${filter.fromDate}`
      _searchFilter += `&search[1][field]=createdAt&search[1][op]=LT&search[1][value]=${filter.toDate}`
    }

    apis.service
      .list(apis.getExecutionsEndPoint(this.appIdFromUrl, _searchFilter))
      .then(resp => this.setState({ executions: resp }))
      .catch(error => {
        throw error
      })
  }

  findEnvById = envId => {
    const envs = Utils.findAppEnvs(this) || []
    const env = envs.find(env => env.uuid === envId)
    return env ? env.name : ''
  }

  onDateClick = item => {
    this.setState({ showModal: true, modalStartTime: item.date })
  }

  updateApp (app, hosts) {
    if (app && hosts) {
      app.hosts = hosts
    }
    return
  }

  render () {
    const executions = Utils.getJsonValue(this, 'state.executions.resource.response')
    const environments = Utils.findAppEnvs(this) || null
    const deploymentStats = Utils.getJsonValue(this, 'state.deploymentStats.resource.statsMap')
    const app = Utils.findApp(this) || null

    return (
      <section className={css.main}>
        <section className="content">
          <div className="row wings-card-row">
            {/* <div className="col-md-12 wings-card-col">*/}
            {/* hiding notification bar for prelaunch
             <NotificationBar fullWidth={true} appId={Utils.appIdFromUrl()}
            className="__notificationBar" />*/}
            {/* </div>*/}

            {/* loading status spinner */}
            <div style={{ 'margin-left': '11px' }}>
              {CompUtils.renderLoadingStatus(this, deploymentStats)}
            </div>

            <div className="col-md-12 wings-card-col">
              <AppSummaryCardView deploymentStats={deploymentStats} app={app} />
            </div>
            <div className="col-md-12 wings-card-col">
              <AppTrendsCardView deploymentStats={deploymentStats} app={app} onDateClick={this.onDateClick} />
            </div>
            <div className="col-md-12 wings-card-col">
              <DeploymentOverviewCardView
                {...this.props}
                dataStore={this.props.dataStore}
                environments={environments}
                executions={executions}
                filterExecutions={this.filterExecutions}
                findEnvById={this.findEnvById}
                dataLoaded={this.dataLoaded['executions']}
              />
            </div>
          </div>
          <DeploymentsByDateModal
            {...this.props}
            dataStore={this.props.dataStore}
            appId={this.appIdFromUrl}
            show={this.state.showModal}
            onHide={Utils.hideModal.bind(this)}
            startTime={this.state.modalStartTime}
          />
        </section>
      </section>
    )
  }
}

export default Utils.createTransmitContainer(AppOverview, fragmentArr)



// WEBPACK FOOTER //
// ../src/containers/AppOverview/AppOverview.js