import { selectFeatureFlags } from 'shared/configure-store'

export default selectFeatureFlags

const loggedFailedSelections = {}

export const selectorForFeatureFlag = (key) => {
    return (state) => {
        const flags = selectFeatureFlags(state)

        const flag = flags[key]
        if (process.env.DEVELOPMENT_DEBUG && typeof flag === 'undefined') {
            if (!loggedFailedSelections[key]) {
                console.error(`Couldn't select feature flag '${key}' from state.`, flags)
                loggedFailedSelections[key] = true
            }
        }

        return flag
    }
}

export const selectFeatureFlag = selectorForFeatureFlag



// WEBPACK FOOTER //
// ./app/getters/feature-flags.js