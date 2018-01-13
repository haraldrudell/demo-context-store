import { getPostLikeCount } from 'actions/post'
import { getUserIsLoggedIn } from 'getters/current-user'
import { getPostLikeCountParams } from 'actions/post'
import redirectToLogin from 'utilities/redirect-to-login'
import apiRequestAction from 'actions/api-request-action'
import jsonApiUrl from 'utilities/json-api-url'

import access from 'safe-access'


export const POST_LIKE = 'POST_LIKE'
export const POST_LIKE_REQUEST = 'POST_LIKE_REQUEST'
export const DELETE_LIKE = 'DELETE_LIKE'
export const DELETE_LIKE_REQUEST = 'DELETE_LIKE_REQUEST'

const DEFAULT_VARIANT = {
    include: ['post.null'],
    fields: getPostLikeCountParams.fields
}

export const toggleLike = ({postId, variant = DEFAULT_VARIANT}) => {
    const { include, fields } = variant
    return (dispatch, getState) => {
        const state = getState()
        if (!getUserIsLoggedIn(state)) return redirectToLogin({postLoginRedirectURI: window.location.pathname})

        const url = `/posts/${postId}/likes`
        const currentUserHasLiked = !!access(state, `data.post.${postId}.currentUserHasLiked`)
        return currentUserHasLiked ?
        dispatch(apiRequestAction(DELETE_LIKE, jsonApiUrl(url, { include, fields }))).then(() => dispatch(getPostLikeCount({postId}))) :
        dispatch(apiRequestAction(POST_LIKE, jsonApiUrl(url, { include, fields })))
    }
}


export const GET_POST_LIKES = 'GET_POST_LIKES'
export const GET_POST_LIKES_REQUEST = 'GET_POST_LIKES_REQUEST'
export const GET_POST_LIKES_SUCCESS = 'GET_POST_LIKES_SUCCESS'

const getPostLikeParams = {
    include: ['post.null', 'user.null'],
    fields: {
        'post': [
            'id'
        ],
        'user': [
            'full_name',
            'url',
            'thumb_url'
        ]
    }
}

export const getPostLikes = ({ postId, nextUrl }) => {
    return (dispatch, getState) => {
        if(nextUrl) {
            dispatch(apiRequestAction(
                `${GET_POST_LIKES}__${postId}`,
                nextUrl
            ))
        } else {
            dispatch(apiRequestAction(
                `${GET_POST_LIKES}__${postId}`,
                jsonApiUrl(`/posts/${postId}/likes`, getPostLikeParams)
            ))
        }
    }
}



// WEBPACK FOOTER //
// ./app/actions/post-like.js