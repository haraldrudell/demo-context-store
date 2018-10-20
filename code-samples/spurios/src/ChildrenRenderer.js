/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
/*
the property is: props.children
https://reactjs.org/docs/react-api.html#reactchildren

React.Children:
.map(children, (child, index) => false)
.forEach(children, (child, index) => false)
.count(children)
.only(children) // returns a single child, if not exactly one: Error: React.Children.only expected to receive a single React element child
.toArray(children)
https://reactjs.org/docs/react-api.html#reactchildren

cloneElement(element, [props], [...children])
https://reactjs.org/docs/react-api.html#cloneelement

A function component is only provided props, ie. no children value
Otherwise props context refs updater
*/
import React, { Fragment, Children, cloneElement } from 'react'

const InnerOne = props => <p>Inner One: props: {Object.keys(props).join(',')}</p>
const InnerTwo = props => <p>Inner Two: props: {Object.keys(props).join(',')}</p>

const TwoChildren = ({children, ...props}) => { // props is c
  return <Fragment>
    {Children.map(children, element => cloneElement(element, props))}
  </Fragment>
}

const OneChild = ({children}) => {
  console.log('Children.only', Children.only(children)) // object: {…}
  console.log('Children.toArray', Children.toArray(children)) // [Object]
  Children.forEach(children, (...args) => console.log('Children.forEach args:', args)) // [Object, 0]
  return false
}

const NoChildren = ({children}) => {
  console.log('children value when no children:', children) // undefined
  // console.log(Children.only(children)) // Error: React.Children.only expected to receive a single React element child
  console.log('Children.count:', Children.count(children)) // 0
  return false
}

export default () =>
  <Fragment>
    <NoChildren />
    <OneChild><Fragment /></OneChild>
    <TwoChildren c='3'>
      <InnerOne a='1' />
      <InnerTwo b='2' />
    </TwoChildren>
  </Fragment>