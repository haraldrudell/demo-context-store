import access from 'safe-access'
import { camelizeKeys } from 'humps'

const presetsNamespace = 'patreon.presets'

/**
 * Target should be the window object when used inside configure-store.
 * Making it an argument allows for cleaner testing/less side effects.
 */
export default (target = {}) => {
    const presets = access(target, presetsNamespace) || {}

    if (process.env.DEVELOPMENT_DEBUG) {
        // default state
        const keys = Object.keys(camelizeKeys(presets))
        if (keys.length > 0) {
            console.info(
                `Read ${keys.length} key${keys.length > 1
                    ? 's'
                    : ''} from ${presetsNamespace}.`,
                keys,
            )
        }
    }

    return {
        reducer: (state = {}, action) => state,
        initialState: camelizeKeys(presets),
    }
}



// WEBPACK FOOTER //
// ./app/shared/configure-store/configure-presets.js