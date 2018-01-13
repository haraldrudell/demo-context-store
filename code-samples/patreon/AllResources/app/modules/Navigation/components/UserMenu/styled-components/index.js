import styled from 'styled-components'
import helpers from 'styles/themes/helpers'
const { colors, components, strokeWidths, units } = helpers

const menuBorder = color => props =>
    `${props.theme.strokeWidths.default} solid ${props.theme.colors[color]}`

export const UserMenuWrapper = styled.div`
    width: ${units.getValue(22)};
    background-color: ${colors.white()};

    position: absolute;
    top: ${components.navigation.height()};
    right: -${strokeWidths.default()};
    z-index: 999;

    transition: all 400ms ease;
    border-top: ${menuBorder('gray6')};
    box-shadow: -2px 2px 0 0 ${colors.shadow()};
`

export const UserMenuLink = styled.a`
    display: flex;
    align-items: center;
    width: 100%;
    padding: ${units.getValues([1.5, 2])};

    &:hover {
        background-color: ${colors.gray8()};
    }
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/UserMenu/styled-components/index.js