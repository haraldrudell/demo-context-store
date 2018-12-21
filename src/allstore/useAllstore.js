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
  const lastCompProps = useRef()
  const lastCount = useRef()
  const lastStoreProps = useRef() // static lastProps mechanic
  lastCompProps.current = props
  const [count, setCount] = useState(0) // force redraw mechanic
  lastCount.current = count
  const storeProps = useMemo(() => lastStoreProps.current = selectorFn(store, props), pure ? [count, ...Object.values(props)] : undefined)

  // subscribe to store and redraw on updates
  const subscription = useMemo(() => subscribe(next), [1])
  function next(state) {
    if (pure) {
      const lastProps = lastStoreProps.current
      const newEntries = Object.entries(selectorFn(state, lastCompProps.current))
      if (Object.keys(lastProps).length === newEntries.length && newEntries.every(([key, value]) => value === lastProps[key])) return // no change
    }
    setCount(lastCount.current + 1)
  }
  useEffect(() => () => subscription.unsubscribe(), [1])

  return storeProps
}
