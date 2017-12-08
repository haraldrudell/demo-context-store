import React from 'react'
import ReactDataGrid from 'react-data-grid'
import UITimeAgo from '../TimeAgo/UITimeAgo'
import Utils from '../Utils/Utils'
import css from './DataGrid.css'

/* Example: <DataGrid columns={columns} gridData={this.state.gridData} minHeight={200} /> */
class DataGrid extends React.Component {
  state = {
    gridData: this.props.gridData
  }
  originalGridData = []

  componentWillMount () {
    this.init(this.props)
  }

  componentWillReceiveProps (newProps) {
    this.init(newProps)
  }

  init = props => {
    this.originalGridData = JSON.parse(JSON.stringify(props.gridData || [])) // clone it
    this.setState({ gridData: props.gridData })
  }

  sortFn = (sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === 'ASC') {
        return a[sortColumn] > b[sortColumn] ? 1 : -1
      } else if (sortDirection === 'DESC') {
        return a[sortColumn] < b[sortColumn] ? 1 : -1
      }
    }
    const rows = sortDirection === 'NONE' ? this.originalGridData.slice(0) : this.state.gridData.sort(comparer)
    this.setState({ gridData: rows })
  }

  // convert simple "columns" array to ReactDataGrid's columns array:
  toGridColumns = columns => {
    const gridColumns = []
    columns.forEach(col => {
      // set some Default Properties:
      if (!col.hasOwnProperty('resizable')) {
        col.resizable = true
      }
      if (!col.hasOwnProperty('sortable')) {
        col.sortable = true
      }

      col.getRowMetaData = row => row
      // convert "renderer" to ReactDataGrid "formatter"
      if (col.hasOwnProperty('renderer')) {
        if (typeof col.renderer === 'function') {
          col.formatter = props => {
            const updatedProps = { value: props.value, data: props.dependentValues }
            return col.renderer(updatedProps)
          }
        } else if (col.renderer === 'TIME_AGO_RENDERER') {
          col.formatter = props => <UITimeAgo value={props.value} />
        } else if (col.renderer === 'TIME_RENDERER') {
          col.formatter = props => <span>{Utils.formatDate(props.value)}</span>
        }
      }
      gridColumns.push(col)
    })
    return gridColumns
  }

  render () {
    const { columns } = this.props
    const { gridData = [] } = this.state

    const gridColumns = this.toGridColumns(columns)
    return (
      <section className={css.main}>
        <harness-data-grid>
          <ReactDataGrid
            columns={gridColumns}
            rowGetter={i => gridData[i]}
            rowsCount={gridData.length}
            minHeight={500}
            onGridSort={this.sortFn}
            {...this.props}
          />
        </harness-data-grid>
      </section>
    )
  }
}

export default DataGrid



// WEBPACK FOOTER //
// ../src/components/DataGrid/DataGrid.js