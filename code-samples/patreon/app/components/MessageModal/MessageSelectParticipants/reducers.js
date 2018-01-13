import { filteredUsers } from 'reducers/users'

import {
    makeRefsCollectionReducer,
    getModelsFromRef,
} from 'reducers/make-refs-reducer'

import { SELECTED_PARTICIPANTS, SUGGESTED_PARTICIPANTS_QUERY } from './actions'

export const selectedParticipants = (state, action) => {
    const users = action.payload.map(userId => {
        return { id: userId, type: 'user' }
    })

    return getModelsFromRef(action.meta.nextDataState, users)
}

export const makeSelectedParticipantsRefReducer = () => {
    return makeRefsCollectionReducer('user', {
        [SELECTED_PARTICIPANTS]: selectedParticipants,
        SET_PARTICIPANTS: selectedParticipants,
    })
}

export const ui = {
    suggestedParticipantsQuery: (state = '', action) => {
        if (action.type !== SUGGESTED_PARTICIPANTS_QUERY) return state

        return action.payload
    },
}

export const refs = {
    suggestedMessageableUsers: filteredUsers(),
    selectedParticipants: makeSelectedParticipantsRefReducer(),
}



// WEBPACK FOOTER //
// ./app/components/MessageModal/MessageSelectParticipants/reducers.js