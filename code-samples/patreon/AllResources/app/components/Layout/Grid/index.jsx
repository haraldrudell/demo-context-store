import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import get from 'lodash/get'
import reduce from 'lodash/reduce'

const MAX_WIDTHS = {
    sm: 64, // units
    md: 104,
    lg: 144,
}

const maxWidthTypes = PropTypes.oneOf(['sm', 'md', 'lg'])

class Grid extends Component {
    static propTypes = {
        /**
         * Set the background color of the outer container of grid, which is
         * 100% width.
         * @type {[type]}
         */
        backgroundColor: PropTypes.oneOf([
            'dark',
            'gray1',
            'gray8',
            'light',
            'transparent',
            'white',
            'highlightPrimary',
        ]),

        /**
         * Contents of the grid. Direct children are generally `<Row>`s.
         * @type {[type]}
         */
        children: PropTypes.node,

        /**
         * Maximum width of the grid, in units. `sm: 64`. `md: 96`, `lg: 144`
         */
        maxWidth: PropTypes.oneOfType([
            maxWidthTypes,
            PropTypes.shape({
                xs: maxWidthTypes,
                sm: maxWidthTypes,
                md: maxWidthTypes,
                lg: maxWidthTypes,
                xl: maxWidthTypes,
            }),
        ]),

        noOverflow: PropTypes.bool,

        /**
         * Add padding in units to the grid at various breakpoints. Supercedes
         * props `pv` and `ph`.
         */
        p: PropTypes.shape({
            xs: PropTypes.number,
            sm: PropTypes.number,
            md: PropTypes.number,
            lg: PropTypes.number,
            xl: PropTypes.number,
        }),

        /**
         * Add horizontal padding in units to the grid at various breakpoints.
         * Defaults to 2 units of padding at all sizes.
         */
        ph: PropTypes.shape({
            xs: PropTypes.number,
            sm: PropTypes.number,
            md: PropTypes.number,
            lg: PropTypes.number,
            xl: PropTypes.number,
        }),

        /**
         * Add vertical padding in units to the grid at various breakpoints.
         */
        pv: PropTypes.shape({
            xs: PropTypes.number,
            sm: PropTypes.number,
            md: PropTypes.number,
            lg: PropTypes.number,
            xl: PropTypes.number,
        }),
    }

    static defaultProps = {
        ph: {
            xs: 2,
        },
    }

    render() {
        // @TODO: replace <Inner> with <Container> from react-grid-system once
        // we’re using React 15
        const {
            backgroundColor,
            children,
            maxWidth,
            noOverflow,
            p,
            ph,
            pv,
        } = this.props
        const responsiveMaxWidth =
            typeof maxWidth === 'string' ? { xs: maxWidth } : maxWidth

        return (
            <Outer backgroundColor={backgroundColor} noOverflow={noOverflow}>
                <Inner maxWidth={responsiveMaxWidth} p={p} ph={ph} pv={pv}>
                    {children}
                </Inner>
            </Outer>
        )
    }
}

const Outer = styled.div`
    ${props =>
        props.backgroundColor
            ? `background-color: ${props.theme.colors[props.backgroundColor]};`
            : ''} ${props =>
            props.noOverflow ? 'overflow: hidden;' : ''} width: 100%;
`

const paddingAtBreakpoint = (breakpoint, ph, pv) => {
    if (ph === 0 && pv === 0) return ''
    return css`
        ${props => `
        ${ph
            ? `
            @media only screen and (min-width: ${props.theme.responsive.getBreakpoints()[
                breakpoint
            ]}rem) {
                padding-left: ${props.theme.units.getValue(ph)};
                padding-right: ${props.theme.units.getValue(ph)};
            }
        `
            : ''}
        ${pv
            ? `
            @media only screen and (min-width: ${props.theme.responsive.getBreakpoints()[
                breakpoint
            ]}rem) {
                padding-top: ${props.theme.units.getValue(pv)};

                    /** Subtract 2 units from the bottom padding to account for
                     * padding from <Row> components
                     **/
                padding-bottom: ${props.theme.units.getValue(pv - 2)};
            }
        `
            : ''}
    `};
    `
}

const Inner = styled.div`
    box-sizing: border-box;
    margin: 0 auto;
    ${props =>
        props.theme.responsive.cssPropsForBreakpointValues(
            reduce(
                props.maxWidth,
                (memo, value, key) => {
                    memo[key] = props.theme.units.getValue(MAX_WIDTHS[value])
                    return memo
                },
                {},
            ),
            'max-width',
        )};
    width: 100%;
    ${props =>
        Object.keys(props.theme.responsive.getBreakpoints()).map(breakpoint => {
            const horizontalPadding =
                get(props, `p[${breakpoint}]`) ||
                get(props, `ph[${breakpoint}]`) ||
                0

            const verticalPadding =
                get(props, `p[${breakpoint}]`) ||
                get(props, `pv[${breakpoint}]`) ||
                0

            return paddingAtBreakpoint(
                breakpoint,
                horizontalPadding,
                verticalPadding,
            )
        })};
`

export default Grid



// WEBPACK FOOTER //
// ./app/components/Layout/Grid/index.jsx