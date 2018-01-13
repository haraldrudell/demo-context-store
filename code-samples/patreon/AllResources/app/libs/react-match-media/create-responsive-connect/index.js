import createMatchMediaConnect from '../create-match-media-connect'
import capitalize from 'lodash/capitalize'
import responsive from 'styles/shared/responsive'

export function generatedSortedBreakpoints(breakpoints) {
    const breakpointsList = []

    for (const key in breakpoints) {
        if (!breakpoints.hasOwnProperty(key)) continue
        const value = breakpoints[key]
        breakpointsList.push({ key, value })
    }

    // Make sure breakpoints are ordered by value ASC
    breakpointsList.sort(({ value: a }, { value: b }) => a - b)

    return breakpointsList
}

export function generateQueryMap(breakpoints) {
    const queryMap = {
        isLandscape: '(orientation: landscape)',
        isPortrait: '(orientation: portrait)',
    }
    const breakpointsList = generatedSortedBreakpoints(breakpoints)

    breakpointsList.forEach((breakpoint, idx) => {
        const { key } = breakpoint
        const capitalizedKey = capitalize(key)
        // Skip min-width query for first element
        if (idx > 0) {
            const { value: width } = breakpoint
            const minWidthKey = `isMin${capitalizedKey}`
            queryMap[minWidthKey] = `(min-width: ${width}px)`
        }
        const nextBreakpoint = breakpointsList[idx + 1]
        // Skip max-width query for last element
        if (nextBreakpoint) {
            const { value: nextWidth } = nextBreakpoint
            const maxWidthKey = `isMax${capitalizedKey}`
            queryMap[maxWidthKey] = `(max-width: ${nextWidth - 1}px)`
        }
    })

    return queryMap
}

export default function createResponsiveConnect(
    breakpoints = responsive.getBreakpointsInPixels(),
) {
    const queryMap = generateQueryMap(breakpoints)
    return createMatchMediaConnect(queryMap)
}



// WEBPACK FOOTER //
// ./app/libs/react-match-media/create-responsive-connect/index.js