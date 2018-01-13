import boundReducer from 'reducers/bound-reducer'
import { REF_REDUCER_INITIAL_STATE, getModelsFromRef } from 'reducers/make-refs-reducer'
import { GET_CURRENT_USER, PATCH_CURRENT_USER } from 'actions/current-user'
import { POST_REVERT_CURRENT_USER_TO_PATRON } from 'pages/settings/actions/current-user'
import { SETTINGS_PAGE_EVENTS, logSettingsEvent } from 'analytics'

const currentUserResponseReducer = (state, action) => {
    return getModelsFromRef(action.meta.nextDataState, action.payload)
}

const patchCurrentUserResponseReducer = (state, action) => {
    switch (action.type) {
        case `${PATCH_CURRENT_USER}_SUCCESS`:
            logSettingsEvent({
                title: SETTINGS_PAGE_EVENTS.PATCH_PROFILE_FINISHED,
                info: {
                    success: true
                }
            })
            return getModelsFromRef(action.meta.nextDataState, action.payload)
        case `${PATCH_CURRENT_USER}_FAILURE`:
            logSettingsEvent({
                title: SETTINGS_PAGE_EVENTS.PATCH_PROFILE_FINISHED,
                info: {
                    success: false
                }
            })
            break
        default:
            break
    }
    return state
}

const revertCurrentUserToPatronResponseReducer = (state, action) => {
    switch (action.type) {
        case `${POST_REVERT_CURRENT_USER_TO_PATRON}_SUCCESS`:
            logSettingsEvent({
                title: SETTINGS_PAGE_EVENTS.REVERT_TO_PATRON_FINISHED,
                info: {
                    success: true
                }
            })
            return getModelsFromRef(action.meta.nextDataState, action.payload)
        case `${POST_REVERT_CURRENT_USER_TO_PATRON}_FAILURE`:
            logSettingsEvent({
                title: SETTINGS_PAGE_EVENTS.REVERT_TO_PATRON_FINISHED,
                info: {
                    success: false
                }
            })
            break
        default:
            break
    }
    return state
}

export default boundReducer({
    [`${GET_CURRENT_USER}_SUCCESS`]: currentUserResponseReducer,
    [`${PATCH_CURRENT_USER}_SUCCESS`]: patchCurrentUserResponseReducer,
    [`${PATCH_CURRENT_USER}_FAILURE`]: patchCurrentUserResponseReducer,
    [`${POST_REVERT_CURRENT_USER_TO_PATRON}_SUCCESS`]: revertCurrentUserToPatronResponseReducer,
    [`${POST_REVERT_CURRENT_USER_TO_PATRON}_FAILURE`]: revertCurrentUserToPatronResponseReducer
}, REF_REDUCER_INITIAL_STATE)



// WEBPACK FOOTER //
// ./app/reducers/current-user.js