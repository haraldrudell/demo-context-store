import isPlainObject from 'lodash/isPlainObject'
import devWarn from 'utilities/dev-warn'

const sizeOrScale = (size, scale) => {
    let s = size
    if (Boolean(scale)) {
        if (scale === '00') {
            s = -1
        } else {
            s = Number.parseInt(scale)
        }
    }
    return s
}

const mobileSizeOrScale = (size, scale, autoScale) => {
    const s = sizeOrScale(size, scale)
    if (s > 3 && autoScale) {
        return 3
    }
    return s
}

export const sizeValuesByBreakpoint = (size, scale, autoScale) => {
    if (isPlainObject(size)) {
        return size
    }
    const s = sizeOrScale(size, scale)
    const mobileSize = mobileSizeOrScale(size, scale, autoScale)
    if (mobileSize === s) {
        return { xs: s }
    }
    devWarn(
        `Warning: Text size ${s} is relying on being autoscaled to ${mobileSize} on mobile <Text>.`,
    )
    return { xs: mobileSize, md: s }
}

export const responsiveSize = (_sizeValuesByBreakpoint, theme, autoScale) => {
    const responsiveSizeProperties = Object.keys(
        _sizeValuesByBreakpoint,
    ).reduce((memo, breakpoint) => {
        const sizeValue = _sizeValuesByBreakpoint[breakpoint]
        const fontSize = theme.text.getSize(sizeValue)
        memo[breakpoint] = fontSize
        return memo
    }, {})
    return theme.responsive.cssPropsForBreakpointValues(
        responsiveSizeProperties,
        'font-size',
        true,
    )
}

export const responsiveLineHeight = (
    lineHeight,
    _sizeValuesByBreakpoint,
    theme,
    autoScale,
) => {
    let responsiveLineHeightProperties
    if (lineHeight) {
        responsiveLineHeightProperties = { xs: lineHeight }
    } else {
        responsiveLineHeightProperties = Object.keys(
            _sizeValuesByBreakpoint,
        ).reduce((memo, breakpoint) => {
            const size = _sizeValuesByBreakpoint[breakpoint]
            const lineHeightForSize = theme.text.getLineHeight(size)
            memo[breakpoint] = lineHeightForSize
            return memo
        }, {})
    }
    return theme.responsive.cssPropsForBreakpointValues(
        responsiveLineHeightProperties,
        'line-height',
        true,
    )
}



// WEBPACK FOOTER //
// ./app/components/Text/responsive-utils.js