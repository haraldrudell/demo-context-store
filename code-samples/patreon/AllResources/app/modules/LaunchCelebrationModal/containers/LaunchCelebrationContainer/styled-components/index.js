import styled from 'styled-components'

export const ConfettiContainer = styled.div`
    ${props =>
        props.isOpen
            ? `
height: 100%;
width: 100%;
left: 0;
top: 0;
overflow: hidden;
position: fixed;
z-index: 150000`
            : ''};
`
export const ModalContentContainer = styled.div`
    text-align: center;
    z-index: 200000;
`



// WEBPACK FOOTER //
// ./app/modules/LaunchCelebrationModal/containers/LaunchCelebrationContainer/styled-components/index.js