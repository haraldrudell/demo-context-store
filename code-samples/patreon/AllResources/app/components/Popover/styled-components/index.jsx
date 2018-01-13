import styled from 'styled-components'

export const StyledPopover = styled.div`
    border: 1px solid
        ${props => props.theme.popovers.getBorderColor(props.color)};
    min-width: 150px;
    max-width: 200px;
    background-color: ${props =>
        props.theme.popovers.getBackgroundColor(props.color)};
    color: ${props => props.theme.popovers.getColor(props.color)};
    z-index: ${props => props.theme.zIndex.Z_INDEX_HIGHEST};
    -webkit-font-smoothing: antialiased;
    box-shadow: ${props => props.theme.popovers.getShadow(props.color)};
`



// WEBPACK FOOTER //
// ./app/components/Popover/styled-components/index.jsx