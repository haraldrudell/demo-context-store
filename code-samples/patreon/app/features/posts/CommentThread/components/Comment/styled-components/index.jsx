import styled, { css } from 'styled-components'

import helpers from 'styles/themes/helpers'
const { units } = helpers

export const Wrapper = styled.div`
    ${props => (props.isOptimistic ? 'opacity: 0.5;' : '')} display: flex;
    flex-direction: row;
    justify-content: space-between;
`

export const placeholderBackground = css`
    background-color: ${props => props.theme.colors.gray8};
`

export const AvatarPlaceholder = styled.div`
    ${props => `
    ${placeholderBackground}
    border-radius: ${props.theme.cornerRadii.circle};
    height: ${props.theme.units.getValue(4)};
    width: ${props.theme.units.getValue(4)};
`};
`

export const TextPlaceholder = styled.div`
    ${props => `
    ${placeholderBackground}
    height: ${props.theme.units.getValue(1.5)};
    margin-bottom: ${props.theme.units.getValue(1)};
    width: ${props.width};
`};
`

export const CommentBody = styled.div`
    ${props => `
    color: ${props.deleted
        ? props.theme.colors.gray3
        : props.theme.colors.dark};
    font-size: ${props.theme.text.getSize(0)};
    font-style: ${props.deleted ? 'italic' : 'normal'};
    font-weight: ${props.theme.text.getWeight('normal')};
    margin-bottom: ${props.theme.units.getValue(1)};
    white-space: pre-wrap;
    word-break: break-word;

    a {
        color: ${props.theme.textButtons.getColor('default')};
        font-weight: ${props.theme.text.getWeight('bold')};
        text-decoration-skip: ink;

        &:hover {
            ${props.theme.textButtons.getHoverStyles()}
        }
    }
`};
`

export const CommentAction = styled.div`
    cursor: pointer;
    width: ${units.getValue(5)};
`



// WEBPACK FOOTER //
// ./app/features/posts/CommentThread/components/Comment/styled-components/index.jsx