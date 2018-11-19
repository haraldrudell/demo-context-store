/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Component, PureComponent, createContext } from 'react'

function getConnector({mapStateToProps, ConnectedComponent, options}) {
  if (!options) options = {}
  const displayName = String(options.displayName || ConnectedComponent.displayName || ConnectedComponent.name || 'Connect')
  const pure = options.pure !== false
  if (mapStateToProps === undefined) mapStateToProps = store => store
  else if (typeof mapStateToProps !== 'function') throw new Error('connect: mapStateToProps not function')
  class Connect extends (pure ? PureComponent : Component) {
    getSelectors = state => Object(mapStateToProps(state, this.props))
    componentDidMount = () => (this.unsubscribe = this.context.subscribe(this)) + (this.lastProps = this.getSelectors(this.context.getState()))
    componentWillUnmount = () => this.unsubscribe()
    next(state) {
      const {lastProps} = this
      const newProps = this.getSelectors(state)
      console.log('Connect.next from:', lastProps, 'to:', newProps)
      const list = Object.entries(newProps)
      if (Object.keys(lastProps).length === list.length && list.every(([key, value]) => value === lastProps[key])) return // no change
      this.lastProps = newProps
      this.setState({})
    }

    render() {
      const {props, context: store} = this
      console.log('Connect.render props:', props, 'state:', store && store.getState(), 'childprops:', {...props, ...Object(mapStateToProps(store.getState(), props))}, this.unsubscribe)
      return <ConnectedComponent {...props} {...Object(mapStateToProps(store.getState(), props))} />
    }
  }
  Connect.contextType = storeContext
  displayName && (Connect.displayName = displayName)
  return Connect
}
export const connect = (mapStateToProps, options) => ConnectedComponent => getConnector({mapStateToProps, ConnectedComponent, options})
