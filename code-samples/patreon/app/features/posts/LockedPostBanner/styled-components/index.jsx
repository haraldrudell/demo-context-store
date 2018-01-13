import styled from 'styled-components'

export const BlurredContent = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    // If background-image exists
    background-size: cover;
    background-position: center;
    ${props =>
        props.backgroundColor
            ? `background-color: ${props.theme.colors[props.backgroundColor]}`
            : ''};
`

export const Opaque = styled.div`opacity: 0.8;`



// WEBPACK FOOTER //
// ./app/features/posts/LockedPostBanner/styled-components/index.jsx