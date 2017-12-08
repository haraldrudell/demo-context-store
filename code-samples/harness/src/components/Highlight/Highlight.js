import React from 'react'
import { findDOMNode } from 'react-dom'
import highlight from 'highlight.js'

// TODO: import react-highlight.js does not work, so we manually copy the component here:
export default class Highlight extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
    language: React.PropTypes.string,
    style: React.PropTypes.object
  }

  isUpdating = false

  componentDidMount () {
    highlight.highlightBlock(findDOMNode(this.refs.code))
  }

  componentDidUpdate () {
    // use this flag for throttling because this function used to cause UI Performance issue (frozen ui)
    if (this.isUpdating) {
      return
    }
    this.isUpdating = true
    highlight.initHighlighting.called = false
    highlight.highlightBlock(findDOMNode(this.refs.code))
    setTimeout(() => {
      this.isUpdating = false // reset
    }, 500) // for throttling
  }

  render () {
    const { children, className, language, style } = this.props

    return (
      <pre
        className={className}
        style={style}
      >
        <code
          className={language}
          ref="code">
          {children}
        </code>
      </pre>
    )
  }
}



// WEBPACK FOOTER //
// ../src/components/Highlight/Highlight.js