import t from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Flexy = ({ children, ...props }) => {
    // Have to delete, else all the children and its parents
    // will all share this data-tag
    delete props['data-tag']
    // coerce direction prop to a responsive form
    const { direction } = props
    let responsiveDirection =
        typeof direction === 'string' ? { xs: direction } : direction
    delete props['direction']
    return (
        <StyledFlexy {...props} direction={responsiveDirection}>
            {children}
        </StyledFlexy>
    )
}

const directionTypes = t.oneOf([
    'row',
    'row-reverse',
    'column',
    'column-reverse',
])

Flexy.propTypes = {
    children: t.node,
    /**
     * alignContent: 'flex-start' 'flex-end' 'center' 'space-around' 'space-between'
     */
    alignContent: t.oneOf([
        'flex-start',
        'flex-end',
        'center',
        'space-around',
        'space-between',
    ]),
    /**
     * alignItems: 'flex-start' 'flex-end' 'center' 'baseline' 'stretch'
     */
    alignItems: t.oneOf([
        'flex-start',
        'flex-end',
        'center',
        'baseline',
        'stretch',
    ]),
    /**
     * alignSelf: 'flex-start' 'flex-end' 'center' 'baseline' 'stretch'
     */
    alignSelf: t.oneOf([
        'flex-start',
        'flex-end',
        'center',
        'baseline',
        'stretch',
    ]),
    /**
     * basis: number (width in units), `auto`, `fill`, `max-content`, `min-content`, `fit-content`
     */
    basis: t.oneOfType([
        t.number,
        t.oneOf(['auto', 'fill', 'max-content', 'min-content', 'fit-content']),
    ]),
    /**
     * Display: `inline` `flex` `inline-flex` `block` `inline-block`
     */
    display: t.oneOf([
        'inline',
        'flex',
        'inline-flex',
        'block',
        'inline-block',
    ]),
    /**
     * direction: 'row' 'row-reverse' 'column' 'column-reverse'
     */
    direction: t.oneOfType([
        directionTypes,
        t.shape({
            xs: directionTypes,
            sm: directionTypes,
            md: directionTypes,
            lg: directionTypes,
            xl: directionTypes,
        }),
    ]),
    /**
     * fluidHeight: Fills container height
     */
    fluidHeight: t.bool,
    /**
     * fluidWidth: Fills container width
     */
    fluidWidth: t.bool,
    /**
     * grow: 'initial' 1, 2, ...
     */
    grow: t.oneOfType([t.number, t.string]),
    /**
     * justifyContent: 'flex-start' 'flex-end' 'center' 'space-around' 'space-between'
     */
    justifyContent: t.oneOf([
        'flex-start',
        'flex-end',
        'center',
        'space-around',
        'space-between',
    ]),
    /**
     * wrap: 'nowrap' 'wrap' wrap-revers'
     */
    wrap: t.oneOf(['nowrap', 'wrap', 'wrap-reverse']),
    /**
     *  String descriptor for testing
     **/
    'data-tag': t.string,
}
Flexy.defaultProps = {
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    display: 'flex',
    direction: 'row',
    fluidHeight: false,
    fluidWidth: false,
    grow: 'initial',
    justifyContent: 'flex-start',
    wrap: 'nowrap',
}

const StyledFlexy = styled.div`
    ${props => `
    align-content: ${props.alignContent};
    align-items: ${props.alignItems};
    ${props.alignSelf ? `align-self: ${props.alignSelf}` : ''};
    display: ${props.display};
    ${props.basis
        ? `flex-basis: ${props.theme.units.getValue(props.basis)};`
        : ''};
    flex-grow: ${props.grow};
    flex-wrap: ${props.wrap};
    ${props.fluidHeight ? 'height: 100%' : ''};
    justify-content: ${props.justifyContent};
    ${props.fluidWidth ? 'width: 100%' : ''};
    ${props.theme.responsive.cssPropsForBreakpointValues(
        props.direction,
        'flex-direction',
    )}
`};
`

export default Flexy



// WEBPACK FOOTER //
// ./app/components/Layout/Flexy/index.jsx