import styled from 'styled-components'
import helpers from 'styles/themes/helpers'
const { units } = helpers

export { default as ListItem } from './ListItem'

export default styled.ul`
    margin-top: ${props =>
        units.getValue(props.mt !== undefined ? props.mt : 2)};
    margin-bottom: ${props =>
        units.getValue(props.mb !== undefined ? props.mb : 2)};
    text-align: ${props => props.align || 'inherit'};
`



// WEBPACK FOOTER //
// ./app/components/UnorderedList/index.jsx