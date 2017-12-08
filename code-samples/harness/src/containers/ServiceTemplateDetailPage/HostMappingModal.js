import React from 'react'
import { Button, Modal, Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import { SearchBox, Utils } from 'components'
import { Wings } from 'utils'
import css from './HostMappingModal.css'

import { AgGridReact } from 'ag-grid-react'

export default class HostMappingModal extends React.Component {
  state = {
    selectedHosts: []
  }

  componentWillMount () {
    this.columnDefs = [
      { headerName: '', width: 30, checkboxSelection: true, suppressSorting: true },
      { headerName: 'All Hosts', field: 'hostName', width: 150 },
      { headerName: 'Tags', field: 'configTag', width: 80, cellRenderer: (params) => {
        return params.data.configTag.name
      } }
    ]
  }

  componentWillReceiveProps (newProps) {
    setTimeout(() => {
      if (this.api) {
        const selectedHosts = Utils.getJsonValue(newProps, 'selectedHosts') || []
        this.api.forEachNode((node) => {
          const isSelected = selectedHosts.find(host => host.uuid === node.data.uuid)
          if (isSelected) {
            node.setSelected(true)
          }
        })
        this.setState({ selectedHosts })
        // for (const hostRow of this.api.rowModel.allRows) {
        //   const isSelected = selectedHosts.find(host => host.uuid === hostRow.data.uuid)
        //   if (isSelected) {
        //     hostRow.setSelected(true)
        //   }
        // }
        //
        // if (newProps.data && newProps.data.selectedTag) {
        //   const selectedTag = newProps.data.selectedTag
        //   for (const hostRow of this.api.rowModel.allRows) {
        //     hostRow.data.isNew = true // default
        //     for (const tag of hostRow.data.tags) {
        //       if (tag.uuid === selectedTag.uuid) {
        //         hostRow.data.isNew = false
        //         hostRow.setSelected(true)
        //       }
        //     }
        //   }
        // }
      }
    }, 300) // wait for onGridReady()
  }

  onGridReady = (params) => {
    this.api = params.api
    this.columnApi = params.columnApi
  }

  onRowSelected = (row) => {
    const selectedRows = this.api.getSelectedNodes()
    const selectedHosts = selectedRows.map(node => node.data)
    this.setState({ selectedHosts })
  }

  onCellClicked = (cell) => {
  }

  onSubmit = () => {
    this.props.onSubmit(this.state.selectedHosts)
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
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>Select Hosts</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div style={{ paddingLeft: 10, paddingRight: 10 }} className="ag-fresh">

            <div className={css.gridContainer}>
              <SearchBox className="wings-card-search" onChange={this.onSearchChanged} />

              <AgGridReact
                columnDefs={this.columnDefs}
                rowData={this.props.allHosts}
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

          <Panel collapsible defaultExpanded header="Selected Hosts" className={css.selectedHostsPanel}>
            <ListGroup fill>
              {(() => {
                if (this.state.selectedHosts.length === 0) {
                  return <ListGroupItem>No Item Selected</ListGroupItem>
                }
              })()}
              {this.state.selectedHosts.map(host => {
                return (<ListGroupItem key={host.uuid}>
                  {host.hostName}
                  {(() => (host.isNew ? <span>NEW</span> : null))()}
                </ListGroupItem>)
              })}
            </ListGroup>
          </Panel>

          <div className={css.footer}>
            <Button bsStyle="primary" onClick={this.onSubmit}>Submit</Button>
            <Button onClick={this.onClear}>Clear</Button>
          </div>

        </Modal.Body>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceTemplateDetailPage/HostMappingModal.js