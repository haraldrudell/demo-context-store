/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Component} from 'react'
import {bound} from 'class-bind'

const m = 'Form'

export default class Parent extends Component {
  static label = 'FormTest'
  state = {one: 'One', two: 'Two'}

  @bound submit(e) {
    e.preventDefault()
    const values = {...this.state}
    console.log(`${m}.submit:`, values)
  }

  @bound fieldUpdate({name, value}) {
    this.setState({[name]: value})
  }

  render() {
    console.log(`${m}.render`)
    const {state, fieldUpdate, submit} = this
    const p = {fieldUpdate}
    return (
      <form onSubmit={submit}> {/* loop removed for clarity */}
        <Child name='one' value={state.one} {...p} />
        <Child name='two' value={state.two} {...p} />
        <input type="submit" />
      </form>
    )
  }
}

class Child extends Component {
  value = this.props.value

  @bound update(e) {
    const {value} = e.target
    const {name, fieldUpdate} = this.props
    fieldUpdate({name, value})
  }

  shouldComponentUpdate(nextProps) {
    const {value} = nextProps
    const doRender = value !== this.value
    if (doRender) this.value = value
    return doRender
  }

  render() {
    console.log(`Child${this.props.name}.render`)
    const {value} = this.props
    const p = {value}
    return <input {...p} onChange={this.update} />
  }
}
