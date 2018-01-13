import styled from 'styled-components'
import helpers from 'styles/themes/helpers'

const { colors, components, units, zIndex } = helpers

export const ButtonWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: ${units.getValue(2)};
`

export const MobileMenuWrapper = styled.div`
    z-index: ${zIndex.Z_INDEX_CPV2_NAV()};
    box-sizing: border-box;
    width: 100%;
    padding: ${units.getValues([0, 2])};

    position: absolute;
    top: ${components.navigation.height()};
`

export const MobileMenuList = styled.nav`
    margin-top: 10px;
    /* multi-line css */
`

export const MobileMenuLink = styled.a`
    height: ${components.navigation.mobileMenuLinkHeight()};

    display: flex;
    flex-direction: row;
    align-items: center;

    justify-content: space-between;

    border-bottom: 1px solid ${colors.gray5()};
`

export const CreatorMenuLink = styled(MobileMenuLink)`
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/MobileMenu/styled-components/index.js