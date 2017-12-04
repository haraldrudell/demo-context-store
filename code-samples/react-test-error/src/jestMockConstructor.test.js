import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

it('renders without crashing', async () => {
  // App is a function, toString() is the class expression
  //console.log('jestMockConstructor.test App:', typeof App)
  // App(): TypeError: Class constructor App cannot be invoked without 'new'
  //console.log('jestMockConstructor.test App:', App)
  // new App() creates an App instance
  const appInstance = new App()
  // appInstance.constructor === App
  //console.log('jestMockConstructor.test app.constructor === App:', appInstance.constructor === App)

  // Jest mockImplementation doesn't work with constructor functions
  // https://github.com/facebook/jest/issues/663

  class C {
    constructor(a) {
      //console.log('a', a) // "a 1"
    }
  }

  const args = [1, 2, 3]
  new C(...args)
})
