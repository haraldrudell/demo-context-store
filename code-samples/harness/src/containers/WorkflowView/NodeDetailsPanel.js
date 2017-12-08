import React from 'react'
import { BreakdownProgress, Highlight, CompUtils, StencilConfigs, Utils } from 'components'
import ActivityModal from '../ActivityPage/ActivityModal'
// import AppDynamicsVerification from './custom/AppDynamicsVerification'
import AppDynamicsVerification3 from './custom/AppDynamicsVerification3'
import NewRelicVerification from './custom/NewRelicVerification'
import SplunkVerification from './custom/SplunkVerification'
import css from './NodeDetailsPanel.css'

export default class NodeDetailsPanel extends React.Component {
  state = {
    data: {},
    fullScreen: false,
    styles: {
      width: '500px'
    }
  }

  componentWillMount () {
    this.init(this.props)
  }

  componentWillReceiveProps (newProps) {
    this.init(newProps)
  }

  init (props) {
    const nodeData = props.data
    if (nodeData) {
      this.setState(prevState => {
        const styles = Object.assign({}, prevState.styles)
        if (['SPLUNKV2', 'ELK', 'LOGZ', 'NEW_RELIC', 'SUMO'].includes(nodeData.type)) {
          styles.width = '48%'
          styles.minWidth = '550px'
        }
        return { styles, data: nodeData }
      })
    }
  }

  onExpand = () => {
    const nodeData = this.state.data
    const details = nodeData.executionDetails || {}
    if (details && details.activityId) {
      this.props.onShowActivity(details.activityId.value)
    }
  }

  onToggleFullscreen = e => {
    const fullScreen = !this.state.fullScreen
    this.setState({ fullScreen })
    const event = new Event('node-details-toggle-fullscreen')
    document.dispatchEvent(event)
    this.props.onToggleFullscreen(fullScreen)
  }

  render () {
    const nodeData = this.state.data

    const details = nodeData.executionDetails || {}
    const iconClass = StencilConfigs.getNodeIconClass(nodeData.type, nodeData.name)

    const progress = Utils.getProgressPercentages(nodeData)
    const progressBar = <BreakdownProgress className="__nodeProgress" progress={progress} status={nodeData.status} />
    let detailsContent = null

    if (details && details.activityId) {
      // for Activity (Log Panel)
      const activityObj = { uuid: details.activityId.value }
      detailsContent = (
        <div key={details.activityId.value}>
          <div className="__topIcons">{/* <i className="icons8-expand" onClick={this.onExpand} /> */}</div>
          <ActivityModal
            useDebounce={true}
            modalView={false}
            checkAutoRefresh={false}
            nodeData={nodeData}
            activity={activityObj}
            appId={this.props.appId}
            envId={this.props.envId}
            show={true}
            onHide={() => {}}
          />
        </div>
      )
    } else if (nodeData.type === 'APP_DYNAMICS') {
      detailsContent = <AppDynamicsVerification3 key={nodeData.id} {...this.props} nodeData={nodeData} />
    } else if (nodeData.type === 'NEW_RELIC') {
      detailsContent = <NewRelicVerification key={nodeData.id} {...this.props} nodeData={nodeData} />
    } else if (nodeData.type === 'SPLUNKV2') {
      detailsContent = <SplunkVerification key={nodeData.id} {...this.props} nodeData={nodeData} />
    } else if (nodeData.type === 'ELK') {
      detailsContent = <SplunkVerification key={nodeData.id} {...this.props} nodeData={nodeData} />
    } else if (nodeData.type === 'LOGZ') {
      detailsContent = <SplunkVerification key={nodeData.id} {...this.props} nodeData={nodeData} />
    } else if (nodeData.type === 'SUMO') {
      detailsContent = <SplunkVerification key={nodeData.id} {...this.props} nodeData={nodeData} />
    } else {
      detailsContent = (
        <div>
          {Object.keys(details).map(key => {
            // if (['hostId', 'hostName', 'templateId', 'templateName'].indexOf(key) >= 0) {
            //   // ignore these fields
            //   return null
            // }
            const originalVal = details[key].value
            let val = details[key].value

            const valStr = val.toString().trim()
            if (
              key === 'httpResponseBody' ||
              valStr.indexOf('<?xml') === 0 ||
              (valStr[0] === '<' && valStr[valStr.length - 1] === '>')
            ) {
              let truncatedVal = val
              if (val.length > 1000) {
                truncatedVal = val.substr(0, 1000) + '...' // <Highlight> will hang with very long "val" string.
              }
              return (
                <div key={nodeData.id}>
                  <dl className="dl-horizontal wings-dl __dl" style={{ display: 'inline-block' }}>
                    <dt>{details[key].displayName}</dt>
                  </dl>
                  <Highlight language="xml">{truncatedVal}</Highlight>
                </div>
              )
            }
            /* Commenting out as there is no reson to trim it off (and there is lot of space to show the error)
             https://harness.atlassian.net/browse/HAR-1922*/
            /* if (typeof val === 'string' && val.length > 80) {
              val = val.slice(0, 200) + '...'
            }*/
            if (typeof val === 'number' && val.toString().length === 13) {
              val = Utils.formatDate(val)
            }

            if (typeof val === 'string' && val.indexOf('http') === 0) {
              return (
                <div key={key}>
                  <dl className="dl-horizontal wings-dl __dl" style={{ display: 'inline-block' }}>
                    <dt>{details[key].displayName}</dt>
                    <dd>
                      <a href={val} target="_blank">
                        {val}
                      </a>
                    </dd>
                  </dl>
                </div>
              )
            }

            let statusEl = null
            if (key === 'jobParameters') {
              return (
                <div key={key}>
                  <dl className="dl-horizontal wings-dl __dl" style={{ display: 'block' }}>
                    <dt>{details[key].displayName}</dt>
                  </dl>
                  {Object.keys(val).map(valKey => {
                    return (
                      <dl key={valKey} className="dl-horizontal wings-dl __dl" style={{ display: 'inline-block' }}>
                        <dt>{valKey}</dt>
                        <dd>{val[valKey]}</dd>
                      </dl>
                    )
                  })}
                </div>
              )
            }
            if (key === 'fileAssertionData') {
              // example: Jenkin Verification: fileAssertionData.value = [ { filePath: '', status: '' } ]
              return (
                <div key={key}>
                  <dl className="dl-horizontal wings-dl __dl" style={{ display: 'block' }}>
                    <dt>{details[key].displayName}</dt>
                  </dl>
                  {val.map(item => {
                    let fileData = item.fileData
                    if (typeof fileData === 'string' && fileData.length > 80) {
                      fileData = fileData.slice(0, 200) + '...'
                    }
                    return (
                      <dl key={fileData} className="dl-horizontal wings-dl __dl" style={{ display: 'inline-block' }}>
                        <dt>File Path</dt>k
                        <dd>{item.filePath}</dd>
                        <dt>File Data</dt>
                        <dd title={item.fileData}>{fileData}</dd>
                        <dt>Assertion</dt>
                        <dd>{item.assertion}</dd>
                        <dt>Status</dt>
                        <dd>{item.status}</dd>
                      </dl>
                    )
                  })}
                </div>
              )
            }

            if (val === 'FAILED' || val === 'FAILURE') {
              statusEl = <span className="error-text">{val}</span>
            } else if (val === 'SUCCESS') {
              statusEl = <span className="success-text">SUCCESS</span>
            } else {
              statusEl = <span title={originalVal}>{val.toString()}</span>
            }

            return (
              <dl key={key} className="dl-horizontal wings-dl __dl">
                <dt>{details[key].displayName}</dt>
                <dd>{statusEl}</dd>
              </dl>
            )
          })}
        </div>
      )
    }

    let mainClass = '__nodeDetails ' + css.main
    if (this.state.fullScreen) {
      mainClass += ' ' + css.fullScreen
    }

    return (
      <section className={mainClass + ' ' + css[nodeData.type]} style={this.state.styles}>
        <h3>
          <i
            className={iconClass}
            style={{ display: typeof nodeData.type !== 'undefined' ? 'inline-block' : 'none' }}
          />
          {nodeData.name}

          <span className="__expandBox" onClick={this.onToggleFullscreen}>
            <i className="icons8-expand" />
          </span>

          {CompUtils.renderStatusIcon(nodeData.status, true)}
        </h3>
        {progressBar}

        {detailsContent}
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowView/NodeDetailsPanel.js