import React from 'react'
import { TooltipOverlay, Utils } from 'components'
import WorkflowView from '../../WorkflowView/WorkflowView'
import css from './WorkflowCardView.css'
import { ActionButtons } from 'components'
import SetupAsCodePanel from '../../SetupAsCode/SetupAsCodePanel.js'
import { Popover, Position } from '@blueprintjs/core'

export default class WorkflowCardView extends React.Component {
  state = {
    jsplumbLoaded: false
  }

  componentWillReceiveProps (newProps) {
    if (newProps.params && newProps.params.jsplumbLoaded === true) {
      this.setState({ jsplumbLoaded: true })
    }
  }

  sortData = () => {
    if (this.props.params.data.length > 0) {
      const data = Utils.clone(this.props.params.data)
      const sortedData = Utils.sortDataByKey(data, 'name', 'ASC')
      return sortedData
    }
  }

  renderTemplateStamp = () => (
    <TooltipOverlay tooltip="Templatized Workflow">
      <span className={css.templateStatus}>Template</span>
    </TooltipOverlay>
  )

  renderServiceName = workflow => {
    let serviceNames
    if (workflow) {
      const phases = workflow.orchestrationWorkflow ? workflow.orchestrationWorkflow.workflowPhases : []
      if (phases && phases.length > 0) {
        const templateExpressions = Utils.getTemplateExpressionFromPhases(phases, Utils.entityTypes.service)
        if (templateExpressions.length > 0) {
          serviceNames = templateExpressions.map(item => item.expression).join(', ')
        } else {
          serviceNames = workflow.services.map(svc => svc.name).join(', ')
        }
      } else {
        serviceNames = workflow.services.map(svc => svc.name).join(', ')
      }
    }
    return serviceNames
  }

  renderActionButtons = ({ item }) => {
    const selectId = item.uuid
    const setUpAsCode = (
      <Popover
        position={Position.LEFT_TOP}
        useSmartArrowPositioning={true}
        content={<SetupAsCodePanel {...this.props} selectId={selectId} />}
      >
        <i className="icons8-source-code" />
      </Popover>
    )
    const buttons = {
      cloneFunc: this.props.params.onClone.bind(this, item),
      deleteFunc: this.props.params.onDelete.bind(this, item.uuid)
    }

    return (
      <action-buttons>
        <ui-card-actions>
          {setUpAsCode}
          <ActionButtons buttons={buttons} />
        </ui-card-actions>
      </action-buttons>
    )
  }

  render () {
    let sortedData
    if (this.props.params.data !== null && this.props.params.data.length > 0) {
      sortedData = this.sortData()
    }

    return (
      <div className={css.main}>
        {sortedData &&
          sortedData.map(item => {
            const env = this.props.params.environments.find(e => e.uuid === item.envId) || {}
            const isValid = item.orchestrationWorkflow && item.orchestrationWorkflow.valid
            const workflowType = Utils.getJsonValue(item, 'orchestrationWorkflow.orchestrationWorkflowType') || ''
            const workflowTypeText = Utils.getCatalogDisplayText(
              this.props.params.catalogs,
              'WORKFLOW_ORCHESTRATION_TYPE',
              workflowType
            )
            return (
              <ui-card key={item.uuid} data-name={item.name}>
                <header>
                  <card-title class="wings-text-link" data-name="workflow-link">
                    <item-name>
                      <span onClick={this.props.params.onNameClick.bind(this, item)}>{item.name}</span>
                      {isValid === false && (
                        <span className="__invalid">
                          <TooltipOverlay tooltip={item.orchestrationWorkflow.validationMessage}>
                            <i className="icons8-info" />
                          </TooltipOverlay>
                          <span>(Incomplete)</span>
                        </span>
                      )}
                      <span className="versionNumber" onClick={this.props.params.onManageVersion.bind(this, item)}>
                        version: {item.defaultVersion}
                      </span>

                      {item.templatized && this.renderTemplateStamp()}
                    </item-name>
                    <item-description>{item.description}</item-description>
                  </card-title>
                  {this.renderActionButtons({ item })}
                </header>

                <main>
                  <label-row>
                    <div className="__workflowType">
                      <span className="__workflowTypeLabel">Workflow Type: </span>
                      <span>{workflowTypeText}</span>
                    </div>

                    {item.services &&
                      Array.isArray(item.services) &&
                      item.services.length > 0 && (
                        <div className="__workflowType">
                          <span className="__workflowTypeLabel">Services: </span>
                          {/* has  logic to get service names for templatized workflow and normal workflow*/}
                          <span>{Utils.getServiceNames(item)}</span>
                        </div>
                      )}
                    {workflowType !== Utils.workflowTypes.BUILD && (
                      <div className="__workflowType">
                        <span className="__workflowTypeLabel">Environment: </span>
                        {/* has  logic to get env names for templatized workflow and normal workflow*/}
                        <span>{Utils.getEnvironmentName(item, env)}</span>
                      </div>
                    )}
                    <div className="__workflowType">
                      <span className="__workflowTypeLabel">Last Modified By: </span>
                      <span>{item.lastUpdatedBy && item.lastUpdatedBy.name}</span>
                    </div>
                    <div className="__workflowType">
                      <span className="__workflowTypeLabel">Last Modified At: </span>
                      <span>{Utils.formatDate(item.lastUpdatedAt)}</span>
                    </div>
                  </label-row>

                  <WorkflowView
                    className="__workflowView"
                    jsplumbLoaded={this.state.jsplumbLoaded}
                    data={item.orchestrationWorkflow}
                    pipeline={item.orchestrationWorkflow}
                    onViewClick={this.props.params.onNameClick.bind(this, item)}
                    workflowId={item.uuid}
                  />
                  <div className="col-md-12 __execTable">
                    <div className="__execTableLabel">Previous Executions</div>
                    <div className="__tableRow">
                      <div className="col-md-3">
                        <div className="__colHeader">Timestamp</div>
                      </div>
                      <div className="col-md-3">
                        <div className="__colHeader">Environment</div>
                      </div>
                      <div className="col-md-3">
                        <div className="__colHeader">Execution Status</div>
                      </div>
                      <div className="col-md-3">
                        <div className="__colHeader">Time Taken</div>
                      </div>
                    </div>
                    {item.workflowExecutions.map(exec => {
                      return (
                        <div className="__tableRow" key={exec.uuid}>
                          <div className="col-md-3">
                            <div>{Utils.formatDate(exec.startTs)}</div>
                          </div>
                          <div className="col-md-3">
                            <div>{exec.envName}</div>
                          </div>
                          <div className="col-md-3">
                            <div>{exec.status}</div>
                          </div>
                          <div className="col-md-3">
                            <div>{Utils.formatDuration((exec.endTs - exec.startTs) / 1000)}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </main>
              </ui-card>
            )
          })}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/OrchestrationPage/views/WorkflowCardView.js