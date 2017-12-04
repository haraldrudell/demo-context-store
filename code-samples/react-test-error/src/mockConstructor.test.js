import React from 'react'
import ReactDOM from 'react-dom'
import App, * as AppImport from './App'

it('renders without crashing', async () => {
  class AppTest extends App {
    static promise

    componentDidMount(...args) {
      // does super work? yes
      //console.log('AppTest.componentDidMount super', super.componentDidMount)
      // does invocation work? yes
      //const p = super.componentDidMount(...args)
      //console.log('AppTest.componentDidMount p', p)
      return AppTest.promise = super.componentDidMount(...args)
    }
  }

  // App cannot be modified directly
  // App = AppTest // ReferenceError: App is not defined
  const App0 = App // save the real App implementation
  AppImport.default = AppTest
  // true { default: [Function: AppTest] } false
  // console.log('mockConstructor.test', App === AppTest, AppImport, App === App0)

  const div = document.createElement('div');
  //ReactDOM.render(<App />, div)
  await new Promise((resolve, reject) => {ReactDOM.render(<App />, div, resolve)})

  // wait for the promise to conclude
  const promise = AppTest.promise
  expect(promise).toBeInstanceOf(Promise, 'Instrumenting App instance failed')
  await promise

  AppImport.default = App0
})
