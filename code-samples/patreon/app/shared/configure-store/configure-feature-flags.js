import access from 'safe-access'
import { camelizeKeys } from 'humps'
import { FEATURE_FLAGS_SUCCESS } from 'actions/feature-flags'

const featureFlagNameSpace = 'patreon.featureFlags'

/**
 * Target should be the window object when used inside configure-store.
 * Making it an argument allows for cleaner testing/less side effects.
 */
export default (target = {}) => {
    const featureFlags = access(target, featureFlagNameSpace) || {}

    if (process.env.DEVELOPMENT_DEBUG) {
        // default state
        const keys = Object.keys(featureFlags)
        if (keys.length > 0) {
            console.info(
                `Read ${keys.length} feature flag${keys.length > 1
                    ? 's'
                    : ''} from ${featureFlagNameSpace}.`,
                keys,
            )
        }
    }

    /**
     * There was a namespacing issue with featureFlags -- some pages are accessing
     * feature flags data from bootstrap, and dispatching FEATURE_FLAGS_SUCCESS action.
     * This reducer, in those cases, was removing the data we got from bootstrap.
     * Calling FEATURE_FLAGS_SUCCESS action from other places should be avoided now,
     * but in order to make this new reducer work with older pages that use that
     * way of access, we need to extend the state here rather than override it completely.
     */
    return {
        reducer: (state = {}, action) => {
            switch (action.type) {
                case FEATURE_FLAGS_SUCCESS:
                    return {
                        ...state,
                        ...action.payload,
                    }
                default:
                    return state
            }
        },
        initialState: camelizeKeys(featureFlags),
    }
}



// WEBPACK FOOTER //
// ./app/shared/configure-store/configure-feature-flags.js