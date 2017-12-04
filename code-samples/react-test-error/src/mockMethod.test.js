import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

it('renders without crashing', async () => {
  // instrument
  const {prototype} = App
  const {componentDidMount} = prototype
  let promise
  prototype.componentDidMount = function mock() {
    promise = componentDidMount.apply(this) // this is the App instance
  }

  const div = document.createElement('div');
  await new Promise((resolve, reject) => ReactDOM.render(<App />, div, resolve))

  // wait for the promise to conclude
  expect(promise).toBeInstanceOf(Promise, 'Instrumenting App instance failed')
  await promise

  // remove instrumentation
  Object.assign(prototype, {componentDidMount})
})
