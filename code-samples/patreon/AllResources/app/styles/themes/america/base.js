import { injectGlobal } from 'styled-components'
import Color from 'color'
import colors from './colors'
import units from './units'
import text from './text'
import { FONT_FAMILY, typeScaleRoot } from './typography'
import {
    HOVER_TRANSITION_TIME,
    HOVER_TRANSITION_EASE,
} from '../../shared/hover'
import responsiveUtils from 'styles/shared/responsive'
// This read as one size up because getBreakpoint returns the lower bound,
// while breakpointXSMAX is an upper bound
const breakpointXSMAX = `${responsiveUtils.getBreakpoint('sm')}rem`

const GRID_MAX_WIDTH = '71rem'
const PAGE_MIN_WIDTH = '320px'

const linkStyles = color => `
    font-weight: ${text.getWeight('bold')};
    color: ${color};
    text-decoration-skip: ink;
    transition: ${color} ${HOVER_TRANSITION_TIME} ${HOVER_TRANSITION_EASE});

    &:hover {
        text-decoration: underline;
    }

    &:visited {
        color: ${Color(color).darken(0.05).string()};
    }
`

const layoutUtilities = (size, value) => `
    /**
     * Margins
     */
    .mt-${size}, .reactWrapper .mt-${size} { margin-top: ${value}; }
    .mr-${size}, .reactWrapper .mr-${size} { margin-right: ${value}; }
    .mb-${size}, .reactWrapper .mb-${size} { margin-bottom: ${value}; }
    .ml-${size}, .reactWrapper .ml-${size} { margin-left: ${value}; }
    .mh-${size}, .reactWrapper .mh-${size} { margin-left: ${value}; margin-right: ${value} }
    .mv-${size}, .reactWrapper .mv-${size} { margin-top: ${value}; margin-bottom: ${value} }
    .m-${size}, .reactWrapper .m-${size} { margin: ${value}; }

    /**
     * Padding
     */
    .pt-${size} { padding-top: ${value}; }
    .pr-${size} { padding-right: ${value}; }
    .pb-${size} { padding-bottom: ${value}; }
    .pl-${size} { padding-left: ${value}; }
    .ph-${size} { padding-right: ${value}; padding-left: ${value}; }
    .pv-${size} { padding-top: ${value}; padding-bottom: ${value}; }
    .p-${size} { padding: ${value}; }
`

const unimportantTextSize = size =>
    text.getSize(size).replace(' !important', '')

injectGlobal`
    body {
        min-width: ${PAGE_MIN_WIDTH};
        /**
         * Should match footer background color so short pages
         * don't result in a "floating" footer bar.
         */
        background-color: ${colors.light};
    }

    #component-playground, /* Scoped for Cosmos */
    .reactWrapper { /* Scoped for patreon.com */
        /* patreon-normalize.less */
        ul {
            margin: 0;
        }

        p, small, h6, h5, h4, h3, h2, h1 {
            margin: 0;
        }

        /*
          UTILITY CLASSES
         */

        /* @DEPRECATED – use <Block> instead */
        .stackable {
            margin-bottom: ${units.getValue(2)};
        }

        /* @DEPRECATED – use <Grid> instead */
        .containerInner {
            box-sizing: border-box;
            margin-right: auto;
            margin-left: auto;
            max-width: ${GRID_MAX_WIDTH};
            padding-left: ${units.getValue(2)};
            padding-right: ${units.getValue(2)};
            width: 100%;
        }

        .containerInner .fullWidthMobile {
            /* Apply this class when: */
            /* - You are displaying the enclosed content as single-column on mobile (XS) widths (common), AND */
            /* - The content is contained inside cards (common). */
            @media (max-width: ${breakpointXSMAX}) {
                padding-left: 0;
                padding-right: 0;
                overflow-x: hidden;
            }
        }

        /* @DEPRECATED – use <Flexy> instead */
        .flex {
            display: flex;
        }

        /* @DEPRECATED – use <Text> instead */
        .subdued {
            color: ${colors.gray3};
        }

        /* @DEPRECATED – use <Text> instead */
        .link {
            ${linkStyles(colors.highlightPrimary)}
        }

        /* @DEPRECATED – use <Text> instead */
        .subtleLink {
            ${linkStyles(colors.gray3)}
        }

        /* @DEPRECATED - use <Text> instead */
        .subdued-text-sm {
            color: ${colors.gray3};
            font-size: ${unimportantTextSize(0)};
        }
        .subdued-text-sm a {
            color: ${colors.light};
        }

        /* @DEPRECATED - use <Text> instead */
        .subdued-text-1 {
            color: ${colors.gray3};
            font-size: ${unimportantTextSize(1)};
        }
        .subdued-text-1 a {
            color: ${colors.gray3};
        }
        .subdued-text-1 a:hover {
            color: ${colors.light};
        }

        /* @DEPRECATED - use <Text> instead */
        .gray-text-0 {
            color: ${colors.gray2};
            font-size: ${unimportantTextSize(0)};
        }

        /* @DEPRECATED - use <Text> instead */
        .gray-text-1 {
            color: ${colors.gray2};
            font-size: ${unimportantTextSize(1)};
        }

        /* @DEPRECATED - use <Text> instead */
        .gray-header-0 {
            color: ${colors.gray2};
            font-size: ${unimportantTextSize(0)};
        }

        /*
          BASE STYLES / BASE TYPOGRAPHY STYLES
         */
        color: ${colors.dark};
        font-family: ${FONT_FAMILY};
        font-size: ${typeScaleRoot};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;

        textarea:focus, input:focus{
            outline: 0;
        }

        small {
            font-size: ${unimportantTextSize(0)};
            line-height: ${text.getLineHeight(0)};
        }

        a {
            text-decoration: none;
            cursor: pointer;
        }

        p, .text, ol {
            font-size: ${unimportantTextSize(1)};
            line-height: ${text.getLineHeight(1)};
        }
        p a, .text a, ol a {
            ${linkStyles(colors.highlightPrimary)}
        }

        h6, h5, h4, h3, h2, h1 {
            line-height: ${text.getLineHeight(2)};
            font-weight: ${text.getWeight('bold')};
        }

        h6 {
            font-size: ${unimportantTextSize(1)};
        }

        h5, .h5 {
            font-size: ${unimportantTextSize(2)};
        }

        h4, .h4 {
            font-size: ${unimportantTextSize(3)};
        }

        h3, .h3 {
            font-size: ${unimportantTextSize(4)};
        }

        h2 {
            font-size: ${unimportantTextSize(5)};
        }

        h1 {
            font-size: ${unimportantTextSize(6)};
        }

        hr {
            border: 0;
            height: 2px;
            background: ${colors.snow};
        }

        .public-DraftEditorPlaceholder-root {
            color: ${colors.aluminum};
        }
    }

    .list-reset {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .button-reset {
        border: none;
        padding: 0;
        background: none;
        line-height: 0;
        ${linkStyles(colors.highlightPrimary)}
    }

    .pos-relative {
        position: relative;
    }

    .pos-absolute-fluid {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    .hide-visually {
        position: absolute;
        overflow: hidden;
        clip: rect(0 0 0 0);
        height: 1px; width: 1px;
        margin: -1px; padding: 0; border: 0;
    }

    .type-italic {
        font-style: italic;
    }

    .type-underline {
        text-decoration: underline !important;
    }

    /**
     * Utility spacing
     * @DEPRECATED – use <Block> instead
     */
    ${layoutUtilities('xs', units.getValue(0.5))}
    ${layoutUtilities('sm', units.getValue(1))}
    ${layoutUtilities('md', units.getValue(2))}
    ${layoutUtilities('lg', units.getValue(3))}
    ${layoutUtilities('xl', units.getValue(4))}
    ${layoutUtilities('xxl', units.getValue(6))}

    /**
     * Grid Borders
     * @DEPRECATED – use <Block> instead
     *
     * Assign to a wrapper within a col element to avoid breaking any
     * grid math unintentionally.
     */
    .bd-xs-t {
        border-top: 1px solid ${colors.snow};
    }

    .bd-xs-r {
        border-right: 1px solid ${colors.snow};
    }

    .bd-xs-b {
        border-bottom: 1px solid ${colors.snow};
    }

    /* partial borders that don't extend edge to edge */
    .bd-xs-r-partial {
        position: relative;
    }

    .bd-xs-r-partial:after {
        content: "";
        display: block;
        position: absolute;
        top: ${units.getValue(1)};
        bottom: ${units.getValue(1)};
        right: 2px; /* lil offset since it doesn't behave like a real border :D */
        width: 1px;
        background-color: ${colors.snow};
    }

    .redactor_box {
        width: 100%;
    }

    .Popover-tipShape {
        stroke-dasharray: 180%, 150%;
    }

    .Popover-tip {
        margin-bottom: -1px;
        z-index: 10;
    }

    /**
     * DEAR GOD FORGIVE US
     * This hack is here to ensure that the border of the popover is covered by * the popover-tip.
     * Taken from https://github.com/littlebits/react-popover/issues/102
     **/
    /* left position */
    .Popover-body[style*="order: -1"] + .Popover-tip[width="7"] {
        margin-left: -1px;
    }

    /* right position */
    .Popover-body[style*="order: 1"] + .Popover-tip[width="7"] {
        margin-right: -1px;
    }

    /* below position */
    .Popover-body[style*="order: 1"] + .Popover-tip[width="14"] {
        margin-bottom: -1px;
    }

    /* above position */
    .Popover-body[style*="order: -1"] + .Popover-tip[width="14"] {
        margin-top: -1px;
    }
    /**
     * END OF HACK
     **/

    .Popover-dark {
        transform: translateY(0) !important;
        transition-duration: 0ms;
        transition-property: transform !important;
    }

    .Popover-tip {
        transition: -webkit-transform 0ms ease-in !important;
    }
`



// WEBPACK FOOTER //
// ./app/styles/themes/america/base.js