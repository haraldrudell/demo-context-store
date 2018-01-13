import apiRequestAction from 'actions/api-request-action'
import jsonApiUrl from 'utilities/json-api-url'
import fetch from 'isomorphic-fetch'

export const PUBLISH_POST_BEGAN = 'PUBLISH_POST_BEGAN'
export const PUBLISH_POST_FINISHED = 'PUBLISH_POST_FINISHED'

export const publishPost = (data, successAction) => {
    return (dispatch) => {
        dispatch({type: PUBLISH_POST_BEGAN})

        return fetch(jsonApiUrl('/posts/new'), {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((res) => {
            const postId = res.data.id

            const url = `/posts/${postId}`
            const attributes = {
                // 0 cents is public, 1 cent is patron only
                min_cents_pledged_to_view: parseInt(data.privacy, 10),
                content: data.content,
                title: data.title,
                post_type: 'text_only',
                tags: {
                    publish: true
                }
            }
            const body = {
                data: {
                    type: 'post',
                    attributes
                }
            }
            fetch(jsonApiUrl(url), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(body)
            }).then((response) => {
                if (response.status === 200) {
                    dispatch({
                        type: PUBLISH_POST_FINISHED,
                        success: true
                    })
                    successAction && dispatch(successAction)
                } else {
                    dispatch({
                        type: PUBLISH_POST_FINISHED,
                        success: false
                    })
                }
            }).catch(error => {
                dispatch({
                    type: PUBLISH_POST_FINISHED,
                    success: false
                })
            })

        }).catch(error => {
            dispatch({
                type: PUBLISH_POST_FINISHED,
                success: false
            })
        })
    }


}

export const GET_POST_LIKE_COUNT = 'GET_POST_LIKE_COUNT'
export const getPostLikeCountParams = {
    include: null,
    fields: {
        'post': [
            'like_count',
            'current_user_has_liked'
        ]
    }
}

export const getPostLikeCount = ({ postId }) =>
    apiRequestAction(
        GET_POST_LIKE_COUNT,
        jsonApiUrl(`/posts/${postId}`, getPostLikeCountParams)
    )

export const GET_POST_COMMENT_COUNT = 'GET_POST_COMMENT_COUNT'
const getPostCommentCountParams = {
    include: [],
    fields: {
        'post': [
            'comment_count'
        ]
    }
}

export const getPostCommentCount = ({ postId }) =>
    apiRequestAction(
        GET_POST_COMMENT_COUNT,
        jsonApiUrl(`/posts/${postId}`, getPostCommentCountParams),
    )



// WEBPACK FOOTER //
// ./app/actions/post.js