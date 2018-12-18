/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { useState } from 'react'

function clickAction(e) {
  console.log('this:', this)
  console.log('props:')
}

export default () => {
  console.log('render this:', this)
  const [play, setPlay] = useState(false)
  return <>
    Look in browser console to see rendering progress<br />
    Demonstrates an action handler without props and an arrow function updating state<br />
    Alternative solution in HookBind
    <div><button onClick={clickAction}>clickAction</button></div>
    <div><button onClick={() => setPlay(!play)}>set play state to: {String(!play)}</button></div>
  </>
}
