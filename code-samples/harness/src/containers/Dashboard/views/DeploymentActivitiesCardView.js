import React from 'react'
import css from './DeploymentActivitiesCardView.css'
import { ProgressBar } from 'react-bootstrap'
import { Utils, SparkChart } from 'components'
import { Link } from 'react-router'

export default class DeploymentActivitiesCardView extends React.Component {
  state = {}
  initialized = false

  chartSelection = 'ALL'
  deploymentStats = null
  topServices = []
  sparkChartActiveElement = 0
  sparkChartSelectedElement = 0

  componentWillMount () {
    this.initData(this.props)
  }

  componentWillReceiveProps (newProps) {
    if (newProps && newProps.params) {
      this.initData(newProps)
    } else {
      this.setState({ msg: 'No Recent Deployments' })
    }
  }

  initData (props) {
    let updateState = false

    // TODO: refactor this to be similar to topServices.
    if (props.params.deploymentStats && props.params.deploymentStats[this.chartSelection]) {
      this.deploymentStats = props.params.deploymentStats
      updateState = true
    }

    if (props.params.topServices) {
      this.topServices = props.params.topServices
      updateState = true
    }

    if (updateState) {
      this.setState({ __update: Date.now() })
    }
  }

  percentValue (count, max) {
    return count / max * 100
  }

  setChartType (type) {
    this.chartSelection = type
    this.setState({ __update: Date.now() })
  }

  setActive = dataElem => {
    this.sparkChartActiveElement = dataElem.date
    this.setState({ __update: this.sparkChartActiveElement })
  }

  setSelectedActive = dataElem => {
    this.sparkChartSelectedElement = dataElem.date
    this.setState({ __update: this.sparkChartSelectedElement })
  }

  renderMostActiveServices () {
    const { path, urlParams: { accountId } } = this.props

    if (!this.topServices || this.topServices.length === 0) {
      return <div className="no-instances-message">No Instances have been deployed.</div>
    } else {
      this.topServices.sort((a, b) => {
        return b.totalCount - a.totalCount
      })
      const max = this.topServices[0].totalCount

      const items = this.topServices.map((item, idx) => {
        return (
          <progress-row key={item.appId + idx}>
            <title-items>
              <row-title>
                <Link
                  data-name="services-link"
                  to={path.toServiceDetails({
                    accountId: accountId,
                    appId: item.appId,
                    serviceId: item.serviceId
                  })}
                >
                  {`${item.serviceName}   (${item.appName})`}
                </Link>
              </row-title>
              <item-count>{item.totalCount}</item-count>
            </title-items>
            <progress-bar-items>
              <ProgressBar
                bsStyle="success"
                label={<span>{item.totalCount}</span>}
                now={this.percentValue(item.totalCount, max)}
              >
                <ProgressBar bsStyle="success" now={this.percentValue(item.successfulActivityCount, max)} key={1} />
                <ProgressBar bsStyle="danger" now={this.percentValue(item.failedActivityCount, max)} key={2} />
              </ProgressBar>
            </progress-bar-items>
          </progress-row>
        )
      })

      return (
        <div className={css.progressBars}>
          {/* <fake-bottom-padding-for-tall-scroll-bar /> */}
          {items}
        </div>
      )
    }
  }

  renderDeploymentsChart () {
    let dummyDeploymentStats

    // When no deployment stats are returned, generate placeholder data.
    if (!this.deploymentStats) {
      const numDays = 30
      const date = Date.now()
      const numSecondsInDay = 60 * 60 * 24 * 1000
      const thirtyDays = numSecondsInDay * 30
      const startDay = date - thirtyDays
      const dayStats = []

      // Generate dummy data.
      for (let i = 1; i <= numDays; i++) {
        const dayStat = {
          totalCount: 0,
          failedCount: 0,
          instancesCount: 0,
          date: startDay + i * numSecondsInDay
        }
        dayStats.push(dayStat)
      }

      dummyDeploymentStats = {
        PROD: {
          totalCount: 0,
          failedCount: 0,
          instancesCount: 0,
          daysStats: dayStats
        },
        NON_PROD: {
          totalCount: 0,
          failedCount: 0,
          instancesCount: 0,
          daysStats: dayStats
        },
        ALL: {
          totalCount: 0,
          failedCount: 0,
          instancesCount: 0,
          daysStats: dayStats
        }
      }
    } else {
      dummyDeploymentStats = null
    }

    const deploymentStats = dummyDeploymentStats ? dummyDeploymentStats : this.deploymentStats
    const _arr = ['totalCount', 'failedCount', 'instancesCount']
    const _textLabels = {
      totalCount: 'Deployments',
      failedCount: 'Failed Deployments',
      instancesCount: 'Instances Deployed'
    }

    return (
      <deployments-chart-container>
        {_arr.map((type, index) => {
          const sharedProps = {
            chartSelection: this.chartSelection,
            data: deploymentStats[this.chartSelection].daysStats,
            dataField: type,
            setActive: this.setActive,
            setSelectedActive: this.setSelectedActive,
            activeElement: this.sparkChartActiveElement,
            selectedElement: this.sparkChartSelectedElement,
            onDateClick: this.props.onDateClick
          }
          return (
            <chart-row key={index}>
              <summary-box>
                <summary-value>{Utils.kFormatter(deploymentStats[this.chartSelection][type])}</summary-value>
                <summary-label>{_textLabels[type]}</summary-label>
              </summary-box>
              <deployments-chart>
                <SparkChart {...sharedProps} />
              </deployments-chart>
            </chart-row>
          )
        })}
      </deployments-chart-container>
    )
  }

  render () {
    this.chartSelection = this.props.params.chartSelection || 'ALL'
    const { path, urlParams } = this.props

    return (
      <div className={css.main}>
        <deployments-card>
          <ui-card>
            <ui-card-header>
              <box-for-baselined-items>
                <Link to={path.toDeployments(urlParams)}>
                  <card-title class="link-style">Deployments</card-title>
                </Link>
                <card-sub-title>last 30 days</card-sub-title>
              </box-for-baselined-items>
            </ui-card-header>
            <ui-card-main>{this.renderDeploymentsChart()}</ui-card-main>
          </ui-card>
        </deployments-card>

        <most-active-services-card>
          <ui-card>
            <ui-card-header>
              <box-for-baselined-items>
                <Link to={path.toServiceDashboard(urlParams)}>
                  <card-title>Most Active Services</card-title>
                </Link>
                <card-sub-title>deployments in the last 30 days</card-sub-title>
              </box-for-baselined-items>
            </ui-card-header>
            <ui-card-main>{this.renderMostActiveServices()}</ui-card-main>
            <fake-bottom-padding-for-tall-scroll-bar />
          </ui-card>
        </most-active-services-card>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/Dashboard/views/DeploymentActivitiesCardView.js