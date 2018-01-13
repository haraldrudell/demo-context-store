import Color from 'color'
import pick from 'lodash/pick'
import values from 'lodash/values'

const BLUE = '#358EFF'

const GRAY_HUE = 205
const getGrayHex = brightness => {
    // Gray saturation is calculated based on the following exponential curve
    // saturation = c1 * e^(c2 * brightness)
    // brightness should be a value between 0 and 100
    const c1 = 401.3
    const c2 = -0.0506555
    const saturation = c1 * Math.exp(c2 * brightness)
    return Color({ h: GRAY_HUE, s: saturation, v: brightness }).hex()
}

const colors = {
    /**
     * DESCRIPTIVE COLOR NAMES
     * Do not use these in components
     */
    coral: '#F96854',
    navy: '#052D49',
    midnight: getGrayHex(35),
    smoke: getGrayHex(48),
    aluminum: getGrayHex(71),
    silver: getGrayHex(94),
    snow: '#F3F4F5',
    white: '#FFFFFF',
    blue: BLUE,
    sky: Color(BLUE)
        .lighten(0.6)
        .hex(),
    salmon: '#FF9B7A',
    brick: '#D13D3D',
    yellow: '#FFDB49',
    forest: '#006375',
    green: '#63D6A3',
}

export const functionalColors = {
    // @TODO: remove "highlight" from `highlightPrimary` and `highlightSecondary`
    highlightPrimary: colors.coral,
    highlightSecondary: colors.blue,
    dark: colors.navy,
    light: colors.white,
    // @TODO: deprecate `gray1` in favor of `dark`, shift grays up
    gray1: colors.navy,
    gray2: colors.midnight,
    gray3: colors.smoke,
    gray4: colors.aluminum,
    gray5: colors.silver,
    gray6: colors.snow,
    gray7: colors.snow,
    gray8: colors.snow,
    shadow: Color(colors.navy)
        .fade(0.93)
        .string(),
    translucentOverlay: Color('#000000')
        .fade(0.15)
        .string(),
    checkmarkFill: colors.coral,
    pollFill: colors.sky,
    listItemHighlight: colors.sky,
    radioFill: colors.coral,
    success: colors.green,
    error: colors.brick,
    pageBackground: colors.snow,

    // Social
    discordBlurple: '#7289DA',
    facebookBlue: '#3B5998',
    googleRed: '#DB4437',
    pinterestRed: '#BD081C',
    spotifyGreen: '#1ED760',
    tumblrBlue: '#36465d',
    twitchPurple: '#6441A5',
    twitterBlue: '#55ACEE',
    youtubeRed: '#e52d27',

    // Other – @TODO: deprecate these
    milestoneBrown: '#8d211b',
    milestoneDarkGreen: '#016534',
    milestoneBlue: '#5591ae',
    milestoneDarkBlue: '#023e5a',
    milestoneOrange: '#f06b49',
}

const primaryColors = pick(colors, [
    'coral',
    'yellow',
    'green',
    'salmon',
    'blue',
    'forest',
    'brick',
])

export default {
    ...colors,
    ...functionalColors,
    primaryColors: values(primaryColors), // converts to array

    // Color sets for documentation in the design system
    designSystem: {
        functionalColors: pick(functionalColors, [
            'highlightPrimary',
            'highlightSecondary',
            'dark',
            'light',
            'gray1',
            'gray2',
            'gray3',
            'gray4',
            'gray5',
            'gray6',
            'gray7',
            'gray8',
            'listItemHighlight',
            'translucentOverlay',
            'success',
            'error',
        ]),
        primaryColors,
    },

    /**
     * Handling of legacy colors (DO NOT USE!!!)
     */
    red: colors.brick,
    orange: colors.coral,
    black: '#000',
    darkGray: colors.navy,
    offwhite: colors.snow,
    whitestGray: colors.snow,
    lightestestGray: colors.snow,
    lightestGray: colors.silver,
    lightGray: colors.aluminum,
    gray: colors.midnight,
    subduedGray: colors.smoke,
    errorOrange: colors.brick,
    errorRedBg: colors.brick,
    darkErrorOrange: colors.brick,
    darkSuccessGreen: colors.green,
    blueBg: colors.sky,
    yellow: colors.yellow,
    transparent: 'transparent',
    statsBlue: colors.sky,
}



// WEBPACK FOOTER //
// ./app/styles/themes/america/colors.js