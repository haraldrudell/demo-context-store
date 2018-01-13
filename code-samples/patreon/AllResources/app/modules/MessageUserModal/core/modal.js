import get from 'lodash/get'
export const namespace = action => `modules/messageUser/${action}`

// Action types
export const OPEN_MODAL = namespace('OPEN_MODAL')
export const CLOSE_MODAL = namespace('CLOSE_MODAL')

const initialState = {
    isModalOpen: false,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_MODAL:
            return { ...state, isModalOpen: true }
        case CLOSE_MODAL:
            return { ...state, isModalOpen: false }
        default:
            return state
    }
}

// Action creators
export const openModal = () => {
    return { type: OPEN_MODAL }
}

export const closeModal = () => {
    return { type: CLOSE_MODAL }
}

// Selectors
export const getIsModalOpen = state =>
    get(state.modules, 'messageUser.modal.isModalOpen')



// WEBPACK FOOTER //
// ./app/modules/MessageUserModal/core/modal.js