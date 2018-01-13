import PropTypes from 'prop-types'
import React from 'react'
import Card from 'components/Card'
import styles from './styles.less'
import InfoPopover from 'components/InfoPopover'
import classnames from 'classnames'

export default class DataTable extends React.Component {
    static propTypes = {
        headers: PropTypes.array,
        rows: PropTypes.array,
        noFirstColumnPadding: PropTypes.bool,
        selectedRows: PropTypes.arrayOf(PropTypes.number),
        onRowClick: PropTypes.func,
    }

    static defaultProps = {
        selectedRows: [],
    }

    renderHeaders = () => {
        const headers = this.props.headers.map((h, i) => {
            if (h === null || h === undefined) {
                return
            }

            const alignment = h.alignment || 'left'
            const headerDivStyle =
                alignment === 'left'
                    ? styles.headerCellLeftAlign
                    : styles.headerCellRightAlign
            const spanStyle =
                alignment === 'left'
                    ? styles.textAlignLeft
                    : styles.textAlignRight
            const explanation = h.tooltipExplanation
            let info = ''
            if (explanation && h.learnMoreLink) {
                info = (
                    <span className={styles.popover}>
                        <a href={h.learnMoreLink} target="_blank">
                            <InfoPopover preferPlace="above">
                                {explanation}
                            </InfoPopover>
                        </a>
                    </span>
                )
            } else if (explanation) {
                info = (
                    <span className={styles.popover}>
                        <InfoPopover preferPlace="above">
                            {explanation}
                        </InfoPopover>
                    </span>
                )
            }

            /* eslint-disable react/no-array-index-key */
            return (
                <th style={h.style} key={i}>
                    <div className={headerDivStyle}>
                        {h.label ? (
                            <span className={spanStyle}>{h.label}</span>
                        ) : (
                            h
                        )}
                        {info}
                    </div>
                </th>
            )
            /* eslint-enable react/no-array-index-key */
        })
        return <tr>{headers}</tr>
    }

    renderRows = () => {
        const { onRowClick } = this.props
        const rows = this.props.rows.map((row, i) => {
            /* eslint-disable react/no-array-index-key */
            return (
                <tr
                    key={i}
                    className={
                        this.props.selectedRows.includes(i) &&
                        styles.rowSelected
                    }
                    onClick={() => {
                        if (!!onRowClick) {
                            onRowClick(i)
                        }
                    }}
                >
                    {row.map((cell, ii) => <td key={ii}>{cell}</td>)}
                </tr>
            )
            /* eslint-enable react/no-array-index-key */
        })
        return rows
    }

    render() {
        const className = classnames(
            {
                [styles.noFirstColumnPadding]: this.props.noFirstColumnPadding,
            },
            styles.table,
        )

        return (
            <Card noPadding>
                <div className={styles.tableOverflowWrapper}>
                    <table className={className}>
                        <thead>{this.renderHeaders()}</thead>
                        <tbody>{this.renderRows()}</tbody>
                    </table>
                </div>
            </Card>
        )
    }
}



// WEBPACK FOOTER //
// ./app/components/DataTable/index.jsx