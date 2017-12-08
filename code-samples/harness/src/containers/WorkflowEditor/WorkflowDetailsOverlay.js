import React from 'react'
import { Overlay, Popover } from 'react-bootstrap'
// import PipelineWorkflowView from '../WorkflowView/PipelineWorkflowView'
import SubworkflowView from '../WorkflowView/SubworkflowView'
import { Utils } from 'components'
// import css from './WorkflowDetailsOverlay.css'

export default class WorkflowDetailsOverlay extends React.Component {
  // static propTypes = {} // React.PropTypes
  state = {}
  headers = []

  onHeaderClick = (workflow, idx) => {
    this.headers = this.headers.slice(0, idx)
    this.props.onHeaderClick(null, true, workflow.subworkflowId)
  }

  render () {
    if (this.props.data && !this.props.data.clickedFromOverlay) {
      this.headers = []
    }
    if (this.props.data && this.props.data.workflow) {
      const workflow = Utils.getJsonValue(this, 'props.data.workflow') || {}
      const graphName = Utils.getJsonValue(this, 'props.data.workflow.graph.graphName') || ''

      const headerIdx = this.headers.length
      const el = (
        <span className="__headerLink">
          {this.headers.length > 0 && <span className="__rightChevron">&nbsp;</span>}
          <span key={graphName} onClick={() => this.onHeaderClick(workflow, headerIdx)}>
            {graphName}
          </span>
        </span>
      )
      this.headers.push({
        name: graphName,
        el
      })
    } else {
      this.headers = []
    }
    const workflowData = Utils.getJsonValue(this, 'props.data.workflow')

    return (
      <Overlay show={this.props.show} target={props => this.props.target} placement="bottom" containerPadding={20}>
        <Popover id="nodePopover" ref="nodePopover" className={this.props.className}>
          <div className="__popoverHeader">
            {this.headers.map((header, idx) => {
              if (idx === this.headers.length - 1) {
                return (
                  <span>
                    {idx > 0 && <span className="__rightChevron">&nbsp;</span>}
                    <span>{header.name}</span>
                  </span>
                )
              } else {
                return header.el
              }
            })}
            <i className="icons8-delete" onClick={this.props.onHide} />
          </div>
          {workflowData && (
            <SubworkflowView
              data={workflowData}
              metaData={this.props.data}
              stencils={this.props.stencils}
              onDetailsIconClick={this.props.onDetailsIconClick}
              jsplumbLoaded={true}
            />
          )}
          {/*
          <div className="__buttons">
            <Button bsStyle="primary" onClick={this.props.onEditClick}>Edit</Button>
          </div>
          */}
        </Popover>
      </Overlay>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/WorkflowEditor/WorkflowDetailsOverlay.js