/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
This source code is licensed under the ISC-style license found in the LICENSE file in the root directory of this source tree.
*/
import React, {useEffect, useState, useCallback, useMemo} from 'react'

import {store, Store, notify, useAllstore} from './allstore'

// the value slice
let sliceName = 'value' // modifiable to avoid collisions setSlicename(s)
const incValue = () => ++store[sliceName]
const valueSelector = state => ({value: state[sliceName]})
const getValue = () => store[sliceName]

// after 6 intervals, the browser slows them down
const incFn = () => console.log('inc') || (incValue() && notify())
const intervalTime = 5e2
const valueHideFn = 3

export default () => console.log('UseAllstoreTest.render') ||
  <Store store={{value: 1}}>
    <FnContainer />
  </Store>

function FnContainer() {
  const [showFn, setShowFn] = useState(true)
  const timer = useMemo(() => setInterval(incFn, intervalTime), [1])
  console.log('FnContainer.render', showFn)
  const hideFn = useCallback(() => console.log('FnContainer.hideFn') || clearInterval(timer) || setShowFn(false), [1])
  return <div>
    Check browser log for progress
    {showFn && <Fn hideFn={hideFn} />}
  </div>
}

function Fn({hideFn}) {
  console.log('Fn.render')
  useEffect(() => getValue() >= valueHideFn ? console.log('Fn.hideFn') || hideFn() : undefined)
  const {value} = useAllstore(valueSelector)
  console.log('Fn.render value:', value)
  return value
}
