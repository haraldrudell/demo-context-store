import styled from 'styled-components'

import helpers from 'styles/themes/helpers'
const { colors, components, text, units, zIndex } = helpers

const flex = (align = 'center') => `
    display: flex;
    flex-direction: row;
    align-items: ${align};
`
export const NavWrapper = styled.nav`
    z-index: ${zIndex.Z_INDEX_CPV2_NAV()};

    ${props =>
        props.theme.responsive.cssPropsForBreakpointValues(
            { xs: 'none', md: 'block' },
            'display',
        )};
`

export const TopNavBar = styled.div`
    background-color: ${colors.white()};
    color: ${colors.gray1()};
    font-size: ${text.getSize(2)};
    font-weight: ${text.getWeight('bold')};
    width: 100%;
    height: ${components.navigation.height()};
    margin: 0 auto;
    display: block;
    position: fixed;
    white-space: nowrap;
    box-shadow: ${components.navigation.boxShadow()};
    ${flex('stretch')};
    justify-content: space-between;
`

export const NavbarIconWrapper = styled.div`
    ${flex('center')} position: relative;
    margin: ${units.getValues([0, 1])};
`

export const NavSection = styled.div`
    ${flex('stretch')} height: 100%;
    padding: ${units.getValues([0, 2])};
`

export const HamburgerMenuWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: ${props => (props.disabled ? 'default' : 'pointer')};
    ${props =>
        props.disabled
            ? 'opacity: 0.33; a { cursor: default !important; }'
            : ''};
`

export const UserMenuWrapper = styled.div`
    align-self: flex-end;
    /* one-line */
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/Navbar/styled-components/index.js