import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { SearchBox, Utils } from 'components'
import { Wings } from 'utils'

import css from './InstanceSelectModal.css'

import { AgGridReact } from 'ag-grid-react'

export default class InstanceSelectModal extends React.Component {
  state = {
    selectedItems: []
  }

  componentWillMount () {
    this.columnDefs = [
      { headerName: '', width: 30, checkboxSelection: true, suppressSorting: true },
      { headerName: 'HostName', field: 'host.hostName', width: 150 },
      { headerName: 'Deployed By', field: 'lastUpdatedBy.email', width: 100 },
      { headerName: 'Deployed At', field: 'lastDeployedOn', width: 150,
        cellRenderer: (params) => { return (params.value > 0) ? Utils.formatDate(params.value) : 'Not Deployed yet!'}
      }
    ]
  }

  componentWillReceiveProps (newProps) {
    if (newProps.data && newProps.data.selectedTag) {
      setTimeout(() => {
        const selectedTag = newProps.data.selectedTag
        for (const hostRow of this.api.rowModel.allRows) {
          hostRow.data.isNew = true // default
          for (const tag of hostRow.data.tags) {
            if (tag.uuid === selectedTag.uuid) {
              hostRow.data.isNew = false
              hostRow.setSelected(true)
            }
          }
        }
      }, 300) // wait for onGridReady()
    }
  }

  onGridReady = (params) => {
    this.api = params.api
    this.columnApi = params.columnApi
  }

  onRowSelected = (row) => {
    const selectedRows = this.api.getSelectedNodes()
    const selectedItems = selectedRows.map(node => node.data)
    this.setState({ selectedItems })
  }

  onCellClicked = (cell) => {
  }

  onSubmit = () => {
    this.props.onSubmit(this.state.selectedItems)
  }

  onSearchChanged = (ev, searchText) => {
    this.api.setQuickFilter(searchText.toLowerCase())
  }

  onClear = () => {
    const selectedRows = this.api.getSelectedNodes()
    for (const row of selectedRows) {
      row.setSelected(false)
    }
  }

  render () {
    const instances = Utils.getJsonValue(this, 'props.data.serviceInstances') || []
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Select Service Instances</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div style={{ paddingLeft: 10, paddingRight: 10 }} className="ag-fresh">
            <SearchBox className="wings-card-search" onChange={this.onSearchChanged} />

            <div style={{ height: 600, padding: 10 }} className="ag-fresh">
              <AgGridReact
                columnDefs={this.columnDefs}
                rowData={instances}
                onGridReady={this.onGridReady}
                onRowSelected={this.onRowSelected}
                onCellClicked={this.onCellClicked}
                suppressRowClickSelection={true}
                suppressCellSelection={true}
                rowSelection="multiple"
                enableColResize="true"
                enableSorting="true"
                enableFilter="true"
                groupHeaders="true"
                headerHeight={Wings.GRID_CELL_HEIGHT}
                rowHeight={Wings.GRID_CELL_HEIGHT}
                debug="false"
              ></AgGridReact>
            </div>
          </div>

          <div className="__footer">
            <Button bsStyle="primary" onClick={this.onSubmit}>Submit</Button>
            <Button onClick={this.onClear}>Clear</Button>
          </div>

        </Modal.Body>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceInstancePage/InstanceSelectModal.js