import apiRequestAction from 'actions/api-request-action'
import jsonApiUrl from 'utilities/json-api-url'

export const POST_MESSAGE = 'POST_MESSAGE'
export const GET_MESSAGES = 'GET_MESSAGES'

export const API_RESOURCE_PATH = '/messages?messages-version=2'

export const postMessage = (content, conversationId, opts = {}) => {
    const relationships = {
        conversation: {
            data: {
                id: conversationId,
                type: 'conversation',
            },
        },
    }

    const attributes = {
        content,
    }

    const body = {
        data: {
            type: 'message_v2',
            attributes,
            relationships,
        },
    }

    const ACTION_TYPE = opts.actionSuffix
        ? `${POST_MESSAGE}_${opts.actionSuffix}`
        : POST_MESSAGE

    const url = jsonApiUrl(API_RESOURCE_PATH, {
        include: ['sender', 'conversation.messages.sender'],
        fields: {
            conversation: ['created_at', 'read'],
            user: ['full_name', 'image_url', 'thumb_url', 'url'],
            message: ['content', 'sent_at'],
        },
        'json-api-use-default-includes': false,
    })

    return dispatch => {
        dispatch(
            apiRequestAction(`${ACTION_TYPE}__${conversationId}`, url, {
                body,
            }),
        )
    }
}

export const getMessagesFrom = (url, namespace = '') => {
    const _namespace = namespace ? `__${namespace}` : ''

    return (dispatch, getState) => {
        dispatch(apiRequestAction(`${GET_MESSAGES}${_namespace}`, url))
    }
}



// WEBPACK FOOTER //
// ./app/actions/messages.js