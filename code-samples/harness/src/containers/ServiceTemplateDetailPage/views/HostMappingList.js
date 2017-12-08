import React from 'react'
import ReactDOM from 'react-dom'
import { Wings } from 'utils'

import { AgGridReact } from 'ag-grid-react'
// import css from './HostMappingList.css'

export default class HostMappingList extends React.Component {
  componentWillMount () {
    this.columnDefs = [
      { headerName: 'Host Name', field: 'hostName', width: 150 },
      { headerName: 'Tags', field: 'tags', width: 500, cellRenderer: this.tagsColRenderer }
    ]
  }

  tagsColRenderer = (params) => {
    const reactEl = (props) => (<div>{params.data.configTag.name}</div>)
    const el = document.createElement('div')
    ReactDOM.render(React.createElement(reactEl), el)
    return el
  }

  render () {
    return (
      <div style={{ height: 350, paddingLeft: 10, paddingRight: 10 }} className="ag-fresh">
        <AgGridReact
          columnDefs={this.columnDefs}
          rowData={this.props.params.data.hosts}
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
// ../src/containers/ServiceTemplateDetailPage/views/HostMappingList.js