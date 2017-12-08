import React from 'react'
import { Modal, Panel, ListGroup, ListGroupItem } from 'react-bootstrap'
import { Wings } from 'utils'

// import css from './TagMappingModal.css'

import { AgGridReact } from 'ag-grid-react'

export default class TagMappingModal extends React.Component {
  state = {
    selectedTags: []
  }

  componentWillMount () {
    this.columnDefs = [{ headerName: 'All Tags', field: 'name', width: 150 }]
  }

  onGridReady = params => {
    this.api = params.api
    this.columnApi = params.columnApi
  }

  onRowSelected = row => {
    const selectedRows = this.api.getSelectedNodes()
    const selectedTags = selectedRows.map(node => node.data)
    this.setState({ selectedTags })
  }

  onCellClicked = cell => {}

  onSubmit = () => {
    this.props.onSubmit(this.state.selectedTags)
  }

  render () {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Select Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ width: 300, height: 400, paddingLeft: 10, paddingRight: 10 }} className="ag-fresh">
            <AgGridReact
              columnDefs={this.columnDefs}
              rowData={this.props.allTree}
              onGridReady={this.onGridReady}
              onRowSelected={this.onRowSelected}
              onCellClicked={this.onCellClicked}
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

          <Panel
            collapsible
            defaultExpanded
            header="Selected Tags"
            style={{ top: '15px', right: '15px', position: 'absolute', width: '250px' }}
          >
            <ListGroup fill style={{ maxHeight: '360px', overflowX: 'hidden' }}>
              {this.state.selectedTags.map(host => {
                return <ListGroupItem>{host.name}</ListGroupItem>
              })}
            </ListGroup>
          </Panel>

          <div style={{ margin: '15px' }}>
            <button onClick={this.onSubmit}>Submit</button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceTemplateDetailPage/TagMappingModal.js