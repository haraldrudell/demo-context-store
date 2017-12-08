// @ts-check
const ERROR = 'ERROR'
const WARN = 'WARN'
const INFO = 'INFO'
const DEBUG = 'DEBUG'

function log (type) {
  return function (message, obj = {}) {
    // @ts-ignore
    if (window.Raven) { // Log to Sentry
      // @ts-ignore
      Raven.captureMessage(message, {
        level: type.toLowerCase(),
        extra: obj
      })
    }

    if (type === ERROR) {
      console.error(message, obj)
    } else if (type === INFO) {
      console.info(message, obj)
    } else if (type === DEBUG) {
      console.debug(message, obj)
    } else if (type === WARN) {
      console.warn(message, obj)
    }
  }
}

export default {
  error: log(ERROR),
  info: log(INFO),
  warn: log(WARN),
  debug: log(DEBUG)
}


// WEBPACK FOOTER //
// ../src/utils/Logger.js