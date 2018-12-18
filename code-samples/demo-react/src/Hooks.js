/*
© 2018-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React from 'react'
import styled from 'styled-components'

const Styling = styled.div`
dt {
  margin-top: 6pt;
  font-weight: bold;
}
pre {
  font-family: inherit;
}
`
export default () =>
  <Styling>
    <div>Demonstration of hooks: <a href="https://reactjs.org/docs/hooks-reference.html">https://reactjs.org/docs/hooks-reference.html</a></div>
    <dl>
      <dt>const [play, setPlay] = useState(false)</dt>
      <dd>Provides access to state inside the functional component</dd>
      <dt>useEffect(fn, [propslist])</dt>
      <dd>The function passed to useEffect will run after the render is committed to the screen<br/>
        <pre>{`useEffect(() => {
  const subscription = props.source.subscribe()
  return () => {
    // Clean up the subscription
    subscription.unsubscribe()
  }
})`}
        </pre>
      </dd>
      <dt>const context = useContext(Context)</dt>
      <dd>Context is a value returned from React.createContext</dd>
      <dt>const [state, dispatch] = useReducer(reducer, initialState, initialAction: FSA)</dt>
      <dt>useCallback(fn, [a, b])</dt>
      <dd>
        <ul>
          <li>useCallback provides a function value that invokes fn</li>
          <li>The useCallback return value changes only when one of the inputs chages</li>
          <li>If no inputs are provided, the useCallback return value changes every time</li>
          <li>useCallback is used when a function value should maintains its identity:
            <ul>
              <li>A callback function for useState<pre>{`const [v, setV] = useState(0)
const incV = useCallback(() => setV(v + 1), [v])
return <button onClick={incV}>redraw</button>`}
                </pre>
              </li>
              <li>A function prop to a child component</li>
            </ul>
          </li>
        </ul>
      <pre>{`const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
)`}</pre></dd>
      <dt>const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])</dt>
      <dd>
        <ul>
          <li>useMemo will only recompute the memoized value when first innvoked and when one of the inputs has changed</li>
          <li>Use useMemo to bind callback functions to props or state:
            <pre>{`function idAction(id, e) {
  console.log('Click on item id:', id)
}

const Id = ({id}) => {
  const idAction1 = useMemo(() => idAction.bind(undefined, id), [id])
  return <button onClick={idAction1}>idAction</button>
}`}
            </pre>
          </li>
        </ul>
        <pre>{`const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])`}</pre>
      </dd>
      <dt>const refContainer = useRef(initialValue)</dt>
      <dd><pre>{`const inputEl = useRef(null);
const onButtonClick = () => {
  // current points to the mounted text input element
  inputEl.current.focus()
}
return <>
    <input ref={inputEl} type="text" />
    <button onClick={onButtonClick}>Focus the input</button>
  </>`}
      </pre></dd>
      <dt>useImperativeMethods</dt>
      <dd>Exposes a function to the parent component<br/>
      <pre>{`function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeMethods(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput)`}
      </pre></dd>
      <dt>useLayoutEffect</dt>
      <dd>The signature is identical to useEffect, but it fires synchronously after all DOM mutations</dd>
    </dl>
  </Styling>
