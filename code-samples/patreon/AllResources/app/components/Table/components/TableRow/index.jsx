import t from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import { onlyUpdateForKeys } from 'recompose'
import noop from 'lodash/noop'

import responsive from 'libs/responsive'

import Block from 'components/Layout/Block'
import Text from 'components/Text'

@responsive
@onlyUpdateForKeys([
    'columns',
    'row',
    'highlighted',
    'responsive',
    'onHighlighted',
])
class Row extends Component {
    static propTypes = {
        columns: t.array,
        row: t.object,
        onClick: t.func,
        highlighted: t.bool, //eslint-disable-line
        responsive: t.object,
        onHighlighted: t.func,
    }

    static defaultProps = {
        onClick: noop,
    }

    componentDidUpdate(lastProps) {
        const { onHighlighted } = this.props

        if (!this.ref || !onHighlighted) return

        const wasHighlighted = lastProps.highlighted
        const isHighlighted = this.props.highlighted

        if (isHighlighted === wasHighlighted) return
        if (isHighlighted) onHighlighted(this.ref)
    }

    handleClick = () => {
        const { onClick, row } = this.props
        onClick(row)
    }

    setRef = ref => (this.ref = ref)

    render() {
        const { columns, row, highlighted } = this.props
        const mobile = this.props.responsive.lte('md')

        let blockProps = {}
        if (mobile) {
            blockProps = {
                p: 1,
            }
        }

        return (
            <StyledRow
                mobile={mobile}
                highlighted={highlighted}
                onClick={this.handleClick}
                ref={this.setRef}
            >
                {columns.map(
                    ({ accessor, align, Header, showMobileHeader }, idx) => {
                        const colData = row[accessor]
                        return (
                            <StyledCell
                                mobile={mobile}
                                align={align}
                                key={`${row.key}--${idx}`} // eslint-disable-line react/no-array-index-key
                            >
                                <Block {...blockProps}>
                                    <Text size={1}>
                                        {mobile && showMobileHeader
                                            ? Header
                                            : null}
                                        {colData}
                                    </Text>
                                </Block>
                            </StyledCell>
                        )
                    },
                )}
            </StyledRow>
        )
    }
}

export const StyledRow = styled.tr`
    ${({ theme, highlighted, mobile }) => `
    &:hover {
        background-color: ${theme.colors.sky};
    }
    transition: border-color ${theme.transitions.timeEasing.default};
    border-top: ${theme.strokeWidths.default} solid ${theme.colors.gray5};
    border-bottom: ${theme.strokeWidths.default} solid ${theme.colors.gray5};
    ${mobile ? `padding: ${theme.units.getValue(1)};` : ''}
    ${!mobile && highlighted
        ? `
        border-left: ${theme.strokeWidths.default} solid ${theme.colors.blue};
        `
        : `border-left: ${theme.strokeWidths.default} solid transparent;`}
    ${mobile ? 'display: block;' : ''}
    `};
`

export const StyledCell = styled.td`
    ${({ theme, mobile, align }) => `
    padding-top: ${theme.units.getValue(mobile ? 0 : 2)};
    padding-bottom: ${theme.units.getValue(mobile ? 0 : 2)};
    padding-left: ${theme.units.getValue(mobile ? 0 : 1)};
    padding-right: ${theme.units.getValue(mobile ? 0 : 1)};
    ${align && !mobile ? `text-align: ${align};` : ''}
    &:first-child {
        padding-left: ${theme.units.getValue(mobile ? 0 : 2)};
    }
    &:last-child {
        padding-right: ${theme.units.getValue(2)};
    }
    ${mobile ? 'display: block;' : ''}

     `};
`

export default Row



// WEBPACK FOOTER //
// ./app/components/Table/components/TableRow/index.jsx