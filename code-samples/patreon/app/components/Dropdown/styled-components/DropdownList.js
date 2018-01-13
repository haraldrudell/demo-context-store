import styled from 'styled-components'

import helpers from 'styles/themes/helpers'
const { units } = helpers


export const ListContainer = styled.div`
    overflow-y: scroll;
    max-height: ${props => typeof (props.maxHeight) === 'number'
        ? units.getValue(props.maxHeight)
        : props.maxHeight};
`



// WEBPACK FOOTER //
// ./app/components/Dropdown/styled-components/DropdownList.js