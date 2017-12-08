import React from 'react'
import { Panel } from 'react-bootstrap'
import apis from 'apis/apis'
import { Utils } from 'components'
import Convert from 'ansi-to-html'

const convert = new Convert()
const LOG_LIMIT = 100000
const LOG_VIEW_LIMIT = 2000

const getEndpoint = (activityId, appId, envId, unitName, offset, limit) => {
  return (
    'activities/' +
    activityId +
    '/logs?appId=' +
    appId +
    '&envId=' +
    envId +
    '&unitName=' +
    unitName +
    '&offset=' +
    offset +
    '&limit=' +
    limit
  )
}

const tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
}

export default class ActivityPanel extends React.Component {
  state = {
    lastUpdatedTime: Date.now()
  }
  pollInProgress = false
  offset = 0
  logs = {}
  commandExecutionStatus = ''
  expanded = false
  userExpanded = false
  offset = 0
  limit = 100
  partialLogs = false

  componentWillMount () {
    this.initData(this.props)
  }

  componentWillReceiveProps (newProps) {
    this.initData(newProps)
    // this.debouncedInit(newProps)
  }

  debouncedInit = Utils.debounce(props => this.initData.bind(this, props), 500)

  initData (props) {
    if (props.show && props.commandUnit) {
      this.expanded = props.defaultExpanded
      this.completed = props.completed
      // Panel is expanded => fetch Log Details
      if (this.expanded) {
        this.partialLogs = false
        this.fetchLogDetails(props.activity, props.commandUnit)
      }
    }
  }

  fetchLogDetails (activity, commandUnit) {
    if (activity && activity.uuid && this.props.appId && this.props.envId && commandUnit && this.offset < LOG_LIMIT) {
      apis.service
        .list(getEndpoint(activity.uuid, this.props.appId, this.props.envId, commandUnit.name, this.offset, this.limit))
        .then(res => {
          if (res.resource && res.resource.response && res.resource.response.length > 0) {
            res.resource.response.map(logItem => {
              this.logs[logItem.uuid] = logItem
            })

            this.offset += res.resource.response.length
            if (this.completed) {
              if (Object.keys(this.logs).length < res.resource.total) {
                this.partialLogs = true
              }
            }
          } else {
            if (Object.keys(this.logs).length <= 0) {
              // Logs are empty
              if (this.completed || commandUnit.commandExecutionStatus !== 'RUNNING') {
                this.logs['noid'] = { logLine: 'Logs are not available' }
              }
            }
          }
          this.setState({ lastUpdatedTime: Date.now() })
        })
        .catch(error => {
          throw error
        })
    }
  }

  replaceTag = tag => {
    return tagsToReplace[tag] || tag
  }

  safeTagsReplace = str => {
    return str.replace(/[&<>]/g, this.replaceTag)
  }

  formatLogItem (logItem, idx) {
    const logSpaces = '   '
    let _formatted = ''
    if (logItem) {
      if (logItem.logLevel) {
        _formatted =
          logItem.logLevel + logSpaces + Utils.formatDate(logItem.createdAt, 'YYYY-MM-DD HH:mm:ss') + logSpaces
      }
      // TODO: TBD need to find better solution
      return (
        <div key={idx}>
          <span>{_formatted} </span>
          <span dangerouslySetInnerHTML={{ __html: convert.toHtml(this.safeTagsReplace(logItem.logLine)) }} />
        </div>
      )
    }
    return <span key={idx}>{_formatted}</span>
  }

  handlePanelClick = e => {
    if (
      e.target.attributes &&
      e.target.attributes['aria-expanded'] &&
      e.target.attributes['aria-expanded'].value === 'false'
    ) {
      // fetch only when expanding the panel
      this.fetchLogDetails(this.props.activity, this.props.commandUnit)
      this.userExpanded = true
    } else {
      this.userExpanded = false
      this.setState({ lastUpdatedTime: Date.now() })
    }
  }

  downloadLog = e => {
    e.preventDefault()
    e.stopPropagation()
    this.props.downloadLog(e)
  }

  renderDownloadLogLine () {
    if (this.partialLogs) {
      return (
        <span>
          <hr />
          Logs are truncated.. Please
          <a href="#" className="btn-link __downloadLog" onClick={this.downloadLog}>
            &nbsp;
            <i className="icons8-installing-updates-2" />
            &nbsp;Download Logs &nbsp;
          </a>
          to view Complete Details..
        </span>
      )
    }

    return null
  }

  render () {
    const expanded = this.expanded || this.userExpanded
    const className = this.props.commandUnit.commandExecutionStatus + (expanded ? ' expanded' : '')

    const logsTail = Object.keys(this.logs).slice(-LOG_VIEW_LIMIT)

    return (
      <Panel
        collapsible
        expanded={expanded}
        header={this.props.commandUnit.name}
        className={className}
        onClick={this.handlePanelClick}
      >
        <div
          className="console-container"
          onClick={e => {
            e.stopPropagation()
          }}
        >
          {logsTail.length > 0 && (
            <div key={this.props.commandUnit.uuid}>
              {logsTail.map((id, idx) => this.formatLogItem(this.logs[id], idx))}
            </div>
          )}
          {logsTail.length <= 0 && <pre>Loading...</pre>}

          {this.renderDownloadLogLine()}
        </div>
      </Panel>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ActivityPage/views/ActivityPanel.js