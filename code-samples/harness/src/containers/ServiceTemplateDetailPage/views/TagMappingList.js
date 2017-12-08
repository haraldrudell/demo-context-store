import React from 'react'

import { AgGridReact } from 'ag-grid-react'
import { Wings } from 'utils'
// import css from './TagMappingList.css'

export default class TagMappingList extends React.Component {
  componentWillMount () {
    this.columnDefs = [
      { headerName: 'Tag Name', field: 'name', width: 150 }
    ]
  }

  render () {
    return (
      <div style={{ height: 350, paddingLeft: 10, paddingRight: 10 }} className="ag-fresh">
        <AgGridReact
          columnDefs={this.columnDefs}
          rowData={this.props.params.data.tags}
          rowSelection="single"
          enableColResize="true"
          enableSorting="true"
          enableFilter="true"
          groupHeaders="true"
          headerHeight={Wings.GRID_CELL_HEIGHT}
          rowHeight={Wings.GRID_CELL_HEIGHT}
          debug="false"
        ></AgGridReact>
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/ServiceTemplateDetailPage/views/TagMappingList.js