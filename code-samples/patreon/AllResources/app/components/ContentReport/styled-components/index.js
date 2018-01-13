import styled from 'styled-components'

export const ModalContentWrapper = styled.div`
    margin: 20px 40px 20px 0px;
    max-width: 500px;
    ${props =>
        props.theme.responsive.cssPropsForBreakpointValues(
            { xs: 'auto', md: '500px' },
            'min-width',
        )};
`



// WEBPACK FOOTER //
// ./app/components/ContentReport/styled-components/index.js