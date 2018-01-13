import styled from 'styled-components'

export const Container = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    background: ${props => props.theme.colors.gray5};
    height: 100%;
    width: 100%;

    span {
        user-select: none;
    }
`



// WEBPACK FOOTER //
// ./app/components/ImagePlaceholder/styled-components/index.js