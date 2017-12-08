import React from 'react'
import css from './TableFromSchema.css'
import ReactDataGrid from 'react-data-grid'
const { Cell, Row } = ReactDataGrid

export default class TableFromSchema extends React.Component {
  renderRow = props => <Row cellRenderer={this.renderCell} ref={node => (this.row = node)} {...props} />
  renderCell = props => <Cell className={`${props.column.class}`} ref={node => (this.cell = node)} {...props} />

  render () {
    const {
      tableData,
      tableProps: { rowHeight = 44, numRows = 10, hideHeader = false, columns = [], title = '' }
    } = this.props

    if (tableData) {
      let tableHeight = tableData.length < numRows ? tableData.length * rowHeight : numRows * rowHeight
      tableHeight = tableHeight < 1 ? 1 : tableHeight
      tableHeight += rowHeight // add a row for header even when there is no data

      return (
        <div className={css.main}>
          <ui-card>
            {!hideHeader && <header>{title} </header>}
            <harness-data-grid>
              <ReactDataGrid
                columns={columns}
                rowGetter={i => tableData[i]} // intakes raw data
                rowsCount={tableData.length}
                minHeight={tableHeight}
                rowHeight={rowHeight}
                minColumnWidth={120}
                rowRenderer={this.renderRow}
              />
            </harness-data-grid>
          </ui-card>
        </div>
      )
    } else {
      return <div />
    }
  }
}



// WEBPACK FOOTER //
// ../src/components/TableFromSchema/TableFromSchema.js