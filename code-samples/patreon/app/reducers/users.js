import { makeRefsCollectionReducer } from 'reducers/make-refs-reducer'
import { getModelsFromRef } from 'reducers/make-refs-reducer'

const usersResponseReducer = (state, action) => getModelsFromRef(action.meta.nextDataState, action.payload)

export const filteredUsers = () => (
    makeRefsCollectionReducer('user', {
        'GET_FILTERED_USERS_SUCCESS': usersResponseReducer
    })
)



// WEBPACK FOOTER //
// ./app/reducers/users.js