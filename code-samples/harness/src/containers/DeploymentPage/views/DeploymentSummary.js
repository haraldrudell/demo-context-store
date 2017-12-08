import React from 'react'
import { TruncateText, Utils, BreakdownChart } from 'components'
import './DeploymentSummary.css'
import { Link } from 'react-router'
import { ExecutionUtils } from 'utils'
import { ExecutionService } from '../../../services'

export default class DeploymentSummary extends React.Component {
  static contextTypes = Utils.getDefaultContextTypes()
  state = {}

  componentWillMount () {
    Utils.loadChildContextToState(this, 'app')
  }

  componentWillUnmount () {
    Utils.unsubscribeAllPubSub(this)
  }

  onBubbleClick = deployment => {
    const { accountId } = this.props.urlParams
    const { appId, envId } = deployment
    this.props.router.push(this.props.path.toExecutionDetails({ accountId, appId, envId, execId: deployment.uuid }))
  }

  renderExecutionStatus (execStatus) {
    const status = execStatus.toLowerCase()
    const prop = {}
    prop[status] = true

    return <execution-status {...prop}>{execStatus}</execution-status>
  }

  transformBreakdown (status, breakdown) {
    const _breakdown = Object.assign({ running: breakdown.inprogress }, breakdown) // make a copy
    delete _breakdown.inprogress // inprogress becomes running
    const total = Object.values(breakdown).reduce((value, sum) => value + sum, 0)

    return ExecutionUtils.ExecutionStatusStyleMapping
      .filter(entry => _breakdown[entry.status.toLowerCase()] > 0)
      .map(entry => {
        const st = entry.status.toLowerCase()
        entry.count = _breakdown[st]
        entry.total = total
        entry.title = st.charAt(0).toUpperCase() + st.slice(1).toLowerCase() + `: ${entry.count}`
        return entry
      })
  }

  renderCISummary ({ deployment }) {
    const summaries = Utils.getJsonValue(deployment, 'buildExecutionSummaries') || []
    const pipelineName = Utils.getJsonValue(deployment, 'pipelineSummary.pipelineName') || 'None'
    const triggeredBy = Utils.getJsonValue(deployment, 'triggeredBy.name') || 'None'
    const placeHolder = ExecutionService.isExecutionEnded(deployment.status) ? 'N/A' : <loading-dots>.</loading-dots>

    const artifactSources = []
    const revisions = []
    const metadata = []
    const buildURLs = []
    const len = summaries && summaries.length
    const loadingAttrs = (len === 0) && { className: 'tooltip--top', 'data-tooltip': 'Data is being collected' }

    if (len) {
      const prefix = (text, len, source) => len >= 1 ? source + ' (' + text + ')' : text

      summaries.forEach((summary, index) => {
        const source = summary.artifactSource
        artifactSources.push(source)
        revisions.push(prefix(summary.revision, len, source))
        metadata.push(summary.metadata)
        buildURLs.push(
          <a key={index + 1} target="_blank" href={summary.buildUrl}>
            {summary.buildName}
          </a>
        )

        if (index + 1 < len) {
          buildURLs.push(<span key={index + 100}>,&nbsp;</span>)
        }
      })
    }

    return (
      <summary-container>
        <summary-info>
          <label>
            <span>Artifact Sources</span>
            <span {...loadingAttrs}>
              {len > 0 && <TruncateText inputText={artifactSources.join(', ')} /> || placeHolder}
            </span>
          </label>

          <label>
            <span>Pipeline</span>
            <span>{pipelineName}</span>
          </label>

          <label>
            <span>Build/URLs</span>
            <span {...loadingAttrs}>{len > 0 && buildURLs || placeHolder}</span>
          </label>
        </summary-info>

        <summary-info>
          <label>
            <span>Revision</span>
            <span data-revision {...loadingAttrs}>
              {len > 0 && <TruncateText inputText={revisions} isArray /> || placeHolder}
            </span>
          </label>

          <label>
            <span>Meta-Data</span>
            <span {...loadingAttrs}>
              {len > 0 && <TruncateText inputText={metadata.join(', ')} /> || placeHolder}
            </span>
          </label>
          <label>
            <span>Triggered By</span>
            <span>{triggeredBy}</span>
          </label>
        </summary-info>
      </summary-container>
    )
  }

  renderSummary ({ deployment }) {
    const serviceNames = []
    let instanceNamesArray = []
    let infrastructureNamesArray = []
    let artifactNamesArray = []

    if (deployment.executionArgs && deployment.executionArgs.artifacts) {
      const artifacts = deployment.executionArgs.artifacts
      if (artifacts && artifacts.length > 0) {
        artifactNamesArray = artifacts.map(
          artifact => artifact.artifactSourceName + ' (build# ' + artifact.buildNo + ')'
        )
      }
    }

    if (deployment.serviceExecutionSummaries) {
      deployment.serviceExecutionSummaries.map(service => {
        // Get service names
        serviceNames.push(service.contextElement)

        // Get instance names
        if (service.instanceStatusSummaries && service.instanceStatusSummaries.length > 0) {
          instanceNamesArray = service.instanceStatusSummaries.map(instance => instance.instanceElement.displayName)
        }

        // Get infrastructure names
        const { infraMappingSummaries } = service
        if (infraMappingSummaries && infraMappingSummaries.length > 0) {
          infrastructureNamesArray = infraMappingSummaries.map(infrastructure => infrastructure.displayName)
        }
      })
    }

    const { path, urlParams: { accountId } } = this.props
    const envLink = path.toEnvironmentsDetails({ accountId, appId: deployment.appId, envId: deployment.envId })
    const triggeredBy = Utils.getJsonValue(deployment, 'triggeredBy.name') || 'None'
    const pipelineName = Utils.getJsonValue(deployment, 'pipelineSummary.pipelineName') || 'None'

    return (
      <summary-container>
        <summary-info>
          <label>
            <span>Environment</span>
            <Link to={envLink}>{deployment.envName}</Link>
          </label>

          <label>
            <span>Pipeline</span>
            <span>{pipelineName}</span>
          </label>

          <label>
            <span>Artifacts</span>
            <span>
              {artifactNamesArray && artifactNamesArray.length > 0 ? (
                <TruncateText inputText={artifactNamesArray} isArray />
              ) : (
                'None'
              )}
            </span>
          </label>
        </summary-info>

        <summary-info>
          <label>
            <span>Instances Deployed</span>
            <span>{instanceNamesArray && instanceNamesArray.length > 0 ? instanceNamesArray.length : 'None'}</span>
          </label>

          <label>
            <span>Infrastructure</span>
            <span>
              {infrastructureNamesArray && infrastructureNamesArray.length > 0 ? (
                <TruncateText inputText={infrastructureNamesArray} isArray />
              ) : (
                'None'
              )}
            </span>
          </label>
          <label>
            <span>Triggered By</span>
            <span>{triggeredBy}</span>
          </label>
        </summary-info>
      </summary-container>
    )
  }

  render () {
    const deployment = this.props.data || {}
    const { status, orchestrationType } = deployment
    const isCIExecution = orchestrationType && orchestrationType.toLowerCase() === 'build'
    const breakdown = this.transformBreakdown(status, deployment.breakdown)
    const breakdownTitle = `Status: ${status}\r\n${breakdown.map(entry => entry.title).join('\r\n')}`

    return (
      <deployment-summary>
        {this.renderExecutionStatus(status)}
        <breakdown-container title={breakdownTitle} status={status.toLowerCase()}>
          <BreakdownChart
            status={status}
            icon={ExecutionUtils.styleForStatus(status).icon}
            title={breakdownTitle}
            breakdown={breakdown}
            onClick={() => this.onBubbleClick(deployment)}
          />
        </breakdown-container>

        {isCIExecution && this.renderCISummary({ deployment })}
        {!isCIExecution && this.renderSummary({ deployment })}
      </deployment-summary>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/DeploymentPage/views/DeploymentSummary.js