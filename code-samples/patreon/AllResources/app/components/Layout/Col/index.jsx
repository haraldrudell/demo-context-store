import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'
import Color from 'color'
import get from 'lodash/get'
import Block from 'components/Layout/Block'

/* eslint-disable react/no-unused-prop-types */

const columnRange = (props, propName, componentName) => {
    const prop = props[propName]
    if (!prop) return
    if (
        typeof prop !== 'number' ||
        !Number.isInteger(prop) ||
        prop < 0 ||
        prop > 12
    ) {
        return new Error(
            'Invalid prop `' +
                propName +
                '` supplied to' +
                ' `' +
                componentName +
                '`. Expected an inteteger between 0 and' +
                ' 12, got `' +
                prop +
                '`',
        )
    }
}

const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl']

const orderType = PropTypes.oneOfType([
    PropTypes.oneOf(['unset']),
    PropTypes.number,
])

const displayType = PropTypes.oneOf(['block', 'none'])

class Col extends Component {
    static propTypes = {
        /**
         * https://developer.mozilla.org/en-US/docs/Web/CSS/align-self
        **/
        alignSelf: PropTypes.oneOf([
            'flex-start',
            'flex-end',
            'center',
            'baseline',
            'stretch',
        ]),

        children: PropTypes.node,

        /**
         * Styles the columns with a background color and border for debugging.
         */
        debug: PropTypes.bool,

        /**
         * Responsive way to show/hide columns
        **/
        display: PropTypes.shape({
            xs: displayType,
            sm: displayType,
            md: displayType,
            lg: displayType,
            xl: displayType,
        }),

        /**
         * fluidHeight: Fills the outer contiainer height
        * Default: false
         */
        fluidHeight: PropTypes.bool,

        /**
         * Moves columns to the right by adding left margin in increments of
         * column widths, according to relative breakpoints.
         */
        offset: PropTypes.shape({
            xs: columnRange,
            sm: columnRange,
            md: columnRange,
            lg: columnRange,
            xl: columnRange,
        }),

        /**
         * https://developer.mozilla.org/en-US/docs/Web/CSS/order
        **/
        order: PropTypes.shape({
            xs: orderType,
            sm: orderType,
            md: orderType,
            lg: orderType,
            xl: orderType,
        }),

        /**
         * The number of columns to fill at breakpoint xs and above. Must be an
         * integer between 0 and 12.
         */
        xs: columnRange,

        /**
         * The number of columns to fill at breakpoint sm and above. Must be an
         * integer between 0 and 12.
         */
        sm: columnRange,

        /**
         * The number of columns to fill at breakpoint md and above. Must be an
         * integer between 0 and 12.
         */
        md: columnRange,

        /**
         * The number of columns to fill at breakpoint lg and above. Must be an
         * integer between 0 and 12.
         */
        lg: columnRange,

        /**
         * The number of columns to fill at breakpoint xl and above. Must be an
         * integer between 0 and 12.
         */
        xl: columnRange,
    }

    render() {
        // @TODO: use <Row> from react-grid-system once we’re using React 15

        const {
            alignSelf,
            children,
            debug,
            display,
            fluidHeight,
            offset,
            order,
        } = this.props

        let classnames = ''

        for (let breakpoint of BREAKPOINTS) {
            // Column widths
            if (typeof get(this.props, breakpoint) === 'number') {
                classnames += `col-${breakpoint}-${this.props[breakpoint]} `
            }
            // Offset amounts
            if (typeof get(offset, breakpoint) === 'number') {
                classnames += `col-${breakpoint}-offset-${offset[breakpoint]} `
            }
        }

        return (
            <StyledCol
                alignSelf={alignSelf}
                className={classnames}
                debug={debug}
                order={order}
                display={display}
            >
                <Block fluidHeight={fluidHeight} pb={2}>
                    {children}
                </Block>
            </StyledCol>
        )
    }
}

const StyledCol = styled.div`
    ${props => props.alignSelf && `align-self: ${props.alignSelf};`};
    ${props =>
        props.theme.responsive.cssPropsForBreakpointValues(
            props.order,
            'order',
        )};
    ${props =>
        props.theme.responsive.cssPropsForBreakpointValues(
            props.display,
            'display',
        )};
    ${props =>
        props.debug &&
        `background-color: ${Color(props.theme.colors.highlightSecondary)
            .fade(0.8)
            .string()};
            border: ${props.theme.strokeWidths.default} solid ${props.theme
            .colors.highlightSecondary};`};
`

export default Col



// WEBPACK FOOTER //
// ./app/components/Layout/Col/index.jsx