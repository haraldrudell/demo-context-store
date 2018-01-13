export const FEATURE_FLAGS_SUCCESS = 'FEATURE_FLAGS_SUCCESS'

export function featureFlagsSuccess (data) {
    return {
        type: FEATURE_FLAGS_SUCCESS,
        payload: data
    }
}



// WEBPACK FOOTER //
// ./app/actions/feature-flags.js