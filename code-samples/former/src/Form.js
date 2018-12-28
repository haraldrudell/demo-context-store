import React, {Component} from 'react'
import Fragment from 'react'

export default class Form extends Component {
  state = {text: 'initial'}
  submit = this.submit.bind(this)
  setText = this.setText.bind(this)

  submit(e) {
    e.preventDefault()
    alert(`Text is: ${this.state.text}`)
  }

  setText(e) {
    this.setState({text: e.target.value})
  }

  render() {
    const {text} = this.state
    const {list} = this.props
    console.log('list', list)
    return (//<Fragment>
      <div>
        {Array.isArray(list) && list.map(item =>
          <div>{item}</div>
        )}
      <form onSubmit={this.submit}>
        <label>Text: <textarea onChange={this.setText} value={text}/></label>
      <button>Submit</button>
      </form>
      </div>
    /*</Fragment>*/)
  }
}
