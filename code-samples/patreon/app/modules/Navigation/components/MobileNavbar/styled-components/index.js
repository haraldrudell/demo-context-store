import styled from 'styled-components'
import helpers from 'styles/themes/helpers'

const { colors, components, units, zIndex } = helpers

const flex = (align = 'center') => `
    display: flex;
    flex-direction: row;
    align-items: ${align};
`

/* eslint-disable no-shadow */
export const MobileNavigationWrapper = styled.div`
    z-index: ${zIndex.Z_INDEX_CPV2_NAV()};
    background-color: ${colors.white()};

    position: fixed;
    top: 0;
    left: 0;
    ${props =>
        props.isMenuOpen
            ? `
        right: 0;
        bottom: 0;
        height: 100%;
        overflow: auto;
    `
            : ''} width: 100%;
    white-space: nowrap;

    box-shadow: ${components.navigation.boxShadow()};

    ${props =>
        props.theme.responsive.cssPropsForBreakpointValues(
            { xs: 'block', md: 'none' },
            'display',
        )};
`

export const NavbarWrapper = styled.div`
    ${flex('center')};
    justify-content: space-between;
    height: ${components.navigation.height()};
    padding: ${units.getValues([0, 2])};
`

export const RightSection = styled.div`
    height: ${components.navigation.height()};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

export const NavbarHamburger = styled.a`
    height: ${components.navigation.height()};
    line-height: ${components.navigation.height()};

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;
    cursor: pointer;
    user-select: none;

    ${props =>
        props.disabled ? 'opacity: 0.33; cursor: default !important' : ''};
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/MobileNavbar/styled-components/index.js