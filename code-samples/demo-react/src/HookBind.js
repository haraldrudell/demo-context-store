/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { useState, useCallback, useMemo } from 'react'

function idAction(id, e) {
  console.log('clickAction e:', Object(Object(e).constructor).name,
    'id', id)
}

export default () => {
  console.log('render')
  const [id, setId] = useState(1)
  return <>
    Demonstrates using useMemo and useCallback to bind action functions<br />
    Look in browser console log for progress<br />
    Click on id buttons modifies props in a child component<br />
    Click on idAction or redraw displays whether the action function value is constant<br />
    Parent component:<br />
    <button onClick={e => setId(1)}>id: 1</button>
    <button onClick={e => setId(2)}>id: 2</button>
    <div>
      Child component:<br />
      <Id id={id} />
    </div>
  </>}


let f
let g
const Id = ({id}) => {
  /*
  useCallback takes two arguments
  - a function value
  - a value array
  useCallback returns a function value that will invoke the fn value
  - the function value changes identity when any input changes
  useCallback does not actually invoke anything
  - a benefit is that the function value identity remains constant

  useMemo takes two arguments
  - a function value
  - a value array
  useMemo returns a function value that will invoke the fn value twice
  - this avoids fn to be evaluated prior to the usememo invocation
  useMemo invokes the function the first time and any time the second arguments change
  if no second argument is provided, useMemo will execute initially and when a different function is provided

  if you want to bind a value to an action handler, use useMemo
  if you want to have a useState modifying callback, use useCallback

  bad: bind is executed every time
  const idAction1 = useCallback(console.log('useCallback idAction executing') || idAction.bind(undefined, id), [id])
  good: bind is not evaluated when passed as argument to useMemo
  */
  const idAction1 = useMemo(() => console.log('useMemo idAction executing') || idAction.bind(undefined, id), [id])
  const [v, setV] = useState(0)
  const incV = useCallback(() => console.log('useCallback setV executing') || setV(v + 1), [v])
  console.log('Id render id:', id, 'v:', v, 'same f?', f === idAction1, 'same g?', g === incV)
  f = idAction1
  g = incV
  return <>
    id: {id}&emsp;
    <button onClick={idAction1}>idAction</button>
    <button onClick={incV}>redraw</button>
  </>
}
