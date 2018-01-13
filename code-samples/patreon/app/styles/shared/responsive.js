const DEFAULT_PIXEL_SIZE = 16

// breakpoints are in REM sizing.
// To calculate sizes in pixel space do BREAK_POINT_SIZE * DEFAULT_PIXEL_SIZE
const BREAKPOINTS_IN_REM = {
    xs: 1, // 16
    sm: 30, // 480
    md: 48, // 768
    lg: 62, // 992
    xl: 75, // 1200
}

const BREAKPOINT_NAMES = ['xs', 'sm', 'md', 'lg', 'xl']

const getRemToPixel = pixelSize => pixelSize * DEFAULT_PIXEL_SIZE
const getBreakpoints = () => BREAKPOINTS_IN_REM
const getBreakpoint = size => BREAKPOINTS_IN_REM[size]
const getBreakpointInPixels = size =>
    BREAKPOINTS_IN_REM[size] * DEFAULT_PIXEL_SIZE
const getBreakpointsInPixels = () =>
    Object.keys(BREAKPOINTS_IN_REM).reduce((m, b) => {
        m[b] = getRemToPixel(BREAKPOINTS_IN_REM[b])
        return m
    }, {})

const transformValues = (object, mapFn) =>
    Object.keys(object).reduce((memo, key) => {
        memo[key] = mapFn(object[key])
        return memo
    }, {})

const getImportantString = (cssPropValue, isImportant) => {
    const importantString = ' !important'
    const propValueHasImportant =
        typeof cssPropValue === 'string' &&
        !!cssPropValue.indexOf(importantString)
    return !propValueHasImportant && isImportant ? importantString : ''
}

const cssPropForBreakpoint = (
    breakpoint,
    cssPropName,
    cssPropValue,
    isImportant,
) => {
    if (!cssPropValue) return ''
    const importantString = getImportantString(cssPropValue, isImportant)
    const propertyString = `${cssPropName}: ${cssPropValue}${importantString};`
    if (breakpoint === 'xs') {
        return propertyString
    }
    return `@media (min-width: ${getBreakpoints()[breakpoint]}rem) {
        ${propertyString}
    }`
}

/**
 * breakpointToValueObject: a dict mapping breakpoint strings to cssPropValues
 *      e.g. {xs: 1, md: 3}
 * cssPropName: the name of the css prop that this value is for
 *      e.g. 'display' or 'order'
 */
const cssPropsForBreakpointValues = (
    breakpointToValueObject,
    cssPropName,
    isImportant,
) => {
    if (!breakpointToValueObject) return ''
    const breakpoints = Object.keys(breakpointToValueObject)
    if (breakpoints.length === 0) return ''
    /*
    * styled-components has a bug where even a vanilla @media query
    * after any spurious semicolon (e.g., color: blue;;) causes the @media query to be ignored.
    * To counteract that bug, we inject a nonce css style at the beginning of the list of @media queries
    */
    return ['styled-components: bug-fix;']
        .concat(
            breakpoints.map(breakpoint => {
                return cssPropForBreakpoint(
                    breakpoint,
                    cssPropName,
                    breakpointToValueObject[breakpoint],
                    isImportant,
                )
            }),
        )
        .join(' ')
}

const cssPropForResolution = (resolution, cssPropName, cssPropValue) => {
    if (!cssPropValue) return ''
    if (resolution <= 1) {
        return `${cssPropName}: ${cssPropValue};`
    }
    return `@media (min-resolution: ${resolution * 96}dpi) {
        ${cssPropName}: ${cssPropValue};
    }`
}

/**
 * resolutionToValueObject: a dict mapping pixel density numbers to cssPropValues
 *      e.g. {1: 'url(my-image.png)', 2: 'url(my-image@2x.png)'}
 * To work around the `styled-components: bug-fix` bug, PLEASE ALWAYS PROVIDE A VALUE FOR resolutionToValueObject[1]
 * cssPropName: the name of the css prop that this value is for
 *      e.g. 'display' or 'order'
 */
const cssPropsForResolutionValues = (resolutionToValueObject, cssPropName) => {
    if (!resolutionToValueObject) return ''
    const resolutions = Object.keys(resolutionToValueObject)
    if (resolutions.length === 0) return ''
    return resolutions
        .map(resolution => {
            return cssPropForResolution(
                resolution,
                cssPropName,
                resolutionToValueObject[resolution],
            )
        })
        .join(' ')
}

export default {
    BREAKPOINT_NAMES,
    getBreakpoint,
    getBreakpoints,
    getBreakpointInPixels,
    getBreakpointsInPixels,
    getRemToPixel,
    cssPropForBreakpoint,
    cssPropsForBreakpointValues,
    cssPropsForResolutionValues,
    transformValues,
}



// WEBPACK FOOTER //
// ./app/styles/shared/responsive.js