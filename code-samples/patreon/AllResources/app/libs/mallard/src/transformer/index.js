import { namespace, denamespace } from '../actions/types'
import { selectValue } from '../selectors'

/*
    transform('counter', {
        initialValue: 0,
        actions: {
            increment: state => state + 1,
            decrement: state => state - 1,
            add: (state, otherValue) => state + otherValue,
            subtract: (state, otherValue) => state - otherValue,
        },
    })
    returns
    {
        dataKey: 'counter',
        initialValue: 0,
        actionTypesAndCreators: {
            increment: {
                type: 'mallard/counter/increment',
                creator: () => ({
                    type: 'mallard/counter/increment',
                }),
            },
            decrement: {
                type: 'mallard/counter/decrement',
                creator: () => ({
                    type: 'mallard/counter/decrement',
                }),
            },
            add: {
                type: 'mallard/counter/add',
                creator: (otherValue) => ({
                    type: 'mallard/counter/add',
                    payload: [otherValue]
                }),
            },
            subtract: {
                type: 'mallard/counter/subtract',
                creator: (otherValue) => ({
                    type: 'mallard/counter/subtract',
                    payload: [otherValue]
                }),
            },
        },
        reducers: {
            // the following function bodies are equivalent, but not literally the output code
            'mallard/counter/increment': (state = 0, { type, payload }) => state + 1,
            'mallard/counter/decrement': (state = 0, { type, payload }) => state - 1,
            'mallard/counter/add': (state = 0, { type, payload }) => state + payload[0],
            'mallard/counter/subtract': (state = 0, { type, payload }) => state - payload[0],
        }
    }
*/

const actionTypeForKey = (dataKey, actionKey) =>
    namespace(`${dataKey}/${actionKey}`)
const actionKeyForType = (dataKey, actionType) =>
    denamespace(actionType).slice(`${dataKey}/`.length)

const transform = (dataKey, { initialValue, actions }) => {
    const actionTypesAndCreators = Object.keys(
        actions,
    ).reduce((memo, actionKey) => {
        const actionType = actionTypeForKey(dataKey, actionKey)
        memo[actionKey] = {
            type: actionType,
            creator: (...args) => {
                return {
                    type: actionType,
                    payload: args,
                }
            },
        }
        return memo
    }, {})

    const actionTypes = Object.keys(actions).map(actionKey =>
        actionTypeForKey(dataKey, actionKey),
    )

    const reducers = actionTypes.reduce((memo, actionType) => {
        memo[actionType] = (state = initialValue, { type, payload }) => {
            if (type === actionType) {
                const actionKey = actionKeyForType(dataKey, type)
                return actions[actionKey](state, ...payload)
            }
            return state
        }
        return memo
    }, {})

    return {
        dataKey,
        initialValue,
        actionTypesAndCreators,
        reducers,
    }
}

export default transform

export const mallardStateForProps = transformed => state =>
    selectValue(transformed.dataKey)(state)

export const mallardDispatchForProps = transformed => dispatch => {
    const actionKeys = Object.keys(transformed.actionTypesAndCreators)
    return actionKeys.reduce((memo, actionKey) => {
        memo[actionKey] = (...args) =>
            dispatch(
                transformed.actionTypesAndCreators[actionKey].creator(...args),
            )
        return memo
    }, {})
}



// WEBPACK FOOTER //
// ./app/libs/mallard/src/transformer/index.js