/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component, PureComponent, memo, Fragment } from 'react'
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { OrderedMap, Map } from 'immutable'

const SET_VALUE = 'SET_VALUE'

export default class App extends Component {
  store = createStore(combineReducers({value: reducer, records: recordsReducer}),
    {value: 1, records: OrderedMap([[1, 'One'], [2, 'Two']])},
    applyMiddleware(thunk))

  render() {
    return <Provider store={this.store}>
      <Fragment>
        <RenderIndicator />
        <DisplayValue />
        <DisplayRecord id={2} />
      </Fragment>
    </Provider>
  }
}

function reducer(storeSlice = null, action) {
  console.log('reducer storeSlice:', storeSlice) // 1
  const {type, value} = Object(action)
  if (type === SET_VALUE) return value // return the store slice value like number 2
  return storeSlice
}

function recordsReducer(storeSlice = OrderedMap()) {
  return storeSlice
}

// fetch function
const valueThunk = value => (dispatch, getState) => fetchValue({dispatch, value}).catch(console.error)
const second = async () => new Promise(resolve => setTimeout(resolve, 1e3))
async function fetchValue({dispatch, value}) {
  console.log('fetchValue dispatch:', dispatch, 'value:', value)
  await second()
  dispatch({type: SET_VALUE, value})
}

const RenderIndicator = () => console.log('RenderIndicator.render') || false

// Display the top-level store key: value
class DisplayValueClass extends PureComponent {
  valueAction = e => this.props.dispatch(valueThunk(this.props.value + 1))

  static valueSelector = ({value}) => ({value})

  render() {
    const {value} = this.props
    console.log('DisplayValueClass.render props:', this.props) // {value: 1, dispatch: ƒ}
    return <div>
      value: {String(value)}&emsp;
      <button onClick={this.valueAction}>Update</button>
    </div>
  }
}
const DisplayValue = connect(DisplayValueClass.valueSelector)(DisplayValueClass)

// Display a record by id
const recordSelector = ({records}, {id}) => ({record: (records || Map()).get(id)})
// arguments: {id: 2, record: "Two", dispatch: ƒ}
const DisplayRecord = connect(recordSelector)(memo(({id, record}) => console.log('DisplayRecord.render') ||
  <div>id: {String(id)} record: {String(record)}</div>))
