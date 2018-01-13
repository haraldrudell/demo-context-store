import { createSelector } from 'reselect'
import get from 'lodash/get'

const getLegacyRoutingLocation = (state, props) =>
    get(
        state,
        'routing.locationBeforeTransitions',
        get(state, 'routing.location'),
    )

const getRoutingLocation = (state, props) => get(props, 'location')

export const getLocation = createSelector(
    [getRoutingLocation, getLegacyRoutingLocation],
    (location, legacyRoutingLocation) => location || legacyRoutingLocation,
)

export const getPathname = createSelector([getLocation], location =>
    get(location, 'pathname'),
)

export const getQueryParams = createSelector([getLocation], location =>
    get(location, 'query', {}),
)



// WEBPACK FOOTER //
// ./app/getters/location.js