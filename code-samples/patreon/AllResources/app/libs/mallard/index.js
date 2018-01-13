/*
@mallard({
    counter: {
        initialValue: 0,
        actions: {
            increment: state => state + 1,
            decrement: state => state - 1,
        },
    },
})
class MallardCounter extends Component {
    static propTypes = {
        mallard: PropTypes.object.isRequired,
    }

    render() {
        const { counter } = this.props.mallard
        const { increment, decrement } = counter.actions
        return (
            <div>
                <span>
                    Counter is: {counter.value}
                </span>
                <button onClick={() => increment()}>+</button>
                <button onClick={() => decrement()}>-</button>
            </div>
        )
    }
}
*/

import decorator from './src/decorator'
export default decorator

import * as _transformer from './src/transformer'
export const { mallardStateForProps, mallardDispatchForProps } = _transformer
export const transformer = _transformer.default

export { reducers, addAllReducers } from './src/reducers'

import * as selectors from './src/selectors'
export const { selectValue, selectValuesForKeys } = selectors



// WEBPACK FOOTER //
// ./app/libs/mallard/index.js