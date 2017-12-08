import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { Utils } from 'components'
import { Wings } from 'utils'

// import css from './ApplicationListView.css'

export default class OrgSettingListView extends React.Component {
  componentWillMount () {
    this.columnDefs = [
      { headerName: 'Name', field: 'name', width: 450 },
      { headerName: 'Created By', field: 'createdBy.email', width: 200 },
      {
        headerName: 'Created At',
        field: 'createdAt',
        width: 150,
        cellRenderer: params => Utils.formatDate(params.value)
      }
    ]
  }

  onGridReady = params => {
    this.api = params.api
    this.columnApi = params.columnApi
  }

  render () {
    return (
      <div style={{ height: 600, paddingLeft: 10, paddingRight: 10 }} className="ag-fresh">
        <AgGridReact
          columnDefs={this.columnDefs}
          rowData={this.props.params.data}
          onGridReady={this.onGridReady}
          rowSelection="single"
          enableColResize="true"
          enableSorting="true"
          enableFilter="true"
          groupHeaders="true"
          headerHeight={Wings.GRID_CELL_HEIGHT}
          rowHeight={Wings.GRID_CELL_HEIGHT}
          debug="false"
        />
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/InfrastructurePage/views/OrgSettingListView.js