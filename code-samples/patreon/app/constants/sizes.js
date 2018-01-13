const SIZE_TO_UNITS = {
    xxxs: 0.25,
    xxs: 0.5,
    xs: 0,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 5,
}

export const ICON_SIZE_TO_UNITS = {
    // TODO: revisit sizing options (lg: 32px, anything larger can use fluid with parent dimens specified)
    xxxxs: 1,
    xxxs: 1.25,
    xxs: 1.5,
    xs: 2,
    sm: 3,
    md: 4,
    lg: 5,
    xl: 6,
    xxl: 8,
    xxxl: 11,
    fluid: '100%',
}

export const SIZE_KEYS = Object.keys(SIZE_TO_UNITS)
export default SIZE_TO_UNITS



// WEBPACK FOOTER //
// ./app/constants/sizes.js