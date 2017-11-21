/*
© 2017-present Harald Rudell <harald.rudell@gmail.com> (http://www.haraldrudell.com)
All rights reserved.
*/
import React, {Component} from 'react'
import util from 'util'

export default class Lifecycle extends Component {
  constructor(props, context) {
    super(props, context)
    this.output = []
    this.log('constructor', `props: ${util.inspect(props)} context: ${util.inspect(context)}`)
  }

  log(label, value) {
    const hasValue = value !== undefined
    console.log('log', hasValue, value)
    const args = [label]
    if (hasValue) args.push(value)
    console.log(...args)

    const message = hasValue
      ? `${label}: ${value}`
      : label
    this.output.push(message)
  }

  componentWillMount() {
    this.log('componentWillMount')
  }

  render() {
    this.log('render')
    const invocationList = this.output.join('\n')
    return <pre>{`invocations:\n${invocationList}`}</pre>
  }

  componentDidMount() {
    this.log('componentDidMount')
  }

  componentWillReceiveProps(...args) {
    this.log('componentWillReceiveProps', args.length)
  }

  shouldComponentUpdate(...args) {
    this.log('shouldComponentUpdate', args.length)
  }

  componentWillUpdate(...args) {
    this.log('componentWillUpdate', args.length)
  }
  componentDidUpdate(...args) {
    this.log('componentDidUpdate', args.length)
  }
  componentWillUnmount(...args) {
    this.log('componentWillUnmount', args.length)
  }
  componentDidCatch(...args) {
    this.log('componentDidCatch', args.length)
  }
}
