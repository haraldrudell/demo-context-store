/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import {useState, useContext, useMemo, useEffect, useRef} from 'react'
import {storeContext} from './Store'

export function useAllstore(selectorFn = store => store, props, pure) {
  if (typeof selectorFn !== 'function') throw new Error('useAllstore: selector not function')
  props = {...props}
  pure = pure !== false // default is pure component

  // get context containing store
  const contextValue = useContext(storeContext)
  if (!contextValue) throw new Error('useAllstore: store context missing, did Store component render?')
  const {subscribe, store} = contextValue

  // generate memoized props, count and propsFromStore
  const lastProps = useRef()
  lastProps.current = props
  const [count, setCount] = useState(0) // force redraw mechanic
  const lastCount = useRef()
  lastCount.current = count
  const lastSeenProps = useRef() // static lastProps mechanic
  const propsFromStore = useMemo(() => lastSeenProps.current = selectorFn(store, props), pure ? [count, ...Object.values(props)] : undefined)

  // subscribe to store and redraw on updates
  const subscription = useMemo(() => subscribe(next), [1])
  function next(state) {
    if (pure) {
      const lastStoreProps = lastSeenProps.current
      const list = Object.entries(selectorFn(state, lastProps.current))
      if (Object.keys(lastStoreProps).length === list.length && list.every(([key, value]) => value === lastStoreProps[key])) return // no change
    }
    setCount(lastCount.current + 1)
  }
  useEffect(() => () => subscription.unsubscribe(), [1])

  return propsFromStore
}
