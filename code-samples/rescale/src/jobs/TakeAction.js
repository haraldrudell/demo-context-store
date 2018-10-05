import React, {PureComponent} from 'react'
import { connect } from 'react-redux'
export default connect()(class TakeAction extends PureComponent {
  onClick = e => this.props.dispatch.actions.callAbramov(e.target.value)
  render() {
    return <button onClick={this.onClick}>click</button>
  }
})
