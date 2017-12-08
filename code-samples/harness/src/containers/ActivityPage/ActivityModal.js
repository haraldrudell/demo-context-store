import React from 'react'
import { Modal, Button, Row, Col, Checkbox, FormGroup } from 'react-bootstrap'
import apis from 'apis/apis'
import css from './ActivityModal.css'
import moment from 'moment'
import ActivityPanel from './views/ActivityPanel'
import { Utils } from 'components'

const pollIntervals = [1, 5, 15, 30, 45, 60]

const getEndpoint = (activityId, appId, envId) => {
  return 'activities/' + activityId + '/units?appId=' + appId + '&envId=' + envId
}

const getDownloadEndpoint = (activityId, appId, envId) => {
  return 'activities/' + activityId + '/all-logs?appId=' + appId + '&envId=' + envId
}

export default class ActivityModal extends React.Component {
  state = {
    checkAutoRefresh: true,
    activity: {},
    pollInterval: 1,
    lastUpdatedTime: Date.now()
  }
  pollInProgress = 0
  offset = 0
  units = []
  lastUnits = []
  isCompleted = false
  current = 0
  lastUuid = ''
  fetchingDone = false

  componentWillMount () {
    this.init(this.props)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.show && newProps.activity && newProps.activity.uuid) {
      if (this.props.useDebounce === true) {
        // Playback case
        this.debouncedInit(newProps)
      } else {
        // Usual cases
        if (newProps.activity.uuid !== this.lastUuid) {
          this.lastUuid = newProps.activity.uuid
          this.init(newProps)
        } else {
          this.debouncedInit(newProps)
        }
      }
    }
  }

  componentWillUnmount () {
    this.cancelPoll()
  }

  debouncedInit = Utils.debounce(props => this.init.bind(this, props), 500)

  init (props) {
    this.setState({ activity: props.activity })

    if (props.checkAutoRefresh) {
      if (props.checkAutoRefresh === false) {
        this.cancelPoll()
      }
      this.setState({ checkAutoRefresh: props.checkAutoRefresh })
    }
    this.fetchLogDetails(props.activity)
  }

  fetchLogDetails (activity) {
    const nodeData = this.props.nodeData
    this.units = []
    this.isCompleted = nodeData.status === 'FAILED' || nodeData.status === 'SUCCESS' ? true : this.isCompleted

    if (activity && activity.uuid && this.props.appId && this.props.envId) {
      apis.service
        .list(getEndpoint(activity.uuid, this.props.appId, this.props.envId))
        .then(res => {
          // console.log('*** fetchLogDetails: ', res)
          const commandUnits = res.resource
          if (commandUnits) {
            this.units = []
            let hasRunning = false
            let isAllQueued = true // initially, all units are in "QUEUED" status.

            commandUnits.map(unit => {
              this.units.push(unit)
              this.isCompleted = !this.isCompleted ? unit.commandExecutionStatus === 'FAILURE' : this.isCompleted
              hasRunning = !this.isCompleted && !hasRunning ? unit.commandExecutionStatus === 'RUNNING' : hasRunning
              if (unit.commandExecutionStatus !== 'QUEUED') {
                isAllQueued = false
              }
            })
            if (isAllQueued === false && (this.isCompleted || hasRunning === false)) {
              // cancel Polling when it completed or has no more running unit
              this.isCompleted = true
              this.cancelPoll()
            } else {
              if (this.state.checkAutoRefresh) {
                this.startPoll()
              }
            }
          } else {
            this.cancelPoll()
            // console.log('no logs available')
          }
          this.setState({ lastUpdatedTime: Date.now() })
          this.fetchingDone = true
        })
        .catch(error => {
          this.cancelPoll()
          throw error
        })
    }
  }

  cancelPoll () {
    if (this.pollInProgress) {
      clearInterval(this.pollInProgress)
    }
    this.pollInProgress = 0
  }

  startPoll (interval = this.state.pollInterval) {
    this.cancelPoll()

    this.pollInProgress = setInterval(() => {
      if (this.pollInProgress) {
        if (this.fetchingDone) {
          this.fetchingDone = false
          this.fetchLogDetails(this.state.activity)
        }
      }
    }, interval * 1000)
  }

  onRefresh () {
    this.fetchLogDetails(this.state.activity)
  }

  onHide () {
    this.cancelPoll()
    this.setState({ checkAutoRefresh: false })
    this.props.onHide()
  }

  handleCheckAutoRefresh = e => {
    const _checked = e.target.checked
    if (_checked) {
      this.startPoll()
    } else {
      this.cancelPoll()
    }
    this.setState({ checkAutoRefresh: _checked })
  }

  handlePollIntervalChanged = e => {
    const value = e.target.value
    this.setState({ pollInterval: value })
    this.startPoll(value)
  }

  downloadLog = e => {
    Utils.downloadFile(
      getDownloadEndpoint(this.state.activity.uuid, this.props.appId, this.props.envId),
      'Activity' + new Date().toString() + '.log'
    )
  }

  defaultExpanded (commandUnit, index) {
    if (commandUnit.commandExecutionStatus === 'FAILURE') {
      this.current = index
      return true
    }

    if (this.isCompleted) {
      return false
    }

    if (commandUnit.commandExecutionStatus === 'RUNNING') {
      if (index === 0 || index === this.current) {
        this.current = index
        return true
      } else {
        // verify if prev is still running
        const prev = this.units[this.current]
        if (prev.commandExecutionStatus !== 'RUNNING') {
          this.current = index
          return true
        }
        return
      }
      /* As ESLint says unreachable code commenting out */
      //  return false
    }
  }

  renderAutoRefresh () {
    if (this.isCompleted) {
      return null
    }

    const spanClassNames = !this.state.checkAutoRefresh ? 'hidden' : ''
    return (
      <FormGroup>
        <Checkbox checked={this.state.checkAutoRefresh || ''} onChange={this.handleCheckAutoRefresh}>
          <span className="refresh-label"> Auto refresh </span>
          <span className={'refresh-select ' + spanClassNames}>
            <select value={this.state.pollInterval} className="btn btn-mini" onChange={this.handlePollIntervalChanged}>
              {pollIntervals.map(item =>
                <option key={item}>
                  {item}
                </option>
              )}
            </select>sec
          </span>
        </Checkbox>
        <span className="pull-right">
          (Last Updated: {moment(this.state.lastUpdatedTime).fromNow()})
        </span>
      </FormGroup>
    )
  }

  renderDownload () {
    if (!this.isCompleted) {
      return null
    }

    return (
      <button key="download" onClick={this.downloadLog} className="btn btn-link downloadIcon" title="Download Logs">
        <i className="icons8-installing-updates-2" />&nbsp;<span>Download Logs</span>
      </button>
    )
  }

  render () {
    // console.log('*** ActivityModal.js render: ', this.units.length, ': ', this.units)
    // fetchLogDetails in some cases set this.units = [] which causes the Activity are flickering (empty & appear back)
    // => to fix that: use this.lastUnits to remember the previous this.units when it's empty:
    if (this.units.length === 0) {
      this.units = this.lastUnits
    } else {
      this.lastUnits = this.units
    }

    // Panel content
    const activityPanel = (
      <div>
        {this.units.map((item, index) =>
          <ActivityPanel
            key={index}
            commandUnit={item}
            defaultExpanded={this.defaultExpanded(item, index)}
            completed={this.isCompleted}
            activity={this.state.activity}
            appId={this.props.appId}
            envId={this.props.envId}
            show={this.props.show}
            downloadLog={this.downloadLog}
          />
        )}
      </div>
    )

    // render without Modal
    if (this.props.modalView === false) {
      return (
        <section className={css.main}>
          {activityPanel}
          <Row className="show-grid">
            {!this.isCompleted && <span className="wings-spinner progress" />}
            <div className="text-left progress-options">
              {this.renderAutoRefresh()}
              {this.renderDownload()}
            </div>
          </Row>
        </section>
      )
    }

    // render with Modal
    return (
      <Modal show={this.props.show} onHide={this.onHide.bind(this)} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>
            Details
            <button
              key="download"
              onClick={this.downloadLog}
              className="btn btn-tool downloadIcon"
              title="Download Logs"
            >
              <i className="icons8-installing-updates-2" />
            </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activityPanel}
        </Modal.Body>

        <Modal.Footer>
          <Row className="show-grid">
            <Col xs={12} md={8} className="pull-right">
              {this.renderAutoRefresh()}
            </Col>
            <Col xs={6} md={4} className="text-left">
              <Button onClick={this.onRefresh.bind(this)}>Refresh </Button>
              <Button bsStyle="primary" onClick={this.onHide.bind(this)}>
                Close
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ActivityPage/ActivityModal.js