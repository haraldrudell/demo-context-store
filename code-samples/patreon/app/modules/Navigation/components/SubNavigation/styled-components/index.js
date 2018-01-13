import styled from 'styled-components'
import helpers from 'styles/themes/helpers'
const { components, colors } = helpers

export const SubNavigationWrapper = styled.div`
    background-color: ${colors.light()};
    box-shadow: ${components.navigation.rightBoxShadow()};
    height: 100vh;
    left: ${props =>
        props.isActiveCreator
            ? components.navigation.creatorMenuOffsetWidth()
            : 0};
    max-width: ${props =>
        props.navWidth
            ? props.navWidth + 'px'
            : components.navigation.subMenuWidth()};
    position: absolute;
    padding-top: 2px;
    top: ${components.navigation.height()};
    z-index: 0;
    overflow: auto;
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/SubNavigation/styled-components/index.js