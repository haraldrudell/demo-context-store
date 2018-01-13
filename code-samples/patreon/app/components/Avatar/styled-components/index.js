import styled, { css } from 'styled-components'
import Block from 'components/Layout/Block'

const responsiveSize = ({ sizesByBreakpoint, b, borderStrokeWidth, theme }) => {
    const cssWidths = {}
    const cssMinWidths = {}
    const cssHeights = {}
    const cssPaddingBottoms = {}

    Object.keys(sizesByBreakpoint).forEach(breakpoint => {
        const size = sizesByBreakpoint[breakpoint]
        if (size === 'fluid') {
            cssWidths[breakpoint] = '100%'
            cssPaddingBottoms[breakpoint] = b
                ? `calc(100% - 2*${borderStrokeWidth});`
                : '100%;'
        } else {
            const cssSize = theme.units.getValue(size)
            cssWidths[breakpoint] = cssSize
            cssMinWidths[breakpoint] = cssSize
            cssHeights[breakpoint] = cssSize
        }
    })

    return css`${theme.responsive.cssPropsForBreakpointValues(
        cssWidths,
        'width',
    )};
    ${theme.responsive.cssPropsForBreakpointValues(cssMinWidths, 'min-width')};
    ${theme.responsive.cssPropsForBreakpointValues(cssHeights, 'height')};
    ${theme.responsive.cssPropsForBreakpointValues(
        cssPaddingBottoms,
        'padding-bottom',
    )};`
}

export const StyledAvatar = styled(Block)`
    ${props => responsiveSize(props)}
    background-clip: padding-box;

    overflow: hidden;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
`



// WEBPACK FOOTER //
// ./app/components/Avatar/styled-components/index.js