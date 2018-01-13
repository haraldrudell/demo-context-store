export const namespace = actionType => `reform/${actionType}`

export const INITIALIZE_DATAKEY = Symbol(namespace('INITIALIZE_DATAKEY'))

// Model setters
export const SET_MODEL = Symbol(namespace('SET_MODEL'))
export const SET_MODEL_PROPERTY = Symbol(namespace('SET_MODEL_PROPERTY'))

// Interaction handlers
export const SET_FOCUSED = Symbol(namespace('SET_FOCUSED'))
export const SET_BLURRED = Symbol(namespace('SET_BLURRED'))
export const RESET_DIRTY_STATE = Symbol(namespace('RESET_DIRTY_STATE'))



// WEBPACK FOOTER //
// ./app/libs/reform/src/actions/types.js