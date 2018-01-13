import {
    addResponsiveHandlers as bindHandlers,
    createResponsiveStateReducer,
} from 'redux-responsive'
import responsiveUtils from 'styles/shared/responsive'
const { getBreakpointInPixels } = responsiveUtils

// These read as one size up because getBreakpointInPixels returns the lower bound,
// while createResponsiveStateReducer expects the upper bound
const breakpoints = {
    extraSmall: getBreakpointInPixels('sm'),
    small: getBreakpointInPixels('md'),
    medium: getBreakpointInPixels('lg'),
}

export default () => {
    return {
        reducer: createResponsiveStateReducer(breakpoints),
    }
}

export const bindResponsiveHandlers = bindHandlers



// WEBPACK FOOTER //
// ./app/shared/configure-store/configure-responsive.js