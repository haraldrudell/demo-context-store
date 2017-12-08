import React from 'react'
import css from './SearchInput.css'

const SEARCH_THROTTLE = 200 // ms

export default class SearchInput extends React.Component {
  state = {
    key: Math.random(),
    text: ''
  }
  timer = null
  inputRef = null

  setStateAsync = async state => {
    await new Promise(resolve => this.setState(state, _ => resolve()))
  }

  onChange = eventOrText => {
    clearTimeout(this.timer)
    let text = eventOrText
    if (typeof eventOrText === 'object') {
      text = eventOrText.target.value
    }
    this.setState({ text })

    this.timer = setTimeout(() => {
      this.doSearch(text)
    }, SEARCH_THROTTLE)
  }

  doSearch = text => {
    this.props.onChange(text)
  }

  clearText = async () => {
    await this.setStateAsync({ key: Math.random(), text: '' })
    this.props.onChange('')
    this.inputRef.focus()
  }

  render () {
    const { key, text } = this.state
    const customCss = this.props.className || ''
    return (
      <div key={key} className={`pt-input-group ui-search-box left-gap ${css.main} ${customCss}`}>
        <input
          ref={r => (this.inputRef = r)}
          defaultValue={text}
          className="pt-input"
          type="search"
          placeholder="Search"
          dir="auto"
          onChange={this.onChange}
        />
        {text.length > 0 ? (
          <span className="pt-icon pt-icon-small-cross" onClick={this.clearText} />
        ) : (
          <span className="pt-icon pt-icon-search" />
        )}
      </div>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/SearchInput/SearchInput.js