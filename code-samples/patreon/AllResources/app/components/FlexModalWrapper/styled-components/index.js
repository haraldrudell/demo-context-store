import styled from 'styled-components'

export const FlexModalContent = styled.div`
    max-height: 100%;
`

export const FlexModalWrapper = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: ${props => props.theme.zIndex.Z_INDEX_HIGHEST};
    ${props =>
        props.useOverlay
            ? `background: ${props.theme.colors.translucentOverlay};`
            : ''};
`



// WEBPACK FOOTER //
// ./app/components/FlexModalWrapper/styled-components/index.js