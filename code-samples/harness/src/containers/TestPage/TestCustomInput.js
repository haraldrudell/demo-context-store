import React from 'react'

class TestCustomInput extends React.Component {

  onChange = ev => {
    this.props.onChange(ev.target.value)
  }

  render () {
    return (
      <input defaultValue={this.props.value} onChange={ev => this.onChange(ev)} />
    )
  }

}

export default TestCustomInput



// WEBPACK FOOTER //
// ../src/containers/TestPage/TestCustomInput.js