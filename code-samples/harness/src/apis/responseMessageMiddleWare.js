import pubsub from 'pubsub-js'
import Utils from '../components/Utils/Utils'
import Tracker from '../utils/Tracker'

module.exports = config => request => {
  function buildMessages (r, type, requestObj) {
    const logObj = {}
    logObj.request = typeof requestObj !== 'undefined' ? JSON.stringify(requestObj) : ''

    if (r && r.responseMessages && r.responseMessages.length > 0) {
      const messages = []
      r.responseMessages.map(item => {
        messages.push(item.message)
        Tracker.log(type.toUpperCase() + ': ' + item.message, logObj)
      })
      // TODO: skip this error for now. Fix this in WorkflowPage.js
      if (logObj.request.includes('/executions/') && messages.join(',').includes('uuid may not be empty')) {
        return
      }
      Utils.publishErrorNotification(pubsub, messages, type)
    } else {
      // error occurred but no response body:
      if (type === 'error') {
        Utils.publishErrorNotification(pubsub, ['A generic error has occurred.'], 'error')
        Tracker.log('ERROR: A generic error has occurred. API did not return details.', logObj)
      }
    }
  }

  return {
    after: response => {
      buildMessages(response, 'info')
      return response
    },
    error: error => {
      if (error.status) {
        if (error.status === 401) {
          Utils.saveActiveUrl()
          window.location = '#/login'
        }
        if (error.status !== 401 && typeof error.json === 'function') {
          error.jsonPromise = error.json()
          error.jsonPromise.then(r => {
            return buildMessages(r, 'error', request)
          })
        }
      } else {
        // Request is still in "Pending" state

        /* pubsub.publish('GlobalNotification', {
          alertStyle: 'warning', autoClose: false, 'message': 'Connection to server lost or cannot be established.'
        })*/
        Utils.publishErrorNotification(pubsub, ['Connection to server lost or cannot be established.'], 'warning')
        Tracker.log('ERROR: Request failed to complete.')
      }
    }
  }
}



// WEBPACK FOOTER //
// ../src/apis/responseMessageMiddleWare.js