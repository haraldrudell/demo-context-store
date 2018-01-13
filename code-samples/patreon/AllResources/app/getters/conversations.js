import { getCurrentUserId } from 'getters/current-user'
import access from 'safe-access'
import uniqBy from 'lodash/uniqBy'

export const createParticipantsFilterFn = (query = '', limit = 10) => {
    return state => {
        const conversations = access(state, 'refs.conversations')
        const currentUserId = getCurrentUserId(state)

        if (!conversations) {
            console.warn(
                `Couldn't find refs.conversations in state for recent participant suggestions.`,
            )
            return []
        }

        const participants = uniqBy(
            conversations.reduce((memo, conversation) => {
                let _participants = conversation.participants
                if (query) {
                    _participants = _participants.filter(
                        p =>
                            p.fullName
                                .toLowerCase()
                                .indexOf(query.toLowerCase()) > -1,
                    )
                }
                return memo.concat(_participants)
            }, []),
            p => p.id,
        ).filter(p => p.id !== currentUserId)

        return participants.slice(0, limit)
    }
}

export const getParticipantsForSelectedConversation = (state, ownProps) => {
    return access(
        state,
        `data.conversation[${access(
            ownProps,
            'params.selectedConversationId',
        )}].participants`,
    )
}

export const getSelectedConversation = (state, ownProps) => {
    return access(
        state,
        `data.conversation[${access(
            ownProps,
            'params.selectedConversationId',
        )}]`,
    )
}



// WEBPACK FOOTER //
// ./app/getters/conversations.js