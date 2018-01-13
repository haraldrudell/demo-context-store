import styled from 'styled-components'
import helpers from 'styles/themes/helpers'
const { units } = helpers

export default styled.li`
    margin-bottom: ${props =>
        units.getValue(props.mb !== undefined ? props.mb : 1)};
    line-height: 1.5;
    text-align: ${props => props.align || 'inherit'};
`



// WEBPACK FOOTER //
// ./app/components/UnorderedList/ListItem/index.jsx