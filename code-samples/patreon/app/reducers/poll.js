import {
    START_UNVOTING_ALL_RESPONSES,
    FINISH_UNVOTING_ALL_RESPONSES
} from 'actions/poll'

const initialState = {
    unvotePending: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case START_UNVOTING_ALL_RESPONSES:
            return {
                ...state,
                unvotePending: true
            }
        case FINISH_UNVOTING_ALL_RESPONSES:
            return {
                ...state,
                unvotePending: false
            }
        default:
            break
    }
    return state
}



// WEBPACK FOOTER //
// ./app/reducers/poll.js