import styled from 'styled-components'
import helpers from 'styles/themes/helpers'
const { colors, text, units } = helpers

import {
    sharedInputContainerStyles,
    sharedInputStyles,
} from 'components/Form/Input/styled-components'

export const SendRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    width: 100%;
    align-items: center;
`

export const AvatarWrapper = styled.div`
    min-width: ${units.getValue(4)};
`

export const FieldContainer = styled.div`
    width: 100%;
    ${sharedInputContainerStyles};
`

export const CommentField = styled.textarea`
    max-height: ${units.getValue(10)};
    resize: none;
    width: 100%;
    &:placeholder {
        color: ${colors.gray5()};
    }
    ${sharedInputStyles} font-size: ${text.getSize(0)};
`

export const LoginField = styled.div`
    color: ${colors.gray7()};
`

export const Cancel = styled.div`
    margin-left: ${units.getValue(6)};
    margin-top: ${units.getValue(1)};
    color: ${colors.gray4()};
    font-size: ${text.getSize(0)};
    font-weight: ${text.getWeight('normal')};
`

export const CancelText = styled.a`
    color: ${colors.highlightSecondary()};
    font-weight: ${text.getWeight('bold')};
`



// WEBPACK FOOTER //
// ./app/features/posts/CommentThread/components/CommentSend/styled-components/index.js