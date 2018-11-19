/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { PureComponent } from 'react'

import PlainStore from './Plainstore'
import { StoreProvider } from './context'

export default class Store extends PureComponent {
  static plainStore = new PlainStore()

  constructor(props) {
    super(props)
    Store.plainStore.state = {...props.store}
  }

  render() {
    const {children} = this.props
    const {plainStore} = Store
    return <StoreProvider value={plainStore}>{children}</StoreProvider>
  }
}

export const plainStore = Store.plainStore
