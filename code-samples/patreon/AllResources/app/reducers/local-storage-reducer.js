import access from 'safe-access'
import { LOCAL_STORAGE_SUCCESS } from 'actions/local-storage'

export const getLocalStorage = (state) => (
    access(state, 'localStorage')
)

export default (state = {}, action) => {
    switch (action.type) {
        case LOCAL_STORAGE_SUCCESS:
            return {
                ...state,
                [action.key]: action.payload
            }
        default:
            return state
    }
}



// WEBPACK FOOTER //
// ./app/reducers/local-storage-reducer.js