/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component, PureComponent, createContext, memo } from 'react'
import { OrderedMap } from 'immutable'
import { Subject } from 'rxjs'

export default class App extends Component {
  render() {
    return <Store store={{value: 1, records: OrderedMap([[1, 'One'], [2, 'Two']])}}>
      <DisplayValue />
      <DisplayRecord id={2} />
    </Store>
  }
}

// Store implementation
const storeContext = createContext()
const {Provider/*, Consumer*/} = storeContext
class Store extends PureComponent {
  constructor(props) {
    super(props)
    const {store = {}} = props
    if (!store || typeof store !== 'object' || store.constructor !== Object) throw new Error('Store: store prop not plain object')
    Object.assign(Store, {context: {store, subject: new Subject()}})
  }

  static notify() {
    const {store, subject} = Store.context
    subject.next(store)
  }

  static subscribe() {
    const {subject} = Object(Store.context)
    if (!subject || typeof subject.subscribe !== 'function') throw new Error('Store: subscribe before construction')
    return subject.subscribe()
  }

  static getState() {
    return Object(Object(Store.context).store)
  }

  render() {
    const {children} = this.props
    const {context} = Store
    return <Provider value={context}>{children}</Provider>
  }
}

// connect implementation
function getConnector({mapStateToProps, ConnectedComponent}) {
  if (mapStateToProps === undefined) mapStateToProps = store => store
  else if (typeof mapStateToProps !== 'function') throw new Error('connect: mapStateToProps not function')
  class Connector extends PureComponent {
    state = {count: 0}

    componentDidMount() {
      console.log('componentDidMount', this.context)
      const {subject} = this.context
      this.unsubscribe = subject.subscribe(this.increment)
    }

    increment = store => this.setState({count: this.state.count + 1})

    componentWillUnmount() {
      console.log('componentWillUnmount')
      this.unsubscribe()
    }

    render() {
      const {props, context: {store}} = this
      console.log('render', props, store)
      return <ConnectedComponent {...props} {...Object(mapStateToProps(store, props))} />
    }
  }
  Connector.contextType = storeContext
  return Connector
}
const connect = mapStateToProps => ConnectedComponent => getConnector({mapStateToProps, ConnectedComponent})

// fetch function
const valueAction = () => fetchValue().catch(console.error)
const second = async () => new Promise(resolve => setTimeout(resolve, 1e3))
async function fetchValue() {
  await second()
  Store.getState().value++
  Store.notify()
}

// Display the top-level store key: value
const valueSelector = ({value}) => ({value})
const DisplayValue = connect(valueSelector)(memo(({value}) =>
  <div>value: {String(value)}&emsp;<button onClick={valueAction}>Update</button></div>))

// Display a record by id
const recordSelector = ({records}, {id}) => ({record: (records || Map()).get(id)})
const DisplayRecord = connect(recordSelector)(memo(({id, record}) =>
  <div>id: {String(id)} record: {String(record)}</div>))
