import { Link } from 'react-router'
import styled, { css } from 'styled-components'

const disabledStyles = css`
    ${props => (props.disabled ? 'opacity: 0.33;' : '')} ${props =>
            props.disabled ? 'pointer-events: none;' : ''};
`

export const CardWrapper = styled.div`
    ${disabledStyles};
`

export const List = styled.ul`
    display: flex;
    flex-direction: row;
    justify-content: ${props => {
        switch (props.align) {
            case 'left':
                return 'flex-start'
            case 'center':
                return 'space-around'
            case 'right':
                return 'flex-end'
        }
    }};
    margin: 0;
    padding: 0 0
        ${props => (props.barPadding ? props.theme.units.getValues(1) : '0')} 0;
    ${disabledStyles};
`

const barHeights = {
    xs: '2px',
    sm: '2px',
    md: '4px',
}

const barContainerPseudoStyles = css`
    &:after {
        content: '';
        background-color: ${props => props.theme.colors.gray3};
        display: block;
        height: ${props => barHeights[props.size]};
    }
`

export const BarContainer = styled.div`
    ${props => (props.includeBarBackdrop ? barContainerPseudoStyles : '')};
`

export const Bar = styled.div`
    background-color: ${props => props.theme.colors[props.color]};
    bottom: 0;
    display: inline-block;
    height: ${props => barHeights[props.size]};
    left: 0;
    position: absolute;
`

const itemMargin = css`
    ${props => {
        const margins = {
            xs: 2,
            sm: 4,
            md: 6,
        }
        const margin = props.theme.units.getValues(margins[props.size])
        switch (props.align) {
            case 'left':
                return `
                    &:not(:last-child) {
                        margin-right: ${margin};
                    }
                `
            case 'right':
                return `
                    &:not(:first-child) {
                        margin-left: ${margin};
                    }
                `
            default:
                return ''
        }
    }};
`

export const Item = styled.li`
    display: block;
    ${props =>
        props.isActive ? 'pointer-events: none;' : ''} position: relative;
    ${props => (props.fullWidthItems ? 'width: 100%;' : '')} ${itemMargin};
`

export const ItemAnchor = styled.a`
    cursor: pointer;
    display: block;
    text-decoration: none;
    ${props => (props.fullWidthItems ? 'width: 100%;' : '')};
`

export const ItemLink = styled(Link)`
    cursor: pointer;
    display: block;
    text-decoration: none;
    ${props => (props.fullWidthItems ? 'width: 100%;' : '')};
`

export const ItemLabelContainer = styled.div`
    ${props =>
        props.fullWidthItems
            ? `
        display: flex;
        justify-content: center;
        width: 100%;
    `
            : ''};
`



// WEBPACK FOOTER //
// ./app/components/HorizontalNavList/styled-components/index.js