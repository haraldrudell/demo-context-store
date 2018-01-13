import styled from 'styled-components'
import helpers from 'styles/themes/helpers'
const { colors, components, units } = helpers

const hover = () => props => {
    const gray2 = props.theme.colors.gray2
    return props.hover ? `background-color: ${gray2};` : ' '
}

const selected = () => props => {
    const gray2 = props.theme.colors.gray2
    return props.selected ? `background-color: ${gray2};` : ' '
}

const flex = () => props => `
    display: flex;
    flex-direction: column;
`

// We need to offset the creator menu by the navbar offset to ensure the bottom section is aligned
// to the bottom of the page
export const CreatorMenuExpandedWrapper = styled.div`
    height: 100vh;
    overflow: hidden;
    width: ${props =>
        props.isExpanded
            ? components.navigation.creatorMenuExpandedWidth()
            : '0'};
    transition: ${props => props.theme.transitions.slow};
    background-color: ${colors.navy()};
    overflow: hidden;

    position: absolute;
    top: 0;
    left: ${components.navigation.creatorMenuOffsetWidth()};
    z-index: 10;
`

export const CreatorMenuLink = styled.a`
    display: block;
    width: 100%;
    padding: ${units.getValues([2, 2, 2, 0])};
    height: ${components.navigation.creatorMenuLinkHeight()};

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    cursor: pointer;

    box-sizing: border-box;
    ${hover()};
    ${selected()};
`

export const Links = styled.div`
    ${flex()};
    height: 100%;
    flex-direction: column;
`



// WEBPACK FOOTER //
// ./app/modules/Navigation/components/CreatorMenuExpanded/styled-components/index.js