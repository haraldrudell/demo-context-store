import t from 'prop-types'
import React, { Component } from 'react'

import Block from 'components/Layout/Block'
import LoadingSpinner from 'components/LoadingSpinner'

import { StyledTable } from './styled-components'
import TableRow from './components/TableRow'
import ColumnHeader from './components/ColumnHeader'
import { tableRowsArray } from './proptypes'

class Table extends Component {
    static defaultProps = {
        rows: [],
        columns: {},
    }

    static propTypes = {
        rows: tableRowsArray,
        columns: t.arrayOf(
            t.shape({
                Header: t.node.isRequired,
                accessor: t.oneOfType([t.string, t.func]).isRequired,
                showMobileHeader: t.bool,
                align: t.oneOf(['left', 'right', 'center']),
                width: t.string,
            }),
        ).isRequired,
        onFilter: t.func,
        onSort: t.func,
        onClickRow: t.func,
        highlighted: t.any,
        onRowHighlighted: t.func,
        isLoading: t.bool,
        noRowsMessage: t.node,
        currentKey: t.string,
    }

    renderHeader() {
        const { columns } = this.props
        return (
            <thead>
                <tr>
                    {columns.map((p, idx, list) => (
                        <ColumnHeader
                            {...p}
                            key={p.accessor}
                            isFirst={idx === 0}
                            isLast={idx === list.length}
                            onFilter={this.props.onFilter}
                            onSort={this.props.onSort}
                            currentKey={this.props.currentKey}
                        />
                    ))}
                </tr>
            </thead>
        )
    }

    isEmpty = () => {
        const { rows, isLoading } = this.props
        return rows.length === 0 && !isLoading
    }

    isReady = () => {
        const { rows, isLoading } = this.props
        return !isLoading && rows.length > 0
    }

    render() {
        const {
            rows,
            columns,
            highlighted,
            noRowsMessage,
            onRowHighlighted,
            isLoading,
        } = this.props

        return (
            <Block backgroundColor="white" fluidHeight>
                <StyledTable>
                    {this.renderHeader()}

                    <tbody>
                        {this.isReady() &&
                            rows.map(row => (
                                <TableRow
                                    key={row.key}
                                    row={row}
                                    highlighted={row.key === highlighted}
                                    onHighlighted={onRowHighlighted}
                                    columns={columns}
                                    onClick={this.props.onClickRow}
                                />
                            ))}

                        {this.isEmpty() && (
                            <tr>
                                <td
                                    colSpan={Object.keys(columns).length}
                                    style={{ borderTop: '2px solid #E7ECF0' }}
                                >
                                    {noRowsMessage}
                                </td>
                            </tr>
                        )}

                        {isLoading && (
                            <tr>
                                <td colSpan={Object.keys(columns).length}>
                                    <Block p={6} m={6}>
                                        <LoadingSpinner data-tag="loading-table-data" />
                                    </Block>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </StyledTable>
            </Block>
        )
    }
}

export default Table



// WEBPACK FOOTER //
// ./app/components/Table/index.jsx