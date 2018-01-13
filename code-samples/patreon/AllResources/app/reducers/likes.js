import access from 'safe-access'
import uniqby from 'lodash/uniqBy'

import {
    GET_POST_LIKES_REQUEST,
    GET_POST_LIKES_SUCCESS,
    POST_LIKE_REQUEST,
    DELETE_LIKE_REQUEST,
} from 'actions/post-like'

const likesDefaultState = {
    isLoading: true,
    nextUrl: undefined,
    likes: [],
}

export default (state = {}, action) => {
    const postKey = access(action.meta, 'actionKey')
    if (action.type === GET_POST_LIKES_REQUEST) {
        let post = state[postKey] || likesDefaultState
        post = {
            ...post,
            isLoading: true,
        }
        return { ...state, [postKey]: post }
    }

    if (action.type === GET_POST_LIKES_SUCCESS) {
        let post = state[postKey] || likesDefaultState
        post = {
            ...post,
            isLoading: false,
            nextUrl: access(action.payload, 'links.self.next'),
            likes: uniqby([...post.likes, ...action.payload], like => like.id),
        }
        return { ...state, [postKey]: post }
    }

    if (
        action.type === POST_LIKE_REQUEST ||
        action.type === DELETE_LIKE_REQUEST
    ) {
        if (state[postKey]) {
            let copy = Object.assign({}, state)
            delete copy[postKey]
            return copy
        }
    }

    return state
}



// WEBPACK FOOTER //
// ./app/reducers/likes.js