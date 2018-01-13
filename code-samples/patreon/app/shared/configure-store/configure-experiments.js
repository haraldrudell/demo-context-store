import access from 'safe-access'
import { camelizeKeys } from 'humps'

const experimentsNameSpace = 'patreon.experiments'

/**
 * Target should be the window object when used inside configure-store.
 * Making it an argument allows for cleaner testing/less side effects.
 */
export default (target = {}) => {
    const experiments = access(target, experimentsNameSpace) || {}

    if (process.env.DEVELOPMENT_DEBUG) {
        // default state
        const keys = Object.keys(experiments)
        if (keys.length > 0) {
            console.info(
                `Read ${keys.length} experiment${keys.length > 1
                    ? 's'
                    : ''} from ${experimentsNameSpace}.`,
                keys,
            )
        }
    }

    return {
        reducer: (state = {}, action) => state,
        initialState: camelizeKeys(experiments),
    }
}



// WEBPACK FOOTER //
// ./app/shared/configure-store/configure-experiments.js