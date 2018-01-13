import get from 'lodash/get'

import americaStyles from './america'

export const getTheme = () => {
    return get(window, 'patreon.theme', 'america')
}

// Consider removing *all* global styles and relying on component styling only.
export const initGlobalThemeStyles = () => {
    require('styles/themes/america/base')
}

export const getThemeFont = () => {
    return americaStyles.fontName
}

export const getThemePrimitives = themeOverride => {
    return americaStyles
}

export const getThemePageColor = () => {
    return americaStyles.colors.pageBackground
}



// WEBPACK FOOTER //
// ./app/styles/themes/index.js