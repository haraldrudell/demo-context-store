import React, { PropTypes } from 'react'
import streams from 'apis/streams'

export default class StreamComponent extends React.Component {

  static propTypes = {
    url: PropTypes.string.isRequired, // websocket url
    callback: PropTypes.func.isRequired // callback function on message
  }

  static defaultProps = {
    callback: (msg) => { console.log(msg)}
  }

  reqSock = null
  subSocket = null

  componentDidMount () {
    this.reqSock = streams.request(this.props.url, this.props.callback)
    // Subscribe to websocket
    this.subSocket = streams.subscribe(this.reqSock)
  }

  componentWillUnmount () {
    // Unsubscibe from websocket
    streams.unsubscribe(this.reqSock)
  }

  render () {
    return null
  }

}



// WEBPACK FOOTER //
// ../src/components/StreamComponent/StreamComponent.js