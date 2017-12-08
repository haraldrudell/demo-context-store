import React from 'react'
import Promise from 'promise'

// based on: https://github.com/cameronbourke/react-async-poll

const asyncPoll = (intervalDuration = 60 * 1000, onInterval) => {
  return Component =>
    class extends React.Component {
      constructor () {
        super()
        this.pollingInterval = intervalDuration
        this.startPolling = this.startPolling.bind(this)
        this.stopPolling = this.stopPolling.bind(this)
      }

      componentDidMount () {
        this.startPolling()
      }

      componentWillUnmount () {
        this.stopPolling()
      }

      componentWillReceiveProps (newProps) {
        this.pollingInterval = newProps.pollingInterval
      }

      startPolling () {
        if (this.interval) {
          return
        }
        this.keepPolling = true
        this.asyncInterval(onInterval)
      }

      stopPolling () {
        this.keepPolling = false
        if (this.interval) {
          clearTimeout(this.interval)
        }
      }

      asyncInterval (fn) {
        const promise = fn(this.getProps(), this.props.dispatch)
        const asyncTimeout = () =>
          setTimeout(() => {
            console.log('this.pollingInterval: ', this.pollingInterval)
            this.asyncInterval(fn)
          }, this.pollingInterval)

        const assignNextInterval = () => {
          if (!this.keepPolling) {
            this.stopPolling()
            return
          }
          this.interval = asyncTimeout()
        }

        Promise.resolve(promise)
          .then(assignNextInterval)
          .catch(assignNextInterval)
      }

      getProps () {
        return {
          ...this.props,
          startPolling: this.startPolling,
          stopPolling: this.stopPolling,
          isPolling: Boolean(this.interval)
        }
      }

      render () {
        const props = this.getProps()
        return <Component {...props} />
      }
    }
}

export default asyncPoll



// WEBPACK FOOTER //
// ../src/components/Utils/asyncPoll.js