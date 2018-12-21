/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {memo, useState, useMemo, useRef, useEffect} from 'react'

const PureParent = memo(PureParentFn)

const states = [{
  name: 'Traditional parent initial render',
  parent: Parent,
}, {
  name: 'Parent state change',
  state: true,
}, {
  name: 'Parent prop change',
  prop: 2,
}, {
  name: 'Pure parent initial render',
  parent: PureParent,
  prop: 3
}, {
  name: 'PureParent state change',
  state: true,
}, {
  name: 'PureParent prop change',
  prop: 4,
}]

let stateIndex = 0
const stateFns = {}

function doNextState() {
  const {name, state, prop} = Object(states[++stateIndex])
  if (!name) {
    console.log('doNextState: end of states')
    return // end of states
  }
  console.log(`doNextState index: ${stateIndex}: ${name}`)

  state != null && stateFns.setParentState(state)
  prop != null && stateFns.setId(prop)
}

export default memo(function ReRender() {

  // ReRender setId
  const [id, setId] = useState(1)
  useMemo(() => stateFns.setId = setId, [1])

  // ReRender Parent component
  const ParentComponentRef = useRef()
  const {parent} = Object(states[stateIndex])
  parent && (ParentComponentRef.current = parent)

  console.log('ReRender stateIndex:', stateIndex, 'id:', id)
  useEffect(() => doNextState())
  return <div>
    <p>Look in the browser log for progress</p>
    Concluded rules:
    <ol>
      <li>If a component has props or state, or any component above it in the tree does, it should be pure</li>
      <li>The only components that do not need to be pure are those that can be traced directly to ReactDOM.render wihtout it or any intermediate components having state or props</li>
      <li>Using memo to make functional component pure is significant for performance</li>
      <li>Do not create render prop functions inside render</li>
    </ol>
    Observations:
    <ul>
      <li>A state or prop change in the parent does not re-render a pure functional child component</li>
      <li>A pure functional component is only re-rendered if its state or props change or on .forceUpdate()</li>
      <li>Traditional functional components always re-render</li>
      <li>component.forceUpdate(callback) updates pure componets</li>
      <li>A PureComponent cannot implement shouldComponentUpdate()</li>
      <li>React.PureComponent’s shouldComponentUpdate() skips prop updates for the whole component subtree:<ul>
          <li>children components should also be pure</li>
          <li>A traditional component below a pure component in the tree is not re-rendered</li>
          <li>Such component needs a state change or .forceUpdate() to force a render</li>
          <li>Deep updates of props will not lead to redraw of a pure component</li>
          <li>A render prop created inside render will cause constant updates</li>
      </ul></li>
    </ul>
    <ParentComponentRef.current id={id} />
    {/*<PureShouldComponentUpdate />*/}
  </div>})

function Parent({id}) {
  const [, setParentState] = useState(false)
  useMemo(() => stateFns.setParentState = setParentState, [1])
  console.log('Parent id:', id)
  const {state} = Object(states[stateIndex])
  useEffect(() => state != null ? doNextState() : undefined)
  return <>
    <div>Parent</div>
    <Traditional />
    <TraditionalProps id='1' />
    <Pure />
    <PureProps id='1' />
  </>
}

function PureParentFn({id}) {
  const [, setParentState] = useState(false)
  useMemo(() => stateFns.setParentState = setParentState, [1])
  console.log('PureParent id:', id)
  const {state} = Object(states[stateIndex])
  useEffect(() => state != null ? doNextState() : undefined)
  return <>
    <div>PureParent</div>
    <Traditional />
    <TraditionalProps id='1' />
    <Pure />
    <PureProps id='1' />
  </>
}

function Traditional() {
  console.log('Traditional')
  return <div>Traditional</div>
}

function TraditionalProps({id}) {
  console.log('TraditionalProps')
  return <div>TraditionalProps</div>
}

const Pure = memo(() => console.log('Pure') ||
  <div>
    Pure
    <TraditionalChuildOfPure />
  </div>)

const PureProps = memo(({id}) => console.log('PureProps') ||
  <div>PureProps</div>)

function TraditionalChuildOfPure() {
  console.log('TraditionalChuildOfPure')
  return <div>TraditionalChuildOfPure</div>
}

/*
Warning: PureShouldComponentUpdate has a method called shouldComponentUpdate().
shouldComponentUpdate should not be used when extending React.PureComponent.
Please extend React.Component if shouldComponentUpdate is used.
class PureShouldComponentUpdate extends PureComponent {
  shouldComponentUpdate = () => true
  render() {
    console.log('PureShouldComponentUpdate')
    return <div>PureShouldComponentUpdate</div>
  }
}
*/
