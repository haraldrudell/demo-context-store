import styled from 'styled-components'
import helpers from 'styles/themes/helpers'
const { components } = helpers

const getStyle = key => props => components.footer[props.colorTheme][key]

export const FooterWrapper = styled.div`
    background-color: ${ getStyle('backgroundColor') };

    ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }
`



// WEBPACK FOOTER //
// ./app/modules/Footer/styled-components/index.js