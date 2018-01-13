import t from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import reduce from 'lodash/reduce'
import unitRange from 'utilities/validation/props/unit-range'

const Block = ({ children, ...props }) => (
    <StyledBlock {...props}>{children}</StyledBlock>
)

Block.defaultProps = {
    b: false,
    bt: false,
    br: false,
    bb: false,
    bl: false,
    borderColor: 'gray5',
    borderStyle: 'solid',
    cornerRadius: 'default',
    display: 'block',
    fluidWidth: false,
    position: 'static',
}

const borderType = t.oneOfType([
    t.bool,
    t.string,
    t.shape({
        xs: t.bool,
        sm: t.bool,
        md: t.bool,
        lg: t.bool,
        xl: t.bool,
    }),
])
const displayType = t.oneOf([
    'inline',
    'block',
    'inline-block',
    'inherit',
    'none',
])
const responsiveUnitRange = t.oneOfType([
    unitRange,
    t.shape({
        xs: unitRange,
        sm: unitRange,
        md: unitRange,
        lg: unitRange,
        xl: unitRange,
    }),
])

Block.propTypes = {
    /**
     * `left` `center` `right`
     */
    textAlign: t.oneOf(['left', 'center', 'right']),

    children: t.node,
    /**
     * Border params either take a bool (show border with values provided by other props)
     * or alternatively, a string of specifically what to show for that border side vs others
     * b: border
     * bt: borderTop
     * br: borderRight
     * bb: borderBottom
     * bl: borderLeft
     */
    b: borderType,
    bt: borderType,
    br: borderType,
    bb: borderType,
    bl: borderType,
    /**
     * Background color of block that takes a color string to match against theme.colors
     * `white` `light` `pageBackground` (add more as necessary)
     **/
    backgroundColor: t.oneOf([
        'white',
        'light',
        'pageBackground',
        'gray1',
        'gray5',
        'gray6',
        'pollFill',
        'success',
        'error',
    ]),
    /**
     * Border color, takes in string to match against colors.js
     * Defaults to gray5
     */
    borderColor: t.string,
    /**
     * Border stroke-width, takes in string value for stroke-width (e.g. "1px")
     * Defaults to theme strokeWidths.default
     */
    borderStrokeWidth: t.string,
    /**
     * Border style, takes in string value for stroke style (e.g. "solid")
     * Defaults to solid
     */
    borderStyle: t.oneOf(['none', 'solid', 'dashed', 'dotted']),
    /**
     * Corner radius -- options defined within theme/xx/corner-radii.js
     * Defaults to default cornerRadii in theme
     */
    cornerRadius: t.oneOf([
        'none',
        'small',
        'default',
        'imageDefault',
        'circle',
    ]),

    /**
     * Display: `inline` `block` `inline-block`
     * OR screen-size dependent display, like {xs: 'none', md: 'block'}
     * If you're looking for `flex`, please use `components/Layout/Flexy` instead of `Block`
     */
    display: t.oneOfType([
        displayType,
        t.shape({
            xs: displayType,
            sm: displayType,
            md: displayType,
            lg: displayType,
            xl: displayType,
        }),
    ]),

    /**
     * fluidHeight: Fills the outer contiainer height
     * Default: false
     */
    fluidHeight: t.bool,

    /**
     * fluidWidth: Fills the outer contiainer width
     * Default: false
     */
    fluidWidth: t.oneOfType([
        t.bool,
        t.shape({
            xs: t.bool,
            sm: t.bool,
            md: t.bool,
            lg: t.bool,
            xl: t.bool,
        }),
    ]),

    maxWidth: t.string,

    /**
     * Whether to hide overflow in this element
     **/
    noOverflow: t.bool,
    /**
     * Position: `static` `relative` `absolute` `fixed`
     */
    position: t.oneOf(['static', 'relative', 'absolute', 'fixed']),

    /**
     * Vertical align: `baseline` `sub` `super` `text-top` `text-bottom`
     * `middle` `top` `bottom`     */
    verticalAlign: t.oneOf([
        'baseline',
        'sub',
        'super',
        'text-top',
        'text-bottom',
        'middle',
        'top',
        'bottom',
    ]),

    /**
     * m: margin
     * ml: marginLeft
     * mr: marginRight
     * mt: marginTop
     * mb: marginBottom
     * mv: marginVertical (top and bottom)
     * mh: marginHorizontal (left and right)
     */
    m: responsiveUnitRange,
    ml: responsiveUnitRange,
    mr: responsiveUnitRange,
    mt: responsiveUnitRange,
    mb: responsiveUnitRange,
    mv: responsiveUnitRange,
    mh: responsiveUnitRange,

    /**
     * p: padding
     * pl: paddingLeft
     * pr: paddingRight
     * pt: paddingTop
     * pb: paddingBottom
     * pv: paddingVertical (top and bottom)
     * ph: paddingHorizontal (left and right)
     */
    p: responsiveUnitRange,
    pl: responsiveUnitRange,
    pr: responsiveUnitRange,
    pt: responsiveUnitRange,
    pb: responsiveUnitRange,
    pv: responsiveUnitRange,
    ph: responsiveUnitRange,

    /**
     *  String descriptor for testing
     **/
    'data-tag': t.string,
}

const _convertResponsiveUnitsToValues = (responsiveUnits, theme) =>
    Object.entries(responsiveUnits).reduce((memo, keyVal) => {
        memo[keyVal[0]] = theme.units.getValue(keyVal[1])
        return memo
    }, {})

const _responsiveLayout = ({ ruleName, theme, base, top, r, l, b, v, h }) => {
    // make props responsive
    const rroot = typeof base === 'number' ? { xs: base } : base
    const rt = typeof top === 'number' ? { xs: top } : top
    const rr = typeof r === 'number' ? { xs: r } : r
    const rl = typeof l === 'number' ? { xs: l } : l
    const rb = typeof b === 'number' ? { xs: b } : b
    const rv = typeof v === 'number' ? { xs: v } : v
    const rh = typeof h === 'number' ? { xs: h } : h
    // unify into single dictionaries per side and transform into values
    const unifiedTop = _convertResponsiveUnitsToValues(
        { xs: 0, ...rroot, ...rv, ...rt },
        theme,
    )
    const unifiedRight = _convertResponsiveUnitsToValues(
        { xs: 0, ...rroot, ...rh, ...rr },
        theme,
    )
    const unifiedBottom = _convertResponsiveUnitsToValues(
        { xs: 0, ...rroot, ...rv, ...rb },
        theme,
    )
    const unifiedLeft = _convertResponsiveUnitsToValues(
        { xs: 0, ...rroot, ...rh, ...rl },
        theme,
    )
    // return responsive rules for each side
    return `${theme.responsive.cssPropsForBreakpointValues(
        unifiedTop,
        `${ruleName}-top`,
    )}; ${theme.responsive.cssPropsForBreakpointValues(
        unifiedRight,
        `${ruleName}-right`,
    )}; ${theme.responsive.cssPropsForBreakpointValues(
        unifiedBottom,
        `${ruleName}-bottom`,
    )}; ${theme.responsive.cssPropsForBreakpointValues(
        unifiedLeft,
        `${ruleName}-left`,
    )};`
}

const getPadding = ({ theme, p, pt, pr, pl, pb, pv, ph }) =>
    _responsiveLayout({
        ruleName: 'padding',
        theme,
        base: p,
        top: pt,
        r: pr,
        l: pl,
        b: pb,
        v: pv,
        h: ph,
    })

const getMargin = ({ theme, m, mt, mr, ml, mb, mv, mh }) =>
    _responsiveLayout({
        ruleName: 'margin',
        theme,
        base: m,
        top: mt,
        r: mr,
        l: ml,
        b: mb,
        v: mv,
        h: mh,
    })

const _borderInnerValue = ({
    theme,
    borderColor,
    borderStrokeWidth,
    borderStyle,
}) => border => {
    if (border && typeof border === 'boolean') {
        return `${borderStyle} ${borderStrokeWidth ||
            theme.strokeWidths.default} ${theme.colors[borderColor]}`
    } else if (border) {
        return border
    }
    return 'none'
}

const _border = ({
    propType,
    theme,
    border,
    borderColor,
    borderStrokeWidth,
    borderStyle,
}) => {
    if (!border) {
        return ''
    }
    const transformationFn = _borderInnerValue({
        theme,
        borderColor,
        borderStrokeWidth,
        borderStyle,
    })
    const borderValues = theme.responsive.transformValues(
        border,
        transformationFn,
    )
    return theme.responsive.cssPropsForBreakpointValues(borderValues, propType)
}

const getBorder = ({
    theme,
    b,
    bt,
    br,
    bb,
    bl,
    borderColor,
    borderStrokeWidth,
    borderStyle,
}) => {
    if (b) {
        b = typeof b === 'boolean' || typeof b === 'string' ? { xs: b } : b
        return `${_border({
            propType: 'border',
            theme,
            borderColor,
            borderStrokeWidth,
            borderStyle,
            border: b,
        })};`
    }

    bt = typeof bt === 'boolean' || typeof bt === 'string' ? { xs: bt } : bt
    br = typeof br === 'boolean' || typeof br === 'string' ? { xs: br } : br
    bb = typeof bb === 'boolean' || typeof bb === 'string' ? { xs: bb } : bb
    bl = typeof bl === 'boolean' || typeof bl === 'string' ? { xs: bl } : bl
    return `
        ${_border({
            propType: 'border-top',
            theme,
            borderColor,
            borderStrokeWidth,
            borderStyle,
            border: bt,
        })};
        ${_border({
            propType: 'border-right',
            theme,
            borderColor,
            borderStrokeWidth,
            borderStyle,
            border: br,
        })};
        ${_border({
            propType: 'border-bottom',
            theme,
            borderColor,
            borderStrokeWidth,
            borderStyle,
            border: bb,
        })};
        ${_border({
            propType: 'border-left',
            theme,
            borderColor,
            borderStrokeWidth,
            borderStyle,
            border: bl,
        })};
    `
}

const getDisplay = props => {
    if (typeof props.display === 'string') {
        return `display: ${props.display};`
    }
    return props.theme.responsive.cssPropsForBreakpointValues(
        props.display,
        'display',
    )
}

const getWidth = props => {
    if (typeof props.fluidWidth === 'boolean') {
        return props.fluidWidth ? 'width: 100%;' : ''
    }
    return props.theme.responsive.cssPropsForBreakpointValues(
        reduce(
            props.fluidWidth,
            (memo, value, key) => {
                memo[key] = value ? '100%' : 'initial'
                return memo
            },
            {},
        ),
        'width',
    )
}

const StyledBlock = styled.div`
    ${props => `
    ${props.fluidHeight ? 'height: 100%;' : ''};
    ${props.backgroundColor
        ? `background-color: ${props.theme.colors[props.backgroundColor]};`
        : ''}
    box-sizing: border-box;
    position: ${props.position};
    border-radius: ${props.theme.cornerRadii[props.cornerRadius]};
    transition: ${props.theme.transitions.default};
    overflow: ${props.noOverflow ? 'hidden' : 'inherit'};
    ${props.maxWidth ? `max-width: ${props.maxWidth}` : ''};
    ${props.verticalAlign ? `vertical-align: ${props.verticalAlign};` : ''}
    ${props.textAlign ? `text-align: ${props.textAlign};` : ''}
    ${getPadding(props)}
    ${getMargin(props)}
    ${getBorder(props)}
    ${getDisplay(props)}
    ${getWidth(props)}
`};
`

export default Block



// WEBPACK FOOTER //
// ./app/components/Layout/Block/index.jsx