import access from 'safe-access'

export const getPollForPost = (state, post) => {
    const pollId = access(post, 'poll.id')
    const poll = access(state, `data.poll.${pollId}`)
    return poll
}



// WEBPACK FOOTER //
// ./app/getters/poll.js