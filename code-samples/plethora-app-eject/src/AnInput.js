import React, {Component} from 'react'

export default class AnInput extends Component {
  constructor(props, context) {
    super(props)
    this.state = {value: '', b: 1}
    console.log('AnInput.state1', this.state)
  }

  componentWillMount() {
    this.setState({value: 'x', b: null})
    console.log('AnInput.state2', this.state)
  }

  change = value => this.setState({value})

  render() {
    console.log('AnInput.render', this.state)
    return <input onChange={this.change} value={this.state.value} />
  }
}
