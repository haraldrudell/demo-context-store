import styled from 'styled-components'

export const MessageForm = styled.form`
    ${'' /* // For button alignment */} text-align: right;
    display: flex;
    flex-direction: row;
    width: 100%;
`

export const MessageFormBody = styled.div`flex-grow: 1;`

export const MessageFormTextarea = styled.textarea`
    border: 1px solid ${props => props.theme.colors.gray4};
    padding: ${props => props.theme.units.getValue(2)};
    resize: none;
    width: 100%;
    border-radius: ${props => props.theme.cornerRadii['default']};
    font-weight: ${props => props.theme.text.getWeight('normal')};
    box-sizing: border-box;
`



// WEBPACK FOOTER //
// ./app/features/messages/Conversation/components/MessageEditor/styled-components/index.js