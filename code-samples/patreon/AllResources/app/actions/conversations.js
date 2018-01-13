import apiRequestAction from 'actions/api-request-action'
import jsonApiUrl from 'utilities/json-api-url'

export const POST_CONVERSATION = 'POST_CONVERSATION'
export const PATCH_CONVERSATION = 'PATCH_CONVERSATION'
export const GET_CONVERSATION = 'GET_CONVERSATION'
export const GET_CONVERSATIONS = 'GET_CONVERSATIONS'

export const API_RESOURCE_PATH = '/conversations'

export const postConversation = (participantUserIds, opts = {}) => {
    const relationships = {
        participants: {
            data: participantUserIds.map(id => {
                return { id, type: 'user' }
            }),
        },
    }

    const body = {
        data: {
            type: 'conversation',
            relationships,
        },
    }

    const ACTION_TYPE = opts.actionSuffix
        ? `${POST_CONVERSATION}_${opts.actionSuffix}`
        : POST_CONVERSATION

    const url = jsonApiUrl(API_RESOURCE_PATH, {
        include: ['participants'],
        fields: {
            conversation: ['created_at', 'read'],
            user: ['full_name', 'image_url', 'thumb_url', 'url'],
        },
        'json-api-use-default-includes': false,
    })

    return dispatch => {
        return dispatch(apiRequestAction(ACTION_TYPE, url, { body }))
    }
}

export const markAsRead = conversationId => {
    const body = {
        data: {
            type: 'conversation',
            attributes: { read: true },
        },
    }
    const includes = []
    const fields = {
        conversation: ['read'],
    }

    return dispatch => {
        return dispatch(
            apiRequestAction(
                `${PATCH_CONVERSATION}__${conversationId}`,
                jsonApiUrl(`${API_RESOURCE_PATH}/${conversationId}`, {
                    includes,
                    fields,
                    'json-api-use-default-includes': false,
                }),
                { body },
            ),
        )
    }
}

const getConversationsIncludes = [
    'participants',
    'messages.sender',
    'messages.conversation',
    'children.participants',
    'children.messages.sender',
    'children.messages.conversation',
    'children.parent',
    'parent.participants',
    'parent.messages.sender',
    'parent.messages.conversation',
]
const getConversationIncludes = [
    'participants',
    'messages.sender',
    'messages.conversation',
    'children.participants',
    'children.messages.sender',
    'children.messages.conversation',
    'children.parent',
]
const getConversationFields = {
    user: ['full_name', 'image_url', 'url'],
}
const getConversationsFilterMap = {
    unread: false,
    read: true,
}

export const getConversations = filter => {
    return (dispatch, getState) => {
        if (!filter) {
            filter = 'all'
        }
        const params = {
            include: getConversationsIncludes,
            fields: getConversationFields,
            'json-api-use-default-includes': false,
        }
        if (getConversationsFilterMap[filter] !== undefined) {
            params['filter'] = {
                read: getConversationsFilterMap[filter],
            }
        }

        dispatch(
            apiRequestAction(
                `${GET_CONVERSATIONS}__${filter}`,
                jsonApiUrl('/conversations', params),
            ),
        )
    }
}

export const getConversationsFrom = (url, filter) => {
    if (!filter) {
        filter = 'all'
    }
    return (dispatch, getState) => {
        dispatch(apiRequestAction(`${GET_CONVERSATIONS}__${filter}`, url))
    }
}

export const getConversation = conversationId => {
    return (dispatch, getState) => {
        return dispatch(
            apiRequestAction(
                `${GET_CONVERSATION}__${conversationId}`,
                jsonApiUrl(`/conversations/${conversationId}`, {
                    include: getConversationIncludes,
                    fields: getConversationFields,
                    'json-api-use-default-includes': false,
                }),
            ),
        )
    }
}



// WEBPACK FOOTER //
// ./app/actions/conversations.js