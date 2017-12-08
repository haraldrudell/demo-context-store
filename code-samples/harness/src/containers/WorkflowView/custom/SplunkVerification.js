import React from 'react'
import apis from 'apis/apis'
import { Utils, TooltipOverlay } from 'components'
import { Button, ButtonGroup } from 'react-bootstrap'
import css from './SplunkVerification.css'
import SplunkChart from './SplunkChart'
import SplunkEventsTable from './SplunkEventsTable'
import SplunkLoadingView from './SplunkLoadingView'
import SplunkFilters from './SplunkFilters'
// import splunkData from './splunk_sample_data.json'

const SECOND = 1000 // milliseconds
const REFRESH = {
  initialProcessing: 4 * SECOND,
  afterLoaded: 30 * SECOND
}

export default class SplunkVerification extends React.Component {
  state = {
    loading: true,
    riskLevel: '',
    message: '',
    score: '',
    filters: {
      unknown: true,
      unexpected: true,
      anticipated: true,
      baseline: true
    },
    suspicious: true,
    autoUpdateData: true,
    selected: null,
    clusters: [],
    eventData: {
      baseline: [],
      anticipated: [],
      unknown: [],
      unexpected: []
    }
  }

  componentDidMount () {
    this.fetchData()

    clearInterval(this.loadingInterval)
    this.loadingInterval = setInterval(this.fetchData, REFRESH.initialProcessing)
  }

  componentWillUnmount () {
    clearInterval(this.loadingInterval)
  }

  fetchData = () => {
    const nodeData = this.props.nodeData
    const stateExecutionInstanceId = Utils.getJsonValue(nodeData, 'executionSummary.stateExecutionInstanceId.value')
    const stateType = Utils.getJsonValue(nodeData, 'type')
    const nodeStatus = Utils.getJsonValue(nodeData, 'status')
    const shouldAutoUpdate = this.state.autoUpdateData && nodeStatus === 'RUNNING'
    if (stateExecutionInstanceId && this.state.eventData.loading !== false) {
      apis.fetchSplunkData(Utils.appIdFromUrl(), stateExecutionInstanceId, stateType).then(response => {
        // Debugging mock data
        // response = splunkData
        const controlClusters = Utils.getJsonValue(response, 'resource.controlClusters')
        if (!controlClusters) {
          this.setState({
            eventData: { loading: true }
          })
          return
        } else if (nodeStatus !== 'RUNNING' || this.state.loading) {
          clearInterval(this.loadingInterval)
          this.loadingInterval = null

          if (this.state.loading) {
            this.loadingInterval = setInterval(this.fetchData, REFRESH.afterLoaded)
          }
        }

        if (this.state.loading || shouldAutoUpdate) {
          this.setState(this.translateResponseToState(response))
        }
      })
    }
  }

  filterOutItems = items => {
    const filters = this.state.filters
    const result = []
    items.forEach(item => {
      const pushed = false
      Object.keys(filters).forEach(f => {
        if (!pushed && filters[f] && item[f]) {
          result.push(item)
        }
      })
    })
    return result
  }

  translateResponseToState = res => {
    const resource = res.resource || {}
    const r = {
      unknownClusters: resource.unknownClusters || [],
      controlClusters: resource.controlClusters || [],
      testClusters: resource.testClusters || [],
      message: resource.analysisSummaryMessage || '',
      riskLevel: resource.riskLevel || '',
      query: resource.query || 'default',
      score: resource.score
    }

    const unexpectedEvents = []
    const unknownEvents = []
    let baselineEvents = []
    const anticipatedEvents = []
    let anomalousClusters = []
    const anticipatedClusters = []

    r.unknownClusters.forEach(cluster => {
      this.parseServerClusterData(cluster, { unknown: true }).forEach(point => {
        if (point.unexpected) {
          unexpectedEvents.push(point)
        } else {
          unknownEvents.push(point)
        }
      })
      if (!cluster.unexpected) {
        cluster.unknown = true
      }
    })

    anomalousClusters = anomalousClusters.concat(r.unknownClusters)

    r.testClusters.forEach(cluster => {
      this.parseServerClusterData(cluster).forEach(point => {
        if (point.unexpected) {
          unexpectedEvents.push(point)
        } else {
          point.anticipated = true
          anticipatedEvents.push(point)
        }
      })

      if (!cluster.unexpected) {
        cluster.anticipated = true
        anticipatedClusters.push(cluster)
      } else {
        anomalousClusters.push(cluster)
      }
    })

    r.controlClusters.forEach(cluster => {
      cluster.baseline = true
      baselineEvents = baselineEvents.concat(this.parseServerClusterData(cluster, { baseline: true }))
    })

    return {
      clusters: anomalousClusters.concat(anticipatedClusters, r.controlClusters),
      message: r.message,
      riskLevel: r.riskLevel,
      score: r.score,
      query: r.query || '*',
      suspicious: this.props.nodeData.status === 'RUNNING',
      loading: false,
      eventData: {
        baseline: baselineEvents,
        anticipated: anticipatedEvents,
        unknown: unknownEvents,
        unexpected: unexpectedEvents
      }
    }
  }

  parseServerClusterData (cluster, addons = {}) {
    const result = []
    const hosts = Object.keys(cluster.hostSummary)
    cluster.hosts = hosts.join(' ')
    hosts.forEach(host => {
      const summary = cluster.hostSummary[host]
      const point = Object.assign(
        {
          cluster: cluster,
          x: summary.xcordinate,
          y: summary.ycordinate,
          logText: cluster.logText || '',
          tags: cluster.tags,
          score: cluster.score,
          hosts: cluster.hosts
        },
        addons
      )

      if (summary.unexpectedFreq) {
        point.unexpected = true
        cluster.unexpected = true
      }

      result.push(point)
    })

    return result
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      this.props.nodeData.status !== nextProps.nodeData.status ||
      this.props.nodeData.id !== nextProps.nodeData.id ||
      nextState.loading !== this.state.loading ||
      nextState.autoUpdateData !== this.state.autoUpdateData ||
      nextState.selected !== this.state.selected ||
      (nextState.filters && JSON.stringify(nextState.filters) !== JSON.stringify(this.state.filters)) ||
      JSON.stringify(nextState.clusters) !== JSON.stringify(this.state.clusters)
    )
  }

  render () {
    if (this.state.loading) {
      return <SplunkLoadingView />
    }

    const toggleCheck = event => null // noop
    const clusterData = this.filterOutItems(this.state.clusters)

    let riskClass = ''
    if (this.state.riskLevel.toUpperCase() === 'HIGH') {
      riskClass = this.state.suspicious ? 'risk-suspicious' : 'risk-high'
    }
    return (
      <div className={css.main} data-name="verification-details">
        <div className="event-summary-title">
          <h5>
            Risk Level: <span className={`risk-level ${riskClass}`}> {`${this.state.riskLevel}`}</span>
          </h5>
          <h6 className="summary-message">
            {this.state.message}
          </h6>
          <ButtonGroup>
            <TooltipOverlay tooltip="Toggle changing the chart with new data" delay={1400}>
              <Button className="toggle-auto-update" onClick={this.onToggleUpdates}>
                <input type="checkbox" checked={this.state.autoUpdateData} onChange={toggleCheck} /> Auto refresh
              </Button>
            </TooltipOverlay>
            <TooltipOverlay tooltip="Cluster chart event filters" delay={1400}>
              <Button onClick={this.onClickFilters}>
                {' '}<i className="glyphicon glyphicon-filter" />
              </Button>
            </TooltipOverlay>
            <TooltipOverlay tooltip="Click and Box to Zoom In&nbsp;&nbsp;&nbsp; Double Click to Zoom Out&nbsp;&nbsp;">
              <Button>
                {' '}<i className="icons8-info" />{' '}
              </Button>
            </TooltipOverlay>
          </ButtonGroup>
        </div>
        <div className="splunk-scroll-area">
          <SplunkFilters
            queries={[this.state.query]}
            suspicious={this.state.suspicious}
            filters={this.state.filters}
            setFilters={this.onFilter}
            ref={f => (this.eventFilters = f)}
          />

          <SplunkChart
            data={this.state.eventData}
            filters={this.state.filters}
            selected={this.state.selected}
            suspicious={this.state.suspicious}
            selectPoint={this.selectCluster}
          />

          <div className="cluster-graph-caption">Log Message Clustering (by text similarity)</div>
          <SplunkEventsTable
            clusters={clusterData}
            selected={this.state.selected}
            suspicious={this.state.suspicious}
            ref={t => (this.eventsTable = t)}
            onClear={() => this.setState({ selected: null })}
          />
        </div>
      </div>
    )
  }

  onToggleUpdates = () => {
    this.setState(prevState => {
      return { autoUpdateData: !prevState.autoUpdateData }
    })
  }

  onFilter = filters => {
    this.setState(prevState => {
      const pf = prevState.filters
      const getFilter = s => (filters[s] ? !pf[s] : pf[s])
      const f = {
        unknown: getFilter('unknown'),
        unexpected: getFilter('unexpected'),
        anticipated: getFilter('anticipated'),
        baseline: getFilter('baseline')
      }
      const selected = prevState.selected
      const keepSelected =
        selected &&
        ((f.unknown && selected.unknown) ||
          (f.unexpected && selected.unexpected) ||
          (f.anticipated && selected.anticipated) ||
          (f.baseline && selected.baseline))
      return {
        selected: keepSelected ? prevState.selected : null,
        filters: f
      }
    })
  }

  onClickFilters = e => {
    this.eventFilters &&
      this.eventFilters.setState(prevState => {
        return { hidden: !prevState.hidden }
      })
  }

  selectCluster = data => {
    let point

    if (!data || !data.points || !data.points.length) {
      point = null
    } else {
      const focusPointData = []

      data.points.forEach(p => {
        if (p && p.data && p.data.dataset && p.data.dataset.customdata && p.data.dataset.customdata.length) {
          focusPointData.push(p.data.dataset.customdata[p.pointNumber])
        }
      })

      point = focusPointData[0] || null
    }

    this.setState(prevState => {
      return { selected: prevState.selected !== point ? point : null }
    })
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/custom/SplunkVerification.js