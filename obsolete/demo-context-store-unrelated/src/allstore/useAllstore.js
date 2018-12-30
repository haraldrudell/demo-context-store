/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import { useState, useContext, useMemo, useEffect } from 'react'
import { storeContext } from './Store'

// use like: useAllstore(selector, {props})
export function useAllstore(selectorFn, props, pure) {
  pure = pure !== false // default is pure component

  // get context containing store
  const contextValue = useContext(storeContext)
  if (!contextValue) throw new Error('useAllstore: store context missing, did Store component render?')
  const { subscribe, store } = contextValue

  // current propsFromStore
  const getPropsFromStore = () => selectorFn(store, props)
  const propsFromStore = useMemo(() => getPropsFromStore(), pure ? [Object.values(props)] : undefined)

  // redraw on store updates
  const [count, setCount] = useState(0)
  function next(state) {
    const newProps = getPropsFromStore()
    if (pure) {
      const list = Object.entries(newProps)
      if (Object.keys(propsFromStore).length === list.length && list.every(([key, value]) => value === propsFromStore[key])) return // no change
    }
    return setCount(count + 1)
  }

  // subscribe to store
  useEffect(() => subscribe(next).unsubscribe, [contextValue])

  return propsFromStore
}
