import React from 'react'
import css from './SearchBox.css'

export default class SearchBox extends React.Component {
  state = { showSearch: false, showCross: false }
  searchBox = null
  lastSource = ''

  constructor () {
    super()
    this.state = {}
  }

  componentWillReceiveProps (newProps) {
    if (newProps.source && JSON.stringify(newProps.source) !== this.lastSource) {
      this.lastSource = JSON.stringify(newProps.source)
      this.props.onChange(null, this.searchBox ? this.searchBox.value : '')
    }
  }

  onChange = ev => {
    if (ev.keyCode === 27) {
      this.props.onChange(ev, '')
      this.onSearchCollpase()
      return
    }
    const searchText = ev.target.value
    this.props.onChange(ev, searchText.trim())
  }

  onClearSearch = e => {
    e.stopPropagation()
    this.searchBox.value = ''
    this.props.onChange(null, '')
  }

  onSearchExpand = e => {
    this.searchBox.focus()
    this.setState({ showSearch: true })
  }

  onSearchCollpase = () => {
    this.searchBox.blur()
    this.setState({ showSearch: false })
  }

  onMouseOut = e => {
    setTimeout(() => {
      if (this.searchBox && this.searchBox.value.length <= 0) {
        this.onSearchCollpase()
      }
    }, 500)
  }

  componentWillMount () {}

  componentDidUpdate () {}

  displayCross () {
    return this.searchBox && this.searchBox.value.length > 1
  }

  render () {
    const searchIconClass = '__searchIcon fa fa-search ' + (this.state.showSearch ? 'active' : 'inactive')
    const searchBoxClass = this.state.showSearch ? 'active' : ''
    return (
      <form
        className={`${css.main} ${this.props.className}`}
        onMouseLeave={this.onMouseOut}
        onMouseOver={this.onSearchExpand}
      >
        <input
          placeholder="Start typing to search"
          className={searchBoxClass}
          onChange={this.onChange}
          ref={input => {
            this.searchBox = input
          }}
        />
        <i
          className="__clear icons8-multiply"
          onClick={this.onClearSearch}
          style={{ display: this.displayCross() ? 'block' : 'none' }}
        />
        <i className={searchIconClass} onClick={this.onSearchCollpase} />
      </form>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/SearchBox/SearchBox.js