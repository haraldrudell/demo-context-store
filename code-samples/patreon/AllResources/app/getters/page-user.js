import access from 'safe-access'


export const getPageUser = state => access(state, 'refs.pageUser')

export const getPageUserId = state => access(getPageUser(state), 'id')



// WEBPACK FOOTER //
// ./app/getters/page-user.js