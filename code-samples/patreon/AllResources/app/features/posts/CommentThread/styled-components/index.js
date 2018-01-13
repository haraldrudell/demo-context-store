import styled from 'styled-components'
import helpers from 'styles/themes/helpers'
const { units } = helpers

export const ThreadHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${units.getValue(2)};
    min-height: ${units.getValue(2)};
`

export const LoadReplies = styled.div`
    cursor: pointer;
    margin: ${units.getValues([0, 0, 4, 8])};
    min-height: ${units.getValue(2)};
`

export const Reply = styled.div`
    margin-left: ${units.getValue(8)};
`



// WEBPACK FOOTER //
// ./app/features/posts/CommentThread/styled-components/index.js