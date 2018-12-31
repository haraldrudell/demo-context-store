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
  const closure = useRef({})
  const [lastCount, setCount] = useState(0) // force redraw mechanic
  Object.assign(closure.current, {propsArg: props, lastCount})
  const storeProps = useMemo(() => closure.current.lastProps = Object(selectorFn(store, props)), pure ? [lastCount, ...Object.values(props)] : null)

  // subscribe to store and redraw on updates
  const subscription = useMemo(() => subscribe(next), [])
  function next(state) {
    const {propsArg, lastCount, lastProps} = closure.current
    if (pure) {
      const newEntries = Object.entries(Object(selectorFn(state, propsArg)))
      if (Object.keys(lastProps).length === newEntries.length && newEntries.every(([key, value]) => value === lastProps[key])) return // no change
    }
    setCount(lastCount + 1)
  }
  useEffect(() => () => subscription.unsubscribe(), [])

  return storeProps
}
