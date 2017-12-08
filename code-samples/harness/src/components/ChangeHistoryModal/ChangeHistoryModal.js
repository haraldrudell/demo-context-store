import React from 'react'
import { Modal } from 'react-bootstrap'
import { AgGridReact } from 'ag-grid-react'
import Utils from '../Utils/Utils'
import { Wings } from 'utils'
import css from './ChangeHistoryModal.css'

export default class ChangeHistoryModal extends React.Component {
  state = {}

  componentWillMount () {
    this.columnDefs = [
      { headerName: 'Name', field: 'entityName', width: 150 },
      { headerName: 'Change Type', field: 'changeType', width: 150 },
      { headerName: 'New Version', field: 'version', width: 150 },
      { headerName: 'Updated By', field: 'lastUpdatedBy.name', width: 150 },
      {
        headerName: 'Updated At',
        field: 'lastUpdatedAt',
        width: 150,
        cellRenderer: params => Utils.formatDate(params.value)
      },
      { headerName: 'Notes', field: 'entityData', width: 270 }
    ]
  }

  onGridReady = params => {
    this.api = params.api
    this.columnApi = params.columnApi
  }

  render () {
    const versions = Utils.getJsonValue(this, 'props.data.versions') || []
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>
            {this.props.modalTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ height: 600, paddingLeft: 10, paddingRight: 10 }} className="ag-fresh">
            <AgGridReact
              columnDefs={this.columnDefs}
              rowData={versions}
              onGridReady={this.onGridReady}
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
            />
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/ChangeHistoryModal/ChangeHistoryModal.js