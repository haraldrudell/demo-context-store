import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import css from './DeploymentsList.css'
import Utils from '../Utils/Utils'
import TimeAgo from 'react-timeago'
import Bubble from '../BubbleChart/Bubble'

@observer
class DeploymentsList extends React.Component {
  state = {}

  static propTypes = {
    executions: PropTypes.array,
    showApp: PropTypes.bool
  }

  static defaultProps = {
    showApp: true,
    executions: null
  }

  onRowClick = deployment => {
    const { accountId } = this.props.urlParams
    const { appId, envId } = deployment
    const execId = deployment.uuid || deployment.executionId

    if (deployment.workflowType === 'PIPELINE') {
      this.props.router.push(this.props.path.toDeploymentDetails({ accountId, appId, execId }))
    } else {
      this.props.router.push(this.props.path.toExecutionDetails({ accountId, appId, envId, execId }))
    }
  }

  renderExecutions (executions) {
    if (!executions) {
      return (
        <tbody>
          <tr>
            <td colSpan="3">
              <span className="wings-spinner" />
            </td>
          </tr>
        </tbody>
      )
    }

    if (executions.length <= 0) {
      return (
        <tbody>
          <tr>
            <td className="__appName">None</td>
            <td className="__artifacts">None</td>
            <td className="__envName">None</td>
            <td className="__wfname">None</td>
            <td className="__startTime">None</td>
            <td className="__center __circle">
              <Bubble className="" completed={1} diameter={80} tooltip="no data" key={0} />
            </td>
          </tr>
        </tbody>
      )
    }

    return (
      <tbody>
        {executions.map(exec => {
          // get Service Names from the array of serviceExecutionSummaries[x].contextElement.uuid
          const allApps = this.props.dataStore ? this.props.dataStore.apps.slice() : []
          const execServiceIds = exec.serviceExecutionSummaries
            ? exec.serviceExecutionSummaries.map(summ => summ.contextElement.uuid)
            : []
          const execServiceNames = Utils.serviceIdsToNames(allApps, execServiceIds)
          return (
            <tr key={exec.uuid} onClick={this.onRowClick.bind(this, exec)}>
              {this.props.showApp && <td className="__appName">{exec.appName}</td>}
              <td className="__service" title={execServiceNames.join(', ')}>
                {execServiceNames.join(', ')}
              </td>
              <td className="__envName">{exec.envName}</td>
              <td className="__wfname">{exec.name}</td>
              <td className="__startTime">
                <TimeAgo date={exec.startTs} minPeriod={30} />
              </td>
              <td className="__center __circle">
                <div className="bubble-container">
                  <Bubble className="" completed={1} diameter={80} tooltip={exec.name} key={exec.uuid} exec={exec} />
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    )
  }

  render () {
    return (
      <div className={'__deploymentsList ' + css.main}>
        <table className="table __table">
          <thead>
            <tr>
              {this.props.showApp && <th className="__appName">Application</th>}
              <th className="">Services</th>
              <th className="__envName">Environment</th>
              <th className="__wfname">Workflow/Command</th>
              <th className="__startTime">Start Time</th>
              <th className="__center __circle">Progress</th>
            </tr>
          </thead>
          {this.renderExecutions(this.props.executions)}
        </table>
      </div>
    )
  }
}

export default DeploymentsList



// WEBPACK FOOTER //
// ../src/components/DeploymentsList/DeploymentsList.js