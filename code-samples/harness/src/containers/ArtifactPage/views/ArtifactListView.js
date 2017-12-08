import React from 'react'
import ReactDOM from 'react-dom'
import { AgGridReact } from 'ag-grid-react'
import { Utils } from 'components'
import { Wings } from 'utils'

import css from './ArtifactListView.css'

export default class ArtifactListView extends React.Component {
  state = {
    gridData: this.props.params.data,
    __update: Math.random() * 9999
  }
  gridHeight = 700 // set later
  artifactStreamData = null
  services = null
  settingSelection = false
  selectedIds = []

  componentWillMount () {
    this.columnDefs = [
      { headerName: '', field: 'actions', width: 50 },
      { headerName: 'Name', field: 'displayName', width: 200 },
      { headerName: 'Services', field: 'services', width: 150, cellRenderer: this.serviceColRenderer },
      {
        headerName: 'Artifact Source',
        field: 'artifactStreamId',
        width: 150,
        cellRenderer: this.artifactStreamColRenderer
      },
      { headerName: 'Build / Name', field: 'metadata.buildNo', width: 150 },
      { headerName: 'Status', field: 'status', width: 100 },
      {
        headerName: 'Collection Time',
        field: 'createdAt',
        width: 150,
        cellRenderer: params => Utils.formatDate(params.value)
      }
    ]

    if (this.props.params.showActions) {
      this.columnDefs.push({ headerName: '', field: 'actions', width: 50, cellRenderer: this.deployColRenderer })

      this.columnDefs.push({ headerName: '', field: 'actions', width: 50, cellRenderer: this.downloadColRenderer })
    }

    this.artifactStreamData = this.props.params.artifactStreamData
    this.services = this.props.params.services
  }

  componentWillReceiveProps (newProps) {
    if (newProps.params.artifactStreamData) {
      this.artifactStreamData = newProps.params.artifactStreamData
      this.services = newProps.params.services
      this.setState({
        gridData: newProps.params.data,
        __update: Math.random() * 9999
      })
      this.selectedIds = []
    }
  }

  onGridReady = params => {
    this.api = params.api
    this.columnApi = params.columnApi
  }

  deployColRenderer = params => {
    const buttons = props => (
      <div className={css.btnBox}>
        <i
          data-uuid={params.data.uuid}
          title="Execute Command"
          className={`icons8-play-filled ${css.btn}`}
          onClick={this.props.params.onDeploy.bind(this, params.data)}
        />
      </div>
    )
    const el = document.createElement('div')
    ReactDOM.render(React.createElement(buttons), el)
    return el
  }

  downloadColRenderer = params => {
    const buttons = props => (
      <div className={css.btnBox}>
        <i
          data-uuid={params.data.uuid}
          title="Download"
          className={`icons8-installing-updates-2 ${css.btn}`}
          onClick={this.props.params.onDownload.bind(this, params.data)}
        />
      </div>
    )
    const el = document.createElement('div')
    ReactDOM.render(React.createElement(buttons), el)
    return el
  }

  artifactStreamColRenderer = params => {
    let _obj = null
    if (this.artifactStreamData) {
      _obj = this.artifactStreamData.find(o => o.uuid === params.data.artifactStreamId)
    }

    const reactEl = props => <div>{_obj ? _obj.sourceName : ''}</div>
    const el = document.createElement('div')
    ReactDOM.render(React.createElement(reactEl), el)
    return el
  }

  serviceColRenderer = params => {
    let _obj = null
    if (this.services) {
      _obj = params.data.serviceIds.map(serviceId => this.services.find(o => o.uuid === serviceId))
    }

    const reactEl = props => <div>{_obj && _obj.length > 0 ? _obj.map(o => (o ? o['name'] : '')).join(', ') : ''}</div>
    const el = document.createElement('div')
    ReactDOM.render(React.createElement(reactEl), el)
    return el
  }

  onSearchChanged = ev => {
    const searchText = ev.target.value.toLowerCase()
    this.api.setQuickFilter(searchText)
  }

  onRowSelected = () => {
    if (this.settingSelection) {
      return
    }
    const _this = this
    const selectedNodes = this.api.getSelectedNodes()
    if (selectedNodes.length > 0 && this.props.params.onSelectionChanged) {
      const selectedArtifact = selectedNodes[0].data

      if (this.selectedIds.indexOf(selectedArtifact.uuid) >= 0) {
        return
      }
      this.selectedIds.push(selectedArtifact.uuid)

      this.props.params.onSelectionChanged(this.selectedIds)

      const allArtifacts = this.state.gridData
      this.setState(
        {
          gridData: allArtifacts.filter(a => {
            // filter out other artifacts which have the same services with the selected artifact.
            if (this.selectedIds.indexOf(a.uuid) >= 0) {
              return true
            }
            const commonServiceIds = Utils.intersect(selectedArtifact.serviceIds, a.serviceIds)
            // return (a.uuid === selectedArtifact.uuid || commonServiceIds.length === 0)
            return commonServiceIds.length === 0
          })
        },
        () => {
          // Re-select after refreshing. Doesn't work all the time.
          setTimeout(() => {
            _this.settingSelection = true
            for (const hostRow of _this.api.rowModel.rowsToDisplay) {
              if (_this.selectedIds.indexOf(hostRow.data.uuid) >= 0) {
                hostRow.setSelected(true)
              }
            }
            _this.settingSelection = false
          }, 100)
        }
      )
    }
  }

  render () {
    if (!this.artifactStreamData || !this.services) {
      return null
    }
    const data = this.state.gridData
    if (data.length > 0) {
      this.gridHeight = (data.length + 1) * Wings.GRID_CELL_HEIGHT + 1
    }

    return (
      <section ref="main" className={css.main}>
        <div style={{ height: this.gridHeight, paddingLeft: 0, paddingRight: 0 }} className="ag-fresh">
          <AgGridReact
            columnDefs={this.columnDefs}
            rowData={data}
            onGridReady={this.onGridReady}
            onRowSelected={this.onRowSelected}
            suppressCellSelection="true"
            rowSelection="multiple"
            enableColResize="true"
            enableSorting="true"
            enableFilter="true"
            groupHeaders="true"
            headerHeight={Wings.GRID_CELL_HEIGHT}
            rowHeight={Wings.GRID_CELL_HEIGHT}
            debug="false"
          />
        </div>
      </section>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ArtifactPage/views/ArtifactListView.js