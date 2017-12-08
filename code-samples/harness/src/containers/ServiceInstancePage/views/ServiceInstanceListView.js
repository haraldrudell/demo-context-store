import React from 'react'
import ReactDOM from 'react-dom'
import { AgGridReact } from 'ag-grid-react'
import { Wings } from 'utils'
import { TimeAgoShort, CompUtils, Utils } from 'components'
import { DropdownButton } from 'react-bootstrap'
import LastActivityHistory from './LastActivityHistory'
import LastArtifactHistory from './LastArtifactHistory'
import apis from 'apis/apis'

import TimeAgo from 'react-timeago'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
const formatter = buildFormatter(TimeAgoShort)

import css from './ServiceInstanceListView.css'

export default class ServiceInstanceListView extends React.Component {
  state = {
    activityDropdown: {
      x: 0,
      y: 0,
      data: []
    },
    artifactDropdown: {
      x: 0,
      y: 0,
      data: []
    }
  }
  gridHeight = 700 // set later

  componentWillMount () {
    this.columnDefs = [
      {
        headerName: '',
        width: 50,
        checkboxSelection: true,
        suppressSorting: true,
        cellStyle: { 'text-align': 'center' }
      },
      { headerName: 'Service', field: 'serviceName', width: 120 },
      { headerName: 'Host', field: 'hostName', width: 120 },
      // { headerName: 'Tag', field: 'tagName', width: 50,
      //     cellRenderer: (params) => (params.value === 'Development-Untagged-Hosts' ? '' : params.value)
      // },
      {
        headerName: 'Last Deployed Artifact',
        field: 'artifactId',
        width: 300,
        cellRenderer: this.lastArtifactRenderer
      },
      { headerName: 'Last Activity', field: 'lastActivityId', width: 300, cellRenderer: this.lastActivityRenderer }
    ]
  }

  onGridReady = params => {
    this.api = params.api
    this.columnApi = params.columnApi
    this.api.sizeColumnsToFit()
  }

  lastArtifactRenderer = params => {
    const val = params.data
    if (val && val.lastActivityCreatedAt) {
      const div = document.createElement('div')
      ReactDOM.render(
        <span className="__lastArtifact">
          {CompUtils.renderStatusIcon(val.artifactDeploymentStatus)}
          <span
            className="__lastArtifactName wings-text-link"
            title={val.artifactName}
            onClick={Utils.goToActivity.bind(this, val.artifactDeploymentActivityId)}
          >
            {val.artifactName}
          </span>
          <span> - </span>
          <TimeAgo date={val.artifactDeployedOn} minPeriod={30} formatter={formatter} />
          <i className="icons8-play-filled __more" />
        </span>,
        div
      )
      return div
    }
    return ''
  }

  lastActivityRenderer = params => {
    const val = params.data
    if (val) {
      if (val.commandType) {
        const div = document.createElement('div')
        ReactDOM.render(
          <span className="__lastActivity">
            {CompUtils.renderStatusIcon(val.lastActivityStatus)}
            <span
              className="wings-text-link __command"
              title={val.commandType + ' / ' + val.commandName}
              onClick={Utils.goToActivity.bind(this, val.lastActivityId)}
            >
              {val.commandType} / {val.commandName}
            </span>
            <span> - </span>
            <TimeAgo date={val.lastActivityCreatedAt} minPeriod={30} formatter={formatter} />
            <i className="icons8-play-filled __more" />
          </span>,
          div
        )
        return div
      }
    }
    return ''
  }

  // actionColRenderer = (params) => {
  //   console.log(params)
  //   const buttons = (props) => (
  //     <div className={`${css.btnBox}`}>
  //       <input type="checkbox" name={params.data.uuid} value={params.data.uuid} />
  //     </div>
  //   )
  //   const el = document.createElement('div')
  //   ReactDOM.render(React.createElement(buttons), el)
  //   return el
  // }

  onCellClicked = ev => {
    const targetEl = ev.event.target

    if (
      // targetEl.className.indexOf('__more') >= 0 &&
      ev.colDef.field === 'artifactId' ||
      ev.colDef.field === 'lastActivityId'
    ) {
      // this.collapseExpandedIcons()
      // setTimeout(() => {
      //   targetEl.className += ' __moreExpanded'
      // }, 100)

      const rowData = ev.data
      const rowEl = Utils.findParentByChild(targetEl, '.ag-cell')
      if (rowEl) {
        let toggleEl = null
        if (ev.colDef.field === 'artifactId' && rowData.artifactId) {
          toggleEl = this.refs.artifactDropdown.querySelector('.dropdown-toggle')
          apis.fetchInstanceArtifacts(Utils.appIdFromUrl(), Utils.envIdFromUrl(), rowData.uuid).then(res => {
            this.setState({
              artifactDropdown: {
                x: parseInt(rowEl.style.left) - 15,
                y: 98 + (ev.rowIndex + 1) * Wings.GRID_CELL_HEIGHT,
                data: res.resource.response
              }
            })
          })
        }
        if (ev.colDef.field === 'lastActivityId' && rowData.lastActivityId) {
          toggleEl = this.refs.activityDropdown.querySelector('.dropdown-toggle')
          apis.fetchInstanceActivities(Utils.appIdFromUrl(), Utils.envIdFromUrl(), rowData.uuid).then(res => {
            this.setState({
              activityDropdown: {
                x: parseInt(rowEl.style.left) - 15,
                y: 98 + (ev.rowIndex + 1) * Wings.GRID_CELL_HEIGHT,
                data: res.resource.response
              }
            })
          })
        }
        setTimeout(() => {
          toggleEl.click()
        }, 0)
      }
    }
  }

  collapseExpandedIcons = () => {
    // collapse all expanded icons
    const moreIcons = this.refs.main.querySelectorAll('.__moreExpanded')
    for (const el of moreIcons) {
      el.className = Utils.removeClassName(el.className, '__moreExpanded')
    }
  }

  onDropdownToggle = isOpen => {
    // this.collapseExpandedIcons()
  }

  onRowSelected = () => {
    const selectedNodes = this.api.getSelectedNodes()
    this.selectedInstances = selectedNodes.map(node => node.data)
    this.props.params.onSelectionChanged(this.selectedInstances)
  }

  render () {
    const data = this.props.params.data
    if (data.length > 0) {
      this.gridHeight = (data.length + 1) * Wings.GRID_CELL_HEIGHT + 1
    }

    return (
      <section ref="main" className={css.main}>
        <div style={{ height: this.gridHeight, paddingLeft: 10, paddingRight: 10 }} className="ag-fresh">
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={data}
            onGridReady={this.onGridReady}
            onRowSelected={this.onRowSelected}
            onCellClicked={this.onCellClicked}
            rowSelection="multiple"
            suppressCellSelection="true"
            enableColResize="true"
            enableSorting="true"
            enableFilter="true"
            groupHeaders="true"
            headerHeight={Wings.GRID_CELL_HEIGHT}
            rowHeight={Wings.GRID_CELL_HEIGHT}
            debug="false"
          />
        </div>
        <div
          className="__artifactDropdown"
          ref="artifactDropdown"
          style={{ left: this.state.artifactDropdown.x, top: this.state.artifactDropdown.y }}
        >
          <DropdownButton bsStyle="default" title="" onToggle={this.onDropdownToggle}>
            <LastArtifactHistory data={this.state.artifactDropdown.data} />
          </DropdownButton>
        </div>
        <div
          className="__activityDropdown"
          ref="activityDropdown"
          style={{ left: this.state.activityDropdown.x, top: this.state.activityDropdown.y }}
        >
          <DropdownButton bsStyle="default" title="" onToggle={this.onDropdownToggle}>
            <LastActivityHistory data={this.state.activityDropdown.data} />
          </DropdownButton>
        </div>
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceInstancePage/views/ServiceInstanceListView.js