import styled from 'styled-components'

export const PostContentWrapper = styled.div`
    white-space: pre-line;
    font-size: ${props => props.theme.text.getSize(1)};
    line-height: ${props => props.theme.text.getLineHeight(1)};

    p {
        margin: 10px 0 !important;
    }
`

export const PostTitle = styled.span`
    a {
        color: currentcolor;
    }
    font-size: ${props => props.theme.text.getSize(2)};
    font-weight: ${props => props.theme.text.getWeight('bold')};
`

export const AttachmentElementsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    max-width: 100%;
`

export const Attachment = styled.div`
    margin-right: ${props => props.theme.units.getValue(2)};
    max-width: 100%;
`

export const PostActions = styled.div`
    & > * {
        display: inline-block;
        cursor: pointer;
        &:not(:last-child) {
            margin-right: ${props => props.theme.units.getValue(4)};
        }
    }
`



// WEBPACK FOOTER //
// ./app/features/posts/Post/styled-components/index.js