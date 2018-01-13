export const SET_RENDER_AS_CLIENT = 'SET_RENDER_AS_CLIENT'

const reducer = (state = false, action) => {
    switch (action.type) {
        case SET_RENDER_AS_CLIENT:
            return action.payload
        default:
            return state
    }
}

export default () => {
    return { reducer }
}



// WEBPACK FOOTER //
// ./app/shared/configure-store/configure-render-as-client.js