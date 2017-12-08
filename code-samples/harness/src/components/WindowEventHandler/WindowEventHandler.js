import React, { PropTypes } from 'react'

export default class WindowEventHandler extends React.Component {

  static propTypes = {
    handleScroll: PropTypes.func,
    handleResize: PropTypes.func
  }

  static defaultProps = {
    handleScroll: (e) => {}
  }

  componentDidMount () {
    if (this.props.handleScroll) {
      this.on(['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], this.props.handleScroll)
    }
    if (this.props.handleResize) {
      this.on(['resize'], this.props.handleResize)
    }
  }

  componentWillUnmount () {
    if (this.props.handleScroll) {
      this.off(['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], this.props.handleScroll)
    }
    if (this.props.handleResize) {
      this.off(['resize'], this.props.handleResize)
    }
  }

  on (events, callback) {
    events.forEach((evt) => {
      window.addEventListener(evt, callback)
    })
  }

  off (events, callback) {
    events.forEach((evt) => {
      window.removeEventListener(evt, callback)
    })
  }

  render () {
    return null
  }

}



// WEBPACK FOOTER //
// ../src/components/WindowEventHandler/WindowEventHandler.js