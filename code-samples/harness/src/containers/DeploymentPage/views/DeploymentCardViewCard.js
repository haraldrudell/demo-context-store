import React from 'react'
import DeploymentSummary from './DeploymentSummary'
import { Utils, WorkflowExecControlBar } from 'components'
import css from './DeploymentCardViewCard.css'
import DeploymentDetailsView from '../../WorkflowView/DeploymentDetailsView'
import { ExecutionService } from 'services'
import { Logger } from 'utils'
import cache from 'plain-cache'
import xhr from 'xhr-async'
import { Link } from 'react-router'
import ABTest from '../../../utils/ABTest'

const XHR_GROUP = 'DeploymentCardViewCard'
const POLL_INTERVAL = 3000

export default class DeploymentCardViewCard extends React.Component {
  state = { jsplumbLoaded: false, showNotesModal: false }

  onEditClick = false

  componentWillReceiveProps (newProps) {
    const { params, insidePipeline } = newProps

    if (params && params.jsplumbLoaded === true) {
      this.setState({ jsplumbLoaded: true })
    }

    if (insidePipeline) {
      this.readStateFromCache(newProps)

      if (this.pollTimeoutId) {
        clearTimeout(this.pollTimeoutId)
        delete this.pollTimeoutId
      }
    }
  }

  componentWillMount () {
    this.readStateFromCache(this.props)
  }

  componentWillUpdate (nextProps) {
    this.readStateFromCache(nextProps)
  }

  componentWillUnmount () {
    xhr.abort(XHR_GROUP)
    clearTimeout(this.pollTimeoutId)
    clearTimeout(this.prepareDataTimeoutId)
    delete this.pollTimeoutId
    delete this.prepareDataTimeoutId
  }

  readStateFromCache = props => {
    const { execution } = props
    const execUUID = execution && execution.uuid
    const cachedExec = execUUID && cache.get(execUUID)

    if (execution) {
      if (this.state.execution && this.state.execution.uuid !== execution.uuid) {
        this.setState({ execution: null })
      } else if (this.state.execution !== cachedExec) {
        this.setState({ execution: cachedExec })
      }
    }
  }

  formatExecutionTime = msec => {
    const date = new Date(1, 1, 1970)
    date.setSeconds(msec / 1000)
    const seconds = date.getSeconds()
    const minutes = date.getMinutes()
    const hour = date.getHours()

    let result = ''

    if (hour > 0) {
      result += hour + ' hr  '
    }

    if (minutes > 0) {
      result += minutes + ' min  '
    }

    result += seconds + ' sec'
    return result
  }

  onPauseClick = async execUUID => {
    const { props, props: { urlParams: { accountId }, execution: { appId, name } } } = this

    if (props.shouldHandleExecutionInterruptedInternally) {
      const { error, status } = await ExecutionService.pause({ accountId, appId, execUUID })
      props.onExecutionInterrupted({ type: 'pause', error, status, name })
    } else if (props.params.onPauseClick) {
      props.params.onPauseClick(execUUID)
    }
  }

  onResumeClick = async execUUID => {
    const { props, props: { urlParams: { accountId }, execution: { appId, name } } } = this

    if (props.shouldHandleExecutionInterruptedInternally) {
      const { error, status } = await ExecutionService.resume({ accountId, appId, execUUID })
      props.onExecutionInterrupted({ type: 'resume', error, status, name })
    } else if (props.params.onPauseClick) {
      props.params.onResumeClick(execUUID)
    }
  }

  onAbortClick = async execUUID => {
    const { props, props: { urlParams: { accountId }, execution: { appId, name } } } = this

    if (props.shouldHandleExecutionInterruptedInternally) {
      const { error, status } = await ExecutionService.abort({ accountId, appId, execUUID })
      props.onExecutionInterrupted({ type: 'abort', error, status, name })
    } else if (this.props.params.onAbortClick) {
      this.props.params.onAbortClick(execUUID)
    }
  }

  onRerunClick = item => {
    if (this.props.params.onRerunClick) {
      this.props.params.onRerunClick(item)
    }
  }

  onRollbackClick = async execUUID => {
    const { props, props: { urlParams: { accountId }, execution: { appId, name } } } = this

    if (props.shouldHandleExecutionInterruptedInternally) {
      const { error, status } = await ExecutionService.rollback({ accountId, appId, execUUID })
      props.onExecutionInterrupted({ type: 'ROLLBACK', error, status, name })
    } else if (this.props.params.onRollbackClick) {
      this.props.params.onRollbackClick(execUUID)
    }
  }

  toExecutionDetails = deployment => {
    const { path, urlParams: { accountId } } = this.props
    const { appId, envId } = deployment
    const execId = deployment.uuid || deployment.executionId
    return path.toExecutionDetails({ accountId, appId, envId, execId })
  }

  renderSetupInfo = ({ execution, renderedInline }) => {
    const { path, urlParams: { accountId } } = this.props
    const serviceNames = []

    if (execution.serviceExecutionSummaries) {
      execution.serviceExecutionSummaries.map(service => serviceNames.push(service.contextElement))
    }
    const router = null // TODO 171208 no-undef
    return (
      <section className={css.sideContent}>
        {renderedInline === false && (
          <label>
            Application:&nbsp;
            <a
              className="value link-color"
              onClick={() => router.push(path.toSetupServices({ accountId, appId: execution.appId }))}
            >
              {execution.appName}
            </a>
          </label>
        )}

        {serviceNames.length > 0 && (
          <label className={css.serviceLabel}>
            Services:&nbsp;
            {serviceNames
              .map((service, idx) => (
                <Link
                  key={`workflow-service-${idx + 1}`}
                  className="value link-style"
                  to={path.toSetupServiceDetails({ accountId, appId: execution.appId, serviceId: service.uuid })}
                >
                  {service.name}
                </Link>
              ))
              .reduce((links, link, index, array) => {
                links.push(link)

                if (index < array.length - 1) {
                  links.push(<span>,&nbsp;</span>)
                }

                return links
              }, [])}
          </label>
        )}
      </section>
    )
  }

  renderLoadingState () {
    return (
      <div>
        <ui-card loading>
          <p>
            Loading data<loading-dots>.</loading-dots>
          </p>
        </ui-card>
      </div>
    )
  }

  /*
   * Argument execution from props will have only { uuid, envId, appId }, this method
   * fetch all details of the execution.
   */
  prepareExecutionData = async () => {
    const { execution } = this.props
    const { uuid: execUUID } = execution
    const cachedExec = cache.get(execUUID)

    if (cachedExec) {
      if (this.state.execution !== cachedExec) {
        this.setState({ execution: cachedExec })
        this.forceUpdate()
      }

      if (ExecutionService.isExecutionEnded(cachedExec.status)) {
        return
      } else {
        return this.pollDataForWorkflowExecution(execution)
      }
    }

    this.fetchExecution(execution)
  }

  pollingTimeoutRatio = 1

  /*
   * Polling when workflow is non-ended. As soon as the workflow moves to an end state,
   * stop polling.
   */
  pollDataForWorkflowExecution = async execution => {
    if (!this.pollTimeoutId) {
      clearTimeout(this.pollTimeoutId)
      const startTime = +new Date()
      const exec = await this.fetchExecution(execution)

      if (exec && ExecutionService.isExecutionEnded(exec.status)) {
        delete this.pollTimeoutId
      } else {
        const error = !exec
        const fetchTime = +new Date() - startTime

        if (error) {
          this.pollingTimeoutRatio += 1
        } else if (fetchTime >= POLL_INTERVAL) {
          this.pollingTimeoutRatio = Math.ceil(fetchTime / POLL_INTERVAL)
        } else {
          this.pollingTimeoutRatio = 1
        }

        this.pollTimeoutId = setTimeout(
          _ => this.pollDataForWorkflowExecution(execution),
          POLL_INTERVAL * this.pollingTimeoutRatio
        )
      }
    }
  }

  /*
   * Fetch actual workflow execution details. Note that the execution argument only
   * contains partial information of the execution ({ appId, envId, uuid }).
   */
  fetchExecution = async ({ uuid: execUUID, appId, envId }) => {
    const { error, execution } = await ExecutionService.fetchWorkflowExecutionDetails({
      execUUID,
      appId,
      envId,
      group: XHR_GROUP
    })

    if (!error) {
      cache.set(execUUID, execution, cache.VALID_FOR_30_MINUTES)
      this.setState({ execution })
      this.forceUpdate()
    } else {
      Logger.error('Failed to load workflow execution details', { execUUID, error })
      return null
    }

    return execution
  }

  getNotes = ({ execution }) => {
    if (execution) {
      const { executionArgs } = execution

      return executionArgs ? executionArgs.notes : ''
    }
  }

  render () {
    const { insidePipeline, renderedInline, router } = this.props
    const execution = this.state.execution || this.props.execution
    /* To not to pass the entire execution getting/deriving notes here from execution */
    const { uuid: execId, appId } = execution
    const notes = this.getNotes({ execution })
    const executionParams = {
      execId,
      appId,
      notes
    }

    if (insidePipeline && ABTest.isExecutionFetchingOptimizationEnabled) {
      clearTimeout(this.prepareDataTimeoutId)
      this.prepareDataTimeoutId = setTimeout(_ => this.prepareExecutionData(execution), 0)

      if (!this.state.execution) {
        return this.renderLoadingState()
      }
    }

    const filteredName = execution.name.replace('Workflow: ', '')
    const extraClassName = `__execDetailsCard __execDetailsStatus_${execution.status}`
    const status = (this.workflowStatus = execution.status)
    const execWorkflowType = execution.orchestrationType

    if (!execution || !Object.keys(execution).length) {
      Logger.error('Invalid workflow execution. Possibly because of corrupted data', { props: this.props })
    }

    return (
      <div key={execution.uuid} className={`${css.main} ${extraClassName} __card-status-${execution.status}`}>
        <ui-card>
          <header onClick={_ => console.log(execution)}>
            <h5>
              <Link to={this.toExecutionDetails(execution)}>
                {filteredName}&nbsp;
                <time dateTime={new Date(execution.createdAt)}>
                  {!insidePipeline ? ' (Direct Workflow Execution) ' : ''}
                  {Utils.formatDate(execution.createdAt)}
                </time>
              </Link>
              {!insidePipeline && (
                <WorkflowExecControlBar
                  className={css.execControlBar}
                  status={this.workflowStatus}
                  onPauseClick={this.onPauseClick.bind(this, execution.uuid)}
                  onResumeClick={this.onResumeClick.bind(this, execution.uuid)}
                  shouldOpenAbortConfirmation={this.props.shouldHandleExecutionInterruptedInternally}
                  onAbortClick={this.onAbortClick.bind(this, execution.uuid)}
                  onRerunClick={this.onRerunClick.bind(this, execution)}
                  onRollbackClick={this.onRollbackClick.bind(this, execution.uuid)}
                  execWorkflowType={execWorkflowType}
                  executionParams={executionParams}
                />
              )}
            </h5>

            <section className={css.headerSideContent}>
              <div className="execution-time" />
              {this.renderSetupInfo({ execution, renderedInline })}
            </section>
          </header>

          <main>
            {!ExecutionService.isExecutionEnded(status) ? (
              [
                <DeploymentSummary
                  {...this.props}
                  data={execution}
                  path={this.props.path}
                  urlParams={this.props.urlParams}
                  router={router}
                />,
                <DeploymentDetailsView
                  {...this.props}
                  data={execution}
                  fullPage={false}
                  onContainerClick={() => router.push(this.toExecutionDetails(execution))}
                />
              ]
            ) : (
              <DeploymentSummary
                {...this.props}
                data={execution}
                path={this.props.path}
                urlParams={this.props.urlParams}
                router={router}
              />
            )}
          </main>
        </ui-card>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/DeploymentPage/views/DeploymentCardViewCard.js