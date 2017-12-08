import React from 'react'
import ReactDOM from 'react-dom'
import { Wings } from 'utils'
// import { Utils } from 'components'
import { AgGridReact } from 'ag-grid-react'
import TimeAgo from 'react-timeago'
import ActivityDetailView from './ActivityDetailView'
import css from './ActivityListView.css'

const ICONS = {
  groupExpanded: '<i class="icons8-expand-arrow" />',
  groupContracted: '<i class="icons8-forward" />'
}

const DETAIL_PANEL_HEIGHT = 520

class ActivityListView extends React.Component {
  state = {
    height: 0
  }
  api = null
  objExpanded = {}
  onRowGroupOpenedCalled = false
  newActivities = 0

  componentWillMount () {
    this.columnDefs = [
      { headerName: '', field: '', width: 30, cellRenderer: 'group' },
      { headerName: 'Application', field: 'applicationName', width: 250, cellRenderer: this.applicationRenderer },
      { headerName: 'Type', field: 'type', width: 250, cellRenderer: this.typeRenderer },
      { headerName: 'Service', field: 'serviceName', width: 100 },
      { headerName: 'Host', field: 'hostName', width: 180 },
      {
        headerName: 'Source Workflow',
        field: 'workflowExecutionName',
        width: 200,
        cellRenderer: this.workflowRenderer
      },
      { headerName: 'Pipeline', field: 'releaseName', width: 100, cellRenderer: this.releaseRenderer },
      { headerName: 'Artifact', field: 'artifactName', width: 150, cellRenderer: this.artifactRenderer },
      { headerName: 'Started At', field: 'createdAt', width: 100, cellRenderer: this.startTimeRenderer }
    ]
  }

  componentWillReceiveProps (newProps) {
    this.parseRows(newProps.params.data)
    this.newActivities = newProps.params.newActivities
  }

  onRedirect = (e, deployment) => {
    e.stopPropagation()
    e.preventDefault()
    // Utils.redirect(redirectObj)
    const { accountId } = this.props.urlParams
    const { appId, envId } = deployment
    const execId = deployment.uuid || deployment.executionId
    this.props.router.push(this.props.path.toExecutionDetails({ accountId, appId, envId, execId }))
  }

  // redirectToWorkflow = (e, redirectObj) => {
  //   e.stopPropagation()
  //   e.preventDefault()
  //   Utils.redirectToWorkflow(redirectObj)
  // }

  typeRenderer = params => {
    const val = params.data
    const _html = props => {
      return (
        <span>
          <span className={val.status} />
          <span>
            {val.type ? val.type + ': ' : ''} {val.commandName}
          </span>
        </span>
      )
    }
    const el = document.createElement('div')
    el.className = '__statusCol'
    ReactDOM.render(React.createElement(_html), el)
    return el
  }

  workflowRenderer = params => {
    const val = params.data
    const _obj = { appId: val.appId, envId: val.environmentId, executionId: val.workflowExecutionId, page: 'detail' }
    const _colHtml = props =>
      <span className="wings-text-link" onClick={e => this.onRedirect(e, _obj)}>
        {/* <span className="wings-text-link" onClick={(e) => this.redirectToWorkflow(e, _obj)}> */}
        {val.workflowExecutionName}
      </span>
    const el = document.createElement('div')
    ReactDOM.render(React.createElement(_colHtml), el)
    return el
  }

  relArtElement = (params, label) => {
    // const val = params.data
    // const _obj = { appId: val.appId, page: 'artifacts' }
    {
      /* onClick={(e) => this.onRedirect(e, _obj)} */
    }
    const _colHtml = props =>
      <span className="" title={label}>
        {label}
      </span>
    const el = document.createElement('div')
    ReactDOM.render(React.createElement(_colHtml), el)
    return el
  }

  releaseRenderer = params => {
    return this.relArtElement(params, params.data.releaseName)
  }

  applicationRenderer = params => {
    return this.relArtElement(params, params.data.applicationName)
  }

  artifactRenderer = params => {
    return this.relArtElement(params, params.data.artifactName)
  }

  startTimeRenderer = params => {
    const _html = props => <TimeAgo date={params.value} minPeriod={30} />
    const el = document.createElement('div')
    ReactDOM.render(React.createElement(_html), el)
    return el
  }

  parseRows (data) {
    if (data.length > 0 && this.state.height <= 0) {
      this.addHeight(data.length * Wings.GRID_CELL_HEIGHT + 100)
    }
    if (data.length === 0) {
      this.setState({ height: DETAIL_PANEL_HEIGHT })
    }

    setTimeout(() => {
      // when grid is ready, expand RUNNING
      // const firstRunning = false
      let expandedRows = 0
      this.api.forEachLeafNode((rowNode, index) => {
        if (!rowNode.expanded) {
          if (this.objExpanded[rowNode.data.uuid]) {
            rowNode.expanded = true
            expandedRows++
          }
        }
      })

      if (expandedRows > 0) {
        // console.log('expandedRows', expandedRows)
        this.api.onGroupExpandedOrCollapsed()
        this.addHeight(DETAIL_PANEL_HEIGHT * expandedRows)
      }
    }, 600)
  }

  onGridReady = params => {
    this.api = params.api
    this.api.sizeColumnsToFit()
    this.parseRows(this.props.params.data)
  }

  isFullWidthCell = rowNode => {
    return rowNode.level === 1
  }

  addHeight (height) {
    this.setState({ height: this.state.height + (height + 100) })
  }

  removeHeight (height) {
    this.setState({ height: this.state.height - (height + 100) })
  }

  adjustHeight = params => {
    if (params.node.expanded) {
      this.objExpanded[params.node.data.uuid] = true
      this.addHeight(DETAIL_PANEL_HEIGHT)
    } else {
      delete this.objExpanded[params.node.data.uuid]
      this.removeHeight(DETAIL_PANEL_HEIGHT)
    }
  }

  getRowHeight = params => {
    const rowIsDetailRow = params.node.level === 1
    if (!rowIsDetailRow) {
      return Wings.GRID_CELL_HEIGHT
    } else {
      return DETAIL_PANEL_HEIGHT
    }
  }

  getDetailPanelCellRenderer = params => {
    const _html = props => <ActivityDetailView activity={params.data} />
    const el = document.createElement('div')
    el.addEventListener('mousewheel', e => {
      e.stopPropagation()
    })
    ReactDOM.render(React.createElement(_html), el)
    return el
  }

  onRowGroupOpened = params => {
    this.onRowGroupOpenedCalled = true
    this.adjustHeight(params)
  }

  onRowClicked = params => {
    if (this.onRowGroupOpenedCalled) {
      this.onRowGroupOpenedCalled = false
      return
    }

    if (
      params.event &&
      typeof params.event.target === 'string' &&
      params.event.target.indexOf('wings-text-link') >= 0
    ) {
      return
    }

    if (params.node.canFlower) {
      params.node.expanded = !params.node.expanded
      params.api.onGroupExpandedOrCollapsed(params.rowIndex)
      this.adjustHeight(params)
    }
  }

  render () {
    return (
      <div className={css.main + ' col-md-12'} style={{ height: this.state.height }}>
        <div className="ag-fresh">
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={this.props.params.data}
            isFullWidthCell={this.isFullWidthCell}
            fullWidthCellRenderer={this.getDetailPanelCellRenderer}
            getRowHeight={this.getRowHeight}
            onGridReady={this.onGridReady}
            suppressCellSelection="true"
            doesDataFlower={d => true}
            enableColResize="true"
            enableSorting="true"
            enableFilter="true"
            groupHeaders="true"
            headerHeight={Wings.GRID_CELL_HEIGHT}
            icons={ICONS}
            onRowGroupOpened={this.onRowGroupOpened}
            onRowClicked={this.onRowClicked}
            rowSelection="single"
            debug="false"
          />
        </div>
      </div>
    )
  }
}

export default ActivityListView



// WEBPACK FOOTER //
// ../src/containers/ActivityPage/views/ActivityListView.js