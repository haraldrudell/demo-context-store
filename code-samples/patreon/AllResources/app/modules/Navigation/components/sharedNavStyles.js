import styled from 'styled-components'
import get from 'lodash/get'

import helpers from 'styles/themes/helpers'
const { units } = helpers

export const LogoSection = styled.a`
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 100%;
    padding: ${props =>
        props.theme.units.getValues([0, 1, 0, get(props, 'ml', 2)])};
`

export const TextLinks = styled.div`
    display: flex;
    align-items: center;

    a {
        display: flex;
        padding: ${units.getValues([1, 1])};
        margin: ${units.getValues([0, 1])};
        & > span {
            align-self: center;
        }
    }
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/sharedNavStyles.js