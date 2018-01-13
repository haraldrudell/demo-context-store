import access from 'safe-access'

import { getModelsFromRef } from 'reducers/make-refs-reducer'

export const getLikesOnPost = (state, postId) => {
    const likes = access(state, `refs.likesOnPost.${postId}.likes`) || []
    const isLoading =  access(state, `refs.likesOnPost.${postId}.isLoading`)
    const nextUrl =  access(state, `refs.likesOnPost.${postId}.nextUrl`)
    let mappedLikes = likes
        .map(like => getModelsFromRef(state.data, like))
        .map(like => like.user)
    return {
        [postId]: {
            likes: mappedLikes,
            isLoading,
            nextUrl
        }
    }
}



// WEBPACK FOOTER //
// ./app/getters/like.js