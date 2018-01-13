import styled from 'styled-components'
import helpers from 'styles/themes/helpers'
const { colors, components, text, units } = helpers

const hover = () => props => {
    const gray2 = props.theme.colors.gray2
    return props.hover ? `background-color: ${gray2};` : ''
}

const selected = () => props => {
    const gray2 = props.theme.colors.gray2
    return props.selected ? `background-color: ${gray2};` : ''
}

const flex = () => props => `
    display: flex;
    flex-direction: column;
    align-items: center;
`

// We need to offset the creator menu by the navbar offset to ensure the bottom section is aligned
// to the bottom of the page
export const CreatorMenuWrapper = styled.div`
    width: ${components.navigation.creatorMenuOffsetWidth()};
    height: 100vh;
    background-color: ${colors.navy()};
    position: absolute;
    top: ${components.navigation.navbarOffsetHeight()};
    left: 0px;
    z-index: 2;

    transition: all 400ms ease;

    color: ${colors.white()};
`

export const CreatorMenuIcon = styled.a`
    ${flex()};
    justify-content: center;

    ${hover()};
    ${selected()};
    text-align: center;
    width: 100%;
    height: ${components.navigation.creatorMenuLinkHeight()};
    color: ${colors.gray2()};
    font-size: ${text.getSize(1)};
    padding: ${units.getValues([1.5, 0])};

    cursor: pointer;

    box-sizing: border-box;
`

export const Links = styled.div`
    ${flex()};
    height: 100%;
    flex-direction: column;
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/CreatorMenu/styled-components/index.js