/* eslint no-undef: 0 */
export default class Tracker {

  static setUser (userEmail) {
    if (typeof amplitude === 'undefined') {
      return
    }
    amplitude.getInstance().setUserId(userEmail)
  }

  static log (eventName, logObj) {
    if (typeof amplitude === 'undefined') {
      return
    }
    if (typeof logObj === 'undefined') {
      const obj = {
        url: window.location.href
      }
      amplitude.logEvent(eventName, obj)
    } else {
      logObj.url = window.location.href
      amplitude.logEvent(eventName, logObj)
    }
  }
}



// WEBPACK FOOTER //
// ../src/utils/Tracker.js