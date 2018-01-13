import {
    makeRequestReducer,
    makeMultiRequestReducer,
} from 'reducers/make-request-reducer'
import {
    REF_REDUCER_INITIAL_STATE,
    makeRefsCollectionReducer,
    getModelsFromRef,
} from 'reducers/make-refs-reducer'
import boundReducer from 'reducers/bound-reducer'
import { GET_FILTERED_USERS } from 'actions/users'
import * as selectParticipantsReducers from './MessageSelectParticipants/reducers'

export const requests = {
    [GET_FILTERED_USERS]: makeRequestReducer(GET_FILTERED_USERS),
    POST_CONVERSATION_MESSAGE_MODAL: makeRequestReducer({
        actionType: 'POST_CONVERSATION_MESSAGE_MODAL',
        resetActionType: 'MESSAGE_MODAL_CLEAR_CONVERSATION',
    }),
    POST_MESSAGE_MESSAGE_MODAL: makeMultiRequestReducer(
        'POST_MESSAGE_MESSAGE_MODAL',
    ),
}

export const messageModalConversationRefReducer = boundReducer(
    {
        POST_CONVERSATION_MESSAGE_MODAL_SUCCESS: (state, action) => {
            return getModelsFromRef(action.meta.nextDataState, action.payload)
        },
        MESSAGE_MODAL_CLEAR_CONVERSATION: () => ({}),
    },
    REF_REDUCER_INITIAL_STATE,
)

export const messageModalMessagesRefsReducer = makeRefsCollectionReducer(
    'message_v2',
    {
        POST_MESSAGE_MESSAGE_MODAL_SUCCESS: (state, action) => {
            const messages = [...state, action.payload]

            return getModelsFromRef(action.meta.nextDataState, messages)
        },
        MESSAGE_MODAL_CLEAR_CONVERSATION: () => [],
    },
    REF_REDUCER_INITIAL_STATE,
)

// Useful when setting participants manually.
export const setParticipantsReducer = (state = [], action) => {
    if (action.type !== 'SET_PARTICIPANTS') return state

    return action.payload
}

export const ui = {
    ...selectParticipantsReducers.ui,
}

export const refs = {
    messageModalConversation: messageModalConversationRefReducer,
    messageModalMessages: messageModalMessagesRefsReducer,
    ...selectParticipantsReducers.refs,
}



// WEBPACK FOOTER //
// ./app/components/MessageModal/reducers.js