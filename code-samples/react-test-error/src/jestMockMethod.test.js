import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

it('renders without crashing', async () => {
  const {prototype} = App
  const componentMethodName = 'componentDidMount'
  const spy = jest.spyOn(prototype, componentMethodName)

  let promise
  // 171201: jest.spyOn cannot inspect return values https://github.com/facebook/jest/issues/3821
  // We must therefore mock and intercept componentDidMount invocation to get the return value
  // Jest does not allow direct access to the spiedMethod function value
  // Here’s how to invoke the spied method, though
  const invokeSpiedMethod = spy.getMockImplementation()
  spy.mockImplementation(function mock(...args) {
    // inside the mock implementation, the this value is the App instance
    // the App instance’s method has been mocked and cannot be invoked
    return promise = invokeSpiedMethod.apply(this, args)
  })

  const div = document.createElement('div');
  await new Promise((resolve, reject) => ReactDOM.render(<App />, div, resolve))

  // wait for the promise to conclude
  expect(promise).toBeInstanceOf(Promise, 'Instrumenting App instance failed')
  await promise

  spy.mockReset()
  spy.mockRestore()
})
