/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {memo, Component} from 'react'

export default memo((nextProps, context) => {
  return <div>FunctionalComponent</div>
})

const F = (a, b) => 1
console.log('F', F)
console.log('F properties:', getProps(F))
console.log('F.length:', F.length)
console.log('F.prototype:', F.prototype)
console.log('F.prototype…', F.prototype.isReactComponent)


function getProps(value) {
  const props = {}
  for (let o = Object(value); o; o = Object.getPrototypeOf(o)) Object.getOwnPropertyNames(o).forEach(p => props[p] = true)
  return Object.keys(props).sort((a, b) => {
    const aa = a.toLowerCase()
    const bb = a.toLowerCase()
    return aa < bb ? -1 : aa === bb ? 0 : 1
  })
}

class C extends Component {
  constructor(a, b) {
    super(a)
  }
}
console.log('C', C)
console.log('C properties:', getProps(C))
console.log('C.length:', C.length)
console.log('C.prototype', C.prototype)
console.log('C.prototype…', C.prototype.isReactComponent)
