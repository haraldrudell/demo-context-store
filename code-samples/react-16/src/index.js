/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import App from './App';
import Lifecycle from './Lifecycle'
import List from './List'

import React, {createElement} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const m = 'index.js'
const componentConstructorList = [Lifecycle, List]
render(window.location.pathname, componentConstructorList).catch(errorHandler).catch(console.error)

async function render(pathname, componentConstructors) { // pathname: string '/…'
  const requestedName = pathname.substring(1)
  const isDefaultRender = requestedName === ''

  const ctor = isDefaultRender
    ? true // true: use the default component <App />
    : componentConstructors.filter(f => f.name === requestedName)[0]
  if (ctor !== true && typeof ctor !== 'function') throw new Error(`${m} unknown component in uri: ${requestedName}`)

  const componentNames = isDefaultRender && componentConstructors.map(f => f.name)

  const component = ctor === true ? <App components={componentNames} /> : createElement(ctor)

  ReactDOM.render(component, document.getElementById('root'));
  registerServiceWorker();
}

function isDevelopment() {
  return process.env.NODE_ENV !== 'production' // Webpack interpolates process.env so that it works in the browser
}

function errorHandler(e) {
  // log first in the case errorHandler fails
  console.error(`${m} errorHandler:`)
  console.error(e)

  // if it’s production, one-liner error message otherwise full stack trace
  const message = e instanceof Error
    ? isDevelopment() ? e.stack : e.message
    : e ? `value: ${e}` : `empty error value of type: ${typeof e}`

  const element = document.createElement('pre')
  element.innerHTML = `Application failed during initial React rendering\n\n${message}`
  element.style.color = 'red'
  element.style.margin = '20px'
  const body = document.body
  body.insertBefore(element, body.firstChild)
}
