import styled from 'styled-components'

export const StyledTable = styled.table`
    width: 100%;
    table-layout: fixed;
    tr {
        vertical-align: top;
    }
    th {
        ${({ theme }) =>
            theme.responsive.cssPropsForBreakpointValues(
                {
                    xs: 'none',
                    lg: 'table-cell',
                },
                'display',
            )};
    }
`

export const Ellipsizer = styled.div`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    ${props => (props.width ? `width: ${props.width};` : '')};
`



// WEBPACK FOOTER //
// ./app/components/Table/styled-components/index.js