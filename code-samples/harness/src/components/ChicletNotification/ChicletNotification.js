import React, { PropTypes } from 'react'
import css from './ChicletNotification.css'
import WindowEventHandler from '../WindowEventHandler/WindowEventHandler'
import { Wings } from 'utils'

export default class ChicletNotification extends React.Component {

  state = { isSticky: false, hide: false }
  lastScrollTop = Wings.STICKY_HEADER_HEIGHT

  static propTypes = {
    count: PropTypes.number.isRequired,
    singleText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]).isRequired,
    pluralText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func
    ]).isRequired,
    onClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    count: 0,
    singleText: 'Show new Updates',
    pluralText: 'Show new Updates',
    onClick: (e) => {}
  };

  componentDidMount () {
    this.lastScrollTop = document.body.scrollTop
  }


  handleScroll = (event) => {
    try {
      const scrollTop = event.srcElement.body.scrollTop
      const diff = scrollTop - this.lastScrollTop
      this.lastScrollTop = (scrollTop > Wings.STICKY_HEADER_HEIGHT) ? scrollTop : Wings.STICKY_HEADER_HEIGHT

      if (diff > 0) {
        this.setState({ hide: true })
        return
      }

      if (scrollTop > Wings.STICKY_HEADER_HEIGHT) {
        this.setState({ isSticky: true, hide: false })
      } else {
        this.setState({ isSticky: false, hide: false })
      }

    } catch (err) {}
  }

  render () {
    const hide = (this.props.count <= 0) || this.state.hide
    let className = ''
    if (hide) {
      className = css.hide
    } else {
      className = this.state.isSticky ? css.sticky : css.main
    }
    return (
      <div className={css.common + ' row __chicletBar ' + className} >
        <div className={'col-md-12 ' + css.bar}>
          <button className={'btn ' + css.chiclet} onClick={this.props.onClick}>
            {(this.props.count <= 1) &&
              <span>{this.props.singleText}</span>
            }
            {(this.props.count > 1) &&
              <span>{this.props.pluralText}</span>
            }
          </button>
        </div>
        <WindowEventHandler handleScroll={this.handleScroll} />
      </div>
    )
  }
}





// WEBPACK FOOTER //
// ../src/components/ChicletNotification/ChicletNotification.js