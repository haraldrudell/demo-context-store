import styled from 'styled-components'

export const PostInfoRow = styled.div`
    display: inline-block;
    line-height: 1.4rem;
    vertical-align: top;
    margin-top: ${props => props.theme.units.getValue(0.5)};
`

export const AccessLabel = styled.div`
    display: inline-block;
    margin-left: auto;
`



// WEBPACK FOOTER //
// ./app/features/posts/Post/components/Header/styled-components/index.js