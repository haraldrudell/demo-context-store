/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import Child from './Child'

import React, {Component, createElement} from 'react'
import {bound} from 'class-bind'

const m = 'Form'

export default class Form extends Component {
  static label = 'Form'
  fields = [{
    name: '1',
    component: Child,
    value: 'One',
  }, {
    name: '2',
    component: Child,
    value: 'Two'
  }]

  constructor(props, context) {
    super(props, context)
    const state = {}
    for (let field of this.fields) {
      const {name, value} = field
      state[name] = value
    }
    this.state = state
  }

  @bound submit(e) {
    e.preventdefault()
    const values = {...this.values}
    console.log(`${m}.submit:  ${values}`)
  }

  @bound fieldUpdate({name, value}) {
    this.setState({[name]: value})
  }

  render() {
    console.log(`${m}.render`)
    const {state, fields, submit, fieldUpdate} = this
    return (
      <form onSubmit={submit}>
        {fields.map((o, key) => {
          const {component, name} = o
          const value = state[name]
          const p = {name, value, key, fieldUpdate}
          return createElement(component, p)
        })}
      </form>
    )
  }
}
