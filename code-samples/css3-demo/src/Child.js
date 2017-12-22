/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Component} from 'react'
import {bound} from 'class-bind'

export default class Child extends Component {
  value = this.props.value

  @bound update(e) {
    const {value} = e.target
    const {name, fieldUpdate} = this.props
    fieldUpdate({name, value})
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {value} = nextProps
    const doRender = value !== this.value
    if (doRender) this.value = value
    return doRender
  }

  render() {
    console.log(`Child${this.props.name}.render`)
    const {value} = this.props
    const p = {value}
    return (
      <input {...p} onChange={this.update} />
    )
  }
}
