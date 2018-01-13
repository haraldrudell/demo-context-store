import apiRequestAction from 'actions/api-request-action'
import jsonApiUrl from 'utilities/json-api-url'

export const DELETE_POST = 'DELETE_POST'

export const deletePost = ({postId}) => {
    return (dispatch, getState) => {
        const url = jsonApiUrl(`/posts/${postId}`)
        return dispatch(
            apiRequestAction(DELETE_POST, url)
        )
    }
}



// WEBPACK FOOTER //
// ./app/actions/post-delete.js