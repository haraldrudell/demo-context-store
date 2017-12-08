import React from 'react'
import ReactDOM from 'react-dom'
import { Wings } from 'utils'
import css from './HostListView.css'

import { AgGridReact } from 'ag-grid-react'

export default class HostListView extends React.Component {
  componentWillMount () {

    this.columnDefs = [
      { headerName: '', field: 'actions', width: 50, cellRenderer: this.actionColRenderer },
      { headerName: 'Host Name', field: 'hostName', width: 150 },
      { headerName: 'Tags', field: '', width: 500, cellRenderer: this.tagsColRenderer }
    ]
  }

  tagsColRenderer = (params) => {
    const reactEl = (props) => (<div>{params.data.configTag.name}</div>)
    const el = document.createElement('div')
    ReactDOM.render(React.createElement(reactEl), el)
    return el
  }

  actionColRenderer = (params) => {
    const buttons = (props) => (
      <div className={`${css.btnBox}`}>
        <i data-uuid={params.data.uuid} className={`fa fa-edit ${css.editBtn}`}
          onClick={this.props.params.onEdit.bind(this, params.data)} />
        <i data-uuid={params.data.uuid} className={`fa fa-remove ${css.deleteBtn}`}
          onClick={this.props.params.onDelete.bind(this, params.data.uuid)} />
      </div>
    )
    const el = document.createElement('div')
    ReactDOM.render(React.createElement(buttons), el)
    return el
  }

  render () {
    return (
      <div style={{ height: 600, paddingLeft: 10, paddingRight: 10 }} className="ag-fresh">
        <AgGridReact
          columnDefs={this.columnDefs}
          rowData={this.props.params.data}
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
// ../src/containers/HostPage/views/HostListView.js