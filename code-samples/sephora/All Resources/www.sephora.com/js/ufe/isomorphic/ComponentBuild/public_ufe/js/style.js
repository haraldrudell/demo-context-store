const black = '#000';
const white = '#fff';
const red = '#e7040f';
const rouge = '#d0112b';
const green = '#02dd2d';
const blue = '#328AFB';
const darkGray = '#333';
const midGray = '#555';
const gray = '#777';
const silver = '#999';
const lightSilver = '#aaa';
const moonGray = '#ccc';
const lightGray = '#eee';
const nearWhite = '#f4f4f4';
const darken = (n) => `rgba(0, 0, 0, ${n})`;

const space = [
    0,
    4,  // 1
    8,  // 2
    12, // 3
    16, // 4
    24, // 5
    32, // 6
    48  // 7
];

const borderRadius = 4;

const colors = {
    black,
    white,
    red,
    rouge,
    green,
    blue,
    darkGray,
    midGray,
    gray,
    silver,
    lightSilver,
    moonGray,
    lightGray,
    nearWhite,
    error: red,
    linkPrimary: blue
};

const fonts = {
    SANS_SERIF: '"helvetica neue", helvetica, arial, sans-serif',
    SERIF: 'georgia, times, serif'
};

const site = {
    HEADER_HEIGHT_MW: 45,
    MAX_WIDTH: 1200,
    MIN_WIDTH_FS: 1024,
    MIN_WIDTH_MW: 320,
    PADDING_FS: 22,
    PADDING_MW: space[4],
    SIDEBAR_WIDTH: 203,
    TOP_BAR_HEIGHT: 34,
    WIDTH: 980
};

const breakpoints = {
    LG: '(min-width: ' + site.MIN_WIDTH_FS + 'px)'
};

const lineHeights = [
    0, 1, 1.25, 1.5
];

const shade = [
    darken(0),
    darken(1 / 16),
    darken(1 / 8),
    darken(1 / 4),
    darken(1 / 2)
];

const tracking = [
    0,
    '.0625em',
    '.125em',
    '.25em'
];

const baseFontSize = 14;

const fontSizes = {
    h6: 11,
    h5: 12,
    h4: baseFontSize,
    h3: 16,
    h2: 18,
    h1: 24,
    h0: 32,
    h00: 44,
    BASE: baseFontSize
};

const zIndex = {
    HEADER: 1000,
    CHAT: 1010,
    HAMBURGER: 1020,
    DROPDOWN: 1030,
    BACK_TO_TOP: 1040,
    MODAL: 1050,
    MAX: 2147483647
};

const buttons = {
    FONT_SIZE: fontSizes.h5,
    BORDER_WIDTH: 1,
    PADDING_X: 16,
    PADDING_Y: 10,
    LINE_HEIGHT: lineHeights[3]
};

const forms = {
    HEIGHT:
        buttons.FONT_SIZE *
        buttons.LINE_HEIGHT +
        buttons.PADDING_Y * 2 +
        buttons.BORDER_WIDTH * 2,
    FONT_SIZE: fontSizes.h4,
    PADDING_X: 12,
    PADDING_Y: 10,
    COLOR: colors.black,
    BG: colors.white,
    BORDER_COLOR: colors.moonGray,
    BORDER_FOCUS_COLOR: colors.black,
    DISABLED_BG: colors.lightGray,
    DISABLED_OPACITY: 0.7,
    RADIO_SIZE: 18,
    RADIO_SIZE_SM: 15,
    RADIO_MARGIN: space[3],
    RADIO_MARGIN_SM: space[2],
    PLACEHOLDER_COLOR: colors.silver,
    PLACEHOLDER_FOCUS_COLOR: colors.moonGray,
    MARGIN_BOTTOM: space[4],
    MSG_STYLE: {
        color: colors.gray,
        marginTop: space[2],
        fontSize: fontSizes.h5,
        lineHeight: lineHeights[2]
    }
};

const dropdown = {
    SHADOW: '0 1px 8px rgba(0,0,0,.15)',
    BG: colors.white,
    ARROW_SIZE: 15
};

const swatch = {
    PADDING: 1,
    BORDER_WIDTH: 3,
    SALE_BADGE_HEIGHT: 16,
    FONT_SIZE: fontSizes.h5,
    TEXT_PADDING_VERT: space[2],
    TEXT_PADDING_HORZ: space[3],
    TEXT_BORDER_WIDTH: 1
};

const modal = {
    PADDING_MW: space[4],
    PADDING_FS: space[6],
    ACTIONS_WIDTH: 362,
    ACTIONS_GUTTER: space[4],
    X_SIZE: 18,
    HEADER_HEIGHT: 56,
    SUBHEADER_HEIGHT: site.HEADER_HEIGHT_MW,
    WIDTH: {
        XS: 384,
        SM: 472,
        MD: 576,
        LG: 783,
        XL: site.WIDTH
    }
};

const overlay = {
    COLOR: colors.black,
    OPACITY: 0.25
};

const measure = {
    /* Measure is limited to ~66 characters */
    BASE: '30em',
    /* Measure is limited to ~80 characters */
    WIDE: '34em',
    /* Measure is limited to ~45 characters */
    NARROW: '20em'
};

const style = {
    borderRadius,
    breakpoints,
    buttons,
    colors,
    fonts,
    forms,
    lineHeights,
    measure,
    modal,
    overlay,
    shade,
    dropdown,
    site,
    space,
    swatch,
    tracking,
    fontSizes,
    zIndex
};

module.exports = style;



// WEBPACK FOOTER //
// ./public_ufe/js/style.js