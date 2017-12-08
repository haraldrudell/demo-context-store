import React from 'react'
import { Link } from 'react-router'
import { PopoverInteractionKind } from '@blueprintjs/core'
import TimeAgo from 'react-timeago'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import DataGrid from '../DataGrid/DataGrid'
import Utils from '../Utils/Utils'
import { AlertService } from 'services'
import css from './AppNotificationBar.css'

class AppNotificationBar extends React.Component {
  state = {
    setupIssues: [],
    approvals: [],
    interventions: []
    // setupIssues: [{ uuid: '1', title: 'Issue 1', status: 'Open', category: 'Setup', type: 'ApprovalNeeded' }],
    // approvals: [{ uuid: '1', title: 'Issue 1', status: 'Open', category: 'Approval', type: 'ApprovalNeeded' }],
    // interventions: [
    //   { uuid: '1', title: 'Issue 1', status: 'Open', category: 'ManualIntervention',
    //     type: 'ManualInterventionNeeded' }
    // ]
  }

  async componentWillMount () {
    const { alerts, error } = await AlertService.fetchAlerts({ accountId: this.props.urlParams.accountId })
    if (!error) {
      const setupIssues = alerts.filter(a => a.category === 'Setup' && a.status === 'Open')
      const approvals = alerts.filter(a => a.category === 'Approval' && a.status === 'Open')
      const interventions = alerts.filter(a => a.category === 'ManualIntervention' && a.status === 'Open')
      this.setState({ setupIssues, approvals, interventions })
    }
  }

  TimeFormatter = props => {
    return <TimeAgo date={props.value} title={Utils.formatDate(props.value)} minPeriod={30} />
  }

  setupIssueFormatter = props => {
    const data = props.dependentValues
    const { path } = this.props
    const { accountId } = data
    return <Link to={path.toSetupDelegates({ accountId })}>{data.title}</Link>
  }

  approvalFormatter = props => {
    const data = props.dependentValues
    const { path } = this.props
    const { accountId, appId } = data
    const execId = Utils.getJsonValue(data, 'alertData.executionId')

    return <Link to={path.toDeploymentDetails({ accountId, appId, execId })}>{data.title}</Link>
  }

  interventionFormatter = props => {
    const data = props.dependentValues
    const { path } = this.props
    const { accountId, appId } = data
    const envId = Utils.getJsonValue(data, 'alertData.envId')
    const execId = Utils.getJsonValue(data, 'alertData.executionId')

    return <Link to={path.toExecutionDetails({ accountId, appId, envId, execId })}>{data.title}</Link>
  }

  renderIssuesDropdown = () => {
    const { setupIssues } = this.state
    const columns = [
      {
        key: 'title',
        name: 'Problem',
        resizable: true,
        sortable: true,
        getRowMetaData: row => row,
        formatter: this.setupIssueFormatter
      },
      {
        key: 'createdAt',
        name: 'Time Detected',
        resizable: true,
        sortable: true,
        formatter: this.TimeFormatter,
        width: 120
      }
    ]
    const popover = (
      <ui-popover-content>
        <DataGrid columns={columns} gridData={setupIssues} minHeight={200} />
      </ui-popover-content>
    )
    const button = (
      <div>
        {setupIssues.length ? (
          <span className="error-text">
            <i className="icons8-attention right-gap" />
            {setupIssues.length} Setup Problem{Utils.pluralize(setupIssues.length)} Detected
          </span>
        ) : (
          <span>No Setup Problems Detected</span>
        )}
      </div>
    )
    return (
      <DropdownMenu
        content={popover}
        button={button}
        popoverProps={{ interactionKind: PopoverInteractionKind.HOVER }}
        showDropdown={setupIssues.length > 0}
      />
    )
  }

  renderApprovals = () => {
    const { approvals } = this.state
    const columns = [
      {
        key: 'title',
        name: 'Pipeline',
        resizable: true,
        sortable: true,
        formatter: this.approvalFormatter,
        getRowMetaData: row => row
      },
      {
        key: 'createdAt',
        name: 'Pending Since',
        resizable: true,
        sortable: true,
        width: 120,
        formatter: this.TimeFormatter
      }
    ]
    const popover = (
      <ui-popover-content>
        <DataGrid columns={columns} gridData={approvals} minHeight={200} />
      </ui-popover-content>
    )
    const button = (
      <div>
        {approvals.length ? (
          <span className="warning-text">
            <i className="icons8-attention right-gap" />
            {approvals.length} Pending Approval{Utils.pluralize(approvals.length)}
          </span>
        ) : (
          <span>No Pending Approvals</span>
        )}
      </div>
    )
    return (
      <DropdownMenu
        content={popover}
        button={button}
        popoverProps={{ interactionKind: PopoverInteractionKind.HOVER }}
        showDropdown={approvals.length > 0}
      />
    )
  }

  renderInterventions = () => {
    const { interventions } = this.state
    const columns = [
      {
        key: 'title',
        name: 'Deployment',
        resizable: true,
        sortable: true,
        getRowMetaData: row => row,
        formatter: this.interventionFormatter
      },
      {
        key: 'createdAt',
        name: 'Time Detected',
        resizable: true,
        sortable: true,
        formatter: this.TimeFormatter,
        width: 120
      }
    ]
    const popover = (
      <ui-popover-content>
        <DataGrid columns={columns} gridData={interventions} minHeight={200} />
      </ui-popover-content>
    )
    const button = (
      <div>
        {interventions.length ? (
          <span className="warning-text">
            <i className="icons8-attention right-gap" />
            {interventions.length} Pending Manual Intervention{Utils.pluralize(interventions.length)}
          </span>
        ) : (
          <span>No Pending Manual Intervention</span>
        )}
      </div>
    )
    return (
      <DropdownMenu
        content={popover}
        button={button}
        popoverProps={{ interactionKind: PopoverInteractionKind.HOVER }}
        showDropdown={interventions.length > 0}
      />
    )
  }

  render () {
    const { setupIssues, approvals, interventions } = this.state
    let headingCss = ''
    if (approvals.length > 0 || interventions.length > 0) {
      headingCss = 'warning-text'
    }
    if (setupIssues.length > 0) {
      headingCss = 'error-text'
    }
    let attentionEl = <span>&nbsp;</span>
    if (setupIssues.length > 0 || approvals.length > 0 || interventions.length > 0) {
      attentionEl = <span>ATTENTION NEEDED:</span>
    }

    return (
      <section className={css.main}>
        <div className={css.bar}>
          <div className={css.box + ' ' + headingCss}>{attentionEl}</div>
          <div className={css.box}>{this.renderIssuesDropdown()}</div>
          <div className={css.box}>|</div>
          <div className={css.box}>{this.renderApprovals()}</div>
          <div className={css.box}>|</div>
          <div className={css.box}>{this.renderInterventions()}</div>
        </div>
      </section>
    )
  }
}

export default AppNotificationBar



// WEBPACK FOOTER //
// ../src/components/NotificationBar/AppNotificationBar.js