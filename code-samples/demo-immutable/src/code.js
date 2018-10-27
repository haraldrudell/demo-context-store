/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment, memo } from 'react'
import styled from 'styled-components'
import Func from './Func'

/*
The source code of a function can be printed: {f.toString()} and evaluated: {f()}
const fStart = ' { '
const fEnd = '; }'
function getSourceCode(f) {
  const type = typeof f
  if (type !== 'function') throw new Error(`Code: f not function: ${type}`)
  const s = f.toString()
  const start = s.indexOf(fStart)
  const end = s.lastIndexOf(fEnd)
  if (start === -1 || end === -1) throw new Error(`Bad f.toString source code: '${s}'`)
  return s.substring(start + fStart.length, end)
}

function evaluate(s) {
  return eval(String(s))
}
*/
const CodeSpan = styled.span`
  font-weight: bold
`
//const Code = ({f}) => <CodeSpan>{String(f)}</CodeSpan>
export const Code = ({f}) => <CodeSpan>{f.getSource()}</CodeSpan>
export const CodeValue = memo(({f}) => {
  if (!(f instanceof Func)) {
    const e = new Error(`CodeValue: f not Function instance: ${typeof f}`)
    console.error(e, f)
    throw e
  }
  return <Fragment><Code f={f} /> ⇒ {f.getValueString()}</Fragment>
})
