/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, { Fragment, PureComponent, memo, createElement, cloneElement, Children } from 'react'

export default class ChildRenderDemo extends PureComponent {
  render() {
    return <div style={{margin: '1em'}}>
      <h2>How to Render children prop</h2>
      <p>Concluded rules:</p>
      <ol>
      <li>As children, use cloneElement or just {'{'}children}</li>
      <li>As values, use createElement</li>
      </ol>
      Observations:
      <ul>
        <li>The children prop is only available if the componnent has children where it was being rendered</li>
      </ul>
      <h3>typeof components</h3>
      <p>In the real world, components are of different types:</p>
      <ul>
      <li>typeof ClassComponent: {typeof ClassComponent}</li>{/* function https://reactjs.org/docs/react-component.html */}
      <li>typeof FunctionalComponent: {typeof FunctionalComponent}</li>{/* function https://reactjs.org/docs/components-and-props.html#function-and-class-components */}
      <li>typeof MemoComponent: {typeof MemoComponent}</li>{/* object https://reactjs.org/docs/react-api.html#reactmemo */}
      </ul>
      <p>As elements of <strong>children</strong> type is always object.</p>
      <h3>Render experiments</h3>
      <p>Rendering a class, functional and memo component:</p>
      <ChildRender prop='ChildRender childProp'>
        <ClassComponent prop='ClassComponent childProp' />
        <FunctionalComponent prop="FunctionalComponent childProp" />
        <MemoComponent prop="MemoComponent childProp" />
      </ChildRender>
      Render component values using createElement(Component…): {
      /*
        React.createElement(type, [props], [...children])
        type: string like 'div' or react component class or function
        - createElement requires type to be function, ie. class or functional component
        - not memo component that is object
        https://reactjs.org/docs/react-api.html#createelement
      */
      [
        createElement(ClassComponent, {key: 1, providedProp: 1}),
        createElement(FunctionalComponent, {key: 2, providedProp: 1}),
        //cloneElement(MemoComponent, {key: 3, providedProp: 1}), // Expected ref to be a function, a string, an object returned by React.createRef(), or null
        createElement(MemoComponent, {key: 4, providedProp: 1}),
      ]}
      <FunctionalWithChild>
        <FunctionalNoChild />
      </FunctionalWithChild>
    </div>
  }
}

const propsToText = props => `[${Object.entries(Object(props)).map(([key, value]) => `${key}: ${typeof value} ${value}`).join('\x20')}]`

class ClassComponent extends PureComponent {
  render() {
    const {props} = this

    return <div>ClassComponent props: {propsToText(props)}</div>
  }
}

const FunctionalComponent = props => <div>FunctionalComponent props: {propsToText(props)}</div>

const MemoComponent = memo(props => <div>FunctionalComponent props: {propsToText(props)}</div>)

/*
children are always object, so cloneElement should be used
- createElement requires type to be function: cannot be used
https://reactjs.org/docs/react-api.html#reactchildren

cloneElement includes props provided by parent render
React.cloneElement(element, [props], [...children])
https://reactjs.org/docs/react-api.html#cloneelement
*/
const ChildRender = memo(({prop, children}) =>
  <Fragment>
    <div>ChildRender: prop: {String(prop)}</div>
    <div>ChildRender: typeof children argument: {typeof children}</div>
    <div>ChildRender: type of each child: Children.toArray: {Children.toArray(children).map(c => typeof c).join('\x20')}</div>
    <div>ChildRender: children length: Children.count: {Children.count(children)}</div>
    <ul>
      <li>render using {'{'}children}: {children}</li>
      <li>render using cloneElement(chilld…): {Children.map(children, (child, i) => cloneElement(child, {mergedProp: 1}))}</li>
    </ul>
  </Fragment>)

const FunctionalWithChild = memo(o => {
  return <div>
    FunctionalWithChild args: {Object.keys(Object(o)).join('\x20')}<br />
    <FunctionalNoChild />
  </div>
})

const FunctionalNoChild = memo(o =>
  <div>FunctionalNoChild args: {Object.keys(Object(o)).join('\x20')}</div>)
